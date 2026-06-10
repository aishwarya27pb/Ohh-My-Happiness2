import { getOrdersAction } from "@/app/actions/admin/orders.actions";
import Link from "next/link";
import { ChevronRight, Filter, Download, ShoppingBag } from "lucide-react";
import StatsCards from "@/components/admin/analytics/StatsCards";
import RevenueChart from "@/components/admin/analytics/RevenueChart";
import StatusPieChart from "@/components/admin/analytics/StatusPieChart";

const STATUS_STYLES: Record<string, string> = {
  confirmed:   "bg-blue-50 text-blue-700",
  processing:  "bg-yellow-50 text-yellow-700",
  shipped:     "bg-purple-50 text-purple-700",
  delivered:   "bg-green-50 text-green-700",
  cancelled:   "bg-red-50 text-red-700",
  refunded:    "bg-gray-100 text-gray-600",
  returned:    "bg-orange-50 text-orange-700",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed:   "#3B82F6",
  processing:  "#F59E0B",
  shipped:     "#A855F7",
  delivered:   "#10B981",
  cancelled:   "#EF4444",
  refunded:    "#6B7280",
  returned:    "#F97316",
};

export default async function AdminOrdersPage() {
  const { orders = [] } = await getOrdersAction();

  // 1. Calculate Stats
  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const returnedOrders = orders.filter(o => o.status === 'returned' || o.status === 'refunded').length;
  const returnRate = orders.length > 0 ? Math.round((returnedOrders / orders.length) * 100) : 0;

  // 2. Prepare Chart Data (Revenue last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const revenueData = last7Days.map(date => ({
    date,
    amount: orders
      .filter(o => o.created_at.startsWith(date))
      .reduce((acc, o) => acc + Number(o.total), 0)
  }));

  // 3. Prepare Status Distribution
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCounts).map(status => ({
    status,
    count: statusCounts[status],
    color: STATUS_COLORS[status] || "#E5E5E5"
  }));

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Order Management</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Monitor sales performance and logistics</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#1A1A1A] hover:border-[#FFB449] transition-all">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-[#FF8A00] transition-all shadow-lg shadow-[#1A1A1A]/10">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards 
        totalOrders={orders.length}
        totalRevenue={totalRevenue}
        avgOrderValue={avgOrderValue}
        returnRate={returnRate}
      />

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <StatusPieChart data={statusData} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[32px] border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F0F0F0] flex items-center justify-between">
          <h3 className="font-black text-[#1A1A1A] text-sm uppercase tracking-widest">Recent Transactions</h3>
          <span className="text-[10px] font-bold text-[#6B6B6B] bg-[#F0F0F0] px-2 py-1 rounded-lg">LIVE UPDATES</span>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#F0F0F0] text-[10px] text-[#6B6B6B] uppercase font-black tracking-widest">
              <th className="text-left px-6 py-4">Order ID</th>
              <th className="text-left px-6 py-4">Customer</th>
              <th className="text-left px-6 py-4">Date</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-right px-6 py-4">Total</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ShoppingBag size={40} className="text-[#E5E5E5]" />
                    <p className="text-[#6B6B6B] font-medium">No orders found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FFF9EE]/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-bold text-[#1A1A1A]">#{order.order_number}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1A1A1A]">{order.contact_name}</span>
                      <span className="text-[10px] text-[#6B6B6B]">{order.contact_email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[#6B6B6B] text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="font-black text-[#FF8A00]">₹{Number(order.total).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5">
                    <Link href={`/admin/orders/${order.id}`} className="flex items-center justify-end text-[#C4C4C4] group-hover:text-[#FFB449] transition-colors">
                      <ChevronRight size={20} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
