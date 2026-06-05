"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RefreshCw, 
  Check, 
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(product.id) : false;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/store/${product.slug}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.jpg"];
  const mainImage = images[activeIndex];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setActiveIndex((prev) => (prev + 1) % images.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Group variants by name
  const variantGroups = product.variants?.reduce<Record<string, typeof product.variants>>((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name]!.push(v);
    return acc;
  }, {}) ?? {};

  const handleAddToCart = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please sign in to add items to your cart", {
        icon: "🔒",
        duration: 4000,
      });
      router.push(`/auth/signup?next=${encodeURIComponent(pathname)}`);
      return;
    }

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
          <div className="aspect-square bg-white rounded-3xl flex items-center justify-center relative overflow-hidden border border-[#FFE4C2]/50 shadow-sm group">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={activeIndex}
                src={mainImage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                alt={product.name}
                className="absolute w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => paginate(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1A1A1A] shadow-md hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => paginate(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1A1A1A] shadow-md hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {product.isBestseller && (
              <span className="absolute top-4 left-4 bg-[#FFB449] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 right-4 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                New Arrival
              </span>
            )}
          </div>

          {/* Thumbnail row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    setDirection(i > activeIndex ? 1 : -1);
                    setActiveIndex(i);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    activeIndex === i ? "border-[#FFB449] scale-95" : "border-transparent hover:border-[#FFE4C2]"
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
          <div className="flex gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(255, 138, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                added
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-[#FFB449] text-[#1A1A1A] hover:bg-[#FF8A00] hover:text-white shadow-md"
              }`}
            >
              {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#FFE4C2" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggle(product)}
              className="w-14 h-14 rounded-2xl border-2 border-[#FFE4C2] flex items-center justify-center transition-all bg-white shadow-sm"
            >
              <Heart size={20} className={wishlisted ? "fill-red-500 text-red-500" : "text-[#6B6B6B]"} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "#FFE4C2" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className={`w-14 h-14 rounded-2xl border-2 border-[#FFE4C2] flex items-center justify-center transition-all bg-white shadow-sm ${shared ? "bg-green-50 border-green-200" : ""}`}
              title="Share product"
            >
              <AnimatePresence mode="wait">
                {shared ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-green-600"
                  >
                    <Check size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="share"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Share2 size={18} className="text-[#6B6B6B]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {product.customizable && (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-[#FFE4C2] rounded-2xl p-4 mb-8 flex items-center gap-4 border border-[#FFB449]/20"
            >
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-bold text-sm text-[#1A1A1A]">This gift is customizable</p>
                <p className="text-xs text-[#6B6B6B]">Add your logo, message, or design.</p>
                <Link href="/custom-orders" className="text-xs text-[#FF8A00] font-bold hover:underline">
                  Request customization →
                </Link>
              </div>
            </motion.div>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#FFE4C2]">
            {[
              { icon: <Truck size={18} />, label: "Free Delivery", sub: "Above ₹999" },
              { icon: <Shield size={18} />, label: "100% Secure", sub: "Safe packaging" },
              { icon: <RefreshCw size={18} />, label: "Easy Returns", sub: "7-day policy" },
            ].map((f) => (
              <motion.div 
                key={f.label} 
                whileHover={{ y: -5 }}
                className="text-center p-3 rounded-2xl transition-colors hover:bg-white/50"
              >
                <div className="flex justify-center text-[#FFB449] mb-2">{f.icon}</div>
                <p className="text-[11px] font-bold text-[#1A1A1A] leading-tight mb-0.5">{f.label}</p>
                <p className="text-[10px] text-[#6B6B6B]">{f.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

