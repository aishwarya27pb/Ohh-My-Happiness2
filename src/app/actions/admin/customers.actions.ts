"use server";

import { getAllCustomers, getProfileById, updateProfile } from "@/lib/services/customers.service";
import { getOrdersByProfile } from "@/lib/services/orders.service";
import type { Profile, OrderWithItems } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";
import { verifyAdmin, createAdminClient } from "@/lib/supabase/server";

export async function getCustomersAction(
  search?: string
): Promise<Profile[]> {
  await verifyAdmin();
  return getAllCustomers(search);
}

export async function getCustomerAction(id: string): Promise<{
  profile: Profile | null;
  orders: OrderWithItems[];
}> {
  await verifyAdmin();
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
    await verifyAdmin();
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

export async function createCustomerAction(data: {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: "customer" | "admin";
}): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdmin();
    const supabase = await createAdminClient();
    
    // Generate a default password if not provided
    const userPassword = data.password || Math.random().toString(36).slice(-10) + "OMH!";

    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: userPassword,
      email_confirm: true,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
      }
    });

    if (createError) {
      return { success: false, error: createError.message };
    }

    if (userData?.user) {
      // Explicitly update the profiles row with the input fields and specified role
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          role: data.role || "customer"
        })
        .eq("id", userData.user.id);

      if (profileError) {
        return { success: false, error: profileError.message };
      }
    }

    revalidatePath("/admin/customers");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Creation failed" };
  }
}
