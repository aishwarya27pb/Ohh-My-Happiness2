"use server";

import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

/**
 * Saves the user's wishlist to their profile in Supabase
 */
export async function saveWishlistAction(items: Product[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ 
      wishlist_data: items as any,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error saving wishlist:", error);
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Fetches the saved wishlist from the user's profile
 */
export async function getSavedWishlistAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("profiles")
    .select("wishlist_data")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching wishlist:", error);
    return { error: error.message, wishlist: [] };
  }

  return { wishlist: (data?.wishlist_data as unknown as Product[]) || [] };
}
