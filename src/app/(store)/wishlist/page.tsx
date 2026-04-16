import type { Metadata } from "next";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your favorite gifts. Save your top picks for later or share your wishlist with friends.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
