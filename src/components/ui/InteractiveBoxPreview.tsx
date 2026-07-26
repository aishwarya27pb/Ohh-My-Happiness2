"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Check } from "lucide-react";

interface BoxColorOption {
  id: string;
  name: string;
  gradient: string;
  bgHex: string;
}

export const BOX_COLORS: BoxColorOption[] = [
  { id: "navy", name: "Royal Navy Blue", gradient: "linear-gradient(135deg, #0A192F 0%, #172A45 100%)", bgHex: "#0A192F" },
  { id: "green", name: "Emerald Forest Green", gradient: "linear-gradient(135deg, #064E3B 0%, #022C22 100%)", bgHex: "#064E3B" },
  { id: "crimson", name: "Burgundy Crimson", gradient: "linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)", bgHex: "#7F1D1D" },
  { id: "charcoal", name: "Midnight Charcoal", gradient: "linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)", bgHex: "#1C1917" },
  { id: "orange", name: "Signature Amber", gradient: "linear-gradient(135deg, #FF8A00 0%, #D43F00 100%)", bgHex: "#FF8A00" },
];

interface InteractiveBoxPreviewProps {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  hasLogo: boolean;
  logoUrl: string | null;
  brandingStyle: string; // "gold_foil" | "silver_foil" | "matte_print" | "laser_engrave"
  onBrandingStyleSelect: (style: string) => void;
}

export default function InteractiveBoxPreview({
  selectedColorId,
  onColorSelect,
  hasLogo,
  logoUrl,
  brandingStyle,
  onBrandingStyleSelect,
}: InteractiveBoxPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D rotation coordinates
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth springs with Emil Kowalski damping configurations
  const springRotX = useSpring(rotateX, { stiffness: 100, damping: 15, mass: 0.8 });
  const springRotY = useSpring(rotateY, { stiffness: 100, damping: 15, mass: 0.8 });

  const activeColor = BOX_COLORS.find(c => c.id === selectedColorId) || BOX_COLORS[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates between -0.5 and 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    // Set rotation angles (max 15 degrees)
    rotateX.set(relativeY * -15);
    rotateY.set(relativeX * 15);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // Generate dynamic overlay shader styles based on branding selections
  const getLogoStyle = () => {
    switch (brandingStyle) {
      case "gold_foil":
        return {
          background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
          animation: "shimmer 4s linear infinite",
        };
      case "silver_foil":
        return {
          background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 25%, #94A3B8 50%, #FFFFFF 75%, #475569 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
          animation: "shimmer 4s linear infinite",
        };
      case "laser_engrave":
        return {
          color: "rgba(0,0,0,0.6)",
          textShadow: "1px 1px 1px rgba(255,255,255,0.15), -1px -1px 1px rgba(0,0,0,0.5)",
          filter: "opacity(0.85) contrast(1.2)",
        };
      default:
        // Matte white print
        return {
          color: "#FFFFFF",
          filter: "drop-shadow(0px 1.5px 3px rgba(0,0,0,0.4))",
        };
    }
  };

  return (
    <div className="bg-white border border-[#FFE4C2] rounded-[32px] p-6 lg:p-8 sticky top-24 shadow-sm">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-[#1A1A1A] text-lg lg:text-xl flex items-center gap-2">
          <Sparkles className="text-[#FFB449]" size={20} />
          Live Box Preview
        </h3>
        <span className="text-xs text-[#6B6B6B] font-semibold bg-[#FFF9EE] px-3 py-1 rounded-full border border-[#FFE4C2]">
          Rotate on Hover
        </span>
      </div>

      {/* 3D Tumble Interactive Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-80 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#FFF9EE] to-[#FFE4C2]/30 border border-[#FFE4C2]/50 cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{
            rotateX: springRotX,
            rotateY: springRotY,
            transformStyle: "preserve-3d",
          }}
          className="w-64 h-64 relative flex items-center justify-center transition-all duration-500 ease-out"
        >
          {/* Shadow behind box */}
          <div className="absolute inset-0 bg-black/35 rounded-2xl filter blur-xl transform translate-y-6 scale-[0.85] opacity-60" />

          {/* Actual Box Face */}
          <div 
            className="w-full h-full rounded-2xl relative p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-700 ease-out border border-white/10"
            style={{ 
              background: activeColor.gradient,
            }}
          >
            {/* Satin Ribbon Accent */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-amber/85 shadow-lg border-y border-white/10 flex items-center justify-center opacity-90">
              <div className="w-1.5 h-full bg-white/20" />
            </div>
            
            {/* Corner Decorative elements */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20 rounded-tl" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/20 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20 rounded-br" />

            {/* Customizer Box Content */}
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-white/50 uppercase">Ohh My Happiness</span>
                <span className="text-[8px] font-semibold text-white/40 tracking-wider">Premium Hampers</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            </div>

            {/* Branding Logo Placement Area */}
            <div className="w-full flex flex-col items-center justify-center py-6 z-10 transform translate-y-1">
              <AnimatePresence mode="wait">
                {hasLogo ? (
                  <motion.div
                    key={logoUrl || "placeholder"}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 150, damping: 12 }}
                    className="flex flex-col items-center"
                  >
                    {logoUrl ? (
                      <div className="relative group">
                        {/* Shimmer/Foil Overlay Applied */}
                        <div 
                          className="w-16 h-16 bg-contain bg-center bg-no-repeat transition-all duration-300"
                          style={{
                            backgroundImage: `url(${logoUrl})`,
                            ...(brandingStyle === "gold_foil" || brandingStyle === "silver_foil" ? {
                              filter: `brightness(1.5) contrast(1.1) drop-shadow(0px 1px 1px rgba(0,0,0,0.3))`,
                            } : brandingStyle === "laser_engrave" ? {
                              filter: `brightness(0.3) opacity(0.85) drop-shadow(1px 1px 0px rgba(255,255,255,0.15))`,
                            } : {
                              filter: "brightness(1) invert(0) drop-shadow(0px 1.5px 3px rgba(0,0,0,0.4))",
                            })
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 w-24">
                        <ImageIcon className="text-white/45 mb-1" size={20} />
                        <span className="text-[9px] font-bold text-white/60 text-center">Logo Area</span>
                      </div>
                    )}
                    
                    {/* Brand Name Text underneath */}
                    <span 
                      style={getLogoStyle()}
                      className="text-xs font-black uppercase tracking-widest mt-2 transition-all duration-300"
                    >
                      YOUR BRAND
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center border-2 border-dashed border-white/20 rounded-2xl p-4 w-32"
                  >
                    <span className="text-[10px] font-bold text-white text-center">Premium Box Layout</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom info */}
            <div className="flex justify-between items-end z-10 text-[9px] font-bold text-white/60">
              <span>EST. 2024</span>
              <span>BOXED WITH JOY</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Real-time configuration swatches */}
      <div className="mt-6 space-y-5">
        {/* Color swatches */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-[#6B6B6B] block mb-2.5">
            1. Select Box Color
          </label>
          <div className="flex gap-3">
            {BOX_COLORS.map(color => (
              <button
                key={color.id}
                type="button"
                onClick={() => onColorSelect(color.id)}
                className={`w-9 h-9 rounded-full relative transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group focus:outline-none`}
                style={{ 
                  background: color.gradient,
                  boxShadow: selectedColorId === color.id ? `0 0 0 3px #FFE4C2, 0 4px 10px rgba(0,0,0,0.15)` : "none"
                }}
                title={color.name}
              >
                {selectedColorId === color.id && (
                  <motion.div layoutId="colorCheck">
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Branding option selectors */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-[#6B6B6B] block mb-2.5">
            2. Select Branding Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "gold_foil", label: "✨ Gold Foil Stamping" },
              { id: "silver_foil", label: "💎 Silver Foil Stamping" },
              { id: "laser_engrave", label: "🪵 Laser Engraving" },
              { id: "matte_print", label: "🎨 Matte Color Print" },
            ].map(style => {
              const active = brandingStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onBrandingStyleSelect(style.id)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition-all duration-200 active:scale-95 ${
                    active 
                      ? "bg-amber text-white border-amber shadow-md shadow-amber/25" 
                      : "bg-[#FFF9EE] text-[#6B6B6B] border-[#FFE4C2] hover:bg-white"
                  }`}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
