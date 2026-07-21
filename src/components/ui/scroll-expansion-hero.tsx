"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Gift, ArrowRight } from "lucide-react";

interface ScrollExpandMediaProps {
  bgImageSrc: string;
  title?: string;
  subtitle?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ScrollExpandMedia = ({
  bgImageSrc,
  title = "Ohh My Happiness",
  subtitle = "Premium Corporate & Personal Gifting Solutions",
  scrollToExpand = "Scroll down to unwrap joy",
  children,
}: ScrollExpandMediaProps) => {
  const [targetProgress, setTargetProgress] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);

  // Restore unboxing state immediately before paint to prevent hydration mismatch and visual flash
  useIsomorphicLayoutEffect(() => {
    const saved = sessionStorage.getItem("scroll-pos:/");
    if (saved && parseInt(saved, 10) > 10) {
      setTargetProgress(1);
      setScrollProgress(1);
      setShowContent(true);
      setMediaFullyExpanded(true);
    }
  }, []);

  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Smooth lerp loop to interpolate scrollProgress towards targetProgress
  useEffect(() => {
    let active = true;
    const tick = () => {
      if (!active) return;
      setScrollProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.0005) {
          return targetProgress;
        }
        return prev + diff * 0.08; // smooth 8% step
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      active = false;
    };
  }, [targetProgress]);

  // Synchronize state unlocks with visual rendering progress
  useEffect(() => {
    if (scrollProgress >= 0.99) {
      if (!mediaFullyExpanded) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      }
    } else {
      if (scrollProgress < 0.75 && showContent) {
        setShowContent(false);
      }
    }
  }, [scrollProgress, mediaFullyExpanded, showContent]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If fully expanded and scrolling up, and we are at the top of the window
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        setTargetProgress(0.95);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        // Prevent default scrolling until the box is fully opened
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0005; // Extremely smooth wheel opening speed
        const newProgress = Math.min(
          Math.max(targetProgress + scrollDelta, 0),
          1
        );
        setTargetProgress(newProgress);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        setTargetProgress(0.95);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Lower scroll factors on mobile devices for deliberate step-by-step feel
        const scrollFactor = deltaY < 0 ? 0.0015 : 0.001;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(targetProgress + scrollDelta, 0),
          1
        );
        setTargetProgress(newProgress);
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener("scroll", handleScroll as EventListener);
    window.addEventListener(
      "touchstart",
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      "touchmove",
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener("touchend", handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel as unknown as EventListener
      );
      window.removeEventListener("scroll", handleScroll as EventListener);
      window.removeEventListener(
        "touchstart",
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, [targetProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Convert children to an array to extract the first element (Hero)
  const childrenArray = React.Children.toArray(children);
  const heroContent = childrenArray[0];
  const restOfContent = childrenArray.slice(1);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute card dimensions dynamically based on scroll progress and client mounting state
  const currentClosedSize = isMobileState ? 240 : 380;
  const mediaWidthStyle = mounted 
    ? `calc(${currentClosedSize}px + ${scrollProgress} * (100% - ${currentClosedSize}px))`
    : `${isMobileState ? 240 : 380}px`;
  const mediaHeightStyle = mounted 
    ? `calc(${currentClosedSize}px + ${scrollProgress} * (100% - ${currentClosedSize}px))`
    : `${isMobileState ? 240 : 380}px`;

  const borderRadius = mounted ? `${(1 - scrollProgress) * 32}px` : "32px";
  const borderWidth = mounted ? `${(1 - scrollProgress) * 4}px` : "4px";
  const shadowIntensity = mounted ? 1 - scrollProgress : 1;

  // Compute sub-animations values based on scrollProgress (0 to 1)
  const ribbonOpacity = Math.max(0, 1 - scrollProgress * 5); // Fades out first
  const ribbonX = scrollProgress * -100;
  
  const lidY = scrollProgress * -250;
  const lidRotate = scrollProgress * -15;
  const lidOpacity = Math.max(0, 1 - scrollProgress * 2.5); // Fades out mid-scroll

  const baseY = scrollProgress * 150;
  const baseOpacity = Math.max(0, 1 - scrollProgress * 2.5); // Fades out mid-scroll

  const glowOpacity = scrollProgress < 0.5 ? scrollProgress * 1.6 : Math.max(0, 1 - (scrollProgress - 0.5) * 2.5);
  const glowScale = 0.5 + scrollProgress * 1.5;

  // Delay content fade-in until the box starts splitting open, avoiding messy text overlays
  const contentOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.25) * 2.5));
  const contentScale = 0.9 + Math.min(0.1, scrollProgress * 0.1);

  // Text / Widget slide-out animations
  const textOpacity = Math.max(0, 1 - scrollProgress * 3);
  const textY = scrollProgress * -80;
  
  const widgetLeftX = scrollProgress * -180;
  const widgetRightX = scrollProgress * 180;
  const widgetOpacity = Math.max(0, 1 - scrollProgress * 3);

  return (
    <div
      ref={sectionRef}
      className="transition-colors duration-700 ease-in-out overflow-x-hidden bg-[#FFF9EE]"
    >
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          {/* Fading Background Image */}
          <motion.div
            className="absolute inset-0 z-0 h-full w-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.15 }}
          >
            <Image
              src={bgImageSrc}
              alt="Background Pattern"
              fill
              className="object-cover object-center opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-[#FFF9EE]/80" />
          </motion.div>

          <div className="w-full flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              
              {/* 1. Header Text (Placed ABOVE the box, fades/slides up on scroll) */}
              <div 
                className="absolute top-[8%] sm:top-[12%] left-1/2 w-full max-w-md text-center z-20 pointer-events-none select-none px-4"
                style={{
                  opacity: textOpacity,
                  transform: `translateX(-50%) translateY(${textY}px)`,
                  transition: "transform 0.08s ease-out, opacity 0.08s ease-out",
                }}
              >
                <div className="inline-flex items-center gap-1.5 bg-[#FF8A00]/10 text-[#FF8A00] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-[#FF8A00]/15">
                  <Sparkles size={11} className="animate-pulse" />
                  Premium Luxury Gifting
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] leading-none mb-3 tracking-tight">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-[#6B6B6B] font-medium tracking-wide max-w-lg mx-auto">
                  {subtitle}
                </p>
              </div>

              {/* 2. Floating Widgets (Fill the left & right blank spaces, drift outwards on scroll. Hidden on mobile CSS-wise to prevent layout shift) */}
              {/* Left Side Widget */}
              <motion.div
                className="hidden md:block absolute left-[5%] lg:left-[8%] top-[48%] z-20 pointer-events-none w-[260px] bg-white rounded-3xl p-6 border border-[#FFE4C2] shadow-[0_15px_45px_rgba(255,180,73,0.08)]"
                style={{
                  opacity: widgetOpacity,
                  x: widgetLeftX,
                  y: "-50%",
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#1A1A1A] leading-tight uppercase tracking-wider">Corporate Gifting</p>
                    <p className="text-[12px] text-[#6B6B6B] mt-1 font-medium">Custom branding & bulk hampers trusted by 500+ premium brands.</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Side Widget */}
              <motion.div
                className="hidden md:block absolute right-[5%] lg:right-[8%] top-[48%] z-20 pointer-events-none w-[260px] bg-white rounded-3xl p-6 border border-[#FFE4C2] shadow-[0_15px_45px_rgba(255,180,73,0.08)]"
                style={{
                  opacity: widgetOpacity,
                  x: widgetRightX,
                  y: "-50%",
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
                    <Gift size={20} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#1A1A1A] leading-tight uppercase tracking-wider">Personalized Touch</p>
                    <p className="text-[12px] text-[#6B6B6B] mt-1 font-medium">Build your own bespoke gift box and add personalized messages.</p>
                  </div>
                </div>
              </motion.div>

              {/* 3. Central Interactive Unboxing Card */}
              <div
                className="absolute z-10 top-[52%] sm:top-[54%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FFF9EE] overflow-hidden flex items-center justify-center border-solid border-[#FFB449]"
                style={{
                  width: mediaWidthStyle,
                  height: mediaHeightStyle,
                  maxWidth: "100vw",
                  maxHeight: "100vh",
                  borderRadius: borderRadius,
                  borderWidth: borderWidth,
                  boxShadow: `0px ${25 * shadowIntensity}px ${80 * shadowIntensity}px rgba(255, 138, 0, ${0.15 * shadowIntensity})`,
                }}
              >
                {/* Behind-the-scenes golden ambient glow */}
                <div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,180,73,0.45)_0%,transparent_70%)] z-10 transition-opacity pointer-events-none"
                  style={{
                    opacity: glowOpacity,
                    transform: `scale(${glowScale})`,
                  }}
                />

                {/* Hero Contents (revealed as box opens) */}
                <div
                  className={`absolute inset-0 z-0 transition-all duration-100 bg-[#FFF9EE] flex items-center justify-center overflow-hidden ${
                    mediaFullyExpanded ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                  style={{
                    opacity: contentOpacity,
                    transform: `scale(${contentScale})`,
                  }}
                >
                  {/* Fixed viewport-like size prevents squishing during expansion */}
                  <div className="w-[100vw] h-[100vh] min-h-[600px] md:min-h-0 relative select-text overflow-y-auto md:overflow-hidden">
                    {heroContent}
                  </div>
                </div>

                {/* Closed Gift Box Base (Bottom Half Clip - slides down) */}
                {baseOpacity > 0 && (
                  <div 
                    className="absolute inset-0 z-20 pointer-events-none transition-transform duration-75"
                    style={{
                      transform: `translateY(${baseY}px) rotate(${-lidRotate * 0.3}deg) translateX(${ribbonX * -0.1}px)`,
                      opacity: baseOpacity,
                    }}
                  >
                    <Image
                      src="/closed_gift_box.png"
                      alt="Gift Box Base"
                      fill
                      className="object-cover"
                      style={{
                        clipPath: "inset(48% 0px 0px 0px)",
                      }}
                      priority
                    />
                  </div>
                )}

                {/* Closed Gift Box Lid (Top Half Clip - slides up) */}
                {lidOpacity > 0 && (
                  <div
                    className="absolute inset-0 z-30 pointer-events-none transition-transform duration-75"
                    style={{
                      transform: `translateY(${lidY}px) rotate(${lidRotate}deg) translateX(${ribbonX * 0.3}px)`,
                      opacity: lidOpacity,
                    }}
                  >
                    <Image
                      src="/closed_gift_box.png"
                      alt="Gift Box Lid"
                      fill
                      className="object-cover"
                      style={{
                        clipPath: "inset(0px 0px 52% 0px)",
                      }}
                      priority
                    />
                  </div>
                )}

                {/* Gold Satin Ribbon Bow (slides off sideways) */}
                {ribbonOpacity > 0 && (
                  <div
                    className="absolute inset-0 z-40 pointer-events-none transition-transform duration-75"
                    style={{
                      transform: `translateX(${ribbonX}px) rotate(${ribbonX * 0.1}deg)`,
                      opacity: ribbonOpacity,
                    }}
                  >
                    <Image
                      src="/closed_gift_box.png"
                      alt="Luxury Ribbon Bow"
                      fill
                      className="object-cover scale-[1.01]"
                      style={{
                        clipPath: "inset(15% 15% 15% 15%)",
                      }}
                      priority
                    />
                  </div>
                )}
              </div>

              {/* 4. Bottom Scroll Indicator */}
              {scrollToExpand && scrollProgress < 0.1 && (
                <div 
                  className="absolute bottom-[6%] left-1/2 transform -translate-x-1/2 z-25 pointer-events-none select-none text-center"
                  style={{ opacity: textOpacity }}
                >
                  <motion.p
                    className="text-[#FF8A00] text-[10px] font-black uppercase tracking-[0.3em] mb-1 animate-bounce-subtle"
                  >
                    {scrollToExpand}
                  </motion.p>
                  <p className="text-[#FF8A00]/50 text-[10px] font-bold">⇅ Scroll to Begin</p>
                </div>
              )}

            </div>

            {/* Scroll Content (Fades in when fully opened) */}
            <motion.section
              className="w-full relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              {restOfContent}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
