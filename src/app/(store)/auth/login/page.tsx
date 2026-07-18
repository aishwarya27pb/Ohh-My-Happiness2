"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TESTIMONIALS = [
  { text: "Found my perfect gift within minutes.", author: "Priya M." },
  { text: "The customization made it truly special.", author: "Rahul S." },
  { text: "Every order feels like they care deeply.", author: "Ananya K." },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";

  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState<"request" | "verify">("request");
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push(nextPath);
      }
    };
    checkSession();
  }, [router, nextPath]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    const t = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  const getIdentifierType = (val: string) => {
    return val.includes("@") ? "email" : "phone";
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier || resendTimer > 0) return;
    
    setIsLoading(true);
    setError(null);

    const type = getIdentifierType(identifier);

    if (loginMode === "password") {
      if (!password) {
        setError("Please enter your password");
        setIsLoading(false);
        return;
      }
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: identifier, password });
      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }
      router.refresh();
      router.push(nextPath);
    } else {
      // OTP flow
      const { signInWithOTP, verifyOTP } = await import("@/app/actions/auth.actions");
      
      if (otpStep === "request") {
        const { error: otpError } = await signInWithOTP(identifier, type);
        if (otpError) {
          setError(otpError);
          if (otpError.toLowerCase().includes("rate limit")) {
            setResendTimer(60);
          }
        } else {
          setOtpStep("verify");
        }
      } else {
        if (otpCode.length < 6) {
          setError("Please enter the 6-digit code");
          setIsLoading(false);
          return;
        }
        const { error: verifyError } = await verifyOTP(identifier, otpCode, type);
        if (verifyError) {
          setError(verifyError);
        } else {
          router.refresh();
          router.push(nextPath);
        }
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel ───────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(145deg, #FF8A00 0%, #FFB449 40%, #F7C96A 75%, #FFE4C2 100%)",
        }}
      >

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
          <div
            key={testimonialIdx}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/20 max-w-xs transition-opacity duration-300"
          >
            <p className="text-white text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-playfair), serif" }}>
              &ldquo;{TESTIMONIALS[testimonialIdx].text}&rdquo;
            </p>
            <p className="text-white/70 text-xs mt-2" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
              — {TESTIMONIALS[testimonialIdx].author}
            </p>
          </div>
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
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FFF9EE]">
        <div
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
              {otpStep === "verify" ? "Verify Code" : loginMode === "password" ? "Welcome back" : "Quick Sign-In"}
            </h2>
            <p className="mt-2 text-[#6B6B6B]" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
              {otpStep === "verify" 
                ? `Enter the 6-digit code sent to ${identifier}` 
                : loginMode === "password" 
                  ? "Sign in to continue to your account" 
                  : "Enter email or phone to receive a login code"}
            </p>
          </div>

          {/* Mode Toggle */}
          {otpStep === "request" && (
            <div className="mb-8 p-1 bg-[#FFE4C2]/30 rounded-2xl flex gap-1">
              <button
                onClick={() => { setLoginMode("password"); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  loginMode === "password" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                Password
              </button>
              <button
                onClick={() => { setLoginMode("otp"); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  loginMode === "otp" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                OTP Login
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {otpStep === "verify" ? (
              <div className="space-y-6">
                <div className="group text-center">
                  <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-4">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="000000"
                    className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 bg-white rounded-2xl border-2 border-[#FFE4C2] focus:border-[#FFB449] outline-none shadow-sm"
                    autoFocus
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => { setOtpStep("request"); setOtpCode(""); }}
                  className="w-full text-xs font-bold text-[#6B6B6B] hover:text-[#FF8A00] transition-colors"
                >
                  Change Email/Phone
                </button>
              </div>
            ) : (
              <>
                {/* Email or Phone */}
                <div className="group">
                  <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="you@example.com or +91..."
                    className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4]"
                  />
                  {identifier && !identifier.includes("@") && !identifier.startsWith("+") && (
                    <p className="mt-1 text-[10px] text-orange-600 font-medium italic">Tip: Use +91 for phone numbers</p>
                  )}
                </div>

                {/* Password (only if mode is password) */}
                {loginMode === "password" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">
                        Password
                      </label>
                      <Link href="/auth/forgot-password" className="text-xs text-[#FF8A00] hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#FF8A00] transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || resendTimer > 0}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-60 shadow-xl shadow-[#FF8A00]/20"
                style={{ 
                  background: resendTimer > 0 
                    ? "#6B6B6B" 
                    : "linear-gradient(135deg, #FFB449 0%, #FF8A00 100%)" 
                }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {resendTimer > 0 ? (
                      <span className="flex items-center gap-2">
                        Wait {resendTimer}s
                      </span>
                    ) : (
                      <>
                        {otpStep === "verify" ? "Verify & Login" : loginMode === "password" ? "Sign In" : "Send Login Code"}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </>
                )}
              </button>
              {resendTimer > 0 && (
                <p className="mt-4 text-center text-xs text-orange-600 font-bold animate-pulse">
                  Rate limit reached. Please wait {resendTimer} seconds before retrying.
                </p>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#FFE4C2]" />
            <span className="text-xs text-[#6B6B6B]">New here?</span>
            <div className="flex-1 h-px bg-[#FFE4C2]" />
          </div>

          {/* Sign up link */}
          <Link
            href={`/auth/signup?next=${encodeURIComponent(nextPath)}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-[#FF8A00] border-2 border-[#FFE4C2] hover:border-[#FFB449] hover:bg-[#FFF4E0] transition-all duration-300"
          >
            Create an account
          </Link>
        </div>
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
