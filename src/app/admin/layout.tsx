import Link from "next/link";
import { signOut } from "@/app/actions/auth.actions";
import { LayoutDashboard, ShoppingBag, Users, MessageSquare, LogOut, Shield } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1A1A1A] flex flex-col fixed inset-y-0 left-0 z-50">
        {/* Brand */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFB449] flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">OMH Admin</p>
              <p className="text-white/30 text-xs">CRM Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/10">
          <form action={signOut.bind(null, true)}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
