"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { adminSignUp } from "@/app/actions/auth.actions";

function AdminSignupForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    const result = await adminSignUp(form.email, form.password, form.firstName, form.lastName);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-4 shadow-lg shadow-[#FFB449]/20 ring-2 ring-[#FFB449]/30">
            <Image src="/logo.jpg" alt="Ohh My Happiness" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Portal</h1>
          <p className="text-white/40 text-sm mt-1">Create Admin Account</p>
        </div>

        {success ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-xl backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Registration Successful</h2>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              We&apos;ve sent a confirmation link to <span className="text-[#FFB449] font-medium">{form.email}</span>. Please verify your email before signing in.
            </p>
            <button
              onClick={() => router.push("/admin/login")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[#1A1A1A] transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #FFB449 0%, #FF8A00 100%)" }}
            >
              Go to Sign In
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={update("firstName")}
                    required
                    placeholder="Jane"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-[#FFB449]/50 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={update("lastName")}
                    required
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-[#FFB449]/50 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  required
                  placeholder="admin@ohhmyhappiness.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-[#FFB449]/50 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={update("password")}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-[#FFB449]/50 transition-colors text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={update("confirmPassword")}
                    required
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-[#FFB449]/50 transition-colors text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-[#1A1A1A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={{ background: "linear-gradient(135deg, #FFB449 0%, #FF8A00 100%)" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Admin Account
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/admin/login"
                className="text-white/40 text-sm hover:text-[#FFB449] transition-colors"
              >
                Return to Admin Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminSignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFB449]/30 border-t-[#FFB449] rounded-full animate-spin" />
      </div>
    }>
      <AdminSignupForm />
    </Suspense>
  );
}
