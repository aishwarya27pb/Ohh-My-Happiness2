import { getCustomerAction } from "@/app/actions/admin/customers.actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { CustomerActionButtons } from "./CustomerActionButtons";

const STATUS_STYLES: Record<string, string> = {
  confirmed:   "bg-blue-50 text-blue-700",
  processing:  "bg-yellow-50 text-yellow-700",
  shipped:     "bg-purple-50 text-purple-700",
  delivered:   "bg-green-50 text-green-700",
  cancelled:   "bg-red-50 text-red-700",
  refunded:    "bg-gray-100 text-gray-600",
};

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile, orders } = await getCustomerAction(id);

  if (!profile) notFound();

  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Unknown";
  const initial = (profile.first_name?.[0] ?? profile.phone?.[0] ?? "?").toUpperCase();
  const totalSpend = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/customers" className="p-2 rounded-full hover:bg-[#F0F0F0] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-black text-[#1A1A1A]">{name}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFB449] text-white text-2xl font-black flex items-center justify-center mx-auto mb-3">
              {initial}
            </div>
            <p className="font-bold text-[#1A1A1A] text-lg">{name}</p>
            <p className="text-sm text-[#6B6B6B] mt-1">{profile.phone ?? "No phone"}</p>
            <p className="text-xs text-[#C4C4C4] mt-0.5 capitalize">{profile.role}</p>
            <CustomerActionButtons profile={profile} />
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 text-sm space-y-3">
            <p className="font-bold text-[#1A1A1A]">Stats</p>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Total Orders</span>
              <span className="font-semibold text-[#1A1A1A]">{orders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Total Spend</span>
              <span className="font-bold text-[#FF8A00]">₹{totalSpend.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Joined</span>
              <span className="text-[#6B6B6B]">
                {new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* Order history */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-[#F0F0F0]">
              <ShoppingBag size={16} className="text-[#FFB449]" />
              <h2 className="font-bold text-[#1A1A1A] text-sm">Order History</h2>
            </div>
            {orders.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-[#6B6B6B]">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F0F0F0] text-xs text-[#6B6B6B] uppercase tracking-widest">
                    <th className="text-left px-5 py-3 font-semibold">Order</th>
                    <th className="text-left px-5 py-3 font-semibold">Date</th>
                    <th className="text-left px-5 py-3 font-semibold">Status</th>
                    <th className="text-right px-5 py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/orders/${order.id}`} className="font-bold text-[#1A1A1A] hover:text-[#FF8A00]">
                          #{order.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B6B6B]">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-[#FF8A00]">
                        ₹{Number(order.total).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
