# TODO — Ohh My Happiness

Future updates and improvements, organized by priority.

---

## CRM (In Progress)

Full implementation guide in [CRM.md](CRM.md).

- [ ] **Step 1 — Install Supabase packages** — `npm install @supabase/supabase-js @supabase/ssr`
- [ ] **Step 2 — Environment variables** — Create `.env.local` with Supabase URL, anon key, service role key
- [ ] **Step 3 — Database schema** — Run SQL in Supabase dashboard (5 tables: customers, addresses, orders, order_items, custom_order_requests)
- [ ] **Step 4 — Create admin user** — Supabase → Authentication → Users → Add user
- [ ] **Step 5 — Supabase client helpers** — `src/lib/supabase/client.ts`, `server.ts`, `service.ts`, `middleware.ts`
- [ ] **Step 6 — Route protection** — `middleware.ts` at project root; redirect `/admin/*` to login if unauthenticated
- [ ] **Step 7 — Server actions** — `auth.ts` (login/logout), `orders.ts` (createOrder), `leads.ts` (createLead)
- [ ] **Step 8 — Wire checkout** — Call `createOrder` in `src/app/checkout/page.tsx` on order submission
- [ ] **Step 9 — Wire custom orders form** — Call `createLead` in `src/app/custom-orders/page.tsx` on submission
- [ ] **Step 10 — Admin login page** — `src/app/admin/login/page.tsx`
- [ ] **Step 11 — Admin layout** — `src/app/admin/layout.tsx` with sidebar (Dashboard, Orders, Customers, Leads)
- [ ] **Step 12 — Orders module** — List (`/admin/orders`) + detail (`/admin/orders/[id]`) with status update
- [ ] **Step 13 — Customers module** — List (`/admin/customers`) + profile (`/admin/customers/[id]`) with notes
- [ ] **Step 14 — Leads module** — Pipeline list (`/admin/leads`) + detail (`/admin/leads/[id]`) with status + notes
- [ ] **Step 15 — Analytics dashboard** — `src/app/admin/page.tsx` with revenue, orders, customers, leads metrics

---

## High Priority

These are core gaps blocking a production-ready launch.

- [ ] **Real product images** — Replace emoji placeholders in `src/data/products.ts` with actual photo assets; `next.config.ts` already has AVIF/WebP optimization configured
- [ ] **Razorpay payment integration** — Wire up Razorpay SDK in the checkout flow (`src/app/checkout/page.tsx`); UPI and COD UI already exists
- [ ] **Blog post content** — Fill in the empty `content` fields for all 6 blog posts in `src/data/products.ts`
- [ ] **File upload for custom orders** — Connect the upload UI in `src/app/custom-orders/` to actually handle file attachments (reference images, brand assets)

---

## Medium Priority

UX polish and feature completions.

- [ ] **Animations with framer-motion** — Add page transitions, product card entrance animations, and cart drawer slide — library is already installed
- [ ] **Toast notifications with react-hot-toast** — Show feedback on add-to-cart, wishlist toggle, coupon apply, and form submissions — library is already installed
- [ ] **Variant persistence in cart** — Ensure selected variants (e.g. size: Small/Medium/Large) are stored and displayed correctly in `CartContext`
- [ ] **Store search** — Add keyword search to `src/app/store/StoreClient.tsx` alongside the existing category/occasion filters
- [ ] **Product image gallery** — Carousel or thumbnail switcher on the product detail page (`src/app/store/[id]/ProductDetailClient.tsx`) once real images are added
- [ ] **More products** — Expand beyond current 12 products; add more categories and occasions to `src/data/products.ts`

---

## Nice to Have

Longer-term features for growth.

- [ ] **User authentication** — Login/signup with order history and saved addresses
- [ ] **Email notifications** — Transactional emails for order confirmations and custom order acknowledgements
- [ ] **Backend / database** — Replace static `src/data/products.ts` with Supabase (already planned in CRM — extend to products/categories once CRM is live)
- [ ] **CMS for blog** — Connect to a headless CMS (e.g. Sanity, Contentlayer) so blog content can be managed without code changes
- [ ] **WhatsApp chat widget** — Common in Indian e-commerce; quick support contact via WhatsApp Business API
- [ ] **Reviews & ratings submission** — Allow customers to submit reviews; currently ratings are read-only static data
- [ ] **Live stock management** — Replace hardcoded `inStock: true` with real inventory tracking
- [ ] **Referral / loyalty program** — Points or discount rewards for repeat customers
- [ ] **Instagram feed embed** — Showcase real gift photos from social media on the home page or product pages
- [ ] **Analytics** — Google Analytics 4 or Meta Pixel for tracking conversions and ad performance
- [ ] **Wishlist sharing** — Let users share their wishlist via a link
- [ ] **Gift message at checkout** — Allow buyers to add a personalized message card to their order

---

## Infrastructure

- [ ] **Deploy to production** — Set up hosting (Vercel recommended for Next.js static export)
- [ ] **Domain + SSL** — Point custom domain, configure HTTPS
- [ ] **Environment variables** — `.env.local` for Supabase keys covered in CRM step 2; add Razorpay keys and email API keys when those are wired up
- [ ] **Error monitoring** — Integrate Sentry or similar for production error tracking
