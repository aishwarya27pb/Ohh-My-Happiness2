import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  const flow = searchParams.get("flow");
  const isOAuth = flow === "oauth";
  const isAdminOAuth = flow === "admin-oauth";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const isPasswordReset = next.includes("reset-password");
      
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      // 1. Handle Admin OAuth Verification
      if (isAdminOAuth) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return NextResponse.redirect(`${origin}/admin/login?error=access_denied`);
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "admin") {
          await supabase.auth.signOut();
          const targetPath = "/admin/login?error=access_denied";
          return NextResponse.redirect(isLocalEnv ? `${origin}${targetPath}` : (forwardedHost ? `https://${forwardedHost}${targetPath}` : `${origin}${targetPath}`));
        }

        const targetPath = "/admin";
        return NextResponse.redirect(isLocalEnv ? `${origin}${targetPath}` : (forwardedHost ? `https://${forwardedHost}${targetPath}` : `${origin}${targetPath}`));
      }
      
      // 2. Handle normal Customer OAuth or Email Link
      // Do NOT sign out if it's a password reset OR if we are on an OAuth SSO flow
      if (!isPasswordReset && !isOAuth) {
        await supabase.auth.signOut();
      }
      
      // For OAuth flows, redirect directly to the target destination (next). Otherwise redirect to password reset or login success.
      let redirectPath = isOAuth ? next : (isPasswordReset ? next : "/auth/login?verified=true");
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}
