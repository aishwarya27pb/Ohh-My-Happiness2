"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function uploadProductImage(formData: FormData) {
  const supabase = await createAdminClient();
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Generate a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  // Upload to Supabase Storage
  // Note: We assume a bucket named 'product-images' exists and is public
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Storage Error:", error);
    return { error: error.message };
  }

  // Create a long-lived Signed URL (10 years) to bypass RLS issues
  const { data: signedData, error: signedError } = await supabase.storage
    .from("product-images")
    .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10);

  if (signedError) {
    console.error("Signed URL Error:", signedError);
    return { error: signedError.message };
  }

  return { url: signedData.signedUrl };
}


