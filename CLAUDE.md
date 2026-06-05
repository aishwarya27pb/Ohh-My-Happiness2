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

No test runner is configured. E2E specs exist at `tests/e2e/specs/` (Playwright) but are not hooked into CI.

## Architecture

**Next.js 16 App Router** — all pages live under `src/app/` as `page.tsx` files. Static pages use `generateStaticParams` for pre-rendering (store/[id] × 12, blog/[slug] × 6).

**Pattern for dynamic routes**: Pages at `src/app/store/[id]/page.tsx` and `src/app/store/[id]/ProductDetailClient.tsx` follow a split pattern — the `page.tsx` is a Server Component that calls `generateStaticParams` and `generateMetadata`, then renders a `*Client.tsx` file that handles all interactivity with `"use client"`. Same pattern for `/store` (StoreClient.tsx) and `/custom-orders`.

**State management**: Two React Contexts, both with localStorage persistence:
- `src/context/CartContext.tsx` — cart items, open/close state, `addItem`/`removeItem`/`updateQuantity`/`clearCart`/`toggleCart`/`openCart`/`closeCart`, `totalItems`, `subtotal`
- `src/context/WishlistContext.tsx` — wishlist items, `addItem`/`removeItem`/`toggle`/`isWishlisted`/`count`

Both providers are mounted in `src/app/layout.tsx`.

**Data layer**: Products live in `src/data/products.ts` (static) AND in Supabase (`products` table via `src/lib/services/products.service.ts`). Products are identified by `id` (cart/wishlist) and `slug` (URLs) — both are the same value in practice. All mutations (orders, leads, cart sync) go through Supabase Server Actions in `src/app/actions/`.

**Supabase integration** (project ID: `siotvawafzrxnchssebk`):
- `src/lib/supabase/client.ts` — browser client
- `src/lib/supabase/server.ts` — server/RSC client (cookies-based)
- `src/lib/supabase/service.ts` — service-role client (admin-only, bypasses RLS)
- `src/lib/supabase/types.ts` — single source of truth for DB types. After schema changes: `npx supabase gen types typescript --project-id siotvawafzrxnchssebk > src/lib/supabase/types.ts`
- Tables: `profiles`, `addresses`, `orders`, `order_items`, `leads`, `products`

**Auth**: Supabase Auth with email/password. Roles: `customer` | `admin` (stored in `profiles.role`). Auth Server Actions are in `src/app/actions/auth.actions.ts`. Admin routes (`/admin/**`) are protected. Customer routes (`/account/**`, `/checkout`) redirect to `/auth/login` if unauthenticated. Auth callback at `/auth/callback`.

**Admin panel** (`/admin`): Dashboard, orders list/detail, customers, leads, products. All admin pages are under `src/app/admin/(dashboard)/`. Requires `role = 'admin'` in `profiles`.

**Environment variables**: Validated at startup via `src/env.ts` (zod). Required for dev: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Required for prod only: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`. Optional: `OPENAI_API_KEY`, `WHATSAPP_API_URL/TOKEN`, analytics IDs, payment keys. Use `import { env } from "@/env"` — never `process.env` directly.

**Styling**: Tailwind CSS v4 with `@theme inline` in `src/app/globals.css`. Brand colors are registered as Tailwind tokens (`bg-golden`, `bg-honey`, `bg-peach`, `bg-cream`, `bg-amber`) — use these, not raw hex values. Global utility classes (`.gradient-sunshine`, `.text-gradient`, `.card-hover`, `.btn-primary`, `.btn-outline`, `.section-padding`) are defined there too.

**Brand identity**:
- Name: Ohh My Happiness
- Tagline: "Your requirement is our responsibility."
- Primary: `#FFB449` (golden), Accent: `#FF8A00` (amber), Background: `#FFF9EE` (cream), Dark: `#1A1A1A`
- Currency: Indian Rupees (₹), phone format: +91

**AI chatbot**: `src/app/api/chat/` — API route using Google Generative AI (`GOOGLE_GENERATIVE_AI_API_KEY`). Knowledge base at `src/lib/chatbot-knowledge.ts`. Chat UI components in `src/components/chat/`.

**BYOB (Build Your Own Box)**: `src/app/(store)/byob/` — custom gift box builder feature.

**Installed but not yet wired**: `framer-motion` (available for animations), `react-hot-toast` (available for notifications).

**SEO**: `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`. Each page uses `generateMetadata` or static `export const metadata`. Checkout and order-confirmation are disallowed in robots.txt.

**lucide-react caveat**: The installed version does not export `Instagram`, `Facebook`, `Twitter`, or `Youtube`. Use text abbreviations or other available icons instead.

**Images**: Currently using emoji placeholders — `Product.images` is a string array but no real image assets exist yet. `next.config.ts` has AVIF/WebP optimization enabled with wildcard remote patterns.

**Checkout flow**: `/cart` → `/checkout` (3-step: Delivery form → Payment selection → Review) → `/order-confirmation`. Coupon `HAPPY10` = 10% off. Free shipping above ₹999. Payment integration is placeholder only (Razorpay/UPI/COD UI exists, no actual SDK).
