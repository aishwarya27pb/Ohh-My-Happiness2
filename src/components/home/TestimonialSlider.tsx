"use client";

import { useState } from "react";
import { testimonials } from "@/data/products";
import SectionHeader from "@/components/ui/SectionHeader";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Testimonials"
          title="What Our Customers "
          highlight="Say"
          subtitle="Thousands of happy customers trust us with their most special gifting moments."
        />

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="relative bg-[#FFF9EE] rounded-3xl p-8 md:p-12 border border-[#FFE4C2] shadow-sm">
            <Quote size={40} className="text-[#FFB449] opacity-40 absolute top-6 left-8" />

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="shrink-0 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB449] to-[#FF8A00] flex items-center justify-center text-2xl font-black text-white mb-2">
                  {t.name.charAt(0)}
                </div>
                <p className="font-bold text-sm text-[#1A1A1A]">{t.name}</p>
                <p className="text-xs text-[#FF8A00] font-medium">{t.role}</p>
                <p className="text-xs text-[#6B6B6B]">{t.company}</p>
              </div>

              {/* Content */}
              <div>
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} className="fill-[#FFB449] text-[#FFB449]" />
                  ))}
                </div>
                <p className="text-[#1A1A1A] text-base md:text-lg leading-relaxed font-medium">
                  "{t.content}"
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border-2 border-[#FFE4C2] flex items-center justify-center hover:border-[#FFB449] hover:bg-[#FFE4C2] transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-8 bg-[#FFB449]" : "w-2 bg-[#FFE4C2]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full border-2 border-[#FFE4C2] flex items-center justify-center hover:border-[#FFB449] hover:bg-[#FFE4C2] transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Logo trust strip */}
        <div className="mt-14 text-center">
          <p className="text-xs text-[#6B6B6B] uppercase tracking-widest mb-6">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {["TechCorp", "StartupHub", "MegaRetail", "InfoSys Co", "DigiMart", "Reliance+"].map((brand) => (
              <div key={brand} className="px-5 py-2.5 bg-[#FFF9EE] border border-[#FFE4C2] rounded-full text-xs font-bold text-[#6B6B6B]">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
