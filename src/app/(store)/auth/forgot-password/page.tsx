"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPasswordForEmail } from "@/app/actions/auth.actions";
import { Mail, ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await resetPasswordForEmail(email);
    
    if (error) {
      setError(error);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#FF8A00] transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Back to Sign In
        </Link>

        <div className="bg-white rounded-[32px] shadow-xl shadow-[#FFB449]/5 border border-[#FFE4C2] p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FFF9EE] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#FFE4C2]">
              <Mail size={32} className="text-[#FF8A00]" />
            </div>
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">Forgot Password?</h1>
            <p className="text-[#6B6B6B] text-sm">
              Enter your email and we&apos;ll send you a link to reset your password. 
              <span className="block mt-1 text-xs font-bold text-[#FF8A00] animate-pulse">Links expire in 60 minutes.</span>
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-start gap-3 text-left border border-green-100">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold mb-1">Check your inbox!</p>
                  <p>A password reset link has been sent to <strong>{email}</strong>.</p>
                </div>
              </div>
              <button 
                onClick={() => setSent(false)}
                className="text-sm font-bold text-[#FF8A00] hover:underline"
              >
                Didn&apos;t get the email? Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] group-focus-within:text-[#FF8A00] transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-4 bg-[#FFF9EE] border-2 border-transparent rounded-2xl focus:border-[#FFB449] focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
