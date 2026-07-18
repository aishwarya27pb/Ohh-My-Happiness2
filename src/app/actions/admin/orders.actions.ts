"use server";

import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "@/lib/services/orders.service";
import type { OrderWithItems, OrderStatus } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/supabase/server";

export async function getOrdersAction(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ orders: OrderWithItems[] }> {
  await verifyAdmin();
  const orders = await getAllOrders(filters);
  return { orders };
}

export async function getOrderAction(
  id: string
): Promise<{ order: OrderWithItems | null }> {
  await verifyAdmin();
  const order = await getOrderById(id);
  return { order };
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  try {
    await verifyAdmin();
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}
