"use client";

import { useState, useMemo } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Filter, X, SlidersHorizontal } from "lucide-react";

const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { label: "Above ₹5,000", min: 5000, max: Infinity },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];

export default function StoreClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedPrice) {
      const range = priceRanges.find((r) => r.label === selectedPrice);
      if (range) list = list.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));
        break;
      default:
        list = list.filter((p) => p.isFeatured || p.isBestseller).concat(list.filter((p) => !p.isFeatured && !p.isBestseller));
    }

    return list;
  }, [selectedCategory, selectedPrice, sortBy, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPrice("");
    setSortBy("featured");
    setSearchQuery("");
  };

  const hasFilters = selectedCategory !== "all" || selectedPrice || sortBy !== "featured" || searchQuery;

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-[#FFE4C2] to-[#FFF9EE] py-14 px-4 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF8A00] bg-white px-4 py-1.5 rounded-full mb-4">
          Gift Store
        </span>
        <h1 className="text-4xl font-black text-[#1A1A1A] mb-3">
          Find the <span className="text-gradient">Perfect Gift</span>
        </h1>
        <p className="text-[#6B6B6B] max-w-xl mx-auto">
          Browse {products.length}+ curated gifts for every occasion, budget, and person.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-2xl border-2 border-[#FFE4C2] bg-white focus:outline-none focus:border-[#FFB449] text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={16} className="text-[#6B6B6B]" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-2xl border-2 border-[#FFE4C2] bg-white focus:outline-none focus:border-[#FFB449] text-sm font-medium"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-[#FFE4C2] bg-white text-sm font-medium"
          >
            <SlidersHorizontal size={16} />
            Filters {hasFilters && <span className="bg-[#FFB449] text-[#1A1A1A] text-xs px-1.5 rounded-full">!</span>}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} sm:block w-full sm:w-56 shrink-0 space-y-6`}>
            {/* Category Filter */}
            <div className="bg-white rounded-3xl p-5 border border-[#FFE4C2]">
              <h3 className="font-bold text-sm text-[#1A1A1A] mb-4 flex items-center gap-2">
                <Filter size={14} /> Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                    selectedCategory === "all" ? "bg-[#FFB449] text-[#1A1A1A] font-bold" : "text-[#6B6B6B] hover:bg-[#FFF9EE]"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      selectedCategory === cat.slug ? "bg-[#FFB449] text-[#1A1A1A] font-bold" : "text-[#6B6B6B] hover:bg-[#FFF9EE]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-3xl p-5 border border-[#FFE4C2]">
              <h3 className="font-bold text-sm text-[#1A1A1A] mb-4">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setSelectedPrice(selectedPrice === r.label ? "" : r.label)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      selectedPrice === r.label ? "bg-[#FFB449] text-[#1A1A1A] font-bold" : "text-[#6B6B6B] hover:bg-[#FFF9EE]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-[#FF8A00] font-bold hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#6B6B6B]">
                <span className="font-bold text-[#1A1A1A]">{filtered.length}</span> gifts found
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">No gifts found</h3>
                <p className="text-[#6B6B6B] text-sm mb-4">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn-primary text-sm py-2 px-6">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
