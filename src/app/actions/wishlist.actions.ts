"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartItem, Product } from "@/types";

/**
 * Saves the user's wishlist to their profile in Supabase
 */
export async function saveWishlistAction(items: Product[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Fetch existing profile data first to avoid overwriting cart
  const { data: profile } = await supabase
    .from("profiles")
    .select("cart_data")
    .eq("id", user.id)
    .single();

  let cart: CartItem[] = [];
  if (profile?.cart_data) {
    if (Array.isArray(profile.cart_data)) {
      cart = profile.cart_data as unknown as CartItem[];
    } else if (typeof profile.cart_data === "object") {
      const rawData = profile.cart_data as Record<string, any>;
      cart = (rawData.cart as unknown as CartItem[]) || [];
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ 
      cart_data: { cart, wishlist: items } as any,
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
    .select("cart_data")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching wishlist:", error);
    return { error: error.message, wishlist: [] };
  }

  const cartData = data?.cart_data;
  if (cartData && typeof cartData === "object" && !Array.isArray(cartData)) {
    const rawData = cartData as Record<string, any>;
    return { wishlist: (rawData.wishlist as unknown as Product[]) || [] };
  }

  return { wishlist: [] };
}
