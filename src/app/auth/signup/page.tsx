"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { signUp } from "@/app/actions/auth.actions";

export default function SignupPage() {
  const router = useRouter();

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

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    const result = await signUp({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel ───────────────────────────────────────── */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(150deg, #FFE4C2 0%, #F7C96A 40%, #FFB449 75%, #FF8A00 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "180px",
          }}
        />
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-amber-800/20 blur-3xl" />

        {/* Brand */}
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

        {/* Content */}
        <div className="relative z-10 space-y-6">
          <div>
            <p
              className="text-white/70 uppercase tracking-widest text-xs font-semibold mb-3"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              Join the community
            </p>
            <h1
              className="text-5xl font-bold text-white leading-[1.1]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Gifting made
              <br />
              effortless.
            </h1>
          </div>

          {/* Benefits */}
          <ul className="space-y-3">
            {[
              "Track all your orders in one place",
              "Save delivery addresses",
              "Get early access to deals",
              "Personalised gift recommendations",
            ].map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 text-white/90"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
                <span className="text-sm">{benefit}</span>
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
      </motion.div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-[#FFF9EE]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 lg:hidden">
            <div className="rounded-xl overflow-hidden ring-1 ring-black/10">
              <Image src="/logo.jpg" alt="Ohh My Happiness" width={36} height={36} className="w-9 h-9 object-cover" />
            </div>
            <span className="text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Ohh My Happiness
            </span>
          </Link>

          <AnimatePresence mode="wait">
            {success ? (
              /* ── Success state ──────────────────────────────────────── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-6"
                >
                  🎁
                </motion.div>
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
                  onClick={() => router.push("/auth/login")}
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #FFB449 0%, #FF8A00 100%)",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                  }}
                >
                  Go to Sign In
                  <ArrowRight size={15} />
                </button>
              </motion.div>
            ) : (
              /* ── Form state ─────────────────────────────────────────── */
              <motion.div key="form">
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm"
                    style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    {(
                      [
                        { field: "firstName", label: "First Name", placeholder: "Priya" },
                        { field: "lastName", label: "Last Name", placeholder: "Sharma" },
                      ] as const
                    ).map(({ field, label, placeholder }, i) => (
                      <motion.div
                        key={field}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                      >
                        <label
                          className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                        >
                          {label}
                        </label>
                        <input
                          type="text"
                          value={form[field]}
                          onChange={update(field)}
                          required
                          placeholder={placeholder}
                          className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4] text-sm"
                          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
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
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label
                      className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    >
                      Phone <span className="normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="+91 98765 43210"
                      className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4]"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    />
                  </motion.div>

                  {/* Password row */}
                  {(
                    [
                      { field: "password", label: "Password", placeholder: "Min. 6 characters" },
                      { field: "confirmPassword", label: "Confirm Password", placeholder: "Same as above" },
                    ] as const
                  ).map(({ field, label, placeholder }, i) => (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                    >
                      <label
                        className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5"
                        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                      >
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={form[field]}
                          onChange={update(field)}
                          required
                          placeholder={placeholder}
                          className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none transition-colors text-[#1A1A1A] placeholder-[#C4C4C4] pr-8"
                          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                        />
                        {field === "password" && (
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#FF8A00] transition-colors"
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-2"
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #FFB449 0%, #FF8A00 100%)",
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        boxShadow: "0 8px 24px rgba(255, 138, 0, 0.3)",
                      }}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Creating account…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Create Account
                          <ArrowRight size={16} />
                        </span>
                      )}
                    </button>
                  </motion.div>
                </form>

                {/* Sign in link */}
                <div className="mt-6 text-center" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  <span className="text-[#6B6B6B] text-sm">Already have an account? </span>
                  <Link
                    href="/auth/login"
                    className="text-[#FF8A00] font-semibold text-sm hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
