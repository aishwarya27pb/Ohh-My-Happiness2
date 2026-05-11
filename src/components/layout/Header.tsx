"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ShoppingCart, Heart, Menu, X, Search, Phone, UserCircle, Package, LogOut, User } from "lucide-react";
import MiniCart from "@/components/cart/MiniCart";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { totalItems, toggleCart, state } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut(); // fires SIGNED_OUT → onAuthStateChange clears user
    setUserMenuOpen(false);
    setMenuOpen(false);
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Supabase auth state — getSession reads cookie instantly (no network round-trip)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Corporate Gifting", href: "/corporate-gifting" },
    { label: "Personal Gifting", href: "/personal-gifting" },
    { label: "Store", href: "/store" },
    { label: "Custom Orders", href: "/custom-orders" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>


      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur shadow-md" : "bg-[#FFF9EE]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="rounded-xl overflow-hidden shadow-sm ring-1 ring-black/10 group-hover:ring-[#FFB449]/60 transition-all duration-300">
                <Image
                  src="/logo.jpg"
                  alt="Ohh My Happiness"
                  width={48}
                  height={48}
                  className="w-10 h-10 lg:w-12 lg:h-12 object-cover"
                  priority
                />
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="text-base font-black text-[#FF8A00] leading-tight group-hover:text-[#FFB449] transition-colors whitespace-nowrap" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  Ohh My Happiness
                </span>
                <span className="text-[10px] text-[#6B6B6B] italic tracking-wide whitespace-nowrap">
                  Your requirement is our responsibility.
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-semibold text-[#1A1A1A] hover:text-[#FF8A00] transition-colors relative group whitespace-nowrap"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFB449] transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 lg:gap-2">

              {/* Search */}
              <div className="relative group/tip">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-full hover:bg-[#FFE4C2] transition-colors"
                  aria-label="Search"
                >
                  <Search size={19} className="text-[#1A1A1A]" />
                </button>
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50">
                  Search
                </span>
              </div>

              {/* Wishlist */}
              <div className="relative group/tip">
                <Link href="/wishlist" className="relative block p-2 rounded-full hover:bg-[#FFE4C2] transition-colors">
                  <Heart size={19} className="text-[#1A1A1A]" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FF8A00] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50">
                  Wishlist{mounted && wishlistCount > 0 ? ` (${wishlistCount})` : ""}
                </span>
              </div>

              {/* Cart */}
              <div className="relative group/tip">
                <button
                  onClick={toggleCart}
                  className="relative p-2 rounded-full hover:bg-[#FFE4C2] transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart size={19} className="text-[#1A1A1A]" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FFB449] text-[#1A1A1A] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </button>
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50">
                  Cart{mounted && totalItems > 0 ? ` · ${totalItems} item${totalItems !== 1 ? "s" : ""}` : ""}
                </span>
              </div>

              {/* Auth UI */}
              {user ? (
                <div className="relative hidden lg:block group/tip" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-[#FFE4C2] transition-colors"
                    aria-label="Account"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FFB449] flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {(user.user_metadata?.first_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                      </span>
                    </div>
                  </button>
                  {!userMenuOpen && (
                    <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50">
                      My Account
                    </span>
                  )}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#FFE4C2] z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#FFE4C2]">
                        <p className="text-xs font-semibold text-[#1A1A1A] truncate">
                          {user.user_metadata?.first_name
                            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ""}`
                            : user.email}
                        </p>
                        <p className="text-xs text-[#6B6B6B] truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#FFF9EE] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package size={15} className="text-[#6B6B6B]" />
                        My Orders
                      </Link>
                      <Link
                        href="/account/profile"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#FFF9EE] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={15} className="text-[#6B6B6B]" />
                        My Profile
                      </Link>
                      <div className="border-t border-[#FFE4C2]">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative hidden lg:block group/tip">
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-1.5 p-2 rounded-full hover:bg-[#FFE4C2] transition-colors"
                    aria-label="Sign in"
                  >
                    <UserCircle size={21} className="text-[#1A1A1A]" />
                  </Link>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 z-50">
                    Sign In
                  </span>
                </div>
              )}

              <Link
                href="/custom-orders"
                className="hidden lg:inline-flex items-center gap-2 btn-primary text-sm py-2 px-5"
              >
                Get Quote
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-[#FFE4C2] transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4 animate-in slide-in-from-top-2">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  type="text"
                  placeholder="Search for gifts, hampers, occasions..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-[#FFE4C2] bg-white focus:outline-none focus:border-[#FFB449] text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-[#FFE4C2] shadow-lg">
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 px-4 rounded-xl text-sm font-semibold text-[#1A1A1A] hover:bg-[#FFF9EE] hover:text-[#FF8A00] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/custom-orders"
                className="mt-3 btn-primary text-center text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Get Bulk Quote
              </Link>
              {user ? (
                <>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2 py-3 px-4 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FFF9EE] hover:text-[#FF8A00] transition-colors rounded-xl"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Package size={16} />
                    My Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 py-3 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 py-3 px-4 text-sm font-semibold text-[#FF8A00] hover:bg-[#FFF9EE] rounded-xl transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircle size={16} />
                  Sign In / Sign Up
                </Link>
              )}
              <a href="tel:+919999999999" className="flex items-center gap-2 py-3 px-4 text-sm text-[#6B6B6B]">
                <Phone size={16} />
                +91 99999 99999
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Mini Cart Sidebar */}
      {state.isOpen && <MiniCart />}
    </>
  );
}
