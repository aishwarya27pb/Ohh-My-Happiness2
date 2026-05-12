"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { state, updateQuantity, removeItem, subtotal, discount, couponCode, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const VALID_COUPON = "HAPPY10";
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === VALID_COUPON) {
      applyCoupon(couponInput);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code.");
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-black text-[#1A1A1A] mb-3">Your cart is empty</h1>
        <p className="text-[#6B6B6B] mb-8">Add some amazing gifts to your cart and spread the happiness!</p>
        <Link href="/store" className="btn-primary inline-flex items-center gap-2">
          Browse Gifts <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-[#1A1A1A] mb-8">
        Your Cart <span className="text-[#6B6B6B] text-lg font-normal">({state.items.length} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <div key={item.product.id} className="bg-white rounded-3xl p-5 border border-[#FFE4C2] flex gap-4">
              <div className="w-24 h-24 bg-[#FFE4C2] rounded-2xl flex items-center justify-center text-4xl shrink-0">
                🎁
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/store/${item.product.slug}`} className="font-bold text-[#1A1A1A] hover:text-[#FF8A00] transition-colors text-sm">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 capitalize">{item.product.category.replace(/-/g, " ")}</p>
                    {item.product.customizable && (
                      <p className="text-xs text-[#FF8A00] font-medium mt-1">✨ Customizable</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 hover:bg-red-50 rounded-full text-[#6B6B6B] hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-[#FFF9EE] rounded-full px-3 py-1.5 border border-[#FFE4C2]">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="hover:text-[#FF8A00]">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="hover:text-[#FF8A00]">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-black text-[#1A1A1A]">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}

          <Link href="/store" className="inline-flex items-center gap-2 text-sm text-[#FF8A00] font-bold hover:underline mt-2">
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white rounded-3xl p-5 border border-[#FFE4C2]">
            <h3 className="font-bold text-sm text-[#1A1A1A] mb-3 flex items-center gap-2">
              <Tag size={16} className="text-[#FFB449]" /> Apply Coupon
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                className="flex-1 px-3 py-2 rounded-xl border-2 border-[#FFE4C2] text-sm focus:outline-none focus:border-[#FFB449] min-w-0"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-[#FFB449] text-[#1A1A1A] font-bold text-sm px-4 py-2 rounded-xl hover:bg-[#FF8A00] hover:text-white transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
            {couponCode && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-green-600 font-medium">✓ Coupon applied! 10% off</p>
                <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
            <p className="text-xs text-[#6B6B6B] mt-2">Try: <span className="font-bold text-[#FF8A00]">HAPPY10</span></p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl p-5 border border-[#FFE4C2]">
            <h3 className="font-bold text-[#1A1A1A] mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {subtotal < 999 && (
                <p className="text-xs text-[#FF8A00] bg-[#FFE4C2] px-3 py-2 rounded-xl">
                  Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
                </p>
              )}
              <div className="border-t border-[#FFE4C2] pt-3 flex justify-between font-black text-lg">
                <span>Total</span>
                <span className="text-[#FF8A00]">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center block mt-5 text-sm">
              Proceed to Checkout <ArrowRight size={16} className="inline-block ml-1" />
            </Link>

            <div className="flex items-center justify-center gap-3 mt-4">
              {["visa", "mastercard", "upi"].map((p) => (
                <div key={p} className="bg-[#FFF9EE] rounded px-2 py-1 text-xs text-[#6B6B6B] uppercase tracking-wide border border-[#FFE4C2]">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
