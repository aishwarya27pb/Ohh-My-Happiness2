"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { getOrderAction, updateOrderStatusAction } from "@/app/actions/admin/orders.actions";
import type { OrderWithItems, OrderStatus } from "@/lib/supabase/types";

const STATUSES: OrderStatus[] = ["confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

const STATUS_STYLES: Record<string, string> = {
  confirmed:   "bg-blue-50 text-blue-700",
  processing:  "bg-yellow-50 text-yellow-700",
  shipped:     "bg-purple-50 text-purple-700",
  delivered:   "bg-green-50 text-green-700",
  cancelled:   "bg-red-50 text-red-700",
  refunded:    "bg-gray-100 text-gray-600",
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getOrderAction(id).then(({ order: o }) => setOrder(o ?? null));
  }, [id]);

  if (!order) {
    return (
      <div className="p-8 text-[#6B6B6B]">Loading…</div>
    );
  }

  const address = order.shipping_address as Record<string, string>;

  async function handleStatusChange(status: OrderStatus) {
    setUpdating(true);
    setMessage(null);
    await updateOrderStatusAction(order!.id, status);
    setOrder((o) => o ? { ...o, status } : o);
    setMessage("Status updated.");
    setUpdating(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="p-2 rounded-full hover:bg-[#F0F0F0] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Order #{order.order_number}</h1>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100"}`}>
          {order.status}
        </span>
      </div>

      {message && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm">
          {message}
        </div>
      )}

      {/* Status update */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-5">
        <h2 className="font-bold text-[#1A1A1A] mb-3 text-sm">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={updating || order.status === s}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed border ${
                order.status === s
                  ? "bg-[#FFB449] border-[#FFB449] text-white"
                  : "bg-white border-[#E5E5E5] text-[#6B6B6B] hover:border-[#FFB449] hover:text-[#FF8A00]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-[#FFB449]" />
            <h2 className="font-bold text-[#1A1A1A] text-sm">Items</h2>
          </div>
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3 border-b border-[#F0F0F0] last:border-0">
              <div className="w-10 h-10 bg-[#FFF9EE] rounded-xl flex items-center justify-center text-lg shrink-0">🎁</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.product_name}</p>
                <p className="text-xs text-[#6B6B6B]">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-sm">₹{Number(item.line_total).toLocaleString()}</p>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-[#F0F0F0] space-y-1 text-sm">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Shipping</span><span>{Number(order.shipping) === 0 ? "FREE" : `₹${Number(order.shipping)}`}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>−₹{Number(order.discount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-black pt-1 border-t border-[#F0F0F0]">
              <span>Total</span><span className="text-[#FF8A00]">₹{Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Side info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 text-sm">
            <p className="font-bold text-[#1A1A1A] mb-3">Customer</p>
            <p className="text-[#6B6B6B]">{order.contact_name}</p>
            <p className="text-[#6B6B6B]">{order.contact_email}</p>
            <p className="text-[#6B6B6B]">{order.contact_phone}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 text-sm">
            <p className="font-bold text-[#1A1A1A] mb-3">Shipping Address</p>
            <p className="text-[#6B6B6B]">{address.address}</p>
            <p className="text-[#6B6B6B]">{address.city}, {address.state}</p>
            <p className="text-[#6B6B6B]">{address.pincode}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 text-sm">
            <p className="font-bold text-[#1A1A1A] mb-3">Payment</p>
            <p className="capitalize text-[#6B6B6B]">{order.payment_method}</p>
            <p className="capitalize text-[#6B6B6B]">Status: {order.payment_status}</p>
            {order.coupon_code && <p className="text-green-600">Coupon: {order.coupon_code}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
