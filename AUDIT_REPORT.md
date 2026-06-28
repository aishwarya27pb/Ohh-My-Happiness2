# Backend / Database / API / Security / Performance Audit

**Date:** 2026-06-13
**Scope:** Server Actions (`src/app/actions/**`), API routes (`src/app/api/**`), Supabase client layers, admin panel access control, checkout/order pricing flow, load behavior under concurrency.

**Method:** Static code review of every server-side entry point + live testing against the dev server (`npm run dev`, port 3000) using `curl` and concurrent request bursts. Destructive endpoints (those that write via the Supabase **service-role** key) were reviewed but **not executed live** to avoid corrupting production data — see notes.

---

## CRITICAL — Fix before any real traffic

### 1. `/admin/**` pages have zero server-side access control
- `src/app/admin/(dashboard)/layout.tsx` is a plain client component with no auth/role check.
- None of `admin/page.tsx`, `admin/orders/page.tsx`, `admin/customers/page.tsx`, `admin/products/page.tsx` call `getUser()` or `redirect()`.
- **Live-verified:** unauthenticated `curl` to `/admin`, `/admin/orders`, `/admin/customers`, `/admin/products` all return `200` and render the full admin shell.
- CLAUDE.md states "Admin routes are protected" — this is **not currently true** in code.
- **Fix:** add a server check (in each `page.tsx`, or a shared layout server wrapper) that calls `supabase.auth.getUser()`, loads `profiles.role`, and `redirect("/auth/login")` if not `admin`. A `middleware.ts` matching `/admin/:path*` is the cleanest single fix.

### 2. Admin Server Actions bypass RLS with the service-role key and have **no auth/role check in the action itself**
Affected files — all callable directly as Next.js Server Actions by any client that knows (or brute-forces/leaks via the client bundle) the action ID, authenticated or not:
- `src/app/actions/product.actions.ts` → `createProductAction`, `updateProductAction`, `deleteProductAction` (uses `createAdminClient()` — service role, bypasses RLS entirely).
- `src/app/actions/storage.actions.ts` → `uploadProductImage` (service role, no file-size/type validation beyond Supabase bucket config, generates a 10-year signed URL).
- `src/app/actions/admin/leads.actions.ts` → `updateLeadStatusAction`, `updateLeadNotesAction` (via `leads.service.ts`, uses `createServiceClient()`).
- `src/app/actions/leads.actions.ts` → `createLeadAction` also uses the service-role-backed `createLead`.

**Impact:** any visitor can create/edit/delete products, overwrite the product catalog, upload arbitrary files to storage as "product images", and tamper with custom-order leads — without logging in.

**Fix:** at the top of every one of these actions, re-derive the user from `createClient()` (cookie-based, anon key), fetch `profiles.role`, and throw/return an error unless `role === 'admin'`. Reserve the service-role/admin client for *after* that check passes.

### 3. Checkout trusts client-supplied pricing — order total / item prices are not re-validated server-side
- `src/app/actions/orders.actions.ts` → `createOrderAction` forwards `pricing.subtotal/shipping/discount/total` and each `cartItems[i].product.price` straight from the browser into `createOrder()` (`src/lib/services/orders.service.ts:47-95`), which inserts them verbatim via the service-role client.
- A modified client (or a direct POST to the action) can submit `total: 1`, `product.price: 0`, etc., and the order will be created with that price — including for COD, where no payment gateway would catch the discrepancy.
- **Fix:** server-side, re-fetch each `product.id` from `products`, recompute `line_total`/`subtotal`/`discount` (re-validate the coupon via `couponsService`) and `total`, and reject/ignore the client-supplied pricing fields.

### 4. `/api/migrate` and `/api/setup-storage` — unauthenticated, service-role-key-powered, no env guard
- `src/app/api/migrate/route.ts`: `GET` with **no auth check and no `NODE_ENV` guard**, instantiates a service-role Supabase client and **upserts the entire `categories`/`products` tables** from `src/data/products.backup.ts`. Anyone hitting this URL re-runs the migration and can overwrite live product data (price, stock flags, etc. revert to the backup snapshot).
- `src/app/api/setup-storage/route.ts`: same pattern — unauthenticated `GET` with service-role key that can create/alter a public storage bucket.
- **Not executed live** in this audit (would mutate the real Supabase project: `siotvawafzrxnchssebk`).
- **Fix:** delete both routes (they're one-time setup scripts) or gate behind `NODE_ENV !== "production"` **and** an admin-auth check, same as `src/app/api/test/*` already does correctly.

---

## HIGH

### 5. `/api/debug-products` — public data-leak endpoint
- Unauthenticated `GET`, **live-verified returns 200** with every product's name and first image URL. Low-sensitivity data, but it's a debug endpoint shipped to prod with no guard. Remove it or gate with the same `NODE_ENV` check used in `/api/test/*`.

### 6. No security headers anywhere
`curl -I http://localhost:3000/` shows **no** `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`, or `Permissions-Policy`. `X-Powered-By: Next.js` is also exposed (framework fingerprinting).
- **Fix:** add a `headers()` block in `next.config.ts` (or middleware) setting at minimum `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a CSP; set `poweredByHeader: false`.

### 7. No rate limiting on any public mutation endpoint
`/api/chat` (calls paid Gemini API per request), `createLeadAction` (custom-orders form, writes via service-role client), and `createOrderAction` (checkout) all accept unlimited unauthenticated requests. Combined with #3/#4, this is a meaningful abuse/cost surface.
- **Fix:** add IP-based rate limiting (e.g., Upstash Ratelimit, or a simple Supabase-table-based limiter) on `/api/chat`, `createLeadAction`, and `createOrderAction`.

---

## MEDIUM

### 8. Admin "read" Server Actions rely entirely on Supabase RLS, unverified in this audit
`getOrdersAction`, `getCustomerAction`, `getLeadsAction`, `getDashboardMetrics`, etc. use the **anon** client (`createClient()`), so they *should* be blocked by RLS for non-admins — but this audit could not inspect the live RLS policies. Given finding #1 (pages render for anonymous users) and #2 (some siblings bypass RLS outright), **verify in the Supabase dashboard** that every table touched by these (`orders`, `order_items`, `profiles`, `custom_order_requests`) has a `SELECT`/`UPDATE` policy requiring `profiles.role = 'admin'` for non-owner rows. Treat #1 as the primary fix; RLS is the backstop, not the only layer.

### 9. `getOrderById` has no ownership check
`src/lib/services/orders.service.ts:111-121` — `getOrderById(orderId)` returns any order by ID via the anon client. If RLS allows a logged-in user to read orders by ID without checking `profile_id = auth.uid()`, any authenticated user could view any other customer's order (PII: name, address, phone, email) by guessing/incrementing IDs. Confirm RLS scopes this to `profile_id = auth.uid() OR role = 'admin'`.

---

## LOW / Informational

### 10. ESLint baseline
`npm run lint` → **290 errors / 2871 warnings**, almost entirely pre-existing `@typescript-eslint/no-explicit-any` and `react-hooks/set-state-in-effect` across the codebase (not introduced by recent changes — the two `setHydrated(true)` calls added during the Cart/Wishlist hydration fix follow the same existing `setMounted(true)` pattern used elsewhere). Not a security issue, but worth a cleanup pass for type safety.

### 11. `/api/chat` error responses leak internals
`src/app/api/chat/route.ts:118-124` returns `details: String(error)` to the client on any failure — could leak stack/config details. Return a generic message and log details server-side only.

---

## Performance & Concurrency

- **Live load test** (dev server, 50 concurrent requests per route):
  | Route | Result | Avg response time |
  |---|---|---|
  | `/` | 50× 200 | ~1.20s |
  | `/store` | 50× 200 | ~1.28s |
  | `/cart` | 50× 200 | ~0.53s |

  No errors/timeouts under burst load. Note this is **Next dev mode** (unoptimized, recompiles on first hit) — re-run the same test against `npm run build && npm run start` for realistic numbers; dev-mode latency is not representative of production.
- `productsService.getProducts()` and friends do simple single-table `select("*")` queries with `.order()` — no N+1 patterns found in the reviewed services.
- No pagination on `getAllOrders`/`getAllCustomers` beyond optional `limit`/`offset` params that the admin UI may or may not pass — check admin list pages don't always fetch the full table as the dataset grows.
- `npm run build` (production static-export build, 33 pages) was **not run** in this session due to time/scope — recommended as a follow-up to catch type errors and verify bundle sizes per route.

---

## Summary / Priority Order

1. **Add `middleware.ts` (or per-page server checks) to gate `/admin/**`** — currently fully public.
2. **Add admin-role checks inside** `product.actions.ts`, `storage.actions.ts`, `admin/leads.actions.ts` mutation actions — they currently use the service-role key with no gate.
3. **Server-side re-validate order pricing** in `createOrderAction`/`createOrder` — currently trusts client totals/prices.
4. **Delete or gate `/api/migrate`, `/api/setup-storage`, `/api/debug-products`** the same way `/api/test/*` is already gated.
5. Add security headers (`next.config.ts` `headers()`), disable `X-Powered-By`.
6. Add rate limiting to `/api/chat`, lead/order creation actions.
7. Verify Supabase RLS policies on `orders`, `order_items`, `profiles`, `custom_order_requests`, `products` match the "admin client-side reliance" assumption baked into the service layer.
8. Run a production build (`npm run build && npm run start`) and re-run load tests for real numbers.
