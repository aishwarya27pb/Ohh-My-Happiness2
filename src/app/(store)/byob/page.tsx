"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Gift, 
  MessageSquare, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Loader2 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import type { Product } from "@/types";

// --- Mock Data ---
const BOX_TYPES = [
  { id: "luxury-wood", name: "Luxury Wooden Box", price: 500, image: "https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?w=400&q=80", color: "bg-[#8B4513]" },
  { id: "classic-pink", name: "Classic Pink Box", price: 300, image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80", color: "bg-[#FFC0CB]" },
  { id: "eco-kraft", name: "Eco-Friendly Kraft", price: 200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", color: "bg-[#D2B48C]" },
];

const STEPS = [
  { id: 1, name: "Choose Box", icon: Package },
  { id: 2, name: "Fill Items", icon: Gift },
  { id: 3, name: "Add Card", icon: MessageSquare },
  { id: 4, name: "Preview", icon: Sparkles },
];

interface BoxType {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
}

interface BYOBSelection {
  box: BoxType | null;
  items: Product[];
  card: string | null;
  message: string;
}

export default function BYOBPage() {
  const { addCustomItem, openCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState<BYOBSelection>({
    box: null,
    items: [],
    card: null,
    message: "",
  });

  const nextStep = async () => {
    if (currentStep === 4) {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please sign in to save your custom hamper", {
          icon: "🔒",
          duration: 4000,
        });
        router.push(`/auth/signup?next=${encodeURIComponent(pathname)}`);
        return;
      }

      // Add to cart logic
      addCustomItem(selection);
      toast.success("Custom Hamper added to cart!");
      openCart();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#FFF9EE] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-[#FF8A00] -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive ? "bg-[#FF8A00] text-white" : "bg-white text-gray-400 border-2 border-gray-100"
                    } ${isCurrent ? "ring-4 ring-[#FF8A00]/20 scale-110" : ""}`}
                  >
                    {isActive && currentStep > step.id ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-3 transition-colors duration-300 ${isActive ? "text-[#FF8A00]" : "text-gray-400"}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Builder Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[40px] shadow-xl shadow-orange-900/5 p-8 sm:p-12 min-h-[500px] border border-orange-100/50"
              >
                {currentStep === 1 && (
                  <Step1BoxSelection selection={selection} setSelection={setSelection} />
                )}
                {currentStep === 2 && (
                  <Step2ItemSelection selection={selection} setSelection={setSelection} />
                )}
                {currentStep === 3 && (
                  <Step3CardMessage selection={selection} setSelection={setSelection} />
                )}
                {currentStep === 4 && (
                  <Step4Preview selection={selection} />
                )}

                {/* Navigation Buttons */}
                <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-all ${
                      currentStep === 1 ? "opacity-0 pointer-events-none" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  
                  <button
                    onClick={nextStep}
                    disabled={(currentStep === 1 && !selection.box) || (currentStep === 2 && selection.items.length === 0)}
                    className="flex items-center gap-2 bg-[#FFB449] text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-orange-200 hover:bg-[#FF8A00] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {currentStep === 4 ? "Add to Cart" : "Continue"}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Real-time Box Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-[32px] p-8 shadow-xl shadow-orange-900/5 border border-orange-100/50">
              <h3 className="text-xl font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
                <Package size={20} className="text-[#FF8A00]" />
                Your Hamper
              </h3>

              <div className="space-y-4 mb-8">
                {selection.box ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{selection.box.name}</span>
                    <span className="font-bold">₹{selection.box.price}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No box selected yet</p>
                )}

                {selection.items.length > 0 ? (
                  selection.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{item.name}</span>
                      <span className="font-bold">₹{item.price}</span>
                    </div>
                  ))
                ) : (
                   currentStep > 1 && <p className="text-sm text-gray-400 italic">No items added yet</p>
                )}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-lg font-bold text-[#1A1A1A]">
                    ₹{(selection.box?.price || 0) + selection.items.reduce((acc, i) => acc + i.price, 0)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                  Price includes premium packaging and taxes. Shipping calculated at checkout.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Step Components ---

function Step1BoxSelection({ selection, setSelection }: { 
  selection: BYOBSelection; 
  setSelection: React.Dispatch<React.SetStateAction<BYOBSelection>>;
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">Choose Your Canvas</h2>
        <p className="text-gray-500">Pick a premium box style that suits the occasion.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BOX_TYPES.map((box) => (
          <div
            key={box.id}
            onClick={() => setSelection({ ...selection, box })}
            className={`cursor-pointer group relative rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
              selection.box?.id === box.id ? "border-[#FF8A00] bg-orange-50/30" : "border-gray-100 hover:border-orange-200"
            }`}
          >
            <div className="aspect-square relative">
              <img src={box.image} alt={box.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {selection.box?.id === box.id && (
                <div className="absolute inset-0 bg-[#FF8A00]/10 flex items-center justify-center">
                  <div className="bg-[#FF8A00] text-white p-2 rounded-full shadow-lg">
                    <Check size={24} />
                  </div>
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="font-bold text-[#1A1A1A]">{box.name}</p>
              <p className="text-[#FF8A00] font-black mt-1">₹{box.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2ItemSelection({ selection, setSelection }: { 
  selection: BYOBSelection; 
  setSelection: React.Dispatch<React.SetStateAction<BYOBSelection>>;
}) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").eq("in_stock", true).lt("price", 1000);
      const filtered = (data ?? []).map((r: any) => ({ ...r, category: r.category_slug ?? "", inStock: r.in_stock, originalPrice: r.original_price, shortDescription: r.short_description, isBestseller: r.is_bestseller, isFeatured: r.is_featured, isNew: r.is_new, stockQuantity: r.stock_quantity, lowStockThreshold: r.low_stock_threshold, reviewCount: r.review_count })) as Product[];
      setItems(filtered);
      setLoading(false);
    }
    fetchItems();
  }, []);

  const toggleItem = (item: Product) => {
    const exists = selection.items.find(i => i.id === item.id);
    if (exists) {
      setSelection({ ...selection, items: selection.items.filter(i => i.id !== item.id) });
    } else {
      setSelection({ ...selection, items: [...selection.items, item] });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">Fill the Happiness</h2>
        <p className="text-gray-500">Select the treats to go inside your hamper.</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
           <Loader2 className="w-10 h-10 animate-spin text-[#FF8A00]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {items.map((item) => {
            const isSelected = selection.items.find(i => i.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item)}
                className={`cursor-pointer group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isSelected ? "border-[#FF8A00] bg-orange-50/30" : "border-gray-100 hover:border-orange-200"
                }`}
              >
                <div className="aspect-square relative">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#FF8A00] text-white p-1 rounded-full shadow-lg">
                      <Check size={14} />
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <p className="font-bold text-xs text-[#1A1A1A] truncate">{item.name}</p>
                  <p className="text-[#FF8A00] text-xs font-black mt-0.5">₹{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step3CardMessage({ selection, setSelection }: { 
  selection: BYOBSelection; 
  setSelection: React.Dispatch<React.SetStateAction<BYOBSelection>>;
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">The Personal Touch</h2>
        <p className="text-gray-500">Choose a card and write a message for your recipient.</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-4 uppercase tracking-widest">Select a Card</label>
          <div className="grid grid-cols-3 gap-4">
            {["Birthday", "Anniversary", "General"].map(card => (
              <div
                key={card}
                onClick={() => setSelection({ ...selection, card })}
                className={`cursor-pointer py-4 px-6 rounded-2xl border-2 text-center font-bold text-sm transition-all ${
                  selection.card === card ? "bg-[#FF8A00] border-[#FF8A00] text-white" : "border-gray-100 text-gray-500 hover:border-orange-200"
                }`}
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1A1A1A] mb-4 uppercase tracking-widest">Your Message</label>
          <textarea
            value={selection.message}
            onChange={(e) => setSelection({ ...selection, message: e.target.value })}
            placeholder="Type your heartfelt message here..."
            className="w-full h-40 p-6 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF8A00] text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

function Step4Preview({ selection }: { selection: BYOBSelection }) {
  return (
    <div className="text-center">
      <div className="mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <Sparkles size={40} />
        </div>
        <h2 className="text-4xl font-black text-[#1A1A1A] mb-3">Hamper Ready!</h2>
        <p className="text-gray-500">Review your custom creation before adding to cart.</p>
      </div>

      <div className="max-w-md mx-auto bg-gray-50 rounded-3xl p-8 text-left space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF8A00]">
             <Package size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Selected Box</p>
            <p className="font-bold text-[#1A1A1A]">{selection.box?.name}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-3">Included Items ({selection.items.length})</p>
          <div className="flex flex-wrap gap-2">
            {selection.items.map((item, idx) => (
              <span key={idx} className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 border border-gray-100">
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {selection.card && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Personal Message ({selection.card})</p>
            <p className="text-sm text-gray-600 italic">"{selection.message || "No message provided"}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
