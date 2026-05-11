import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;
  console.log(`[Middleware] Path: ${path}, User: ${user?.email ?? "Guest"}`);

  // ── Admin route protection ──────────────────────────────────────────────
  if (path.startsWith("/admin") && path !== "/admin/login") {
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
    if (path === "/account") {
      return NextResponse.redirect(new URL("/account/orders", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/admin", "/account"],
};
