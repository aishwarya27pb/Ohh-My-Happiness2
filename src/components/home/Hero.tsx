"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFF9EE] min-h-[85vh] flex items-center">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFE4C2] rounded-full opacity-40 -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB449] rounded-full opacity-20 translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#FFE4C2] text-[#FF8A00] text-xs font-bold px-4 py-2 rounded-full mb-6">
              <Sparkles size={13} />
              India's Most Trusted Gifting Brand
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A1A] leading-tight mb-4">
              Spreading Joy, <br />
              <span className="text-gradient">One Gift</span> at a Time
            </h1>

            <p className="text-base sm:text-lg text-[#6B6B6B] mb-3 leading-relaxed max-w-xl">
              Premium corporate & personal gifting solutions crafted with love. From customized hampers to luxury collections — we make every moment unforgettable.
            </p>

            <p className="text-sm font-bold text-[#FF8A00] italic mb-8">
              "Your requirement is our responsibility."
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/corporate-gifting"
                className="btn-primary flex items-center justify-center gap-2 text-base"
              >
                Corporate Gifting
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/store"
                className="btn-outline flex items-center justify-center gap-2 text-base"
              >
                Shop Now
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: "10,000+", label: "Happy Clients" },
                { value: "500+", label: "Corporate Partners" },
                { value: "50+", label: "Gift Collections" },
                { value: "4.9★", label: "Average Rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-black text-xl text-[#FF8A00]">{value}</p>
                  <p className="text-xs text-[#6B6B6B]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Main gift box visual */}
            <div className="relative w-[420px] h-[420px]">
              {/* Center gift */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-60 h-60 gradient-sunshine rounded-3xl shadow-2xl flex items-center justify-center text-8xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  🎁
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-8 -left-4 bg-white rounded-2xl p-4 shadow-lg border border-[#FFE4C2] w-40">
                <p className="text-2xl mb-1">🏆</p>
                <p className="font-bold text-xs text-[#1A1A1A]">Corporate Gifting</p>
                <p className="text-xs text-[#6B6B6B]">500+ brands trust us</p>
              </div>

              <div className="absolute bottom-12 -right-4 bg-white rounded-2xl p-4 shadow-lg border border-[#FFE4C2] w-40">
                <p className="text-2xl mb-1">✨</p>
                <p className="font-bold text-xs text-[#1A1A1A]">Customized</p>
                <p className="text-xs text-[#6B6B6B]">Every gift personalized</p>
              </div>

              <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-[#FFB449] rounded-2xl p-4 shadow-lg w-36">
                <p className="font-black text-lg text-white">Free</p>
                <p className="text-xs text-white/80">Delivery above ₹999</p>
              </div>

              {/* Floating emoji decorations */}
              <div className="absolute top-2 right-12 text-3xl animate-bounce">🌟</div>
              <div className="absolute bottom-8 left-8 text-2xl animate-pulse">💛</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-white">
          <path d="M0,60 C240,20 480,0 720,20 C960,40 1200,60 1440,40 L1440,60 Z" />
        </svg>
      </div>
    </section>
  );
}
