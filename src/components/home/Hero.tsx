"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FFF9EE] pt-8 lg:pt-12 pb-28 lg:pb-36">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFE4C2] rounded-full opacity-40 -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB449] rounded-full opacity-20 translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10 pt-4 lg:pt-8">
            <div className="inline-flex items-center gap-2 bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-bold px-4 py-2 rounded-full mb-8">
              <Sparkles size={13} />
              India's Most Trusted Gifting Brand
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A1A] leading-[1.1] mb-6">
              Spreading Joy,<br />
              <span className="text-[#FF8A00]">One Gift</span> at a Time
            </h1>

            <p className="text-lg text-[#6B6B6B] mb-4 leading-relaxed max-w-lg">
              Premium corporate & personal gifting solutions crafted with love. From customized hampers to luxury collections — we make every moment unforgettable.
            </p>

            <p className="text-base text-[#FF8A00] italic mb-10">
              "Your requirement is our responsibility."
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/corporate-gifting"
                className="flex items-center justify-center gap-2 bg-[#FFB449] text-[#1A1A1A] font-bold py-4 px-8 rounded-full shadow-lg shadow-orange-200/50 hover:bg-[#FF8A00] hover:text-white transition-all group"
              >
                Corporate Gifting
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/store"
                className="flex items-center justify-center gap-2 border-2 border-[#FFB449] text-[#FFB449] font-bold py-4 px-10 rounded-full hover:bg-[#FFB449]/5 transition-all"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:flex items-center justify-center pt-8 lg:pt-12">
            {/* Main visual container */}
            <div className="relative w-[480px] h-[480px] flex items-center justify-center">
              
              {/* Back Flat Card */}
              <div className="absolute w-[340px] h-[340px] bg-gradient-to-br from-[#F7C96A] to-[#FFB449] rounded-[48px] shadow-[0_20px_50px_rgba(255,180,73,0.3)] opacity-95 transition-transform duration-700 hover:scale-105" />
              
              {/* Center Gift 3D */}
              <div className="relative z-10 hover:scale-110 transition-transform duration-500 cursor-default">
                <img 
                  src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" 
                  alt="Gift" 
                  className="w-56 h-56 object-contain drop-shadow-2xl"
                />
              </div>

              {/* Floating Cards */}
              
              {/* Top Left - Corporate */}
              <div className="absolute top-8 -left-8 bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white w-[250px] z-20 animate-float-slow">
                <div className="flex flex-col gap-2">
                  <img 
                    src="https://em-content.zobj.net/source/apple/354/trophy_1f3c6.png" 
                    alt="Trophy" 
                    className="w-10 h-10 object-contain drop-shadow-sm mb-1"
                  />
                  <div>
                    <p className="font-bold text-[15px] text-[#1A1A1A] leading-tight">Corporate Gifting</p>
                    <p className="text-[13px] text-[#6B6B6B] mt-0.5">500+ brands trust us</p>
                  </div>
                </div>
              </div>

              {/* Mid Right - Free Delivery */}
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-gradient-to-r from-[#FFB449] to-[#FF8A00] rounded-3xl py-5 px-7 shadow-[0_20px_40px_rgba(255,138,0,0.25)] z-20 w-[220px] animate-float-medium">
                <p className="font-black text-2xl text-white mb-1 tracking-tight">Free</p>
                <p className="text-[13px] text-white/95 font-medium">Delivery above ₹999</p>
              </div>

              {/* Bottom Right - Customized */}
              <div className="absolute bottom-8 right-0 bg-white rounded-3xl p-6 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] w-[240px] z-20 animate-float-slow" style={{ animationDelay: '1s' }}>
                <div className="flex flex-col gap-2">
                  <img 
                    src="https://em-content.zobj.net/source/apple/354/sparkles_2728.png" 
                    alt="Sparkles" 
                    className="w-9 h-9 object-contain drop-shadow-sm mb-1"
                  />
                  <div>
                    <p className="font-bold text-[15px] text-[#1A1A1A] leading-tight">Customized</p>
                    <p className="text-[13px] text-[#6B6B6B] mt-0.5">Every gift personalized</p>
                  </div>
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute -top-6 right-16 z-10 animate-pulse transition-transform hover:scale-110">
                <img src="https://em-content.zobj.net/source/apple/354/star_2b50.png" alt="Star" className="w-14 h-14 object-contain drop-shadow-lg" />
              </div>
              <div className="absolute -bottom-2 left-6 z-10 animate-bounce-subtle transition-transform hover:scale-110">
                <img src="https://em-content.zobj.net/source/apple/354/yellow-heart_1f49b.png" alt="Heart" className="w-10 h-10 object-contain drop-shadow-md opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce-subtle flex flex-col items-center gap-1 cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF8A00]">Scroll</span>
        <ChevronDown size={20} className="text-[#FF8A00]" />
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
