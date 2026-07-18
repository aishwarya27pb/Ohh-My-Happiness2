"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartItem, Product } from "@/types";

/**
 * Saves the user's cart to their profile in Supabase
 */
export async function saveCartAction(items: CartItem[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Fetch existing profile data first to avoid overwriting wishlist
  const { data: profile } = await supabase
    .from("profiles")
    .select("cart_data")
    .eq("id", user.id)
    .single();

  let wishlist: Product[] = [];
  if (profile?.cart_data && typeof profile.cart_data === "object" && !Array.isArray(profile.cart_data)) {
    const rawData = profile.cart_data as Record<string, any>;
    if ("wishlist" in rawData) {
      wishlist = rawData.wishlist || [];
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ 
      cart_data: { cart: items, wishlist } as any,
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

  const cartData = data?.cart_data;
  if (Array.isArray(cartData)) {
    return { cart: (cartData as unknown as CartItem[]) };
  } else if (cartData && typeof cartData === "object") {
    const rawData = cartData as Record<string, any>;
    return { cart: (rawData.cart as unknown as CartItem[]) || [] };
  }

  return { cart: [] };
}
