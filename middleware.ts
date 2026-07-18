import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept Protected Admin Routes: /admin/**
  // But skip public admin routes: login, signup, forgot-password
  if (pathname.startsWith("/admin")) {
    const isPublicAdminRoute =
      pathname.startsWith("/admin/login") ||
      pathname.startsWith("/admin/signup") ||
      pathname.startsWith("/admin/forgot-password");

    if (!isPublicAdminRoute) {
      const { user, supabase } = await updateSession(request);

      if (!user) {
        // Redirect to login
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }

      // Query profiles table for role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        // Redirect non-admin back to home page
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // For other requests, refresh session cookies to keep the user authenticated
  const { supabaseResponse } = await updateSession(request);
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
