"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/services/customers.service";
import {
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/services/addresses.service";
import type { AddressInsert } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(updates: {
  firstName?: string;
  lastName?: string;
  phone: string;
}): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    await updateProfile(user.id, {
      first_name: updates.firstName,
      last_name: updates.lastName,
      phone: updates.phone,
    });

    revalidatePath("/account/profile");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}

export async function saveAddressAction(
  addressData: Omit<AddressInsert, "profile_id">
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    await createAddress({ ...addressData, profile_id: user.id });
    revalidatePath("/account/profile");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Save failed" };
  }
}

export async function deleteAddressAction(
  addressId: string
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    await deleteAddress(addressId, user.id);
    revalidatePath("/account/profile");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Delete failed" };
  }
}

export async function updateAddressAction(
  addressId: string,
  updates: Partial<AddressInsert>
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    await updateAddress(addressId, user.id, updates);
    revalidatePath("/account/profile");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}
