"use server";

import { createClient, verifyAdmin } from "@/lib/supabase/server";
import { createOrder, updateOrderStatus } from "@/lib/services/orders.service";
import type { CartItemParam } from "@/lib/services/orders.service";
import type { OrderStatus } from "@/lib/supabase/types";
import { headers } from "next/headers";
import { RateLimiter } from "@/lib/rate-limit";

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
