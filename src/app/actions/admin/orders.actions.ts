"use server";

import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "@/lib/services/orders.service";
import type { OrderWithItems, OrderStatus } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function getOrdersAction(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ orders: OrderWithItems[] }> {
  const orders = await getAllOrders(filters);
  return { orders };
}

export async function getOrderAction(
  id: string
): Promise<{ order: OrderWithItems | null }> {
  const order = await getOrderById(id);
  return { order };
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  try {
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}
