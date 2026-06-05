import { getDashboardMetrics } from "@/app/actions/admin/analytics.actions";
import Link from "next/link";
import { ShoppingBag, Users, MessageSquare, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics();

  const stats = [
    { label: "This Month Revenue", value: `₹${Number(metrics.monthRevenue).toLocaleString()}`, sub: `${metrics.monthOrders} orders`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Total Revenue", value: `₹${Number(metrics.totalRevenue).toLocaleString()}`, sub: `${metrics.totalOrders} total orders`, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "New Customers", value: String(metrics.newCustomers), sub: "this month", icon: Users, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1A1A1A]">Dashboard</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Welcome back to Ohh My Happiness CRM.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E5E5E5]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-black text-[#1A1A1A]">{s.value}</p>
            <p className="text-xs text-[#6B6B6B] mt-0.5">{s.label}</p>
            <p className="text-xs text-[#C4C4C4] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-1 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-[32px] border border-[#E5E5E5] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[#F0F0F0]">
            <h2 className="font-black text-[#1A1A1A] text-sm uppercase tracking-widest">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#FF8A00] font-black hover:underline uppercase tracking-widest">View all</Link>
          </div>
          <div className="divide-y divide-[#F0F0F0]">
            {metrics.recentOrders.length === 0 ? (
              <p className="p-10 text-center text-sm text-[#6B6B6B]">No orders yet.</p>
            ) : (
              metrics.recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between px-6 py-5 hover:bg-[#FFF9EE]/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FFF9EE] rounded-2xl flex items-center justify-center text-xl border border-[#FFE4C2]">🎁</div>
                    <div>
                      <p className="text-sm font-black text-[#1A1A1A]">#{order.order_number}</p>
                      <p className="text-xs text-[#6B6B6B] font-bold">{order.contact_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-[#FF8A00]">₹{Number(order.total).toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#6B6B6B] mt-1">{order.status}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

