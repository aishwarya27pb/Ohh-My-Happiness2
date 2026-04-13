"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "ADD"; payload: Product }
  | { type: "REMOVE"; payload: string }
  | { type: "CLEAR" };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD":
      if (state.items.find((i) => i.id === action.payload.id)) return state;
      return { items: [...state.items, action.payload] };
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  toggle: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] }, () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("omh-wishlist");
      if (stored) {
        try {
          return { items: JSON.parse(stored) };
        } catch {
          return { items: [] };
        }
      }
    }
    return { items: [] };
  });

  useEffect(() => {
    localStorage.setItem("omh-wishlist", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addItem: (p) => dispatch({ type: "ADD", payload: p }),
        removeItem: (id) => dispatch({ type: "REMOVE", payload: id }),
        toggle: (p) => {
          if (state.items.find((i: Product) => i.id === p.id)) {
            dispatch({ type: "REMOVE", payload: p.id });
          } else {
            dispatch({ type: "ADD", payload: p });
          }
        },
        isWishlisted: (id) => !!state.items.find((i: Product) => i.id === id),
        count: state.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
