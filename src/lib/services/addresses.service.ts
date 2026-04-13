import { createClient } from "@/lib/supabase/server";
import type { Address, AddressInsert, AddressUpdate } from "@/lib/supabase/types";

export async function getAddressesByProfile(
  profileId: string
): Promise<Address[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("profile_id", profileId)
    .order("is_default", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createAddress(
  address: AddressInsert
): Promise<Address> {
  const supabase = await createClient();

  // If this is the default, unset existing default first
  if (address.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("profile_id", address.profile_id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert(address)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateAddress(
  id: string,
  profileId: string,
  updates: AddressUpdate
): Promise<Address> {
  const supabase = await createClient();

  if (updates.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("profile_id", profileId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .update(updates)
    .eq("id", id)
    .eq("profile_id", profileId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAddress(
  id: string,
  profileId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("profile_id", profileId);

  if (error) throw new Error(error.message);
}
