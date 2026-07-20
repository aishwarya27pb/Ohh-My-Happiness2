"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";

const variants = {
  hidden: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" as const } },
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsTransitioning(true);
    const handleEnd = () => setIsTransitioning(false);

    window.addEventListener("page-transition-start", handleStart);
    window.addEventListener("page-transition-end", handleEnd);

    // Hide transition loader when the page path changes
    setIsTransitioning(false);

    return () => {
      window.removeEventListener("page-transition-start", handleStart);
      window.removeEventListener("page-transition-end", handleEnd);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {/* 4 pulsing brand-colored dots loading transition indicator */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FFF9EE]/85 backdrop-blur-sm pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FFB449] animate-bounce-custom" style={{ animationDelay: "0s" }} />
              <span className="w-3.5 h-3.5 rounded-full bg-[#FF8A00] animate-bounce-custom" style={{ animationDelay: "0.15s" }} />
              <span className="w-3.5 h-3.5 rounded-full bg-[#F7C96A] animate-bounce-custom" style={{ animationDelay: "0.3s" }} />
              <span className="w-3.5 h-3.5 rounded-full bg-[#1A1A1A] animate-bounce-custom" style={{ animationDelay: "0.45s" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
          className="min-h-screen flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
