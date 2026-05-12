"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(product.id) : false;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Image */}
      <div className="relative aspect-square bg-[#FFF9EE] overflow-hidden">
        {/* Product Image */}
        {product.images && product.images.length > 0 && !imgError ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            onError={() => {
              console.error(`Failed to load image for ${product.name}:`, product.images[0]);
              setImgError(true);
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🎁
          </div>
        )}


        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestseller && (
            <span className="bg-[#FFB449] text-[#1A1A1A] text-xs font-bold px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#FF8A00] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {discount && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product); }}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-[#6B6B6B]"}
          />
        </button>

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="w-full bg-[#FFB449] hover:bg-[#FF8A00] text-[#1A1A1A] hover:text-white font-bold py-3 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <Link href={`/store/${product.slug}`} className="block p-4">
        <p className="text-xs text-[#FF8A00] font-semibold uppercase tracking-wide mb-1">
          {product.category.replace(/-/g, " ")}
        </p>
        <h3 className="font-bold text-[#1A1A1A] text-sm mb-2 line-clamp-2 group-hover:text-[#FF8A00] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                className={s <= Math.round(product.rating) ? "fill-[#FFB449] text-[#FFB449]" : "text-[#E0E0E0]"}
              />
            ))}
          </div>
          <span className="text-xs text-[#6B6B6B]">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-black text-[#1A1A1A] text-base">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-[#6B6B6B] line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {product.customizable && (
          <p className="text-xs text-[#FF8A00] mt-1 font-medium">✨ Customizable</p>
        )}
      </Link>
    </div>
  );
}
