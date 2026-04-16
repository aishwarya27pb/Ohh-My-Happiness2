"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TESTIMONIALS = [
  { text: "Found my perfect gift within minutes.", author: "Priya M." },
  { text: "The customization made it truly special.", author: "Rahul S." },
  { text: "Every order feels like they care deeply.", author: "Ananya K." },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError(null);

    // Sign in via browser client so onAuthStateChange fires SIGNED_IN immediately,
    // updating the header avatar without needing a full page reload.
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // refresh() re-syncs server components (account page data), then navigate
    router.refresh();
    router.push(nextPath);
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel ───────────────────────────────────────── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(145deg, #FF8A00 0%, #FFB449 40%, #F7C96A 75%, #FFE4C2 100%)",
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "180px",
          }}
        />
        {/* Large decorative circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-amber-700/20 blur-3xl" />

        {/* Brand mark */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
              <Image src="/logo.jpg" alt="Ohh My Happiness" width={44} height={44} className="w-11 h-11 object-cover" />
            </div>
            <span className="text-white font-semibold text-lg" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Ohh My Happiness
            </span>
          </Link>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-6">
          <h1
            className="text-5xl font-bold text-white leading-[1.1]"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Every gift tells
            <br />
            a story.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-xs" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Track your orders, manage wishlists, and make every occasion unforgettable.
          </p>

          {/* Rotating testimonial */}
          <motion.div
            key={testimonialIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/20 max-w-xs"
          >
            <p className="text-white text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-playfair), serif" }}>
              &ldquo;{TESTIMONIALS[testimonialIdx].text}&rdquo;
            </p>
            <p className="text-white/70 text-xs mt-2" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
              — {TESTIMONIALS[testimonialIdx].author}
            </p>
          </motion.div>
        </div>

        {/* Decorative dots */}
        <div className="relative z-10 flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === testimonialIdx ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FFF9EE]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="rounded-xl overflow-hidden ring-1 ring-black/10">
              <Image src="/logo.jpg" alt="Ohh My Happiness" width={36} height={36} className="w-9 h-9 object-cover" />
            </div>
            <span className="text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Ohh My Happiness
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h2
              className="text-4xl font-bold text-[#1A1A1A] leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Welcome back
            </h2>
            <p className="mt-2 text-[#6B6B6B]" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
              Sign in to continue to your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="group"
            >
              <label
                className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4]"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32 }}
            >
              <label
                className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4] pr-10"
                  style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#FF8A00] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: isLoading
                    ? "#FFB449"
                    : "linear-gradient(135deg, #FFB449 0%, #FF8A00 100%)",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  boxShadow: "0 8px 24px rgba(255, 138, 0, 0.3)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#FFE4C2]" />
            <span
              className="text-xs text-[#6B6B6B]"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              New here?
            </span>
            <div className="flex-1 h-px bg-[#FFE4C2]" />
          </div>

          {/* Sign up link */}
          <Link
            href="/auth/signup"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-[#FF8A00] border-2 border-[#FFE4C2] hover:border-[#FFB449] hover:bg-[#FFF4E0] transition-all duration-300"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            Create an account
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9EE]" />}>
      <LoginForm />
    </Suspense>
  );
}
