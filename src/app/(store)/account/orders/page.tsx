import { createClient } from "@/lib/supabase/server";
import { getOrdersByProfile } from "@/lib/services/orders.service";
import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  confirmed:   "bg-blue-50 text-blue-700",
  processing:  "bg-yellow-50 text-yellow-700",
  shipped:     "bg-purple-50 text-purple-700",
  delivered:   "bg-green-50 text-green-700",
  cancelled:   "bg-red-50 text-red-700",
  refunded:    "bg-gray-100 text-gray-600",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let orders: Awaited<ReturnType<typeof getOrdersByProfile>> = [];
  try {
    orders = user ? await getOrdersByProfile(user.id) : [];
  } catch {
    orders = [];
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#FFE4C2] p-12 text-center">
        <ShoppingBag size={48} className="text-[#FFE4C2] mx-auto mb-4" />
        <h2 className="text-xl font-black text-[#1A1A1A] mb-2">No orders yet</h2>
        <p className="text-[#6B6B6B] mb-6 text-sm">When you place an order, it will appear here.</p>
        <Link href="/store" className="btn-primary inline-block text-sm">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1A1A1A] mb-6">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block bg-white rounded-3xl border border-[#FFE4C2] p-5 hover:border-[#FFB449] hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF9EE] flex items-center justify-center shrink-0">
                  <Package size={18} className="text-[#FFB449]" />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A] text-sm">#{order.order_number}</p>
                  <p className="text-xs text-[#6B6B6B]">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
                <span className="font-black text-[#FF8A00] text-sm shrink-0">
                  ₹{Number(order.total).toLocaleString()}
                </span>
                <ChevronRight size={16} className="text-[#C4C4C4] group-hover:text-[#FFB449] shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
