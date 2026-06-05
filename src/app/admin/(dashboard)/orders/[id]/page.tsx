"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Printer, RotateCcw, Truck, ShieldCheck } from "lucide-react";
import { getOrderAction, updateOrderStatusAction } from "@/app/actions/admin/orders.actions";
import type { OrderWithItems, OrderStatus } from "@/lib/supabase/types";

const STATUSES: OrderStatus[] = ["confirmed", "processing", "shipped", "delivered", "cancelled", "refunded", "returned"];

const STATUS_STYLES: Record<string, string> = {
  confirmed:   "bg-blue-50 text-blue-700",
  processing:  "bg-yellow-50 text-yellow-700",
  shipped:     "bg-purple-50 text-purple-700",
  delivered:   "bg-green-50 text-green-700",
  cancelled:   "bg-red-50 text-red-700",
  refunded:    "bg-gray-100 text-gray-600",
  returned:    "bg-orange-50 text-orange-700",
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
      <div className="p-8 text-[#6B6B6B] flex items-center gap-2">
        <RotateCcw className="animate-spin" size={16} /> Loading order details...
      </div>
    );
  }

  const address = order.shipping_address as Record<string, string>;

  async function handleStatusChange(status: OrderStatus) {
    setUpdating(true);
    setMessage(null);
    await updateOrderStatusAction(order!.id, status);
    setOrder((o) => o ? { ...o, status } : o);
    setMessage(`Order status updated to ${status}.`);
    setUpdating(false);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #shipping-label, #shipping-label * { visibility: visible; }
          #shipping-label { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 40px;
            border: 2px solid #000;
            background: #fff;
          }
          nav, footer, button, .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-8 no-print">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2.5 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#FFB449] transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#1A1A1A]">Order #{order.order_number}</h1>
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status] ?? "bg-gray-100"}`}>
                {order.status}
              </span>
            </div>
            <p className="text-[#6B6B6B] text-xs mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl text-xs font-bold hover:bg-[#FF8A00] transition-all shadow-lg shadow-[#1A1A1A]/10"
          >
            <Printer size={16} /> Print Shipping Label
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 px-4 py-3 rounded-2xl bg-green-50 border border-green-100 text-green-700 text-xs font-bold animate-fade-in">
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status update */}
          <div className="bg-white rounded-[32px] border border-[#E5E5E5] p-6 no-print shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Truck size={16} className="text-[#FFB449]" />
              <h2 className="font-black text-[#1A1A1A] text-xs uppercase tracking-widest">Update Logistics Status</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || order.status === s}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
                    order.status === s
                      ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                      : "bg-white border-[#F0F0F0] text-[#6B6B6B] hover:border-[#FFB449] hover:text-[#FF8A00]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-[32px] border border-[#E5E5E5] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Package size={16} className="text-[#FFB449]" />
              <h2 className="font-black text-[#1A1A1A] text-xs uppercase tracking-widest">Ordered Items</h2>
            </div>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#F0F0F0] last:border-0">
                  <div className="w-14 h-14 bg-[#FFF9EE] rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-[#FFE4C2]">🎁</div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1A1A1A] text-sm">{item.product_name}</p>
                    <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-black text-[#1A1A1A]">₹{Number(item.line_total).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-[#F0F0F0] space-y-2">
              <div className="flex justify-between text-[#6B6B6B] text-xs font-bold uppercase tracking-widest">
                <span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B] text-xs font-bold uppercase tracking-widest">
                <span>Shipping</span><span>{Number(order.shipping) === 0 ? "FREE" : `₹${Number(order.shipping)}`}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600 text-xs font-bold uppercase tracking-widest">
                  <span>Discount Applied</span><span>−₹{Number(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-black pt-4 border-t-2 border-[#F0F0F0] text-lg">
                <span className="text-[#1A1A1A]">Grand Total</span><span className="text-[#FF8A00]">₹{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side info */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-[#E5E5E5] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-[#FFB449]" />
              <h2 className="font-black text-[#1A1A1A] text-xs uppercase tracking-widest">Customer Details</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest">Full Name</p>
                <p className="font-bold text-[#1A1A1A]">{order.contact_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest">Email Address</p>
                <p className="font-bold text-[#1A1A1A]">{order.contact_email}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest">Phone Number</p>
                <p className="font-bold text-[#1A1A1A]">{order.contact_phone}</p>
              </div>
            </div>
          </div>

          <div id="shipping-label" className="bg-white rounded-[32px] border-2 border-dashed border-[#FFB449] p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFB449]/10 rounded-bl-full -mr-10 -mt-10" />
            <div className="flex items-center gap-2 mb-4">
              <Truck size={16} className="text-[#FFB449]" />
              <h2 className="font-black text-[#1A1A1A] text-xs uppercase tracking-widest">Shipping Label</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#FFF9EE] rounded-2xl border border-[#FFE4C2]">
                <p className="font-black text-[#1A1A1A] text-base mb-1">{order.contact_name}</p>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{address.address}</p>
                <p className="text-xs font-black text-[#1A1A1A] mt-1">{address.city}, {address.state} — {address.pincode}</p>
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-[#6B6B6B] uppercase tracking-[0.2em]">Order Number</span>
                  <span className="text-xs font-black text-[#1A1A1A]">#{order.order_number}</span>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" /> {/* Placeholder for barcode */}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-[#E5E5E5] p-6 shadow-sm">
            <h2 className="font-black text-[#1A1A1A] text-xs uppercase tracking-widest mb-4">Payment & Offer</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest">Method</span>
                <span className="text-xs font-bold text-[#1A1A1A] capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest">Status</span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${order.payment_status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                  {order.payment_status}
                </span>
              </div>
              {order.coupon_code && (
                <div className="flex justify-between items-center pt-2 border-t border-[#F0F0F0]">
                  <span className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest">Coupon</span>
                  <span className="text-xs font-black text-green-600 uppercase">{order.coupon_code}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

