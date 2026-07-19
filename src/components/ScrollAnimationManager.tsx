"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollAnimationManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstMount = useRef(true);

  // Apply scroll Restorer behavior & permanent monkey-patch on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set scroll restoration to manual so the browser doesn't do instant jumps
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const originalScrollTo = window.scrollTo;

    // Monkey-patch window.scrollTo globally to enforce smooth scrolling transitions
    window.scrollTo = function (first?: ScrollToOptions | number, second?: number) {
      // If we are on the homepage and the hero scroll-pinning is active, do not force smooth behavior
      if (window.location.pathname === "/" && (
        (typeof first === "number" && first === 0 && second === 0) ||
        (typeof first === "object" && first.top === 0)
      )) {
        return originalScrollTo.apply(window, arguments as any);
      }

      if (typeof first === "object") {
        if (first.behavior !== "smooth") {
          return (originalScrollTo as any).call(window, {
            ...first,
            behavior: "smooth"
          });
        }
        return (originalScrollTo as any).call(window, first);
      } else if (typeof first === "number" && typeof second === "number") {
        return (originalScrollTo as any).call(window, {
          left: first,
          top: second,
          behavior: "smooth"
        });
      }
      return originalScrollTo.apply(window, arguments as any);
    };

    // Save scroll position on scroll events
    const handleScroll = () => {
      // Track page positions including 0
      sessionStorage.setItem(`scroll-pos:${window.location.pathname}`, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.scrollTo = originalScrollTo;
    };
  }, []); // Run once on mount so it stays active during transition swaps!

  // Perform smooth scroll transition on pathname / search parameter changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    const isFirst = isFirstMount.current;
    isFirstMount.current = false;

    const isHomepage = pathname === "/";

    // Prevent overriding scroll position on very first loading of the landing page
    if (isFirst && isHomepage) {
      return;
    }

    const key = `scroll-pos:${pathname}`;
    const savedPos = sessionStorage.getItem(key);

    // Briefly delay so Next.js finishes swapping page DOM content, then scroll smoothly
    const timer = setTimeout(() => {
      if (savedPos) {
        const targetY = parseInt(savedPos, 10);
        window.scrollTo({
          top: targetY,
          behavior: "smooth"
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
