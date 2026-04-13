import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import type {
  OrderInsert,
  OrderItemInsert,
  OrderWithItems,
  OrderStatus,
} from "@/lib/supabase/types";

export interface CartItemParam {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
  };
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface CreateOrderParams {
  cartItems: CartItemParam[];
  profileId?: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  giftMessage?: string | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string | null;
}

export interface CreateOrderResult {
  orderNumber: string;
  orderId: string;
}

export async function createOrder(
  params: CreateOrderParams
): Promise<CreateOrderResult> {
  const supabase = createServiceClient();

  const orderNumber = `OMH${Date.now().toString(36).toUpperCase()}`;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      profile_id: params.profileId ?? null,
      status: "confirmed",
      subtotal: params.subtotal,
      shipping: params.shipping,
      discount: params.discount,
      total: params.total,
      coupon_code: params.couponCode ?? null,
      payment_method: params.paymentMethod,
      payment_status: "pending",
      gift_message: params.giftMessage ?? null,
      shipping_address: params.shippingAddress,
      contact_email: params.contactEmail,
      contact_phone: params.contactPhone,
      contact_name: params.contactName,
    } satisfies OrderInsert)
    .select("id, order_number")
    .single();

  if (error || !order) {
    throw new Error(error?.message ?? "Order creation failed");
  }

  const items: OrderItemInsert[] = params.cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_slug: item.product.slug,
    product_price: item.product.price,
    quantity: item.quantity,
    selected_variants: item.selectedVariants ?? {},
    line_total: item.product.price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) throw new Error(itemsError.message);

  return { orderNumber: order.order_number, orderId: order.id };
}

export async function getOrdersByProfile(
  profileId: string
): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as OrderWithItems[];
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error) return null;
  return data as unknown as OrderWithItems;
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", orderNumber)
    .single();

  if (error) return null;
  return data as unknown as OrderWithItems;
}

// Admin only — uses authenticated session, RLS enforces admin role
export async function getAllOrders(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status as OrderStatus);
  if (filters?.search) {
    query = query.or(
      `order_number.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%`
    );
  }
  if (filters?.limit) query = query.limit(filters.limit);
  if (filters?.offset) query = query.range(filters.offset, (filters.offset + (filters.limit ?? 20)) - 1);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as OrderWithItems[];
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
}
