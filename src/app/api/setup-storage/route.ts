import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function GET() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase credentials in .env.local" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);


  try {
    console.log("Checking for product-images bucket...");
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) throw listError;

    const bucketExists = buckets.find(b => b.name === "product-images");

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket("product-images", {
        public: true,
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
        fileSizeLimit: 5242880 // 5MB
      });
      if (createError) throw createError;
      return NextResponse.json({ message: "Bucket 'product-images' created successfully and set to public!" });
    } else {
      if (!bucketExists.public) {
        const { error: updateError } = await supabase.storage.updateBucket("product-images", { public: true });
        if (updateError) throw updateError;
        return NextResponse.json({ message: "Bucket 'product-images' existed and has now been set to public!" });
      }
      return NextResponse.json({ message: "Bucket 'product-images' already exists and is already public." });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
