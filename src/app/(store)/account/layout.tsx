import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Package, User, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "@/app/actions/auth.actions";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/account");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single()) as { data: { first_name: string | null; last_name: string | null } | null; error: unknown };

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
    : user.email ?? "Account";

  const initial = (profile?.first_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase();

  const navItems = [
    { href: "/account/orders", label: "My Orders", icon: Package },
    { href: "/account/profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-[#FFE4C2] overflow-hidden">
            {/* User card */}
            <div className="p-5 border-b border-[#FFE4C2] bg-gradient-to-br from-[#FFF9EE] to-[#FFE4C2]">
              <div className="w-12 h-12 rounded-full bg-[#FFB449] flex items-center justify-center mb-3">
                <span className="text-white font-black text-lg">{initial}</span>
              </div>
              <p className="font-bold text-[#1A1A1A] truncate">{displayName}</p>
              <p className="text-xs text-[#6B6B6B] truncate">{user.email}</p>
            </div>

            {/* Nav links */}
            <nav className="p-2">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-[#1A1A1A] hover:bg-[#FFF9EE] hover:text-[#FF8A00] transition-colors group"
                >
                  <Icon size={16} className="text-[#6B6B6B] group-hover:text-[#FF8A00]" />
                  {label}
                  <ChevronRight size={14} className="ml-auto text-[#C4C4C4] group-hover:text-[#FFB449]" />
                </Link>
              ))}
              <div className="border-t border-[#FFE4C2] mt-2 pt-2">
                <form action={signOut.bind(null, false)}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
