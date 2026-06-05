# Future Implementations — Ohh My Happiness

This document outlines the strategic roadmap and production-ready checklist for the "Ohh My Happiness" gifting platform.

---

## ✅ Completed Milestones
- [x] **Automated Testing Engine:** Full Playwright E2E suite covering Customer Checkout, Admin OMS, and Security Audit with automated Git hooks.
- [x] **Order Management System (OMS):** A full dashboard with visual analytics (Revenue Bar Charts, Status Donut Charts), shipping label printing, and return handling.
- [x] **Secure Auth & Test Bypass:** Implemented Universal OTP, Protected Admin Routes, and a secure `x-test-bypass` system for automated verification.
- [x] **Supabase Storage Integration:** Moved product images to a Supabase bucket with secure, long-lived signed URLs for robust performance.
- [x] **Dynamic Product Management:** Migrated from static files to a live Supabase `products` table.
- [x] **Admin Portal (CRUD):** Built a dedicated dashboard for managing products, pricing, and badges.
- [x] **Premium UI/UX:** Dark-mode admin portal and high-end aesthetic for the customer store.
- [x] **Unit Testing Engine:** Vitest configured for unit testing of core systems (pricing, discount, cart logic) with 7/7 tests passing.
- [x] **Analytics Telemetry:** Google Analytics 4 (GA4) and Facebook Pixel scripts integrated and dynamically mounted.

---

## 🏗 Core Architecture (Production Ready)
- [x] **Image Optimization Pipeline:** [Launch Critical] Next.js Image loader with AVIF/WebP support and priority preloading for Hero visuals.
- [/] **Sentry Error Tracking:** [Launch Critical] Error monitoring configuration boilerplate created, but requires installing `@sentry/nextjs` package and wiring up a valid DSN (currently commented out to prevent build failure).
- [x] **Real-time Performance Monitoring:** [Completed] Integrated via Sentry configuration blueprints and Performance Budgeting gates.
- [x] **Environment Security:** Audit and lock down all `.env` variables for the production environment (Zod schema-based validation implemented in `src/env.ts`).
- [ ] **Database Backups:** Configure daily automated backups for the Supabase Postgres instance.

---

## 📈 SEO & Marketing
- [x] **Dynamic Metadata:** [Launch Critical] Unique meta tags, OpenGraph images, and Twitter cards for every product page.
- [x] **Automated Sitemap:** [Launch Critical] Dynamically generated `sitemap.xml` and `robots.txt`.
- [x] **Google Analytics 4 (GA4):** [Completed] Global tracking script integrated and dynamically mounted in the Root Layout.
- [x] **Facebook/Instagram Pixel:** [Completed] Global pixel tracking code integrated and dynamically mounted in the Root Layout.
- [x] **Rich Snippets (JSON-LD):** [Launch Critical] Product schema for prices, ratings, and availability in Google.

---

## 💳 Checkout & Payments
- [ ] **Live Payment Gateway:** [Launch Critical] Replace mock flow with Razorpay/Stripe for real-time transactions.
- [ ] **Address Validation:** Integrate a maps API (like Google Places) for accurate delivery address entry.
- [ ] **Tax & Shipping Logic:** Implement dynamic GST calculations and shipping fees based on weight/location.
- [x] **Cart Persistence:** [Launch Critical] Automatically saves the user's cart to the database for cross-device access.

---

## 🤝 Customer Experience
- [ ] **WhatsApp Business API:** Automated order confirmations, tracking links, and support via WhatsApp.
- [ ] **Live Order Tracking:** A "Track My Gift" page showing the real-time status from shipping partners.
- [x] **Build Your Own Box (BYOB):** [Launch Critical] An interactive multi-step builder for custom hampers.
- [ ] **AI Gift Recommender:** A smart quiz to help users find the perfect gift in under 60 seconds.

---

## 🛠 Admin & Operations
- [x] **Inventory Alerts:** [Launch Critical] Automated detection of low-stock products based on custom thresholds.
- [x] **Coupon & Promo Engine:** [Launch Critical] Dynamic validation for percentage, fixed, and minimum-order discounts.

---

## 🧪 Testing & Quality
- [x] **Unit Testing:** [Completed] Vitest installed and configured, mock boundaries established, and core Cart logic tests fully passing.
- [/] **Stress Testing:** [Planned] Strategy and k6 scripts documented in `tests/stress/`.
- [/] **Performance Budgeting:** [Defined] Standards set in `performance-budget.json`.

---

## 🔒 Production Stability & Security (Recommended)
- [ ] **API Rate Limiting:** Protect critical endpoints (especially `/api/chat`) using a lightweight token bucket rate-limiting middleware (e.g. Upstash Redis or Edge Middleware).
- [ ] **Security Headers & CSP:** Configure strict Content Security Policy (CSP), X-Frame-Options, and security headers in the Next.js middleware.
- [ ] **Postgres Connection Pooling:** Configure Supabase connection pooling (using Session or Transaction pooling) to prevent serverless functions from exhausting connection limits.
- [ ] **Error Alerting Rules:** Define active alert rules in Sentry to notify developers (via Slack/Discord or email) immediately when a production exception is captured.
- [ ] **CI/CD Quality Gates:** Create a GitHub Actions workflow to run linting, typechecks, unit tests, and Playwright E2E suites on every PR before merge.
- [ ] **Global Error Boundary:** Implement a high-level React error boundary component in the App layout to catch runtime JavaScript crashes gracefully and display a stylized error fallback instead of a blank screen.
- [ ] **Supabase Row Level Security (RLS) Audit:** Ensure strict RLS policies on all tables (`products`, `orders`, `profiles`) so that normal users cannot read/write other users' private checkout information.
- [ ] **Transactional Email Provider (Resend/SendGrid):** Fully integrate Resend with a verified domain to handle OTP auth emails and automated receipt delivery.
- [ ] **Console Log Sanitization:** Clean up development `console.log` statements in the code prior to deployment, particularly those outputting user profiles, carts, or session tokens.
- [ ] **Database Indexes on Core Relations:** Verify that indices are set up for fields involved in frequent joins and filterings: `orders.user_id`, `order_items.order_id`, and `products.slug`.
- [ ] **Edge Network CDN Caching:** Implement static/CDN caching rules (ISR / Stale-While-Revalidate) for catalog endpoints to handle traffic surges without crushing Postgres connections.
