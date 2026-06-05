import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productsService, getProductSlugsForStaticParams } from "@/lib/services/products.service";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { env } from "@/env";

export async function generateStaticParams() {
  return getProductSlugsForStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await productsService.getProductBySlug(id);
  if (!product) return { title: "Product Not Found | Ohh My Happiness" };

  const baseUrl = env.NEXT_PUBLIC_SITE_URL;
  const productUrl = `${baseUrl}/store/${product.slug}`;
  const productImage = product.images[0] || `${baseUrl}/logo.jpg`;
// ... (skip lines to keep it clean)


  return {
    title: `${product.name} | Ohh My Happiness`,
    description: product.shortDescription,
    keywords: product.tags.join(", "),
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: productUrl,
      siteName: "Ohh My Happiness",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [productImage],
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "INR",
      "product:availability": product.inStock ? "instock" : "oos",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productsService.getProductBySlug(id);
  if (!product) notFound();

  const allProducts = await productsService.getProducts();
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Ohh My Happiness"
    },
    "offers": {
      "@type": "Offer",
      "url": `${env.NEXT_PUBLIC_SITE_URL}/store/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="section-padding bg-[#FFF9EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="You May Also Like"
              title="Related "
              highlight="Gifts"
              centered
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
