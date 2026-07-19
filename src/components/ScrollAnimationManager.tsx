"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function ScrollAnimationManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFirstMount = useRef(true);

  // Apply scroll Restorer behavior, link interceptor, & permanent monkey-patch on mount
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
      sessionStorage.setItem(`scroll-pos:${window.location.pathname}`, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intercept storefront link clicks to scroll smoothly to top first
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      // Handle standard clicks only
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = anchor.getAttribute("target");
      if (target && target !== "_self") {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Filter relative storefront paths
      const isRelative = href.startsWith("/") && !href.startsWith("//");
      if (!isRelative) return;

      // Skip current page hash changes
      if (href.includes("#") && href.split("#")[0] === window.location.pathname) {
        return;
      }

      // Skip same page links
      if (href === window.location.pathname) {
        return;
      }

      // If already at top of the page, navigate immediately
      if (window.scrollY <= 20) {
        return;
      }

      // Intercept and animate scroll-to-top first before routing
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      setTimeout(() => {
        router.push(href);
      }, 350);
    };

    window.addEventListener("click", handleLinkClick, { capture: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleLinkClick, { capture: true });
      window.scrollTo = originalScrollTo;
    };
  }, [router]);

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
