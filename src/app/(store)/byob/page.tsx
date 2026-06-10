"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Gift,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Banknote,
  PenLine,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

// --- Config ---
const MAX_ITEMS = 6;

const BOX_TYPES = [
  { id: "luxury-wood", name: "Luxury Wooden Box", price: 500, image: "https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?w=400&q=80" },
  { id: "classic-pink", name: "Classic Pink Box", price: 300, image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80" },
  { id: "eco-kraft", name: "Eco-Friendly Kraft", price: 200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
];

// Individual fillable gift items for the box (curated, not full hampers)
interface GiftItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Individual gifts are real catalog products (tagged "byob-gift" in Supabase) —
// adding, editing, or removing one in the admin Products page updates this
// builder automatically, keeping the storefront and admin in sync.
const BYOB_GIFT_TAG = "byob-gift";

type GiftShape = "bottle" | "mug" | "pen" | "small" | "card";

// Each gift keeps its own real-world footprint — a bottle is tall & narrow, a
// pen is a thin sliver, a book is a wide card — so it looks like the actual
// object resting inside the box rather than a generic tile. Keyed by product
// slug so it keeps working as long as the catalog slugs stay stable.
const ITEM_SHAPE: Record<string, GiftShape> = {
  bottle: "bottle",
  mug: "mug",
  pen: "pen",
  keychain: "small",
  frame: "small",
};

const SHAPE_SIZE: Record<GiftShape, { w: number; h: number }> = {
  bottle: { w: 60, h: 150 },
  mug: { w: 64, h: 64 },
  pen: { w: 24, h: 124 },
  small: { w: 56, h: 56 },
  card: { w: 132, h: 104 },
};

const SHAPE_RADIUS: Record<GiftShape, string> = {
  bottle: "rounded-t-full rounded-b-2xl",
  mug: "rounded-xl",
  pen: "rounded-full",
  small: "rounded-lg",
  card: "rounded-2xl",
};

const BOX_W = 380;
const BOX_H = 440;
const GIFT_GAP = 8; // breathing room so real objects don't visually overlap

function shapeOf(item: GiftItem): GiftShape {
  return ITEM_SHAPE[item.slug] ?? "card";
}

function rectsCollide(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw + GIFT_GAP && ax + aw + GIFT_GAP > bx && ay < by + bh + GIFT_GAP && ay + ah + GIFT_GAP > by;
}

// Searches the box for the open spot closest to where the user actually
// dropped the item — this is the "rearrange themselves" behaviour: drop on
// top of something else and the new gift settles into the nearest free space
// instead of overlapping it. Returns null when nothing fits anywhere (no space).
function findOpenSpot(
  w: number,
  h: number,
  placed: { x: number; y: number; w: number; h: number }[],
  desiredX: number,
  desiredY: number
): { x: number; y: number } | null {
  const STEP = 14;
  let best: { x: number; y: number } | null = null;
  let bestDist = Infinity;
  for (let y = 0; y <= BOX_H - h; y += STEP) {
    for (let x = 0; x <= BOX_W - w; x += STEP) {
      const collides = placed.some((p) => rectsCollide(x, y, w, h, p.x, p.y, p.w, p.h));
      if (!collides) {
        const dx = x - desiredX;
        const dy = y - desiredY;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          best = { x, y };
        }
      }
    }
  }
  return best;
}

const STEPS = [
  { id: 1, name: "Select Box", icon: Package },
  { id: 2, name: "Add Gifts", icon: Gift },
  { id: 3, name: "Personalize", icon: PenLine },
];

interface BoxType {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface BYOBSelection {
  box: BoxType | null;
  items: GiftItem[];
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

  const subtotal = (selection.box?.price || 0) + selection.items.reduce((acc, i) => acc + i.price, 0);

  const goToStep = (id: number) => {
    if (id < currentStep) setCurrentStep(id);
  };

  const nextStep = async () => {
    if (currentStep === 3) {
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

      addCustomItem(selection);
      toast.success("Custom Hamper added to cart!");
      openCart();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const sidebarLabel = currentStep === 1 ? "Continue" : currentStep === 2 ? "Review Box" : "Add to Cart";
  const sidebarDisabled =
    (currentStep === 1 && !selection.box) || (currentStep === 2 && selection.items.length === 0);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <p className="text-amber font-bold text-xs uppercase tracking-[0.2em] mb-2">Build Your Own Box</p>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1A1A1A] mb-3">Fill the Happiness</h1>
          <p className="text-[#6B6B6B]">
            Select premium items from our catalog and drag them into your custom gift box. Every box is hand-packed
            with care.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Main Builder Area */}
          <div>
            {/* Step indicator (mobile-friendly horizontal) */}
            <div className="flex items-center gap-1.5 sm:gap-3 mb-8">
              {STEPS.map((step, idx) => {
                const isActive = currentStep >= step.id;
                const isCurrent = currentStep === step.id;
                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => goToStep(step.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 ${
                        isCurrent
                          ? "bg-amber text-white shadow-lg shadow-amber/20"
                          : isActive
                          ? "bg-peach text-amber"
                          : "bg-white text-gray-400 border border-gray-100"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0 ${
                          isCurrent ? "bg-white/25" : isActive ? "bg-amber/20" : "bg-gray-100"
                        }`}
                      >
                        {isActive && currentStep > step.id ? <Check size={12} /> : step.id}
                      </span>
                      <span className="hidden sm:inline">{step.name}</span>
                    </button>
                    {idx < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 max-w-10" />}
                  </React.Fragment>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {currentStep === 1 && <Step1BoxSelection selection={selection} setSelection={setSelection} />}
                {currentStep === 2 && <Step2AddGifts selection={selection} setSelection={setSelection} />}
                {currentStep === 3 && <Step3Personalize selection={selection} setSelection={setSelection} />}
              </motion.div>
            </AnimatePresence>

            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="mt-8 flex items-center gap-2 font-bold px-6 py-3 rounded-full text-gray-500 hover:bg-white transition-all"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
          </div>

          {/* Persistent Cart Sidebar */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-peach/40 border border-peach rounded-[28px] p-6 sm:p-7">
              <h3 className="text-xl font-black text-amber mb-1">Your Custom Box</h3>
              <p className="text-xs text-[#6B6B6B] font-semibold mb-6">{selection.items.length}/{MAX_ITEMS} Items Selected</p>

              <div className="space-y-1 mb-6">
                {STEPS.map((step) => {
                  const isCurrent = currentStep === step.id;
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.id}
                      onClick={() => goToStep(step.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        isCurrent ? "bg-amber text-white shadow-md shadow-amber/30" : "text-[#6B6B6B] hover:bg-white/60"
                      }`}
                    >
                      <Icon size={18} />
                      {step.name}
                    </button>
                  );
                })}
              </div>

              {(selection.box || selection.items.length > 0) && (
                <div className="space-y-2 mb-6 pt-2 border-t border-peach max-h-48 overflow-y-auto pr-1">
                  {selection.box && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B6B6B] truncate">{selection.box.name}</span>
                      <span className="font-bold text-[#1A1A1A]">₹{selection.box.price}</span>
                    </div>
                  )}
                  {selection.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-[#6B6B6B] truncate">{item.name}</span>
                      <span className="font-bold text-[#1A1A1A]">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-[#6B6B6B] font-semibold mb-4 pt-2 border-t border-peach">
                <Banknote size={16} className="text-amber" />
                Subtotal: <span className="text-[#1A1A1A] font-black">₹{subtotal}</span>
              </div>

              <button
                onClick={nextStep}
                disabled={sidebarDisabled}
                className="w-full flex items-center justify-center gap-2 bg-amber text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-amber/20 hover:bg-[#E67A00] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sidebarLabel}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Step 1: Box Selection ---

function Step1BoxSelection({
  selection,
  setSelection,
}: {
  selection: BYOBSelection;
  setSelection: React.Dispatch<React.SetStateAction<BYOBSelection>>;
}) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-peach/60 p-8 sm:p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">Choose Your Canvas</h2>
        <p className="text-[#6B6B6B] text-sm">Pick a premium box style that suits the occasion.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BOX_TYPES.map((box) => (
          <div
            key={box.id}
            onClick={() => setSelection({ ...selection, box })}
            className={`cursor-pointer group relative rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
              selection.box?.id === box.id ? "border-amber bg-cream" : "border-gray-100 hover:border-golden"
            }`}
          >
            <div className="aspect-square relative">
              <img src={box.image} alt={box.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              {selection.box?.id === box.id && (
                <div className="absolute inset-0 bg-amber/10 flex items-center justify-center">
                  <div className="bg-amber text-white p-2 rounded-full shadow-lg">
                    <Check size={24} />
                  </div>
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="font-bold text-[#1A1A1A]">{box.name}</p>
              <p className="text-amber font-black mt-1">₹{box.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Step 2: Add Gifts (drag items into the box) ---

function Step2AddGifts({
  selection,
  setSelection,
}: {
  selection: BYOBSelection;
  setSelection: React.Dispatch<React.SetStateAction<BYOBSelection>>;
}) {
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showFullWarning, setShowFullWarning] = useState(false);
  // Real x/y coordinates (px, relative to the box) where each gift currently rests
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [loadingGifts, setLoadingGifts] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);

  // Pull individual gifts straight from the live catalog — anything an admin
  // tags "byob-gift" in /admin/products shows up here automatically.
  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, price, images, tags")
        .contains("tags", [BYOB_GIFT_TAG])
        .order("name");
      if (!active) return;
      if (!error && data) {
        setGiftItems(
          data.map((row) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            price: row.price,
            image: row.images?.[0] ?? "",
            category: (row.tags ?? []).find((t: string) => t !== BYOB_GIFT_TAG) ?? "gifts",
          }))
        );
      }
      setLoadingGifts(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(giftItems.map((i) => i.category));
    return ["All Items", ...Array.from(set)];
  }, [giftItems]);

  const visibleItems = activeCategory === "All Items" ? giftItems : giftItems.filter((i) => i.category === activeCategory);

  const placedRects = useMemo(
    () =>
      selection.items.map((i) => {
        const { w, h } = SHAPE_SIZE[shapeOf(i)];
        const pos = positions[i.id] ?? { x: 0, y: 0 };
        return { id: i.id, x: pos.x, y: pos.y, w, h };
      }),
    [selection.items, positions]
  );

  const flashFullWarning = () => {
    setShowFullWarning(true);
    setTimeout(() => setShowFullWarning(false), 1500);
  };

  // Drops the gift at (or as close as possible to) the spot the user actually
  // chose — landing exactly there if it's free, or settling into the nearest
  // open space if something's already there. No space anywhere → error toast.
  const placeItem = (item: GiftItem, desiredX?: number, desiredY?: number) => {
    if (selection.items.find((i) => i.id === item.id)) return;
    if (selection.items.length >= MAX_ITEMS) {
      flashFullWarning();
      return;
    }
    const { w, h } = SHAPE_SIZE[shapeOf(item)];
    const dx = desiredX ?? (BOX_W - w) / 2;
    const dy = desiredY ?? (BOX_H - h) / 2;
    const clampedX = Math.min(Math.max(dx, 0), BOX_W - w);
    const clampedY = Math.min(Math.max(dy, 0), BOX_H - h);
    const spot = findOpenSpot(w, h, placedRects, clampedX, clampedY);
    if (!spot) {
      flashFullWarning();
      return;
    }
    setPositions((prev) => ({ ...prev, [item.id]: spot }));
    setSelection({ ...selection, items: [...selection.items, item] });
  };

  // Re-settles an already-placed gift at (or near) a new spot the user dragged
  // it to — snapping to the nearest free space if something else is there.
  const repositionItem = (item: GiftItem, desiredX: number, desiredY: number) => {
    const { w, h } = SHAPE_SIZE[shapeOf(item)];
    const clampedX = Math.min(Math.max(desiredX, 0), BOX_W - w);
    const clampedY = Math.min(Math.max(desiredY, 0), BOX_H - h);
    const others = placedRects.filter((r) => r.id !== item.id);
    const spot = findOpenSpot(w, h, others, clampedX, clampedY);
    if (!spot) return;
    setPositions((prev) => ({ ...prev, [item.id]: spot }));
  };

  const removeItem = (id: string) => {
    setSelection({ ...selection, items: selection.items.filter((i) => i.id !== id) });
    setPositions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleItem = (item: GiftItem) => {
    if (selection.items.find((i) => i.id === item.id)) removeItem(item.id);
    else placeItem(item);
  };

  const handleDragStart = (e: React.DragEvent, item: GiftItem) => {
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData("text/plain");
    const item = giftItems.find((i) => i.id === id);
    if (!item) return;
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) {
      placeItem(item);
      return;
    }
    const { w, h } = SHAPE_SIZE[shapeOf(item)];
    // Land the gift centred under the cursor — exactly where the user dropped it
    const dropX = e.clientX - box.left - w / 2;
    const dropY = e.clientY - box.top - h / 2;
    if (selection.items.find((i) => i.id === id)) {
      repositionItem(item, dropX, dropY);
      return;
    }
    placeItem(item, dropX, dropY);
  };

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-6">
      {/* Box drop zone — the highlighted centerpiece */}
      <div className="bg-white rounded-[32px] shadow-md shadow-amber/10 border-2 border-golden/40 p-6 sm:p-8 relative">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-black text-[#1A1A1A]">Your Gift Box</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] mt-1">Drag gifts here to fill it up</p>
          </div>
          <span className="text-xs font-bold text-amber bg-peach px-3 py-1.5 rounded-full whitespace-nowrap">
            {selection.items.length}/{MAX_ITEMS} items
          </span>
        </div>

        <div
          ref={boxRef}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative mx-auto rounded-[28px] border-2 border-dashed transition-colors duration-200 ${
            isDragOver ? "border-amber bg-peach/50" : "border-golden bg-cream"
          }`}
          style={{ width: BOX_W, height: BOX_H, maxWidth: "100%" }}
        >
          {selection.items.length === 0 && (
            <p className="absolute inset-x-4 bottom-5 text-center text-xs text-[#6B6B6B] italic flex items-center justify-center gap-2">
              <Package size={16} className="text-golden shrink-0" />
              Drag a gift and drop it anywhere — it lands right where you place it
            </p>
          )}

          <AnimatePresence>
            {selection.items.map((item) => {
              const shape = shapeOf(item);
              const { w, h } = SHAPE_SIZE[shape];
              const pos = positions[item.id] ?? { x: 0, y: 0 };
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: -50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 360, damping: 26 }}
                  whileHover={{ scale: 1.04 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, item)}
                  onClick={() => removeItem(item.id)}
                  title="Drag to move • click to remove"
                  style={{ position: "absolute", left: pos.x, top: pos.y, width: w, height: h }}
                  className={`overflow-hidden border-2 border-white shadow-lg cursor-grab active:cursor-grabbing group ${SHAPE_RADIUS[shape]}`}
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-[10px] font-bold">Drag to move • Click to remove</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {showFullWarning && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 whitespace-nowrap z-10"
              >
                <AlertCircle size={14} />
                No space left in the box!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Individual gifts panel */}
      <div className="bg-white rounded-[28px] shadow-sm border border-peach/60 p-5 sm:p-6">
        <h3 className="text-lg font-black text-[#1A1A1A] mb-4">Individual Gifts</h3>
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize transition-all ${
                activeCategory === cat ? "bg-amber text-white" : "bg-cream text-[#6B6B6B] hover:bg-peach"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loadingGifts ? (
          <p className="text-sm text-[#6B6B6B] italic py-8 text-center">Loading gifts from the catalog…</p>
        ) : visibleItems.length === 0 ? (
          <p className="text-sm text-[#6B6B6B] italic py-8 text-center">No gifts available in this category yet.</p>
        ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
          {visibleItems.map((item) => {
            const isSelected = !!selection.items.find((i) => i.id === item.id);
            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => toggleItem(item)}
                className={`cursor-grab active:cursor-grabbing group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isSelected ? "border-amber bg-cream" : "border-gray-100 hover:border-golden"
                }`}
              >
                <div className="aspect-square relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" draggable={false} />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-amber text-white p-1 rounded-full shadow-lg">
                      <Check size={14} />
                    </div>
                  )}
                </div>
                <div className="p-2.5 text-center">
                  <p className="font-bold text-xs text-[#1A1A1A] truncate">{item.name}</p>
                  <p className="text-amber text-xs font-black mt-0.5">₹{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}

// --- Step 3: Personalize + Review ---

function Step3Personalize({
  selection,
  setSelection,
}: {
  selection: BYOBSelection;
  setSelection: React.Dispatch<React.SetStateAction<BYOBSelection>>;
}) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-peach/60 p-8 sm:p-10 space-y-10">
      <div>
        <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">The Personal Touch</h2>
        <p className="text-[#6B6B6B] text-sm">Choose a card and write a message for your recipient.</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-4 uppercase tracking-widest">Select a Card</label>
          <div className="grid grid-cols-3 gap-4">
            {["Birthday", "Anniversary", "General"].map((card) => (
              <div
                key={card}
                onClick={() => setSelection({ ...selection, card })}
                className={`cursor-pointer py-4 px-6 rounded-2xl border-2 text-center font-bold text-sm transition-all ${
                  selection.card === card ? "bg-amber border-amber text-white" : "border-gray-100 text-[#6B6B6B] hover:border-golden"
                }`}
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-4 uppercase tracking-widest">Your Message</label>
          <textarea
            value={selection.message}
            onChange={(e) => setSelection({ ...selection, message: e.target.value })}
            placeholder="Type your heartfelt message here..."
            className="w-full h-36 p-6 rounded-3xl bg-cream border-none focus:ring-2 focus:ring-amber text-[#1A1A1A] placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="pt-8 border-t border-peach">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-peach flex items-center justify-center text-amber">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs text-[#6B6B6B] uppercase font-bold tracking-widest">Review</p>
            <h3 className="font-black text-[#1A1A1A]">Your Hamper Summary</h3>
          </div>
        </div>

        <div className="bg-cream rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B6B6B]">Selected Box</span>
            <span className="font-bold text-[#1A1A1A]">{selection.box?.name ?? "—"}</span>
          </div>
          <div>
            <p className="text-xs text-[#6B6B6B] uppercase font-bold tracking-widest mb-3">
              Included Items ({selection.items.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selection.items.map((item, idx) => (
                <span key={idx} className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-[#6B6B6B] border border-gray-100">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
          {selection.card && (
            <div className="pt-4 border-t border-peach">
              <p className="text-xs text-[#6B6B6B] uppercase font-bold tracking-widest mb-2">
                Personal Message ({selection.card})
              </p>
              <p className="text-sm text-[#6B6B6B] italic">"{selection.message || "No message provided"}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
