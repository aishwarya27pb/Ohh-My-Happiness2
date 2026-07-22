"use server";

import { createClient, verifyAdmin } from "@/lib/supabase/server";
import { createOrder, updateOrderStatus } from "@/lib/services/orders.service";
import type { CartItemParam } from "@/lib/services/orders.service";
import type { OrderStatus } from "@/lib/supabase/types";
import { headers } from "next/headers";
import { RateLimiter } from "@/lib/rate-limit";
import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "@/env";
import { createServiceClient } from "@/lib/supabase/service";

const actionLimiter = new RateLimiter({
  limit: 10,
  windowMs: 60 * 1000,
});

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  giftMessage?: string;
}

export interface PricingData {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
}

export async function createOrderAction(
  cartItems: CartItemParam[],
  form: CheckoutFormData,
  pricing: PricingData
): Promise<{ orderNumber: string; orderId: string }> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "anonymous";
  const rateLimit = actionLimiter.check(`order_${ip}`);
  if (!rateLimit.success) {
    throw new Error("Too Many Requests. Please try again later.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Validate pricing server-side
  const productIds = cartItems.map(item => item.product.id);
  const { data: dbProducts, error: dbError } = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds);

  if (dbError || !dbProducts) {
    throw new Error("Failed to validate products");
  }

  let calculatedSubtotal = 0;
  for (const item of cartItems) {
    const dbProduct = dbProducts.find(p => p.id === item.product.id);
    if (!dbProduct) {
      throw new Error(`Product not found: ${item.product.name}`);
    }
    if (item.product.price !== dbProduct.price) {
      throw new Error(`Price mismatch for product ${item.product.name}`);
    }
    calculatedSubtotal += dbProduct.price * item.quantity;
  }

  if (calculatedSubtotal !== pricing.subtotal) {
    throw new Error("Subtotal discrepancy detected.");
  }

  const calculatedTotal = calculatedSubtotal + pricing.shipping - pricing.discount;
  if (calculatedTotal !== pricing.total) {
    throw new Error("Total discrepancy detected.");
  }

  const result = await createOrder({
    cartItems,
    profileId: user?.id ?? null,
    contactName: `${form.firstName} ${form.lastName}`,
    contactEmail: form.email,
    contactPhone: form.phone,
    shippingAddress: {
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    },
    paymentMethod: form.paymentMethod,
    giftMessage: form.giftMessage,
    subtotal: calculatedSubtotal,
    shipping: pricing.shipping,
    discount: pricing.discount,
    total: calculatedTotal,
    couponCode: pricing.couponCode,
  });

  return result;
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    await updateOrderStatus(orderId, status);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}

export async function createRazorpayOrderAction(
  orderId: string
): Promise<{ id: string; amount: number; currency: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, total, status, payment_status")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      throw new Error("Order not found");
    }

    if (order.payment_status === "paid") {
      throw new Error("Order already paid");
    }

    const razorpay = new Razorpay({
      key_id: env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      key_secret: env.RAZORPAY_KEY_SECRET || "",
    });

    const amountInPaise = Math.round(order.total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.id,
    });

    return {
      id: razorpayOrder.id,
      amount: typeof razorpayOrder.amount === "number" ? razorpayOrder.amount : parseInt(razorpayOrder.amount as string, 10),
      currency: razorpayOrder.currency,
    };
  } catch (err) {
    return {
      id: "",
      amount: 0,
      currency: "INR",
      error: err instanceof Error ? err.message : "Razorpay order creation failed",
    };
  }
}

export interface RazorpayVerificationParams {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export async function verifyRazorpayPaymentAction(
  params: RazorpayVerificationParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const body = params.razorpayOrderId + "|" + params.razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === params.razorpaySignature;

    if (!isSignatureValid) {
      throw new Error("Invalid payment signature");
    }

    const serviceClient = createServiceClient();
    
    // Update order to paid and confirmed
    const { error: updateError } = await serviceClient
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "paid"
      })
      .eq("id", params.orderId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Payment verification failed"
    };
  }
}
