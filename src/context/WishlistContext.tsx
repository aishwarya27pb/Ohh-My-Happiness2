"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { saveWishlistAction, getSavedWishlistAction } from "@/app/actions/wishlist.actions";

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
  const [loadedFromDB, setLoadedFromDB] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load persisted wishlist from localStorage after mount (avoids SSR hydration mismatch)
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

  // Helper to merge local storage and database wishlists cleanly
  const mergeWishlists = (local: Product[], saved: Product[]): Product[] => {
    const map = new Map<string, Product>();
    local.forEach(p => {
      if (p && p.id) map.set(p.id, p);
    });
    saved.forEach(p => {
      if (p && p.id) map.set(p.id, p);
    });
    return Array.from(map.values());
  };

  // Fetch database wishlist if user is already logged in at initial load
  useEffect(() => {
    if (!hydrated) return;

    const initWishlist = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);
        const { wishlist } = await getSavedWishlistAction();
        const localStored = localStorage.getItem("omh-wishlist");
        const localItems = localStored ? JSON.parse(localStored) : [];
        const merged = mergeWishlists(localItems, wishlist || []);
        dispatch({ type: "SET", payload: merged });
        setLoadedFromDB(true);
      } else {
        setCurrentUserId(null);
        setLoadedFromDB(true); // Anonymous users don't need DB load
      }
    };

    initWishlist();
  }, [hydrated]);

  // Persist to local storage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("omh-wishlist", JSON.stringify(state.items));
  }, [state.items, hydrated]);

  // Sync to database if logged in and wishlist has been successfully loaded from database
  useEffect(() => {
    if (!hydrated || !loadedFromDB || !currentUserId) return;

    const syncTimeout = setTimeout(async () => {
      await saveWishlistAction(state.items);
    }, 1000); // Debounce sync by 1 second

    return () => clearTimeout(syncTimeout);
  }, [state.items, hydrated, loadedFromDB, currentUserId]);

  // Auth listener to load/merge wishlist on session changes
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setCurrentUserId(session.user.id);
        const { wishlist } = await getSavedWishlistAction();
        const localStored = localStorage.getItem("omh-wishlist");
        const localItems = localStored ? JSON.parse(localStored) : [];
        const merged = mergeWishlists(localItems, wishlist || []);
        dispatch({ type: "SET", payload: merged });
        setLoadedFromDB(true);
      } else if (event === "SIGNED_OUT") {
        setCurrentUserId(null);
        setLoadedFromDB(false);
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
