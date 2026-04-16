"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { Reveal, StaggerReveal, staggerItem } from "@/components/ui/Reveal";
import { motion } from "framer-motion";

const steps = [
  { step: "01", icon: "🔍", title: "Browse & Choose", desc: "Explore our curated gift collections across categories, occasions, and budgets." },
  { step: "02", icon: "✏️", title: "Personalize It", desc: "Add custom messages, logos, or select variants to make it uniquely yours." },
  { step: "03", icon: "📦", title: "We Pack with Love", desc: "Every gift is beautifully packed in our signature Sunshine Glow packaging." },
  { step: "04", icon: "🚀", title: "Swift Delivery", desc: "Pan-India delivery with tracking. Bulk orders dispatched within 48 hours." },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-gradient-to-b from-[#FFF9EE] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <SectionHeader
            eyebrow="How It Works"
            title="Gifting Made "
            highlight="Effortless"
            subtitle="Four simple steps from browsing to delivery — we handle the rest."
          />
        </Reveal>

        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.12} delay={0.15}>
          {steps.map((s, i) => (
            <motion.div key={s.step} variants={staggerItem} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#FFB449] to-[#FFE4C2] z-0 -translate-x-1/2" />
              )}

              <div className="relative z-10 text-center p-6">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-md flex items-center justify-center text-4xl mx-auto border-2 border-[#FFE4C2]">
                    {s.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-[#FFB449] text-[#1A1A1A] text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">{s.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
