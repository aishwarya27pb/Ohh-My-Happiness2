import { productsService } from "@/lib/services/products.service";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    try {
      const { createClient: createServerClient } = await import("@/lib/supabase/server");
      const supabase = await createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return new Response("Forbidden", { status: 403 });

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        return new Response("Forbidden", { status: 403 });
      }
    } catch {
      return new Response("Forbidden", { status: 403 });
    }
  }
  const products = await productsService.getProducts();
  const debugData = products.map(p => ({
    name: p.name,
    imageCount: p.images?.length || 0,
    firstImageUrl: p.images?.[0] || "NONE"
  }));
  
  return NextResponse.json(debugData);
}
