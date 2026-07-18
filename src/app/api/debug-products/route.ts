import { productsService } from "@/lib/services/products.service";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Forbidden", { status: 403 });
  }
  const products = await productsService.getProducts();
  const debugData = products.map(p => ({
    name: p.name,
    imageCount: p.images?.length || 0,
    firstImageUrl: p.images?.[0] || "NONE"
  }));
  
  return NextResponse.json(debugData);
}
