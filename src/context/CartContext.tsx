"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { CartItem, Product } from "@/types";
import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { saveCartAction, getSavedCartAction } from "@/app/actions/cart.actions";
import { couponsService, type Coupon } from "@/lib/services/coupons.service";

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: Coupon | null;
  couponError: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity?: number; selectedVariants?: Record<string, string> } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_COUPON"; payload: Coupon | null }
  | { type: "SET_COUPON_ERROR"; payload: string | null }
  | { type: "ADD_CUSTOM_ITEM"; payload: { product: Product; customData: any } };

export const initialState: CartState = {
  items: [],
  isOpen: false,
  appliedCoupon: null,
  couponError: null,
};

export function generateCartItemId(productId: string, variants?: Record<string, string>): string {
  if (!variants || Object.keys(variants).length === 0) return productId;
  const variantStr = Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${productId}-${variantStr}`;
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1, selectedVariants } = action.payload;
      const cartItemId = generateCartItemId(product.id, selectedVariants);
      
      const existing = state.items.findIndex((i) => i.id === cartItemId);
      if (existing >= 0) {
        const updated = [...state.items];
        updated[existing] = {
          ...updated[existing],
          quantity: updated[existing].quantity + quantity,
        };
        return { ...state, items: updated, isOpen: true };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: cartItemId,
            product,
            quantity,
            selectedVariants,
          },
        ],
        isOpen: true,
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QUANTITY": {
      const { productId: cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== cartItemId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === cartItemId ? { ...i, quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_CART":
      return { ...state, items: action.payload };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "SET_COUPON":
      return { ...state, appliedCoupon: action.payload, couponError: null };
    case "SET_COUPON_ERROR":
      return { ...state, couponError: action.payload };
    case "ADD_CUSTOM_ITEM": {
      const { product, customData } = action.payload;
      const cartItemId = product.id; // BYOB items already have unique IDs generated
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: cartItemId,
            product,
            quantity: 1,
            customData,
          },
        ],
        isOpen: true,
      };
    }
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
  couponError: string | null;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  addCustomItem: (item: any) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const [loadedFromDB, setLoadedFromDB] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load persisted cart/coupon from localStorage after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const stored = localStorage.getItem("omh-cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migration: Add IDs to legacy cart items if missing
        const itemsWithIds = parsed.map((item: any) => {
          if (!item.id) {
            return {
              ...item,
              id: generateCartItemId(item.product.id, item.selectedVariants)
            };
          }
          return item;
        });

        const storedCoupon = localStorage.getItem("omh-coupon");
        const appliedCoupon = storedCoupon ? JSON.parse(storedCoupon) : null;
        dispatch({ type: "SET_CART", payload: itemsWithIds });
        if (appliedCoupon) dispatch({ type: "SET_COUPON", payload: appliedCoupon });
      } catch {
        // ignore corrupted cart data
      }
    }
    setHydrated(true);
  }, []);

  // Fetch database cart if user is already logged in at initial load
  useEffect(() => {
    if (!hydrated) return;

    const initCart = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setCurrentUserId(user.id);
        const { cart: savedCart } = await getSavedCartAction();
        if (savedCart && savedCart.length > 0) {
          dispatch({ type: "SET_CART", payload: savedCart });
        }
        setLoadedFromDB(true);
      } else {
        setCurrentUserId(null);
        setLoadedFromDB(true); // Anonymous users don't need DB load
      }
    };

    initCart();
  }, [hydrated]);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("omh-cart", JSON.stringify(state.items));
  }, [state.items, hydrated]);

  // Sync to database if logged in and cart has been successfully loaded from database
  useEffect(() => {
    if (!hydrated || !loadedFromDB || !currentUserId) return;

    const syncTimeout = setTimeout(async () => {
      await saveCartAction(state.items);
    }, 1000); // Debounce sync by 1 second

    return () => clearTimeout(syncTimeout);
  }, [state.items, hydrated, loadedFromDB, currentUserId]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.appliedCoupon) {
      localStorage.setItem("omh-coupon", JSON.stringify(state.appliedCoupon));
    } else {
      localStorage.removeItem("omh-coupon");
    }
  }, [state.appliedCoupon, hydrated]);

  // Handle Login/Logout Cart Sync
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setCurrentUserId(session.user.id);
        const { cart: savedCart } = await getSavedCartAction();
        if (savedCart) {
          dispatch({ type: "SET_CART", payload: savedCart });
        }
        setLoadedFromDB(true);
      } else if (event === "SIGNED_OUT") {
        setCurrentUserId(null);
        setLoadedFromDB(false);
        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem("omh-cart");
        dispatch({ type: "SET_COUPON", payload: null });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const totalItems = state.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
  const subtotal = state.items.reduce((acc: number, item: CartItem) => acc + (item.product?.price || 0) * item.quantity, 0);

  const discount = state.appliedCoupon 
    ? couponsService.calculateDiscount(state.appliedCoupon, subtotal) 
    : 0;

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
        couponCode: state.appliedCoupon?.code || null,
        couponError: state.couponError,
        applyCoupon: async (code) => {
          const { coupon, error } = await couponsService.validateCoupon(code, subtotal);
          if (error) {
            dispatch({ type: "SET_COUPON_ERROR", payload: error });
          } else if (coupon) {
            dispatch({ type: "SET_COUPON", payload: coupon });
          }
        },
        removeCoupon: () => dispatch({ type: "SET_COUPON", payload: null }),
        addCustomItem: (customItem) => {
          const virtualProduct: Product = {
            id: `byob-${Date.now()}`,
            name: "Custom Hamper",
            slug: `custom-hamper-${Date.now()}`,
            price: (customItem.box?.price || 0) + customItem.items.reduce((acc: number, i: any) => acc + i.price, 0),
            images: [customItem.box?.image || ""],
            category: "custom",
            occasion: [],
            description: "Customized gift hamper built via BYOB builder.",
            shortDescription: "Customized gift hamper",
            customizable: true,
            inStock: true,
            stockQuantity: 1,
            lowStockThreshold: 0,
            rating: 5,
            reviewCount: 0,
            tags: ["byob"],
            isBestseller: false,
            isFeatured: false,
            isNew: true,
          };
          dispatch({ 
            type: "ADD_CUSTOM_ITEM", 
            payload: { 
              product: virtualProduct, 
              customData: {
                type: "byob",
                box: customItem.box,
                items: customItem.items,
                message: customItem.message,
                card: customItem.card,
              }
            } 
          });
        },
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
