# Ohh My Happiness

> **"Your requirement is our responsibility."**

A gifting e-commerce platform built for the Indian market — offering curated hampers, personalized gifts, corporate gifting solutions, and custom orders.

---

## Features

- **Product Store** — 12 curated gift products with filtering by category and occasion
- **Cart & Wishlist** — Persistent across sessions via localStorage
- **Checkout Flow** — 3-step process: Delivery → Payment → Order Confirmation
- **Coupon System** — `HAPPY10` for 10% off; free shipping above ₹999
- **Corporate Gifting** — Dedicated B2B landing page with tiered pricing packages
- **Personal Gifting** — Occasion-based collections and curated sets
- **Custom Orders** — Bulk/custom order request form with special requirements
- **Blog** — 6 articles covering gifting tips, trends, and ideas
- **SEO** — Sitemap, robots.txt, and per-page metadata

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript 5 |
| Icons | lucide-react |
| Animations | framer-motion |
| Notifications | react-hot-toast |
| Rendering | Dynamic & Static Export |
| Database & Auth | Supabase Postgres & Auth |
| Storage | Supabase Storage (Signed URLs) |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Production build + static export
npm run build

# Serve the production build locally
npm run start

# Run ESLint
npm run lint
```

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home page
│   ├── store/            # Product listing + dynamic product pages [id]
│   ├── cart/             # Cart page
│   ├── checkout/         # 3-step checkout
│   ├── order-confirmation/
│   ├── blog/             # Blog listing + dynamic posts [slug]
│   ├── about/
│   ├── corporate-gifting/
│   ├── personal-gifting/
│   ├── custom-orders/
│   ├── sitemap.ts        # Auto-generated /sitemap.xml
│   └── robots.ts         # Auto-generated /robots.txt
│
├── components/
│   ├── layout/           # Header, Footer
│   ├── home/             # Hero, CategoryGrid, BestsellerSection, etc.
│   ├── ui/               # ProductCard, SectionHeader (reusable)
│   └── cart/             # MiniCart drawer
│
├── context/
│   ├── CartContext.tsx   # Cart state + localStorage persistence
│   └── WishlistContext.tsx
│
├── data/
│   └── products.ts       # All static data: products, blog posts, categories, testimonials
│
└── types/
    └── index.ts          # TypeScript interfaces (Product, CartItem, BlogPost, etc.)
```

---

## Architecture

**Server + Client split:** Each dynamic route follows a two-file pattern — a Server Component (`page.tsx`) handles `generateStaticParams` and `generateMetadata`, then delegates interactivity to a `*Client.tsx` file with `"use client"`.

**Data layer:** All products, blog posts, categories, and testimonials are static in `src/data/products.ts`. No external API or database.

**State:** Two React Contexts (Cart, Wishlist) mounted in `layout.tsx`, both persisted to localStorage.

---

## Design System

**Brand Colors** (registered as Tailwind tokens):

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-golden` | `#FFB449` | Primary / CTA buttons |
| `bg-amber` | `#FF8A00` | Accents, highlights |
| `bg-cream` | `#FFF9EE` | Page backgrounds |
| `bg-peach` | `#FFE4C2` | Cards, soft sections |
| `bg-honey` | `#FF9500` | Hover states |

**Global Utility Classes** (defined in `src/app/globals.css`):

- `.gradient-sunshine` — Golden gradient background
- `.text-gradient` — Gradient text effect
- `.card-hover` — Lift-on-hover card effect
- `.btn-primary` — Filled golden button
- `.btn-outline` — Outlined button
- `.section-padding` — Consistent vertical section spacing

---

## Known Limitations

| Area | Status |
|------|--------|
| Payment processing | Razorpay/UPI/COD UI exists; no live SDK yet |
| Blog content | Post `content` fields are empty — only excerpts populated |
| Client Auth | Only Admin auth is active. Customer auth via OTP is pending full implementation. |

---

## Brand Identity

- **Name:** Ohh My Happiness
- **Tagline:** "Your requirement is our responsibility."
- **Currency:** Indian Rupees (₹)
- **Phone format:** +91
- **Primary market:** India
