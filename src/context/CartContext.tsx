"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { CartItem, Product } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity?: number; selectedVariants?: Record<string, string> } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "REMOVE_COUPON" };

const initialState: CartState = {
  items: [],
  isOpen: false,
  couponCode: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.findIndex((i) => i.product.id === action.payload.product.id);
      if (existing >= 0) {
        const updated = [...state.items];
        updated[existing] = {
          ...updated[existing],
          quantity: updated[existing].quantity + (action.payload.quantity || 1),
        };
        return { ...state, items: updated, isOpen: true };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.payload.product,
            quantity: action.payload.quantity || 1,
            selectedVariants: action.payload.selectedVariants,
          },
        ],
        isOpen: true,
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.payload) };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.payload.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "APPLY_COUPON":
      return { ...state, couponCode: action.payload };
    case "REMOVE_COUPON":
      return { ...state, couponCode: null };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("omh-cart");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const storedCoupon = localStorage.getItem("omh-coupon");
          return { ...initialState, items: parsed, couponCode: storedCoupon };
        } catch {
          return initialState;
        }
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem("omh-cart", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (state.couponCode) {
      localStorage.setItem("omh-coupon", state.couponCode);
    } else {
      localStorage.removeItem("omh-coupon");
    }
  }, [state.couponCode]);

  // Clear cart when the signed-in user changes (sign out, or different user)
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const newUserId = session?.user?.id ?? null;
      const storedUserId = localStorage.getItem("omh-cart-owner") ?? null;

      if (newUserId !== storedUserId) {
        // User changed — clear cart and update the owner tag
        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem("omh-cart");
        if (newUserId) {
          localStorage.setItem("omh-cart-owner", newUserId);
        } else {
          localStorage.removeItem("omh-cart-owner");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const totalItems = state.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
  const subtotal = state.items.reduce((acc: number, item: CartItem) => acc + item.product.price * item.quantity, 0);

  // For now, hardcode the logic for "HAPPY10"
  const discount = state.couponCode?.toUpperCase() === "HAPPY10" ? Math.round(subtotal * 0.1) : 0;

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (product, quantity, variants) =>
          dispatch({ type: "ADD_ITEM", payload: { product, quantity, selectedVariants: variants } }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQuantity: (id, qty) => dispatch({ type: "UPDATE_QUANTITY", payload: { productId: id, quantity: qty } }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
        openCart: () => dispatch({ type: "OPEN_CART" }),
        closeCart: () => dispatch({ type: "CLOSE_CART" }),
        totalItems,
        subtotal,
        discount,
        couponCode: state.couponCode,
        applyCoupon: (code) => dispatch({ type: "APPLY_COUPON", payload: code }),
        removeCoupon: () => dispatch({ type: "REMOVE_COUPON" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
