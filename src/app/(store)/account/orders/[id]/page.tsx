import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/services/orders.service";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft, MapPin, CreditCard } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  confirmed:   "bg-blue-50 text-blue-700 border-blue-200",
  processing:  "bg-yellow-50 text-yellow-700 border-yellow-200",
  shipped:     "bg-purple-50 text-purple-700 border-purple-200",
  delivered:   "bg-green-50 text-green-700 border-green-200",
  cancelled:   "bg-red-50 text-red-700 border-red-200",
  refunded:    "bg-gray-100 text-gray-600 border-gray-200",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/account/orders");

  const order = await getOrderById(id);
  if (!order || order.profile_id !== user.id) notFound();

  const address = order.shipping_address as Record<string, string>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account/orders" className="p-2 rounded-full hover:bg-[#FFE4C2] transition-colors">
          <ArrowLeft size={18} className="text-[#1A1A1A]" />
        </Link>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Order #{order.order_number}</h1>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Items */}
        <div className="bg-white rounded-3xl border border-[#FFE4C2] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-[#FFB449]" />
            <h2 className="font-bold text-[#1A1A1A] text-sm">Order Items</h2>
          </div>
          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b border-[#FFE4C2] last:border-0">
                <div className="w-12 h-12 bg-[#FFE4C2] rounded-xl flex items-center justify-center text-xl shrink-0">🎁</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[#1A1A1A]">{item.product_name}</p>
                  <p className="text-xs text-[#6B6B6B]">Qty: {item.quantity} × ₹{Number(item.product_price).toLocaleString()}</p>
                </div>
                <p className="font-bold text-sm text-[#1A1A1A]">₹{Number(item.line_total).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[#FFE4C2] space-y-1.5 text-sm">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toLocaleString()}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−₹{Number(order.discount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Shipping</span>
              <span>{Number(order.shipping) === 0 ? "FREE" : `₹${Number(order.shipping).toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-black text-base pt-1 border-t border-[#FFE4C2]">
              <span>Total</span>
              <span className="text-[#FF8A00]">₹{Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Shipping address */}
          <div className="bg-white rounded-3xl border border-[#FFE4C2] p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-[#FFB449]" />
              <h2 className="font-bold text-[#1A1A1A] text-sm">Shipping Address</h2>
            </div>
            <div className="text-sm text-[#6B6B6B] space-y-0.5">
              <p className="font-semibold text-[#1A1A1A]">{address.firstName} {address.lastName}</p>
              <p>{address.address}</p>
              <p>{address.city}, {address.state} — {address.pincode}</p>
              <p className="mt-1">{address.phone}</p>
              <p>{address.email}</p>
            </div>
          </div>

          {/* Payment & dates */}
          <div className="bg-white rounded-3xl border border-[#FFE4C2] p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-[#FFB449]" />
              <h2 className="font-bold text-[#1A1A1A] text-sm">Payment</h2>
            </div>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Method</span>
                <span className="font-semibold capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Status</span>
                <span className="font-semibold capitalize">{order.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Ordered</span>
                <span className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {order.gift_message && (
          <div className="bg-[#FFF9EE] rounded-3xl border border-[#FFE4C2] p-5">
            <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-widest mb-2">Gift Message</p>
            <p className="text-sm text-[#1A1A1A] italic">&ldquo;{order.gift_message}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
