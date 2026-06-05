"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#FF8A00]/10 transition-all duration-500 border border-transparent hover:border-[#FFE4C2] ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#FFF9EE] overflow-hidden">
        {/* Product Images (with cross-fade) */}
        <AnimatePresence mode="wait">
          <motion.img 
            key={isHovered && product.images?.length > 1 ? product.images[1] : product.images?.[0]}
            src={imgError ? "/logo.jpg" : (isHovered && product.images?.length > 1 ? product.images[1] : product.images?.[0] || "/logo.jpg")} 
            alt={product.name} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Overlay Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isBestseller && (
            <span className="bg-[#FFB449] text-[#1A1A1A] text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#FF8A00] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
              New
            </span>
          )}
        </div>

        {discount && (
          <div className="absolute top-4 right-14 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm z-10">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product); }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10 ${
            wishlisted ? "bg-red-50 text-red-500" : "bg-white/80 backdrop-blur-sm text-[#6B6B6B] hover:bg-white hover:text-red-500"
          } ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
          aria-label="Wishlist"
        >
          <Heart size={18} className={wishlisted ? "fill-red-500" : ""} />
        </button>
      </div>

      {/* Info */}
      <Link href={`/store/${product.slug}`} className="block p-5 pt-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] text-[#FF8A00] font-black uppercase tracking-[0.2em]">
            {product.category.replace(/-/g, " ")}
          </p>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-[#FFB449] text-[#FFB449]" />
            <span className="text-[10px] font-bold text-[#1A1A1A]">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-bold text-[#1A1A1A] text-sm mb-3 line-clamp-1 group-hover:text-[#FF8A00] transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-black text-[#1A1A1A] text-lg">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#6B6B6B] line-through opacity-60">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          {product.customizable && (
            <div className="flex items-center gap-1 bg-[#FFF9EE] px-2 py-0.5 rounded-full border border-[#FFE4C2]" title="Customizable">
              <Sparkles size={10} className="text-[#FF8A00]" />
              <span className="text-[8px] font-black text-[#FF8A00] uppercase tracking-tighter">Custom</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
