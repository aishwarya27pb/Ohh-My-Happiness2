"use client";

import { Suspense, useState, useEffect } from "react";
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

function SignupForm() {
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9EE]" />}>
      <SignupForm />
    </Suspense>
  );
}
