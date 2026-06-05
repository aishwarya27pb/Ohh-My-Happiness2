import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import BestsellerSection from "@/components/home/BestsellerSection";
import CorporateBanner from "@/components/home/CorporateBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import HowItWorks from "@/components/home/HowItWorks";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { productsService } from "@/lib/services/products.service";

export const metadata: Metadata = {
  title: "Ohh My Happiness — Premium Corporate & Personal Gifting",
  description: "India's most trusted gifting brand.",
};

export default async function HomePage() {
  const products = await productsService.getProducts();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <BestsellerSection products={products} />
        <CorporateBanner />
        <FeaturedProducts products={products} />
        <HowItWorks />
        <TestimonialSlider />
      </main>
      <Footer />
    </>
  );
}
