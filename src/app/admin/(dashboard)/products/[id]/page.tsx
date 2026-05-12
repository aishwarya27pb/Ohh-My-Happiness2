import ProductForm from "@/components/admin/ProductForm";
import { productsService } from "@/lib/services/products.service";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [product, categories] = await Promise.all([
    productsService.getProductById(id),
    productsService.getCategories()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Edit Product</h1>
        <p className="text-sm text-[#6B6B6B]">Update information for "{product.name}".</p>
      </div>
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
