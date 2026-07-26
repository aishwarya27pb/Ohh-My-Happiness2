"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit";
  range?: number;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
  range = 50,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to animate the physical pulling effect
  const springX = useSpring(x, { stiffness: 120, damping: 12, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 12, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    const distance = Math.hypot(distanceX, distanceY);

    if (distance < range) {
      // Pull toward cursor
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`relative active:scale-95 transition-shadow duration-200 focus:outline-none ${className}`}
      whileTap={{ scale: 0.96 }} // Responsive active scale
    >
      {children}
    </motion.button>
  );
}
