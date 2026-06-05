"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Reveal, StaggerReveal, staggerItem } from "@/components/ui/Reveal";
import { motion } from "framer-motion";

export default function CorporateBanner() {
  const features = [
    "Minimum 10 units",
    "Custom branding & packaging",
    "Bulk discounts up to 35%",
    "Dedicated account manager",
    "Pan-India delivery",
    "GST invoice",
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB449] opacity-[0.15] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#FF8A00] opacity-[0.15] rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
          <div>
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB449] mb-6 bg-[#FFB449]/10 border border-[#FFB449]/20 px-5 py-2 rounded-full">
              Corporate Gifting Solutions
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6">
              Gifting at Scale —{" "}
              <span className="text-[#FFB449]">Done Right</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed text-lg max-w-xl">
              From 10 to 10,000 gifts — we handle bulk corporate orders with precision, quality, and customization that reflects your brand values. Your requirement is our responsibility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FFB449]/20 flex items-center justify-center shrink-0">
                    <CheckCircle size={12} className="text-[#FFB449]" />
                  </div>
                  <span className="text-[13px] font-bold text-white/80 tracking-wide">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/corporate-gifting"
                className="bg-[#FFB449] hover:bg-[#FFC674] text-[#1A1A1A] font-black py-4 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] shadow-xl shadow-[#FFB449]/10"
              >
                Explore Corporate Gifting <ArrowRight size={16} />
              </Link>
              <Link
                href="/custom-orders"
                className="bg-transparent border-2 border-[#FFB449]/30 hover:border-[#FFB449] text-white font-black py-4 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center uppercase tracking-widest text-[11px]"
              >
                Request Bulk Quote
              </Link>
            </div>
          </div>
          </Reveal>

          {/* Stats grid */}
          <StaggerReveal className="grid grid-cols-2 gap-5" staggerDelay={0.1} delay={0.1}>
            {[
              { icon: "🏆", value: "500+", label: "Corporate Partners" },
              { icon: "📦", value: "1L+", label: "Gifts Delivered" },
              { icon: "⭐", value: "4.9/5", label: "Client Satisfaction" },
              { icon: "🚀", value: "48hrs", label: "Bulk Dispatch" },
            ].map(({ icon, value, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 text-center hover:bg-white/[0.08] transition-all duration-500 backdrop-blur-xl group hover:-translate-y-2 cursor-default"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{icon}</div>
                <p className="text-3xl font-black text-[#FFB449] tracking-tight">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-2">{label}</p>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
