"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue
} from "framer-motion";
import { Sparkles } from "lucide-react";

// Inline helper to wrap value between a range for seamless looping
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface ScrollVelocityTickerProps {
  baseSpeed?: number;
}

export default function ScrollVelocityTicker({ baseSpeed = 2 }: ScrollVelocityTickerProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Create a smoothed spring representation of the scroll velocity
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Map the velocity to an animation speed factor
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 6], {
    clamp: false
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((time, delta) => {
    // delta is in ms, we scale it
    const elapsedSeconds = delta / 1000;
    
    // Base continuous movement
    let moveBy = directionFactor.current * baseSpeed * elapsedSeconds;

    // Detect scroll direction from velocity and update direction factor
    const currentVelocity = velocityFactor.get();
    if (currentVelocity < 0) {
      directionFactor.current = -1; // scrolling up -> move marquee to the right
    } else if (currentVelocity > 0) {
      directionFactor.current = 1;  // scrolling down -> move marquee to the left
    }

    // Combine base speed with scroll velocity scroll push
    moveBy += directionFactor.current * currentVelocity * elapsedSeconds * 12;

    // Update motion value
    baseX.set(baseX.get() + moveBy);
  });

  // Map baseX to percentage translation. We wrap between -25% and 0% for seamless looping of 4 duplicated sets.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const partners = [
    { name: "Google", desc: "Corporate Partner" },
    { name: "Amazon", desc: "Bulk Client" },
    { name: "Deloitte", desc: "Event Partner" },
    { name: "Tata Group", desc: "Loyalty Program" },
    { name: "Netflix", desc: "Brand Gifting" },
    { name: "Microsoft", desc: "Executive Kits" },
    { name: "ITC Limited", desc: "Hampers Custom" },
    { name: "KPMG", desc: "New Joiner Gifts" },
    { name: "Ernst & Young", desc: "Corporate Hampers" },
    { name: "Reliance", desc: "Festival Gifting" }
  ];

  // Repeat the list 4 times to ensure seamless infinite overflow width coverage
  const duplicatedSets = [...partners, ...partners, ...partners, ...partners];

  return (
    <div className="w-full overflow-hidden bg-[#FFF9EE] border-y border-[#FFB449]/20 py-8 relative select-none">
      {/* Visual background gradient fading edges for premium look */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#FFF9EE] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#FFF9EE] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8A00]/80">
          <Sparkles size={11} className="text-[#FF8A00]" />
          Trusted by Industry Leaders
        </span>
      </div>

      {/* Marquee Track Container */}
      <div className="flex flex-nowrap whitespace-nowrap overflow-hidden py-2">
        <motion.div className="flex gap-8 sm:gap-12 flex-nowrap" style={{ x }}>
          {duplicatedSets.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center gap-3 bg-white/60 border border-[#FFB449]/10 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md hover:border-[#FFB449]/30 hover:bg-white transition-all duration-300 group cursor-default shrink-0"
            >
              {/* Monogram brand icon */}
              <div className="w-8 h-8 rounded-xl bg-[#FFB449]/10 flex items-center justify-center font-black text-sm text-[#FF8A00] group-hover:bg-[#FF8A00] group-hover:text-white transition-colors duration-300">
                {partner.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-black text-sm text-[#1A1A1A] tracking-wide group-hover:text-[#FF8A00] transition-colors duration-300">
                  {partner.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-black/40">
                  {partner.desc}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
