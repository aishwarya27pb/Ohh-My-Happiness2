"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollAnimationManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathname = useRef(pathname);

  // Disable native scroll restoration on load
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Save scroll position on scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem(`scroll-pos:${window.location.pathname}`, window.scrollY.toString());
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle smooth scroll transitions on navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip smooth scroll if there is a hash fragment in the URL (allow anchor scroll)
    if (window.location.hash) return;

    const key = `scroll-pos:${pathname}`;
    const savedPos = sessionStorage.getItem(key);
    const isHomepage = pathname === "/";

    lastPathname.current = pathname;

    const originalScrollTo = window.scrollTo;

    // Monkey-patch window.scrollTo during page transition to ensure smooth scrolling
    window.scrollTo = function (first?: ScrollToOptions | number, second?: number) {
      // If we are on the homepage, let the landing page scroll-pinning work without smooth behavior
      if (window.location.pathname === "/" && (
        (typeof first === "number" && first === 0 && second === 0) ||
        (typeof first === "object" && first.top === 0)
      )) {
        return originalScrollTo.apply(window, arguments as any);
      }

      if (typeof first === "object") {
        return (originalScrollTo as any).call(window, {
          ...first,
          behavior: "smooth"
        });
      } else if (typeof first === "number" && typeof second === "number") {
        return (originalScrollTo as any).call(window, {
          left: first,
          top: second,
          behavior: "smooth"
        });
      }
      return originalScrollTo.apply(window, arguments as any);
    };

    // Trigger smooth scroll after a short delay so the DOM has swapped
    const timer = setTimeout(() => {
      if (savedPos) {
        const targetY = parseInt(savedPos, 10);
        if (!isHomepage || targetY > 0) {
          window.scrollTo({
            top: targetY,
            behavior: "smooth"
          });
        }
      } else {
        if (!isHomepage) {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }
      }
    }, 120);

    return () => {
      clearTimeout(timer);
      window.scrollTo = originalScrollTo;
    };
  }, [pathname, searchParams]);

  return null;
}
