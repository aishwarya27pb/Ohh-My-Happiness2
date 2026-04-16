"use client";

import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, StaggerReveal, staggerItem } from "@/components/ui/Reveal";
import { motion } from "framer-motion";

export default function BestsellerSection() {
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <section className="section-padding bg-[#FFF9EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <Reveal direction="up">
            <SectionHeader
              eyebrow="Most Loved"
              title="Our "
              highlight="Bestsellers"
              subtitle="Gifts that keep getting reordered — loved by thousands of happy customers."
              centered={false}
              className="mb-0"
            />
          </Reveal>
          <Reveal direction="right" delay={0.15}>
            <Link
              href="/store?filter=bestseller"
              className="hidden sm:inline-flex items-center gap-2 text-[#FF8A00] font-bold text-sm hover:gap-3 transition-all shrink-0"
            >
              See All <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" staggerDelay={0.1} delay={0.1}>
          {bestsellers.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </StaggerReveal>

        <Reveal direction="up" delay={0.3}>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/store?filter=bestseller" className="btn-outline text-sm inline-block">
              View All Bestsellers
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
