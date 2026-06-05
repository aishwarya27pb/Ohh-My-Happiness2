"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updatePassword, getSession } from "@/app/actions/auth.actions";
import { Lock, Loader2, CheckCircle2, ShieldCheck, X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const user = await getSession();
      if (user) {
        setIsValid(true);
      }
      setChecking(false);
    }
    checkAuth();
  }, []);

  if (checking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF8A00]" />
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-white p-10 rounded-[32px] border border-[#FFE4C2] shadow-xl shadow-[#FFB449]/5">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1A] mb-3">Invalid Link</h1>
          <p className="text-[#6B6B6B] mb-8">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link 
            href="/auth/forgot-password"
            className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await updatePassword(password);
    
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-white p-10 rounded-[32px] border border-[#FFE4C2] shadow-xl shadow-[#FFB449]/5">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1A] mb-3">Password Updated!</h1>
          <p className="text-[#6B6B6B] mb-8">
            Your password has been updated successfully. You can now use your new password to sign in.
          </p>
          <Link 
            href="/auth/login"
            className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[32px] shadow-xl shadow-[#FFB449]/5 border border-[#FFE4C2] p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FFF9EE] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#FFE4C2]">
              <ShieldCheck size={32} className="text-[#FF8A00]" />
            </div>
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">New Password</h1>
            <p className="text-[#6B6B6B] text-sm">
              Please enter your new secure password below. 
              <span className="block mt-1 text-xs font-bold text-[#FF8A00] animate-pulse">This link expires 60 minutes after it was sent.</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider ml-1">
                New Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 bg-[#FFF9EE] border-2 border-transparent rounded-2xl focus:border-[#FFB449] focus:bg-white outline-none transition-all text-sm font-medium pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#FF8A00] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider ml-1">
                Confirm New Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 bg-[#FFF9EE] border-2 border-transparent rounded-2xl focus:border-[#FFB449] focus:bg-white outline-none transition-all text-sm font-medium pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#FF8A00] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
