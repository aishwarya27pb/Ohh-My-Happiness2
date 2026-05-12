import { productsService } from "@/lib/services/products.service";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await productsService.getProducts();
  const debugData = products.map(p => ({
    name: p.name,
    imageCount: p.images?.length || 0,
    firstImageUrl: p.images?.[0] || "NONE"
  }));
  
  return NextResponse.json(debugData);
}
