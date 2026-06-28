# Hand-off Document — Ohh My Happiness (Next.js Storefront)

**Date:** 2026-06-28 (updated)
**Purpose:** Context transfer for continuing work in another LLM/IDE session.

---

## 1. Project Overview

- **Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Supabase (Postgres + Auth + Storage), Google Generative AI (chatbot).
- **Read first:** `CLAUDE.md` and `AGENTS.md` at repo root — they contain architecture notes, brand identity, commands, and a critical warning that this Next.js version has breaking changes vs. training-data assumptions (check `node_modules/next/dist/docs/` before writing new code).
- **Dev server:** `npm run dev` (port 3000). Production: `npm run build && npm run start` (static export, 33 pages).
- **Supabase project ID:** `siotvawafzrxnchssebk`.

---

## 2. Recently Completed Work

### 2.1 Full responsive pass
The entire site was made responsive across breakpoints with consistent alignment/spacing. Completed and verified — no follow-up needed unless new pages are added.

### 2.2 Hydration error fix on `/checkout`
**Root cause:** `CartContext` and `WishlistContext` used `useReducer` lazy initializers that read `localStorage` synchronously during the client's first render, causing SSR/client mismatch (server rendered empty-cart state, client rendered full cart).

**Fix applied** (already in code, verified live via Playwright):
- `src/context/CartContext.tsx` and `src/context/WishlistContext.tsx`: removed lazy-init localStorage reads from `useReducer`. Added a `hydrated` state flag and a post-mount `useEffect` that reads `omh-cart`/`omh-coupon`/`omh-wishlist` from localStorage and dispatches `SET_CART`/`SET_COUPON`/`SET` actions. All persistence effects are gated behind `if (!hydrated) return;`.
- Wishlist reducer gained a new `SET` action type.

**Status:** Done, verified, no further action needed.

### 2.3 Full backend/security/performance audit
A comprehensive audit was performed and written to **`AUDIT_REPORT.md`** at repo root. **The user has NOT yet asked for fixes to be implemented** — this is the most important open item for the next session.

---

## 3. AUDIT_REPORT.md — Summary of Open Issues (NOT YET FIXED)

### CRITICAL (fix before real traffic)
1. **`/admin/**` has zero server-side access control.** `src/app/admin/(dashboard)/layout.tsx` is a client component with no auth/role check; no `middleware.ts` exists anywhere. Live-verified: unauthenticated curl to `/admin`, `/admin/orders`, `/admin/customers`, `/admin/products` all return 200 with full admin UI.
2. **Admin Server Actions bypass RLS via service-role key with no auth check**, callable by anyone:
   - `src/app/actions/product.actions.ts` → `createProductAction`, `updateProductAction`, `deleteProductAction`
   - `src/app/actions/storage.actions.ts` → `uploadProductImage`
   - `src/app/actions/admin/leads.actions.ts` → `updateLeadStatusAction`, `updateLeadNotesAction`
   - `src/app/actions/leads.actions.ts` → `createLeadAction`
3. **Checkout trusts client-supplied pricing.** `src/app/actions/orders.actions.ts` → `createOrderAction` forwards `pricing.subtotal/shipping/discount/total` and per-item `product.price` straight from the browser into `createOrder()` (`src/lib/services/orders.service.ts:47-95`) with no server-side recomputation. A modified client can set `total: 1`.
4. **`/api/migrate` and `/api/setup-storage`** — unauthenticated `GET` endpoints, no `NODE_ENV` guard, use service-role key. `/api/migrate` upserts the entire `categories`/`products` tables from `src/data/products.backup.ts` — anyone hitting the URL can revert live product data to the backup snapshot. **Do not execute these against the live Supabase project without explicit user confirmation.**

### HIGH
5. **`/api/debug-products`** — unauthenticated, live-verified 200, leaks product names/image URLs. Remove or gate like `src/app/api/test/*` (which correctly does `if (env.NODE_ENV === "production") return 403`).
6. **No security headers** — no CSP/X-Frame-Options/X-Content-Type-Options/Referrer-Policy/HSTS/Permissions-Policy; `X-Powered-By: Next.js` exposed. Fix via `headers()` in `next.config.ts` + `poweredByHeader: false`.
7. **No rate limiting** on `/api/chat` (paid Gemini calls), `createLeadAction`, `createOrderAction`.

### MEDIUM
8. Admin "read" actions (`getOrdersAction`, `getCustomerAction`, `getLeadsAction`, `getDashboardMetrics`, etc.) rely entirely on unverified Supabase RLS policies — confirm in Supabase dashboard that `orders`, `order_items`, `profiles`, `custom_order_requests` tables enforce admin-only access for non-owners.
9. `getOrderById` (`src/lib/services/orders.service.ts:111-121`) has no `profile_id` ownership filter — relies entirely on RLS to prevent one customer viewing another's order/PII.

### LOW
10. ESLint baseline: 290 errors / 2871 warnings, pre-existing (`@typescript-eslint/no-explicit-any`, `react-hooks/set-state-in-effect`) — not new regressions.
11. `src/app/api/chat/route.ts:118-124` returns `details: String(error)` to client on failure — info leak, should log server-side only.

### Performance (dev-mode only, not production-validated)
- 50 concurrent requests to `/`, `/store`, `/cart` all returned 200, no errors. Re-run against `npm run build && npm run start` for real numbers — production build was not run in the audit.

### Suggested priority order (from AUDIT_REPORT.md)
1. Gate `/admin/**` (middleware or per-page server checks)
2. Add admin-role checks to `product.actions.ts`, `storage.actions.ts`, `admin/leads.actions.ts`
3. Server-side re-validate order pricing in `createOrderAction`/`createOrder`
4. Delete/gate `/api/migrate`, `/api/setup-storage`, `/api/debug-products`
5. Add security headers, disable `X-Powered-By`
6. Rate limit `/api/chat`, lead/order creation
7. Verify Supabase RLS policies
8. Run production build + re-test load

---

## 4. CURRENT/NEXT TASK — BYOB 2D → 3D Conversion

**User request:** Convert the "Build Your Own Box" drag-and-drop builder from 2D to a more impressive 3D experience for clients, while staying user-friendly.

**Current implementation:** `src/app/(store)/byob/page.tsx` (733 lines)
- Step 2 component (lines ~364-552): native HTML5 drag-and-drop (`draggable`, `onDragStart`, `onDrop`, `onDragOver`/`onDragLeave`).
- Items are absolutely positioned via a `positions` state map: `Record<string, { x: number; y: number }>` (line 377).
- `placeItem`/`repositionItem` (lines ~435-484) compute drop coordinates relative to the box bounding rect and "settle" items into place.
- All product visuals are currently **emoji placeholders** — `Product.images` is a string array but no real image/3D assets exist (per CLAUDE.md "Images" section).
- No 3D libraries (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/cannon`) are installed. `framer-motion` IS installed but unused; `react-hot-toast` installed but unused.

**Recommendation already given to user (pending their decision on direction):**

| Option | Description | Effort | Asset requirement |
|---|---|---|---|
| **A. 2.5D CSS-transform isometric** (recommended first step) | Tilt the box container with CSS `perspective`/`rotateX`, add drop-shadows + layered z-index/depth as items are placed, animate placement with `framer-motion` (already installed). Keep existing drag logic mostly intact. | Low — few days, no new deps | Works fine with current emoji placeholders |
| **B. True 3D** (react-three-fiber + drei + @react-three/cannon) | Real 3D scene, rotatable box, items physically drop/settle with physics. Most "wow" factor. | High — new ~200KB+ dep chain, full rewrite of drag interaction into 3D raycasting | Needs real 3D models or textured sprites per product — current emoji placeholders won't look good in a 3D scene |

**Status:** No implementation started. User has NOT yet picked A vs. B — last assistant message asked "Want me to start on the 2.5D isometric version?" and the user instead asked for this hand-off doc, so **the decision is still open**. The next session should either get the user's choice or default to Option A (2.5D) as the pragmatic recommendation, given the lack of 3D assets.

---

## 5. Environment Notes

- Dev server may already be running in background from a prior session (`npm run dev > /tmp/omh-dev.log 2>&1 &`). Check `lsof -i :3000` before starting another.
- `.gitignore` correctly excludes `.env*`; no secrets committed (verified via `git ls-files`).
- Current branch: `master`. Uncommitted files as of 2026-06-28: `.claude/settings.json` (modified), `AUDIT_REPORT.md` (untracked), `HANDOFF.md` (untracked). No uncommitted code changes — BYOB page was NOT modified for 3D.
- Latest commit: `4a35b55 made website responsive`.
- No test runner configured. Playwright E2E specs exist at `tests/e2e/specs/` but not wired into CI.
