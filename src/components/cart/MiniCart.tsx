"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";

export default function MiniCart() {
  const { state, closeCart, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#FFF9EE] z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFE4C2] bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#FF8A00]" />
            <span className="font-bold text-lg">Your Cart</span>
            {state.items.length > 0 && (
              <span className="bg-[#FFB449] text-[#1A1A1A] text-xs font-bold px-2 py-0.5 rounded-full">
                {state.items.length}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-[#FFE4C2] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag size={48} className="text-[#FFE4C2] mb-4" />
              <p className="font-semibold text-[#1A1A1A] mb-1">Your cart is empty</p>
              <p className="text-sm text-[#6B6B6B] mb-4">Add some happiness to your cart!</p>
              <button onClick={closeCart} className="btn-primary text-sm py-2 px-6">
                Start Shopping
              </button>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={item.product.id} className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm">
                {/* Image placeholder */}
                <div className="w-16 h-16 bg-[#FFE4C2] rounded-xl flex items-center justify-center shrink-0 text-2xl">
                  🎁
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1A1A1A] leading-tight mb-1 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[#FF8A00] font-bold text-sm">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-[#FFF9EE] rounded-full border border-[#FFE4C2]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-[#FFE4C2] rounded-full transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-[#FFE4C2] rounded-full transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 hover:bg-red-50 rounded-full text-[#6B6B6B] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="px-4 py-4 border-t border-[#FFE4C2] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#6B6B6B] text-sm">Subtotal</span>
              <span className="font-black text-lg text-[#1A1A1A]">₹{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-[#6B6B6B] text-center">Shipping & taxes calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block text-sm"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-outline w-full text-center block text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
