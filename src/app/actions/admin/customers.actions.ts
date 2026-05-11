"use server";

import { getAllCustomers, getProfileById, updateProfile } from "@/lib/services/customers.service";
import { getOrdersByProfile } from "@/lib/services/orders.service";
import type { Profile, OrderWithItems } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function getCustomersAction(
  search?: string
): Promise<Profile[]> {
  return getAllCustomers(search);
}

export async function getCustomerAction(id: string): Promise<{
  profile: Profile | null;
  orders: OrderWithItems[];
}> {
  const [profile, orders] = await Promise.all([
    getProfileById(id),
    getOrdersByProfile(id),
  ]);
  return { profile, orders };
}

export async function updateCustomerNotesAction(
  id: string,
  notes: { phone: string; firstName?: string; lastName?: string }
): Promise<{ error?: string }> {
  try {
    await updateProfile(id, {
      first_name: notes.firstName,
      last_name: notes.lastName,
      phone: notes.phone,
    });
    revalidatePath(`/admin/customers/${id}`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}
