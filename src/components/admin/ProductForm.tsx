"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Product, Category } from "@/types";
import { Loader2, Save, X, Image as ImageIcon, Plus, Trash2, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    price: initialData?.price || 0,
    original_price: initialData?.originalPrice || 0,
    category_slug: initialData?.category || "",
    description: initialData?.description || "",
    short_description: initialData?.shortDescription || "",
    in_stock: initialData?.inStock ?? true,
    is_featured: initialData?.isFeatured ?? false,
    is_bestseller: initialData?.isBestseller ?? false,
    is_new: initialData?.isNew ?? false,
    customizable: initialData?.customizable ?? false,
    images: initialData?.images || [],
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState("");
  const [imgInput, setImgInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const { uploadProductImage } = await import("@/app/actions/storage.actions");
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const { url, error } = await uploadProductImage(formDataUpload);
      
      if (error) throw new Error(error);
      
      if (url) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
        toast.success("Image uploaded successfully!", { id: toastId });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Upload failed. Ensure 'product-images' bucket is created.", { id: toastId });
    } finally {
      setIsUploading(false);
      // Clear input
      if (e.target) e.target.value = "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleToggle = (name: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: !prev[name] }));
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const addImage = () => {
    if (imgInput && !formData.images.includes(imgInput)) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, imgInput] }));
      setImgInput("");
    }
  };

  const removeImage = (img: string) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((i) => i !== img) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Sanitize slug (strips accidental descriptions/special characters)
    const cleanSlug = (formData.slug || formData.name)
      .toLowerCase()
      .trim()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
      .split("-")
      .slice(0, 8) // Safety: Keep slugs reasonably short
      .join("-");
    
    formData.slug = cleanSlug;

    try {
      const { createProductAction, updateProductAction } = await import("@/app/actions/product.actions");
      
      if (initialData) {
        const { error } = await updateProductAction(initialData.id, formData, formData.slug);
        if (error) throw error;
        toast.success("Product updated successfully!");
      } else {
        const { error } = await createProductAction(formData);
        if (error) throw error;
        toast.success("Product created successfully!");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
        >
          <ChevronLeft size={16} /> Back to Products
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 px-8"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {initialData ? "Save Changes" : "Create Product"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">Basic Information</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B6B6B] uppercase">Product Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sunshine Delight Hamper"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFB449] outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B6B6B] uppercase">URL Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="sunshine-delight-hamper"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFB449] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B6B6B] uppercase">Category</label>
                <select
                  name="category_slug"
                  required
                  value={formData.category_slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFB449] outline-none transition-all bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B6B6B] uppercase">Short Description</label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="Brief summary for cards..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFB449] outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B6B6B] uppercase">Full Description</label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFB449] outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#1A1A1A]">Product Images</h2>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="img-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="img-upload"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isUploading 
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed" 
                    : "bg-[#FFF9EE] text-[#FF8A00] hover:bg-[#FFB449] hover:text-white border border-[#FFE4C2]"
                  }`}
                >
                  {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {isUploading ? "Uploading..." : "Upload Image"}
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={imgInput}
                onChange={(e) => setImgInput(e.target.value)}
                placeholder="Or paste image URL..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#FFB449] transition-all text-sm"
              />
              <button 
                type="button" 
                onClick={addImage}
                className="bg-white text-[#1A1A1A] px-4 py-2 rounded-xl font-bold border border-gray-200 hover:border-[#FFB449] transition-all text-sm"
              >
                Add URL
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {formData.images.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                  <img src={img} alt={`Product ${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                  
                  {i === 0 && (
                    <div className="absolute top-2 left-2 bg-[#FF8A00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                      Main Image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      type="button"
                      onClick={() => removeImage(img)}
                      className="bg-red-500 text-white p-2.5 rounded-xl hover:scale-110 transition-all shadow-lg"
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-[#FFE4C2] rounded-3xl bg-[#FFF9EE]/30">
                  <div className="w-16 h-16 bg-[#FFE4C2] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FFB449]">
                    <ImageIcon size={32} />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] mb-1">No images yet</h3>
                  <p className="text-xs text-[#6B6B6B] max-w-[200px] mx-auto">Upload or add image URLs to create a gallery for this product.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">Pricing & Inventory</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B6B6B] uppercase">Sale Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFB449] outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B6B6B] uppercase">Original Price (₹)</label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFB449] outline-none transition-all text-[#6B6B6B]"
              />
            </div>

            <div className="pt-4 border-t border-gray-50 space-y-3">
               <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-[#1A1A1A]">In Stock</span>
                  <input 
                    type="checkbox" 
                    checked={formData.in_stock} 
                    onChange={() => handleToggle("in_stock")}
                    className="w-5 h-5 rounded border-gray-300 text-[#FF8A00] focus:ring-[#FFB449]"
                  />
               </label>
               <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-[#1A1A1A]">Customizable</span>
                  <input 
                    type="checkbox" 
                    checked={formData.customizable} 
                    onChange={() => handleToggle("customizable")}
                    className="w-5 h-5 rounded border-gray-300 text-[#FF8A00] focus:ring-[#FFB449]"
                  />
               </label>
            </div>
          </div>

          {/* Status Tags */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">Badges & Status</h2>
            <div className="space-y-3">
               <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-[#1A1A1A]">Featured Product</span>
                  <input type="checkbox" checked={formData.is_featured} onChange={() => handleToggle("is_featured")} className="w-5 h-5" />
               </label>
               <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-[#1A1A1A]">Bestseller</span>
                  <input type="checkbox" checked={formData.is_bestseller} onChange={() => handleToggle("is_bestseller")} className="w-5 h-5" />
               </label>
               <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-[#1A1A1A]">New Arrival</span>
                  <input type="checkbox" checked={formData.is_new} onChange={() => handleToggle("is_new")} className="w-5 h-5" />
               </label>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">Tags</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. luxury"
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 outline-none"
              />
              <button type="button" onClick={addTag} className="bg-gray-100 p-2 rounded-xl"><Plus size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-[#6B6B6B] text-[10px] font-bold rounded-lg uppercase">
                  {t} <button type="button" onClick={() => removeTag(t)}><X size={10}/></button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
