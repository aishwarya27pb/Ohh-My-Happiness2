import { getOrdersAction } from "@/app/actions/admin/orders.actions";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  confirmed:   "bg-blue-50 text-blue-700",
  processing:  "bg-yellow-50 text-yellow-700",
  shipped:     "bg-purple-50 text-purple-700",
  delivered:   "bg-green-50 text-green-700",
  cancelled:   "bg-red-50 text-red-700",
  refunded:    "bg-gray-100 text-gray-600",
};

export default async function AdminOrdersPage() {
  const { orders } = await getOrdersAction();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1A1A1A]">Orders</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{orders?.length ?? 0} total orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F0F0F0] text-xs text-[#6B6B6B] uppercase tracking-widest">
              <th className="text-left px-5 py-3.5 font-semibold">Order</th>
              <th className="text-left px-5 py-3.5 font-semibold">Customer</th>
              <th className="text-left px-5 py-3.5 font-semibold">Date</th>
              <th className="text-left px-5 py-3.5 font-semibold">Status</th>
              <th className="text-right px-5 py-3.5 font-semibold">Total</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0]">
            {(!orders || orders.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[#6B6B6B]">No orders yet.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 font-bold text-[#1A1A1A]">#{order.order_number}</td>
                  <td className="px-5 py-4 text-[#6B6B6B]">{order.contact_name}</td>
                  <td className="px-5 py-4 text-[#6B6B6B]">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-[#FF8A00]">
                    ₹{Number(order.total).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="flex items-center justify-end text-[#C4C4C4] hover:text-[#FFB449]">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
