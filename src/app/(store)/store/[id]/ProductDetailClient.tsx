"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types";
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw, Check, Share2 } from "lucide-react";
import Link from "next/link";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);
  const [mainImage, setMainImage] = useState(product.images?.[0] || "");

  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Group variants by name
  const variantGroups = product.variants?.reduce<Record<string, typeof product.variants>>((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name]!.push(v);
    return acc;
  }, {}) ?? {};

  const handleAddToCart = () => {
    addItem(product, qty, selectedVariants);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-8">
        <Link href="/" className="hover:text-[#FF8A00]">Home</Link>
        <span>/</span>
        <Link href="/store" className="hover:text-[#FF8A00]">Store</Link>
        <span>/</span>
        <Link href={`/store?category=${product.category}`} className="hover:text-[#FF8A00] capitalize">
          {product.category.replace(/-/g, " ")}
        </Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl flex items-center justify-center relative overflow-hidden border border-[#FFE4C2]/50 shadow-sm">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            ) : (
              <span className="text-[120px]">🎁</span>
            )}
            
            {product.isBestseller && (
              <span className="absolute top-4 left-4 bg-[#FFB449] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 right-4 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                New Arrival
              </span>
            )}
          </div>

          {/* Thumbnail row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    mainImage === img ? "border-[#FFB449] scale-95" : "border-transparent hover:border-[#FFE4C2]"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-[#FF8A00] font-bold uppercase tracking-wide mb-2 capitalize">
            {product.category.replace(/-/g, " ")}
          </p>

          <h1 className="text-2xl lg:text-3xl font-black text-[#1A1A1A] leading-tight mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className={s <= Math.round(product.rating) ? "fill-[#FFB449] text-[#FFB449]" : "text-[#E0E0E0]"} />
              ))}
            </div>
            <span className="text-sm font-bold text-[#1A1A1A]">{product.rating}</span>
            <span className="text-sm text-[#6B6B6B]">({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black text-[#1A1A1A]">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-[#6B6B6B] line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">{product.description}</p>

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName} className="mb-5">
              <p className="text-sm font-bold text-[#1A1A1A] mb-2">{groupName}</p>
              <div className="flex flex-wrap gap-2">
                {variants?.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariants((prev) => ({ ...prev, [groupName]: v.value }))}
                    disabled={!v.inStock}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      selectedVariants[groupName] === v.value
                        ? "border-[#FFB449] bg-[#FFE4C2] text-[#1A1A1A]"
                        : v.inStock
                        ? "border-[#FFE4C2] hover:border-[#FFB449] text-[#1A1A1A]"
                        : "border-[#E0E0E0] text-[#C0C0C0] cursor-not-allowed line-through"
                    }`}
                  >
                    {v.value}
                    {v.priceModifier && <span className="text-[#FF8A00]"> +₹{v.priceModifier}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-bold text-[#1A1A1A]">Quantity:</p>
            <div className="flex items-center gap-3 bg-[#FFF9EE] rounded-full px-4 py-2 border border-[#FFE4C2]">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="font-black text-lg hover:text-[#FF8A00]">−</button>
              <span className="font-bold w-6 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="font-black text-lg hover:text-[#FF8A00]">+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-[#FFB449] text-[#1A1A1A] hover:bg-[#FF8A00] hover:text-white hover:shadow-lg"
              }`}
            >
              {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>

            <button
              onClick={() => toggle(product)}
              className="w-14 h-14 rounded-full border-2 border-[#FFE4C2] flex items-center justify-center hover:border-[#FFB449] hover:bg-[#FFE4C2] transition-all"
            >
              <Heart size={20} className={wishlisted ? "fill-red-500 text-red-500" : "text-[#6B6B6B]"} />
            </button>

            <button className="w-14 h-14 rounded-full border-2 border-[#FFE4C2] flex items-center justify-center hover:border-[#FFB449] hover:bg-[#FFE4C2] transition-all">
              <Share2 size={18} className="text-[#6B6B6B]" />
            </button>
          </div>

          {product.customizable && (
            <div className="bg-[#FFE4C2] rounded-2xl p-4 mb-6 flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-bold text-sm text-[#1A1A1A]">This gift is customizable</p>
                <p className="text-xs text-[#6B6B6B]">Add your logo, message, or design.</p>
                <Link href="/custom-orders" className="text-xs text-[#FF8A00] font-bold hover:underline">
                  Request customization →
                </Link>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#FFE4C2]">
            {[
              { icon: <Truck size={16} />, label: "Free Delivery", sub: "Above ₹999" },
              { icon: <Shield size={16} />, label: "100% Secure", sub: "Safe packaging" },
              { icon: <RefreshCw size={16} />, label: "Easy Returns", sub: "7-day policy" },
            ].map((f) => (
              <div key={f.label} className="text-center">
                <div className="flex justify-center text-[#FFB449] mb-1">{f.icon}</div>
                <p className="text-xs font-bold text-[#1A1A1A]">{f.label}</p>
                <p className="text-xs text-[#6B6B6B]">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
