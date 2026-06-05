"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/types";

/**
 * Saves the user's cart to their profile in Supabase
 */
export async function saveCartAction(items: CartItem[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ 
      cart_data: items as any,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error saving cart:", error);
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Fetches the saved cart from the user's profile
 */
export async function getSavedCartAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("profiles")
    .select("cart_data")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching cart:", error);
    return { error: error.message };
  }

  return { cart: (data?.cart_data as unknown as CartItem[]) || [] };
}
