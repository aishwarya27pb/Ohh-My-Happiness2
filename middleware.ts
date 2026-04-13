import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // ── Admin route protection ──────────────────────────────────────────────
  if (path.startsWith("/admin")) {
    if (path === "/admin/login") {
      // Already logged in as admin? Skip the login page.
      if (user) {
        const { data: profile } = (await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()) as { data: { role: string } | null; error: unknown };
        if (profile?.role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
      return supabaseResponse;
    }

    // All other /admin/* routes require an authenticated admin
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const { data: profile } = (await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()) as { data: { role: string } | null; error: unknown };

    if (profile?.role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/login?error=access_denied", request.url)
      );
    }
  }

  // ── Customer account route protection ───────────────────────────────────
  if (path.startsWith("/account")) {
    if (!user) {
      return NextResponse.redirect(
        new URL(
          `/auth/login?next=${encodeURIComponent(path)}`,
          request.url
        )
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
