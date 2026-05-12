"use client";

import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, StaggerReveal, staggerItem } from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import type { Product } from "@/types";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="section-padding bg-[#FFF9EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <Reveal direction="up">
            <SectionHeader
              eyebrow="Featured"
              title="New "
              highlight="Arrivals"
              subtitle="Fresh collections handpicked for you this season."
              centered={false}
              className="mb-0"
            />
          </Reveal>
          <Reveal direction="right" delay={0.15}>
            <Link
              href="/store?filter=featured"
              className="hidden sm:inline-flex items-center gap-2 text-[#FF8A00] font-bold text-sm hover:gap-3 transition-all shrink-0"
            >
              See All <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
