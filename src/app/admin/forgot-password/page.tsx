"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPasswordForEmail } from "@/app/actions/auth.actions";
import { Mail, ChevronLeft, Loader2, CheckCircle2, Shield } from "lucide-react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Redirect admins to the same reset page but maybe I can customize it later
    const { error } = await resetPasswordForEmail(email);
    
    if (error) {
      setError(error);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1A1A1A] p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
             <div className="w-16 h-16 bg-[#FFB449] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
               <Shield size={32} className="text-white" />
             </div>
             <h1 className="text-white text-2xl font-black">Admin Recovery</h1>
             <p className="text-white/50 text-sm mt-1">OMH Central Dashboard</p>
          </div>

          <div className="p-8 lg:p-10">
            {sent ? (
              <div className="text-center space-y-6">
                <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-start gap-3 text-left border border-green-100">
                  <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold mb-1">Link Sent!</p>
                    <p>Check your admin email <strong>{email}</strong> for instructions.</p>
                  </div>
                </div>
                <Link 
                  href="/admin/login"
                  className="block w-full py-4 rounded-2xl bg-[#1A1A1A] text-white font-bold text-sm hover:bg-[#333] transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-[#6B6B6B] text-sm text-center">
                  Enter your administrator email to receive a secure recovery link.
                  <span className="block mt-1 text-xs font-bold text-[#FF8A00] animate-pulse">Note: Recovery links expire in 60 minutes.</span>
                </p>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider ml-1">
                    Admin Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] group-focus-within:text-[#FF8A00] transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ohhmyhappiness.com"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#FFB449] focus:bg-white outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-[#1A1A1A] text-white font-black text-sm hover:bg-[#333] transition-all flex items-center justify-center gap-2 group shadow-xl"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Request Recovery Link"}
                </button>

                <Link 
                  href="/admin/login" 
                  className="flex items-center justify-center gap-2 text-sm font-bold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                >
                  <ChevronLeft size={16} /> Back to Sign In
                </Link>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
