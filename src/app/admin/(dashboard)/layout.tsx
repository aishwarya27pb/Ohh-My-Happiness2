"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth.actions";
import { LayoutDashboard, ShoppingBag, Users, MessageSquare, LogOut, Shield, Gift } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Gift },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1A1A1A] flex flex-col fixed inset-y-0 left-0 z-50">
        {/* Brand */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFB449] flex items-center justify-center shadow-lg shadow-[#FFB449]/20">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">OMH Admin</p>
              <p className="text-white/30 text-xs tracking-tight">CRM Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                  isActive 
                    ? "bg-white text-[#1A1A1A] shadow-lg shadow-white/5 translate-x-1" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? "text-[#FF8A00]" : "group-hover:text-white"} />
                  {label}
                </div>
                {isActive && <div className="w-1 h-1 rounded-full bg-[#FF8A00]" />}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => signOut(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/30 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}

