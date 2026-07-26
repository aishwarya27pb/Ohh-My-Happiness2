"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TESTIMONIALS = [
  { text: "Found my perfect gift within minutes.", author: "Priya M." },
  { text: "The customization made it truly special.", author: "Rahul S." },
  { text: "Every order feels like they care deeply.", author: "Ananya K." },
];

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: ssoError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?flow=oauth&next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (ssoError) {
        setError(ssoError.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during Google sign in");
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
            <span className="text-white font-semibold text-lg" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Ohh My Happiness
            </span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1
              className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-4"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Start gifting
              <br />
              beautifully.
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-sm" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
              Create an account to manage orders, build wishlists, and check out faster.
            </p>
          </div>

          <ul className="space-y-4">
            {["Save your favorite items", "Track orders in real-time", "Exclusive member offers"].map((benefit, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-white/90"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tagline */}
        <p
          className="relative z-10 text-white/60 text-xs italic"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          "Your requirement is our responsibility."
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-[#FFF9EE]">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 lg:hidden">
            <div className="rounded-xl overflow-hidden ring-1 ring-black/10">
              <Image src="/logo.jpg" alt="Ohh My Happiness" width={36} height={36} className="w-9 h-9 object-cover" />
            </div>
            <span className="text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Ohh My Happiness
            </span>
          </Link>

          <>
            {success ? (
              /* ── Success state ──────────────────────────────────────── */
              <div className="text-center py-8">
                <div className="text-6xl mb-6">🎁</div>
                <h2
                  className="text-3xl font-bold text-[#1A1A1A] mb-3"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  You&apos;re in!
                </h2>
                <p
                  className="text-[#6B6B6B] mb-6 leading-relaxed"
                  style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                >
                  We&apos;ve sent a confirmation to{" "}
                  <span className="text-[#FF8A00] font-medium">{form.email}</span>.
                  <br />
                  Check your inbox and verify your account.
                </p>
                <button
                  onClick={() => router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`)}
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #FFB449 0%, #FF8A00 100%)",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                  }}
                >
                  Go to Sign In
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              /* ── Form state ─────────────────────────────────────────── */
              <div>
                <div className="mb-7">
                  <h2
                    className="text-4xl font-bold text-[#1A1A1A] leading-tight"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Create account
                  </h2>
                  <p
                    className="mt-2 text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                  >
                    Join thousands of happy gifters
                  </p>
                </div>

                {error && (
                  <div
                    className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm"
                    style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    {(
                      [
                        { field: "firstName", label: "First Name", placeholder: "Priya" },
                        { field: "lastName", label: "Last Name", placeholder: "Sharma" },
                      ] as const
                    ).map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label
                          className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                        >
                          {label}
                        </label>
                        <input
                          type="text"
                          value={form[field as keyof typeof form]}
                          onChange={update(field as keyof typeof form)}
                          required
                          placeholder={placeholder}
                          className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4] text-sm"
                          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      required
                      placeholder="you@example.com"
                      className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4]"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4]"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    />
                  </div>

                  {/* Password row */}
                  {(
                    [
                      { field: "password", label: "Password", placeholder: "Min. 6 characters" },
                      { field: "confirmPassword", label: "Confirm Password", placeholder: "Same as above" },
                    ] as const
                  ).map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label
                        className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                      >
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={form[field as keyof typeof form]}
                          onChange={update(field as keyof typeof form)}
                          required
                          placeholder={placeholder}
                          className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4] pr-8"
                          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
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
                  ))}

                  {/* Submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
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
                          Creating…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Create Account
                          <ArrowRight size={16} />
                        </span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#FFE4C2]" />
                  <span className="text-xs text-[#6B6B6B]">or</span>
                  <div className="flex-1 h-px bg-[#FFE4C2]" />
                </div>

                {/* Google SSO Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-semibold text-[#1A1A1A] bg-white border-2 border-[#FFE4C2] hover:border-[#FFB449] hover:bg-[#FFF4E0] transition-all duration-300 shadow-sm disabled:opacity-60 mb-6"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.28-1.12-.66-1.51-1.11L5.84 14.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                {/* Login link */}
                <div className="mt-6 text-center">
                  <span
                    className="text-sm text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                  >
                    Already have an account?{" "}
                    <Link
                      href={`/auth/login?next=${encodeURIComponent(nextPath)}`}
                      className="font-semibold text-[#FF8A00] hover:text-[#E67A00] transition-colors underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </span>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
