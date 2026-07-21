"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  maxSize: number;
  size: number;
  opacity: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
}

const BRAND_COLORS = [
  "#FFB449", // Gold
  "#FF8A00", // Amber
  "#F7C96A", // Warm Honey
  "#FFE4C2", // Soft Peach
  "#FFFFFF", // Pure White highlight
];

export default function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resizing of the canvas to fit window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Spawn a sparkle at coordinate (x, y)
    const spawnSparkle = (x: number, y: number) => {
      const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      
      const newParticle: Particle = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // drift slightly upwards
        color,
        maxSize: Math.random() * 7 + 4, // size range 4px - 11px
        size: 1, // start small and grow, then shrink
        opacity: 1,
        decay: Math.random() * 0.02 + 0.015, // decay rate
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      };

      particlesRef.current.push(newParticle);
    };

    // Listen to mousemove and touchmove
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const dx = clientX - lastMousePos.current.x;
      const dy = clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only spawn if mouse has moved a threshold to avoid cluttering when slow/stopped
      if (dist > 6) {
        // Spawn 1 or 2 sparkles
        const count = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          // Add minor jitter so they spread from the trailing line
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterY = (Math.random() - 0.5) * 4;
          spawnSparkle(clientX + jitterX, clientY + jitterY);
        }
        lastMousePos.current = { x: clientX, y: clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      spawnSparkle(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Draw a 4-pointed sparkle star
    const drawSparkleStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number
    ) => {
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.22;
      let rot = rotation;
      const step = Math.PI / spikes;

      c.save();
      c.beginPath();
      c.translate(cx, cy);
      c.rotate(rotation);
      
      let x = 0;
      let y = -outerRadius;
      c.moveTo(x, y);

      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      
      c.closePath();
      c.fillStyle = color;
      c.globalAlpha = opacity;
      c.shadowColor = color;
      c.shadowBlur = size * 0.8; // subtle glow
      c.fill();
      c.restore();
    };

    // Animation Loop
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= p.decay;
        p.rotation += p.rotationSpeed;

        // Size lifecycle: grow rapidly, then shrink as opacity decays
        if (p.opacity > 0.6) {
          p.size += (p.maxSize - p.size) * 0.2;
        } else {
          p.size -= 0.15;
        }

        if (p.opacity <= 0 || p.size <= 0.1) {
          particles.splice(i, 1);
          continue;
        }

        drawSparkleStar(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
