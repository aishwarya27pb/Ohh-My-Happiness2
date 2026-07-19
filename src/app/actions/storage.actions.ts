"use server";

import { createAdminClient, verifyAdmin } from "@/lib/supabase/server";

export async function uploadProductImage(formData: FormData) {
  await verifyAdmin();
  const supabase = await createAdminClient();
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Generate a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Supabase Storage
  // Note: We assume a bucket named 'product-images' exists and is public
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Storage Error:", error);
    return { error: error.message };
  }

  // Get the public URL directly for the public bucket
  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl };
}


