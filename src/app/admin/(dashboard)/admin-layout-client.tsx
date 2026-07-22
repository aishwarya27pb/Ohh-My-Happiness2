"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth.actions";
import { LayoutDashboard, ShoppingBag, Users, MessageSquare, LogOut, Shield, Gift, Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Gift },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/leads", label: "Custom Requests", icon: MessageSquare },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[#1A1A1A] flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FFB449] flex items-center justify-center shadow-lg shadow-[#FFB449]/20">
            <Shield size={14} className="text-white" />
          </div>
          <p className="text-white font-black text-sm leading-tight">OMH Admin</p>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 -mr-2 text-white/70 hover:text-white"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-60 bg-[#1A1A1A] flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFB449] flex items-center justify-center shadow-lg shadow-[#FFB449]/20">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">OMH Admin</p>
              <p className="text-white/30 text-xs tracking-tight">CRM Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="lg:hidden p-1 text-white/50 hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
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
      <main className="flex-1 min-w-0 lg:ml-60 min-h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

