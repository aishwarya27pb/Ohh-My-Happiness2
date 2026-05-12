"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/services/customers.service";
import { redirect } from "next/navigation";

// ── Customer sign-up ────────────────────────────────────────────────────────

export async function signUp(formData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        role: "customer",
        first_name: formData.firstName,
        last_name: formData.lastName,
      },
    },
  });

  if (error) return { error: error.message };

  // Update phone separately if provided (after profile is created by trigger)
  if (formData.phone) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await updateProfile(user.id, { phone: formData.phone });
    }
  }

  return { success: true };
}

// ── Customer sign-in ────────────────────────────────────────────────────────

export async function signIn(
  email: string,
  password: string,
  nextPath?: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect(nextPath ?? "/");
}

// ── Admin sign-in ───────────────────────────────────────────────────────────

export async function adminSignIn(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  // Verify admin role from profiles table
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()) as { data: { role: string } | null; error: unknown };

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Access denied. Admin credentials required." };
  }

  redirect("/admin");
}

// ── Admin sign-up ───────────────────────────────────────────────────────────

export async function adminSignUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/login`,
      data: {
        role: "admin",
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) return { error: error.message };

  return {};
}

// ── Sign-out ────────────────────────────────────────────────────────────────

export async function signOut(isAdmin = false) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(isAdmin ? "/admin/login" : "/");
}

// ── Get current session (for Server Components) ─────────────────────────────

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ── Password Reset ──────────────────────────────────────────────────────────

export async function resetPasswordForEmail(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset-password`,
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: true };
}

// ── OTP / Magic Link Login ────────────────────────────────────────────────

export async function signInWithOTP(identifier: string, type: "email" | "phone" = "email") {
  const supabase = await createClient();
  if (type === "email") {
    const { error } = await supabase.auth.signInWithOtp({
      email: identifier,
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.auth.signInWithOtp({
      phone: identifier,
    });
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function verifyOTP(identifier: string, token: string, type: "email" | "phone" = "email") {
  const supabase = await createClient();
  const verifyParams = type === "email" 
    ? { email: identifier, token, type: "email" as const }
    : { phone: identifier, token, type: "sms" as const };

  const { data, error } = await supabase.auth.verifyOtp(verifyParams);
  
  if (error) return { error: error.message };
  return { success: true };
}
