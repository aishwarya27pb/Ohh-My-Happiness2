"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const variants = {
  hidden:  { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeIn" as const } },
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
