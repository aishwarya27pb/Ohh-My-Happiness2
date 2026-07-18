"use client";

import { useState, useEffect } from "react";
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

export default function LoginForm() {
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
        className="hidden lg:flex lg:w-[40%] relative overflow-hidden flex-col justify-between p-10"
        style={{
          background:
            "linear-gradient(150deg, #FFE4C2 0%, #F7C96A 40%, #FFB449 75%, #FF8A00 100%)",
        }}
      >
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-800/20 blur-3xl" />

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-all">
              <Image src="/logo.jpg" alt="Ohh My Happiness" width={44} height={44} className="w-11 h-11 object-cover" />
            </div>
            <span className="font-black text-[#1A1A1A] tracking-wider text-lg">
              Ohh My Happiness
            </span>
          </Link>
        </div>

        {/* Testimonials */}
        <div className="relative z-10 my-auto pr-10">
          <div className="min-h-[140px] flex flex-col justify-center">
            <p className="text-2xl lg:text-3xl font-black text-[#1A1A1A] leading-tight mb-4 italic">
              "{TESTIMONIALS[testimonialIdx].text}"
            </p>
            <p className="text-sm font-bold text-[#1A1A1A]/70 uppercase tracking-widest">
              — {TESTIMONIALS[testimonialIdx].author}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-xs font-bold text-[#1A1A1A]/50">
          © {new Date().getFullYear()} Ohh My Happiness. All rights reserved.
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#FFF9EE]">
        <div className="w-full max-w-[440px]">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-block lg:hidden rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image src="/logo.jpg" alt="Ohh My Happiness" width={56} height={56} className="w-14 h-14 object-cover" />
            </div>
            <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-[#6B6B6B]">
              Sign in to continue to your account
            </p>
          </div>

          {/* Toggle login mode */}
          <div className="bg-[#FFF4E0] p-1.5 rounded-2xl flex gap-1 mb-8 border border-[#FFE4C2]">
            <button
              onClick={() => {
                setLoginMode("password");
                setError(null);
              }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                loginMode === "password"
                  ? "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              Password
            </button>
            <button
              onClick={() => {
                setLoginMode("otp");
                setError(null);
                setOtpStep("request");
              }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                loginMode === "otp"
                  ? "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              OTP Login
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-2xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {loginMode === "otp" && otpStep === "verify" ? (
              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] mb-2 uppercase tracking-widest">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  required
                  placeholder="000000"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-center text-2xl font-black tracking-[0.5em] text-[#1A1A1A]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setOtpStep("request")}
                  className="mt-3 text-xs font-bold text-[#FF8A00] hover:underline"
                >
                  Change Email / Phone
                </button>
              </div>
            ) : (
              <>
                {/* Email / Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B6B] mb-1.5 uppercase tracking-widest">
                    {loginMode === "password" ? "Email" : "Email or Phone"}
                  </label>
                  <input
                    type={loginMode === "password" ? "email" : "text"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder={
                      loginMode === "password" ? "you@example.com" : "you@example.com or +91..."
                    }
                    className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4] text-sm"
                  />
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
