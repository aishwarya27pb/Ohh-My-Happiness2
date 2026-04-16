import type { Metadata } from "next";
import StoreClient from "./StoreClient";

export const metadata: Metadata = {
  title: "Gift Store",
  description: "Browse our complete collection of premium gifts. Filter by category, occasion, price, and more. Free delivery on orders above ₹999.",
};

export default function StorePage() {
  return <StoreClient />;
}
