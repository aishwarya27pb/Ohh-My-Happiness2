"use client";

import Link from "next/link";
import { categories } from "@/data/products";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRight } from "lucide-react";
import { Reveal, StaggerReveal, staggerItem } from "@/components/ui/Reveal";
import { motion } from "framer-motion";

export default function CategoryGrid() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up">
          <SectionHeader
            eyebrow="Gift Categories"
            title="Find the Perfect Gift for "
            highlight="Every Occasion"
            subtitle="Explore our carefully curated categories designed to match every need, budget, and emotion."
          />
        </Reveal>

        <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={0.07} delay={0.1}>
          {categories.map((cat, i) => (
            <motion.div key={cat.id} variants={staggerItem}>
              <Link
                href={`/store?category=${cat.slug}`}
                className="group flex flex-col items-center text-center p-5 rounded-3xl bg-[#FFF9EE] border-2 border-transparent hover:border-[#FFB449] hover:bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(255,180,73,0.2)] cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <p className="font-bold text-xs text-[#1A1A1A] leading-tight mb-1 group-hover:text-[#FF8A00]">
                  {cat.name}
                </p>
                <p className="text-xs text-[#6B6B6B]">{cat.productCount} gifts</p>
              </Link>
            </motion.div>
          ))}
        </StaggerReveal>

        <Reveal direction="up" delay={0.3}>
          <div className="text-center mt-8">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-[#FF8A00] font-bold text-sm hover:gap-3 transition-all"
            >
              Browse All Categories <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
