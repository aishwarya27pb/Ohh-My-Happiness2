import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { categories, products } from "@/data/products.backup";
import { env } from "@/env";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Forbidden", { status: 403 });
  }
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 });
  }

  // Use service role key to bypass RLS
  const supabase = createClient(supabaseUrl, supabaseServiceKey);


  const results = {
    categories: [] as string[],
    products: [] as string[],
    errors: [] as string[],
  };

  try {
    // 1. Migrate Categories
    const categoryMap = new Map();

    for (const cat of categories) {
      const { data, error } = await supabase
        .from("categories")
        .upsert({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          product_count: cat.productCount,
          icon: cat.icon
        }, { onConflict: "slug" })
        .select()
        .single();

      if (error) {
        results.errors.push(`Category ${cat.slug}: ${error.message}`);
      } else {
        results.categories.push(cat.name);
        categoryMap.set(cat.slug, data.id);
      }
    }

    // 2. Migrate Products
    for (const prod of products) {
      const categoryId = categoryMap.get(prod.category);
      
      const { error } = await supabase
        .from("products")
        .upsert({
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          original_price: prod.originalPrice,
          images: prod.images,
          category_id: categoryId,
          category_slug: prod.category,
          occasion: prod.occasion,
          description: prod.description,
          short_description: prod.shortDescription,
          variants: prod.variants || [],
          customizable: prod.customizable,
          in_stock: prod.inStock,
          rating: prod.rating,
          review_count: prod.reviewCount,
          tags: prod.tags,
          is_bestseller: prod.isBestseller || false,
          is_featured: prod.isFeatured || false,
          is_new: prod.isNew || false
        }, { onConflict: "slug" });

      if (error) {
        results.errors.push(`Product ${prod.slug}: ${error.message}`);
      } else {
        results.products.push(prod.name);
      }
    }

    return NextResponse.json({ 
      message: "Migration completed",
      summary: {
        categoriesMigrated: results.categories.length,
        productsMigrated: results.products.length,
      },
      results 
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
