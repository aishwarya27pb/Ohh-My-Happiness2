"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/services/customers.service";
import { redirect } from "next/navigation";
import { env } from "@/env";
import { createServiceClient } from "@/lib/supabase/service";
import { sendWhatsAppMessage, formatWhatsAppPhone } from "@/lib/services/whatsapp.service";
import crypto from "crypto";


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
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/admin/login`,
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
    redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset-password`,
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
  if (type === "email") {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: identifier,
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) return { error: error.message };
  } else {
    // Custom WhatsApp OTP flow
    const cleanedPhone = formatWhatsAppPhone(identifier);
    if (!cleanedPhone) {
      return { error: "Invalid phone number." };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes validity

    const serviceClient = createServiceClient();

    // Look up if a profile with this phone number exists
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("id, cart_data")
      .eq("phone", cleanedPhone)
      .maybeSingle();

    if (profile) {
      const currentCart = profile.cart_data && typeof profile.cart_data === "object" ? profile.cart_data : {};
      const updatedCart = {
        ...currentCart,
        whatsapp_otp: otp,
        whatsapp_otp_expires: expires,
      };

      const { error: updateError } = await serviceClient
        .from("profiles")
        .update({ cart_data: updatedCart })
        .eq("id", profile.id);

      if (updateError) return { error: updateError.message };
    } else {
      // Create the Auth User first to avoid violating foreign key constraints
      const tempPass = crypto.randomUUID(); // secure random key
      const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
        phone: cleanedPhone,
        phone_confirm: true,
        password: tempPass,
        user_metadata: { role: "customer" },
      });

      if (createError) {
        return { error: createError.message };
      }

      // Now insert the profile safely using the generated user ID
      const { error: insertError } = await serviceClient
        .from("profiles")
        .insert({
          id: newUser.user.id,
          phone: cleanedPhone,
          role: "customer",
          cart_data: {
            whatsapp_otp: otp,
            whatsapp_otp_expires: expires,
          },
        });

      if (insertError) return { error: insertError.message };
    }

    // Send the OTP via WhatsApp
    console.log(`🔑 [OTP SYSTEM] Generated code for WhatsApp OTP login: ${otp} (sent to ${cleanedPhone})`);
    const whatsappResult = await sendWhatsAppMessage({
      recipientPhone: cleanedPhone,
      templateName: "auth_otp_omh",
      parameters: [otp],
    });

    // We do NOT fail the operation if Meta API is unconfigured/sandbox mode during development
    // This ensures local testing works perfectly using the console logs!
    if (!whatsappResult.success && env.NODE_ENV === "production") {
      return { error: whatsappResult.error || "Failed to deliver WhatsApp message." };
    }
  }

  return { success: true };
}

export async function verifyOTP(identifier: string, token: string, type: "email" | "phone" = "email") {
  if (type === "email") {
    const supabase = await createClient();
    const verifyParams = { email: identifier, token, type: "email" as const };
    const { error } = await supabase.auth.verifyOtp(verifyParams);
    if (error) return { error: error.message };
  } else {
    // Custom WhatsApp OTP verification flow
    const cleanedPhone = formatWhatsAppPhone(identifier);
    if (!cleanedPhone) {
      return { error: "Invalid phone number." };
    }

    const serviceClient = createServiceClient();

    const { data: profile } = await serviceClient
      .from("profiles")
      .select("id, cart_data")
      .eq("phone", cleanedPhone)
      .maybeSingle();

    if (!profile) {
      return { error: "No pending OTP request found." };
    }

    const cartData = profile.cart_data && typeof profile.cart_data === "object" ? (profile.cart_data as Record<string, any>) : null;
    const storedOtp = cartData?.whatsapp_otp;
    const expires = cartData?.whatsapp_otp_expires;

    if (!storedOtp || !expires) {
      return { error: "No pending OTP request found." };
    }

    if (new Date(expires).getTime() < Date.now()) {
      return { error: "OTP code has expired." };
    }

    if (storedOtp !== token) {
      return { error: "Invalid OTP code." };
    }

    // Clear the OTP fields in database
    const updatedCart = { ...cartData };
    delete updatedCart.whatsapp_otp;
    delete updatedCart.whatsapp_otp_expires;

    await serviceClient
      .from("profiles")
      .update({ cart_data: updatedCart })
      .eq("id", profile.id);

    // Proceed to securely establish a Supabase Auth session for this user
    try {
      const tempPassword = crypto.randomBytes(16).toString("hex");

      // Check if user exists in auth.users
      const { data: { user: authUser }, error: getAuthError } = await serviceClient.auth.admin.getUserById(profile.id);

      if (!authUser || getAuthError) {
        // Create user with corresponding profile ID
        const { error: createError } = await serviceClient.auth.admin.createUser({
          id: profile.id,
          phone: cleanedPhone,
          phone_confirm: true,
          password: tempPassword,
          user_metadata: { role: "customer" },
        });

        if (createError) throw new Error(createError.message);
      } else {
        // Update user password to temporary password
        const { error: updateError } = await serviceClient.auth.admin.updateUserById(profile.id, {
          password: tempPassword,
        });

        if (updateError) throw new Error(updateError.message);
      }

      // Log user in using standard client (setting standard secure cookies)
      const userSupabase = await createClient();
      const { error: signInError } = await userSupabase.auth.signInWithPassword({
        phone: cleanedPhone,
        password: tempPassword,
      });

      if (signInError) throw new Error(signInError.message);

    } catch (authErr) {
      return { error: authErr instanceof Error ? authErr.message : "Authentication session creation failed." };
    }
  }

  return { success: true };
}
