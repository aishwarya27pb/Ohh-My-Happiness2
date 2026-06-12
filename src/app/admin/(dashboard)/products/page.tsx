"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { deleteProductAction } from "@/app/actions/product.actions";
import type { Product } from "@/types";
import { Plus, Search, Edit2, Trash2, ExternalLink, Loader2, PackageX, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []).map((r: any) => ({ ...r, category: r.category_slug ?? "", inStock: r.in_stock, originalPrice: r.original_price, shortDescription: r.short_description, isBestseller: r.is_bestseller, isFeatured: r.is_featured, isNew: r.is_new, stockQuantity: r.stock_quantity, lowStockThreshold: r.low_stock_threshold, reviewCount: r.review_count })) as Product[]);
    setLoading(false);
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    const { error } = await deleteProductAction(id);
    
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted successfully");
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    setDeletingId(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Products</h1>
          <p className="text-sm text-[#6B6B6B]">Manage your gift catalog and inventory.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FFB449]/20 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#6B6B6B]">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF8A00] mb-4" />
            <p className="text-sm font-medium">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Stock Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FFF9EE] rounded-xl flex items-center justify-center text-2xl shrink-0 border border-[#FFE4C2] overflow-hidden">
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            "🎁"
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#1A1A1A] truncate">{p.name}</p>
                          <div className="flex items-center gap-2">
                             <Link href={`/store/${p.slug}`} target="_blank" className="text-[10px] text-[#FF8A00] hover:underline flex items-center gap-0.5">
                               View on site <ExternalLink size={8} />
                             </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 bg-[#FFF9EE] text-[#FF8A00] rounded-lg capitalize border border-[#FFE4C2]">
                        {p.category.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">₹{p.price.toLocaleString()}</p>
                        {!!p.originalPrice && (
                          <p className="text-[10px] text-[#6B6B6B] line-through">₹{p.originalPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.inStock ? (
                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                          <CheckCircle2 size={14} /> In Stock
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                          <PackageX size={14} /> Out of Stock
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/admin/products/${p.id}`}
                          className="p-2 text-[#6B6B6B] hover:text-[#FF8A00] hover:bg-[#FFF9EE] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="p-2 text-[#6B6B6B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-gray-300" size={32} />
            </div>
            <h3 className="font-bold text-[#1A1A1A]">No products found</h3>
            <p className="text-sm text-[#6B6B6B] max-w-[240px] mx-auto mt-1">
              Try searching for something else or add a new product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
