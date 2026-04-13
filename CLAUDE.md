# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build + static export (33 pages)
npm run start    # Serve production build
npm run lint     # ESLint check
```

No test runner is configured.

## Architecture

**Next.js 16 App Router** — all pages live under `src/app/` as `page.tsx` files. Static pages use `generateStaticParams` for pre-rendering (store/[id] × 12, blog/[slug] × 6).

**Pattern for dynamic routes**: Pages at `src/app/store/[id]/page.tsx` and `src/app/store/[id]/ProductDetailClient.tsx` follow a split pattern — the `page.tsx` is a Server Component that calls `generateStaticParams` and `generateMetadata`, then renders a `*Client.tsx` file that handles all interactivity with `"use client"`. Same pattern for `/store` (StoreClient.tsx) and `/custom-orders`.

**State management**: Two React Contexts, both with localStorage persistence:
- `src/context/CartContext.tsx` — cart items, open/close state, `addItem`/`removeItem`/`updateQuantity`/`clearCart`/`toggleCart`/`openCart`/`closeCart`, `totalItems`, `subtotal`
- `src/context/WishlistContext.tsx` — wishlist items, `addItem`/`removeItem`/`toggle`/`isWishlisted`/`count`

Both providers are mounted in `src/app/layout.tsx`.

**Data layer**: All product/blog/category data is static in `src/data/products.ts`. No external API or database. Products are identified by `id` (used in cart/wishlist) and `slug` (used in URLs). `id` and `slug` are both the same value in practice.

**Styling**: Tailwind CSS v4 with `@theme inline` in `src/app/globals.css`. Brand colors are registered as Tailwind tokens (`bg-golden`, `bg-honey`, `bg-peach`, `bg-cream`, `bg-amber`) — use these, not raw hex values. Global utility classes (`.gradient-sunshine`, `.text-gradient`, `.card-hover`, `.btn-primary`, `.btn-outline`, `.section-padding`) are defined there too.

**Brand identity**:
- Name: Ohh My Happiness
- Tagline: "Your requirement is our responsibility."
- Primary: `#FFB449` (golden), Accent: `#FF8A00` (amber), Background: `#FFF9EE` (cream), Dark: `#1A1A1A`
- Currency: Indian Rupees (₹), phone format: +91

**Installed but not yet wired**: `framer-motion` (available for animations), `react-hot-toast` (available for notifications).

**SEO**: `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`. Each page uses `generateMetadata` or static `export const metadata`. Checkout and order-confirmation are disallowed in robots.txt.

**lucide-react caveat**: The installed version does not export `Instagram`, `Facebook`, `Twitter`, or `Youtube`. Use text abbreviations or other available icons instead.

**Images**: Currently using emoji placeholders — `Product.images` is a string array but no real image assets exist yet. `next.config.ts` has AVIF/WebP optimization enabled with wildcard remote patterns.

**Checkout flow**: `/cart` → `/checkout` (3-step: Delivery form → Payment selection → Review) → `/order-confirmation`. Coupon `HAPPY10` = 10% off. Free shipping above ₹999. Payment integration is placeholder only (Razorpay/UPI/COD UI exists, no actual SDK).
