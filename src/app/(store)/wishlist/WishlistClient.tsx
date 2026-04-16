"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ui/ProductCard";

export default function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const { items, count } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFB449] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Search + Page Header */}
      <section className="bg-gradient-to-b from-[#FFE4C2] to-[#FFF9EE] py-16 px-4 text-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFB449]/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        
        <div className="relative z-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF8A00] bg-white px-4 py-1.5 rounded-full mb-4 shadow-sm">
            Saved Gifts
          </span>
          <h1 className="text-4xl font-black text-[#1A1A1A] mb-3">
            My <span className="text-[#FF8A00]">Wishlist</span>
          </h1>
          <p className="text-[#6B6B6B] max-w-xl mx-auto">
            {count > 0 
              ? `You have saved ${count} gift${count !== 1 ? "s" : ""} for later. Your favorites are ready whenever you are.`
              : "Keep track of your favorite gifts! Browse the store and save the ones you love."}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] shadow-xl border border-[#FFE4C2] p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-[#FFF9EE] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-[#FFB449] opacity-40" />
            </div>
            <h2 className="text-2xl font-black text-[#1A1A1A] mb-3">Your Wishlist is Empty</h2>
            <p className="text-[#6B6B6B] mb-8 leading-relaxed">
              Looks like you haven't added any gifts to your wishlist yet. Explore our curated collections and save the ones that catch your eye!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/store"
                className="btn-primary flex items-center justify-center gap-2 px-8"
              >
                Browse All Gifts <ArrowRight size={18} />
              </Link>
              <Link
                href="/"
                className="btn-outline flex items-center justify-center gap-2"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-16 text-center">
            <hr className="border-[#FFE4C2] mb-12" />
            <h3 className="font-bold text-[#1A1A1A] mb-4">Ready to complete your shopping?</h3>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-[#FF8A00] font-black hover:gap-3 transition-all"
            >
              Back to Store <ShoppingBag size={18} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
