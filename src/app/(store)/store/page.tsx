import type { Metadata } from "next";
import StoreClient from "./StoreClient";

export const metadata: Metadata = {
  title: "Gift Store",
  description: "Browse our complete collection of premium gifts. Filter by category, occasion, price, and more. Free delivery on orders above ₹999.",
};

import { productsService } from "@/lib/services/products.service";

export default async function StorePage() {
  const [products, categories] = await Promise.all([
    productsService.getProducts(),
    productsService.getCategories(),
  ]);

  return <StoreClient initialProducts={products} initialCategories={categories} />;
}

