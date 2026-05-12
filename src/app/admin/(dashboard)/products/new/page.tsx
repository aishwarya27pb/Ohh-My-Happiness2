import ProductForm from "@/components/admin/ProductForm";
import { productsService } from "@/lib/services/products.service";

export default async function NewProductPage() {
  const categories = await productsService.getCategories();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Add New Product</h1>
        <p className="text-sm text-[#6B6B6B]">Create a new gift hamper or product for your store.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
