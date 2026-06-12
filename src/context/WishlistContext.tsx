"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "ADD"; payload: Product }
  | { type: "REMOVE"; payload: string }
  | { type: "SET"; payload: Product[] }
  | { type: "CLEAR" };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD":
      if (state.items.find((i) => i.id === action.payload.id)) return state;
      return { items: [...state.items, action.payload] };
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case "SET":
      return { items: action.payload };
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
  clearWishlist: () => void;
  toggle: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  // Load persisted wishlist after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const stored = localStorage.getItem("omh-wishlist");
    if (stored) {
      try {
        dispatch({ type: "SET", payload: JSON.parse(stored) });
      } catch {
        // ignore corrupted wishlist data
      }
    }
    setHydrated(true);
  }, []);

  // Persist to local storage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("omh-wishlist", JSON.stringify(state.items));
  }, [state.items, hydrated]);

  // Auth listener to clear wishlist on sign out
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        dispatch({ type: "CLEAR" });
        localStorage.removeItem("omh-wishlist");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addItem: (p) => dispatch({ type: "ADD", payload: p }),
        removeItem: (id) => dispatch({ type: "REMOVE", payload: id }),
        clearWishlist: () => dispatch({ type: "CLEAR" }),
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
