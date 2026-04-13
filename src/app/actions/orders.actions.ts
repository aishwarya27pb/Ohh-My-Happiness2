"use server";

import { createClient } from "@/lib/supabase/server";
import { createOrder, updateOrderStatus } from "@/lib/services/orders.service";
import type { CartItemParam } from "@/lib/services/orders.service";
import type { OrderStatus } from "@/lib/supabase/types";

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    subtotal: pricing.subtotal,
    shipping: pricing.shipping,
    discount: pricing.discount,
    total: pricing.total,
    couponCode: pricing.couponCode,
  });

  return result;
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  try {
    await updateOrderStatus(orderId, status);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}
