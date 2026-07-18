"use server";

import { createAdminClient, verifyAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProductAction(product: any) {
  await verifyAdmin();
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (!error) {
    // Refresh all relevant customer pages
    revalidatePath("/");
    revalidatePath("/store");
    revalidatePath("/personal-gifting");
    revalidatePath("/corporate-gifting");
  }

  return { data, error };
}

export async function updateProductAction(id: string, updates: any, slug?: string) {
  await verifyAdmin();
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (!error) {
    // Refresh the home, store, and specific product detail pages
    revalidatePath("/");
    revalidatePath("/store");
    if (slug) {
      revalidatePath(`/store/${slug}`);
    }
    revalidatePath("/personal-gifting");
    revalidatePath("/corporate-gifting");
  }

  return { data, error };
}

export async function deleteProductAction(id: string, slug?: string) {
  await verifyAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (!error) {
    revalidatePath("/");
    revalidatePath("/store");
    if (slug) {
      revalidatePath(`/store/${slug}`);
    }
  }

  return { error };
}
