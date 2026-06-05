import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Product, Category } from "@/types";
import type { ProductRow, CategoryRow } from "@/lib/supabase/types";

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    images: row.images,
    category: row.category_slug ?? "",
    occasion: row.occasion,
    description: row.description,
    shortDescription: row.short_description ?? "",
    variants: (row.variants as any) ?? [],
    customizable: row.customizable,
    inStock: row.in_stock,
    stockQuantity: row.stock_quantity,
    lowStockThreshold: row.low_stock_threshold,
    rating: row.rating,
    reviewCount: row.review_count,
    tags: row.tags,
    isBestseller: row.is_bestseller,
    isFeatured: row.is_featured,
    isNew: row.is_new,
  };
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: row.image ?? "",
    productCount: row.product_count,
    icon: row.icon ?? undefined,
  };
}

// Safe for generateStaticParams — uses service client, no cookies()
export async function getProductSlugsForStaticParams(): Promise<{ id: string }[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("products").select("slug");
  return (data ?? []).map((r) => ({ id: r.slug }));
}

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // Note: In a production environment with Next.js fetch, we would add:
    // next: { tags: ['products'] }
    // Since we are using the Supabase client, we rely on revalidatePath
    // which I have already added to the actions.


    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data.map(mapProduct);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching product ${slug}:`, error);
      return null;
    }

    return data ? mapProduct(data) : null;
  },

  async getCategories(): Promise<Category[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data.map(mapCategory);
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or("is_featured.eq.true,is_bestseller.eq.true")
      .limit(8);

    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }

    return data.map(mapProduct);
  },

  async getProductById(id: string): Promise<Product | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }

    return mapProduct(data);
  },

  async createProduct(product: any): Promise<{ data: Product | null; error: any }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    return { data: data ? mapProduct(data) : null, error };
  },

  async updateProduct(id: string, updates: any): Promise<{ data: Product | null; error: any }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data: data ? mapProduct(data) : null, error };
  },

  async deleteProduct(id: string): Promise<{ error: any }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    return { error };
  },

  async getLowStockProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .lte("stock_quantity", "low_stock_threshold");
    
    if (error) {
      console.error("Error fetching low stock products:", error);
      return [];
    }

    return data.map(mapProduct);
  }
};
