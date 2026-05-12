"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Check, CreditCard, MapPin, User } from "lucide-react";
import { createOrderAction } from "@/app/actions/orders.actions";

const steps = ["Delivery", "Payment", "Review"];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "",
    paymentMethod: "razorpay",
    giftMessage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const { state, subtotal, clearCart, discount, couponCode } = useCart();
  const router = useRouter();

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone || form.phone.length < 10) e.phone = "Valid phone required";
    if (!form.address) e.address = "Required";
    if (!form.city) e.city = "Required";
    if (!form.pincode || form.pincode.length < 6) e.pincode = "Valid pincode required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    setOrderError(null);
    const result = await createOrderAction(state.items, form, {
      subtotal,
      shipping,
      discount,
      total,
    });
    if ("error" in result && result.error) {
      setOrderError(result.error as string);
      setIsPlacing(false);
      return;
    }
    clearCart();
    router.push(`/order-confirmation?order=${(result as { orderNumber: string }).orderNumber}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-2xl border-2 text-sm focus:outline-none transition-colors ${
      errors[field] ? "border-red-300 focus:border-red-400" : "border-[#FFE4C2] focus:border-[#FFB449]"
    }`;

  if (state.items.length === 0 && step === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-black text-[#1A1A1A] mb-4">Your cart is empty</h1>
        <a href="/store" className="btn-primary inline-block">Browse Gifts</a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-[#1A1A1A] mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 ${i <= step ? "text-[#FF8A00]" : "text-[#C0C0C0]"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                i < step ? "bg-[#FFB449] border-[#FFB449] text-white" :
                i === step ? "border-[#FF8A00] text-[#FF8A00]" :
                "border-[#E0E0E0] text-[#C0C0C0]"
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-sm font-semibold hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 sm:mx-4 min-w-8 ${i < step ? "bg-[#FFB449]" : "bg-[#E0E0E0]"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Forms */}
        <div className="lg:col-span-2">
          {/* Step 0 — Delivery */}
          {step === 0 && (
            <div className="bg-white rounded-3xl p-6 border border-[#FFE4C2] space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <User size={18} className="text-[#FFB449]" />
                <h2 className="font-bold text-[#1A1A1A]">Contact Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Priya" className={inputClass("firstName")} />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sharma" className={inputClass("lastName")} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="priya@email.com" className={inputClass("email")} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Phone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 99999 99999" className={inputClass("phone")} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="border-t border-[#FFE4C2] pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-[#FFB449]" />
                  <h2 className="font-bold text-[#1A1A1A]">Delivery Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Address</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="House no, Street, Area" className={inputClass("address")} />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">City</label>
                      <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className={inputClass("city")} />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Pincode</label>
                      <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" className={inputClass("pincode")} maxLength={6} />
                      {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">State</label>
                    <select name="state" value={form.state} onChange={handleChange} className={inputClass("state")}>
                      <option value="">Select state</option>
                      {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "West Bengal", "Telangana"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#FFE4C2] pt-4">
                <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Gift Message (optional)</label>
                <textarea
                  name="giftMessage"
                  value={form.giftMessage}
                  onChange={handleChange}
                  placeholder="Add a personal message to be included with the gift..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFE4C2] text-sm focus:outline-none focus:border-[#FFB449] resize-none"
                />
              </div>

              <button
                onClick={() => { if (validate()) setStep(1); }}
                className="btn-primary w-full"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-6 border border-[#FFE4C2]">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} className="text-[#FFB449]" />
                <h2 className="font-bold text-[#1A1A1A]">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: "razorpay", icon: "💳", label: "Razorpay", sub: "Credit/Debit cards, UPI, Net banking" },
                  { id: "upi", icon: "📱", label: "UPI", sub: "GPay, PhonePe, Paytm" },
                  { id: "cod", icon: "💵", label: "Cash on Delivery", sub: "Pay when you receive" },
                ].map((m) => (
                  <label key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    form.paymentMethod === m.id ? "border-[#FFB449] bg-[#FFF9EE]" : "border-[#FFE4C2] hover:border-[#FFB449]"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={form.paymentMethod === m.id}
                      onChange={handleChange}
                      className="accent-[#FFB449]"
                    />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-[#1A1A1A]">{m.label}</p>
                      <p className="text-xs text-[#6B6B6B]">{m.sub}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="btn-outline flex-1">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <div className="bg-white rounded-3xl p-6 border border-[#FFE4C2] space-y-5">
              <h2 className="font-bold text-[#1A1A1A]">Review Your Order</h2>

              <div className="bg-[#FFF9EE] rounded-2xl p-4">
                <p className="text-xs font-bold text-[#6B6B6B] uppercase mb-2">Delivering to</p>
                <p className="text-sm font-semibold">{form.firstName} {form.lastName}</p>
                <p className="text-sm text-[#6B6B6B]">{form.address}, {form.city}, {form.state} — {form.pincode}</p>
                <p className="text-sm text-[#6B6B6B]">{form.phone} · {form.email}</p>
              </div>

              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-3 py-3 border-b border-[#FFE4C2] last:border-0">
                  <div className="w-14 h-14 bg-[#FFE4C2] rounded-xl flex items-center justify-center text-2xl shrink-0">🎁</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.product.name}</p>
                    <p className="text-xs text-[#6B6B6B]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}

              {orderError && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                  {orderError}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1" disabled={isPlacing}>Back</button>
                <button onClick={handlePlaceOrder} className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isPlacing}>
                  {isPlacing ? "Placing Order…" : `Place Order · ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-3xl p-5 border border-[#FFE4C2] h-fit">
          <h3 className="font-bold text-[#1A1A1A] mb-4">Order Summary</h3>
          {state.items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm py-2 border-b border-[#FFE4C2] last:border-0">
              <span className="text-[#6B6B6B] truncate mr-2">{item.product.name} ×{item.quantity}</span>
              <span className="font-medium shrink-0">₹{(item.product.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-[#FFE4C2] space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Shipping</span>
              <span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            {couponCode && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({couponCode})</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-base pt-2 border-t border-[#FFE4C2]">
              <span>Total</span>
              <span className="text-[#FF8A00]">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
