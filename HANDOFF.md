# Hand-off Document — Ohh My Happiness (Next.js Storefront)

**Date:** 2026-07-05 (updated)
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

## 4. COMPLETED — BYOB 2.5D Isometric Builder

**Status: DONE.** `src/app/(store)/byob/page.tsx` fully rewritten. Verified on desktop, tablet (768px), mobile (390px) via Playwright.

### What was built
- **Isometric box** — CSS `perspective(1200px)` + `rotateX(20°)` tilt, spring-animates on drag-over (tilts to 16°, scales 1.02×). Inner wall shadow layers simulate box depth.
- **3D block items** — placed gifts have a front face (`translateZ(5px)`), bottom edge, and right edge (dark gradient strips rotated via `rotateX(-90deg)`/`rotateY(90deg)`) giving physical thickness. Each item gets `rotateX(-8°)` + progressive `translateZ(depth * 4px)` + stronger shadow per insertion depth.
- **ResizeObserver scaling** (`useBoxScale` hook) — box always fits container width at any breakpoint, no hacky CSS scale hacks. Drop coordinates divided by scale factor so placement stays accurate.
- **Touch detection** (`useIsTouchDevice`) — labels switch "Drag" → "Tap", catalog `draggable={false}` on touch, red X badges on placed items (mobile remove affordance), 3D hover disabled on touch devices.
- **Collision/placement** — `findOpenSpot` with `BOX_PADDING=12`, `GIFT_GAP=6`, `STEP=8` (finer than original 14). Auto-settles dropped item to nearest free spot. Toast errors on "box full" and "no space".
- **Catalog panel** — 3-col grid on mobile, 2-col on tablet+. Loading skeleton (animated pulse). `framer-motion` hover tilt + selected-item float animation.
- **Step 1 box cards** — 2-col on mobile, 3-col on sm+. 3D tilt hover via framer-motion.
- **Step 3 personalize** — fully responsive, all text/spacing scale per breakpoint. `resize-none` on textarea.

### Key constants (in `page.tsx`)
```ts
const BOX_W = 380;      // logical coordinate space — never change without updating findOpenSpot
const BOX_H = 440;
const BOX_PADDING = 12; // item keepout from box edges
const GIFT_GAP = 6;     // min gap between placed items
```

### Known limitation
`overflow: hidden` doesn't clip `preserve-3d` children — clipping is on the perspective wrapper (parent div), not the tilted box itself. Works correctly.

---

## 5. NEXT OPEN TASK — Connectors Lead Access

**User request (interrupted, not yet implemented):** "let connectors also have access to add leads"

**Context:** The current leads system:
- `src/app/actions/leads.actions.ts` → `createLeadAction` — uses `createServiceClient()` (service-role), no auth check. Anyone can call it (security issue from audit).
- `src/app/actions/admin/leads.actions.ts` → `updateLeadStatusAction`, `updateLeadNotesAction` — admin-only mutations, also unprotected.
- `src/lib/services/leads.service.ts` — `createLead`, `getLeadById`, etc. via service-role client.
- Supabase `profiles` table has `role` column: `customer` | `admin`. No `connector` role exists yet.

**What "connectors" means:** Likely a new user role (`connector`) who can submit leads on behalf of clients (referral/partner model) but cannot access the admin panel or manage other leads. Needs:
1. Add `connector` to the `profiles.role` enum in Supabase schema and regenerate types (`npx supabase gen types typescript --project-id siotvawafzrxnchssebk > src/lib/supabase/types.ts`)
2. A UI for connectors to submit leads (either reuse the `/custom-orders` form or a dedicated `/connector` page)
3. Auth gate in `createLeadAction` that allows `role === 'admin' OR role === 'connector'` (or allow unauthenticated for public lead forms — clarify with user)
4. Optionally: connectors can view their own submitted leads (`getLeadsByConnector`)

**Status: NOT STARTED.** Clarify with user: should connectors be registered users with a `connector` role, or is this about allowing the public custom-orders form to submit leads without auth?

---

## 6. Environment Notes

- Dev server: `npm run dev` (port 3000). Check `lsof -i :3000` before starting another instance.
- `.gitignore` correctly excludes `.env*`; no secrets committed.
- Current branch: `master`. Uncommitted: `.claude/settings.json` (modified), `src/app/(store)/byob/page.tsx` (modified — the 2.5D rewrite, **not yet committed**). `AUDIT_REPORT.md` and `HANDOFF.md` are untracked.
- Latest commits: `107683a built 2.5d byob`, `4a35b55 made website responsive`.
- `.playwright-mcp/` directory has untracked Playwright session logs — safe to ignore or delete.
- No test runner configured. Playwright E2E specs exist at `tests/e2e/specs/` but not wired into CI.
