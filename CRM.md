# CRM — Ohh My Happiness

A complete internal CRM built on top of the existing Next.js storefront, backed by Supabase. Admin-only access at `/admin`.

---

## What's Included

| Module | Description |
|--------|-------------|
| **Dashboard** | Revenue metrics, order counts, new customers, open leads, recent activity |
| **Orders** | All customer orders with status tracking, line items, and payment details |
| **Customers** | Customer profiles, contact info, full order history, admin notes |
| **Leads** | Custom/bulk order requests with pipeline status (New → Quoted → Won/Lost) |

The checkout flow and custom orders form are wired to Supabase — every order and lead from the website lands directly in the CRM.

---

## Implementation Steps

### Step 1 — Install Supabase packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

### Step 2 — Set up environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ywcqtpnrsvubyduqiefn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
SUPABASE_SERVICE_ROLE_KEY=<your service role key>
```

Find these in your Supabase dashboard → Project Settings → API.

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_`. It bypasses Row Level Security and is used only for trusted server-side inserts (checkout, form submissions).

---

### Step 3 — Create the database schema

Go to Supabase → SQL Editor → New query. Paste and run:

```sql
-- Customers
create table customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text not null,
  last_name text not null,
  phone text,
  company text,
  notes text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Addresses (linked to customers)
create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id),
  status text default 'confirmed',
  subtotal numeric not null,
  shipping numeric not null default 0,
  total numeric not null,
  discount numeric default 0,
  coupon_code text,
  payment_method text not null,
  gift_message text,
  shipping_address jsonb not null,
  created_at timestamptz default now()
);

-- Order line items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_price numeric not null,
  quantity int not null,
  selected_variants jsonb default '{}',
  line_total numeric not null
);

-- Custom order / bulk quote requests
create table custom_order_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text not null,
  category text,
  occasion text,
  quantity int,
  budget text,
  deadline date,
  requirements text,
  has_logo boolean default false,
  logo_url text,
  status text default 'new',
  admin_notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table customers enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table custom_order_requests enable row level security;

-- Only authenticated admins can read/write
create policy "Admin only" on customers for all using (auth.role() = 'authenticated');
create policy "Admin only" on addresses for all using (auth.role() = 'authenticated');
create policy "Admin only" on orders for all using (auth.role() = 'authenticated');
create policy "Admin only" on order_items for all using (auth.role() = 'authenticated');
create policy "Admin only" on custom_order_requests for all using (auth.role() = 'authenticated');
```

---

### Step 4 — Create admin user(s)

In Supabase → Authentication → Users → Add user. Enter your email and a strong password. This is the account used to log into the CRM.

> No self-registration UI exists — all admin accounts must be created manually in the Supabase dashboard.

---

### Step 5 — Supabase client helpers

Create three helper files:

**`src/lib/supabase/client.ts`** — browser client (for client components)
```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**`src/lib/supabase/server.ts`** — server client (for Server Components + server actions)
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

**`src/lib/supabase/service.ts`** — service role client (for trusted server-side inserts only)
```ts
import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

**`src/lib/supabase/middleware.ts`** — middleware client
```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return { supabaseResponse, user };
}
```

---

### Step 6 — Route protection middleware

Create `middleware.ts` at the project root:

```ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

---

### Step 7 — Server actions

**`src/app/actions/auth.ts`**
```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
```

**`src/app/actions/orders.ts`** — called from checkout
```ts
"use server";
import { createServiceClient } from "@/lib/supabase/service";

export async function createOrder(payload: {
  cartItems: CartItem[];
  delivery: DeliveryInfo;
  subtotal: number;
  shipping: number;
  total: number;
  discount: number;
  couponCode?: string;
}) {
  const supabase = createServiceClient();

  // 1. Upsert customer
  const { data: customer } = await supabase
    .from("customers")
    .upsert(
      { email: payload.delivery.email, first_name: payload.delivery.firstName,
        last_name: payload.delivery.lastName, phone: payload.delivery.phone },
      { onConflict: "email", ignoreDuplicates: false }
    )
    .select()
    .single();

  // 2. Create order
  const orderNumber = "OMH" + Math.floor(100000 + Math.random() * 900000);
  const { data: order } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: customer.id,
      status: "confirmed",
      subtotal: payload.subtotal,
      shipping: payload.shipping,
      total: payload.total,
      discount: payload.discount,
      coupon_code: payload.couponCode,
      payment_method: payload.delivery.paymentMethod,
      gift_message: payload.delivery.giftMessage,
      shipping_address: {
        address: payload.delivery.address,
        city: payload.delivery.city,
        state: payload.delivery.state,
        pincode: payload.delivery.pincode,
      },
    })
    .select()
    .single();

  // 3. Insert line items
  await supabase.from("order_items").insert(
    payload.cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_price: item.product.price,
      quantity: item.quantity,
      selected_variants: item.selectedVariants ?? {},
      line_total: item.product.price * item.quantity,
    }))
  );

  return { orderNumber };
}
```

**`src/app/actions/leads.ts`** — called from custom orders form
```ts
"use server";
import { createServiceClient } from "@/lib/supabase/service";

export async function createLead(formData: CustomOrderFormData) {
  const supabase = createServiceClient();
  await supabase.from("custom_order_requests").insert({
    name: formData.name,
    company: formData.company,
    email: formData.email,
    phone: formData.phone,
    category: formData.category,
    occasion: formData.occasion,
    quantity: formData.quantity ? parseInt(formData.quantity) : null,
    budget: formData.budget,
    deadline: formData.deadline || null,
    requirements: formData.requirements,
    has_logo: formData.hasLogo,
    status: "new",
  });
}
```

---

### Step 8 — Admin pages

#### `/admin/login` — Login page
Simple centered form with email + password inputs. Calls `login()` server action. Uses brand golden button styling.

#### `/admin` — Dashboard
4 metric cards (total revenue, total orders, new customers this month, open leads) + recent orders table (last 10) + recent leads (last 5).

#### `/admin/orders` — Orders list
Searchable, filterable table:

| Column | Description |
|--------|-------------|
| Order # | Clickable link to detail |
| Customer | Name + email |
| Date | Created at |
| Items | Count of line items |
| Total | ₹ amount |
| Payment | Razorpay / UPI / COD |
| Status | Badge (Confirmed / Processing / Shipped / Delivered / Cancelled) |

Status filter chips at top. Search by order number or customer name.

#### `/admin/orders/[id]` — Order detail
- Customer info block (name, email, phone)
- Shipping address
- Line items table (product, variant, qty, price, line total)
- Order totals (subtotal, shipping, discount, total)
- Gift message (if any)
- **Status dropdown** — update order status (saves immediately)

#### `/admin/customers` — Customers list
Searchable table:

| Column | Description |
|--------|-------------|
| Name | Full name |
| Email | Contact email |
| Phone | Phone number |
| Company | Company name (if any) |
| Orders | Total order count |
| Spent | Total ₹ across all orders |
| Since | Account created date |

#### `/admin/customers/[id]` — Customer profile
- Contact info card (editable phone, company)
- Tags (VIP, corporate, repeat customer)
- Order history table
- **Notes textarea** — free-form admin notes (auto-saves)

#### `/admin/leads` — Custom order requests
Filterable by status. Table view:

| Column | Description |
|--------|-------------|
| Name | Requester name |
| Company | Company name |
| Category | Gift category |
| Occasion | Target occasion |
| Quantity | Units requested |
| Budget | Budget range |
| Deadline | Required by date |
| Status | Badge (New / Contacted / Quoted / Won / Lost) |

#### `/admin/leads/[id]` — Lead detail
- Full contact info
- Order requirements
- Budget + deadline
- Logo/branding request indicator
- **Status dropdown** (New → Contacted → Quoted → Won / Lost)
- **Admin notes** textarea (for quotes sent, call notes, etc.)

---

## Wiring the Storefront

### Checkout (`src/app/checkout/page.tsx`)
On the final "Place Order" step, instead of generating a random order number locally:

```ts
// Before (local only):
const orderNumber = "OMH" + Math.floor(100000 + Math.random() * 900000);

// After (saves to Supabase):
const { orderNumber } = await createOrder({
  cartItems: cartState.items,
  delivery: formData,
  subtotal,
  shipping,
  total,
  discount,
  couponCode: appliedCoupon,
});
```

Then clear the cart and redirect to `/order-confirmation?order=${orderNumber}`.

### Custom Orders (`src/app/custom-orders/page.tsx`)
On form submission, after validation:

```ts
// Before (client-side only):
setIsSubmitted(true);

// After (saves lead to Supabase):
await createLead(formData);
setIsSubmitted(true);
```

---

## Admin UI Design Principles

- **Background:** `bg-cream` (`#FFF9EE`) — consistent with the storefront
- **Sidebar:** White with `bg-golden` active link indicator
- **Stat cards:** White cards with colored left border
- **Status badges:** Yellow (new/confirmed), Blue (processing/contacted), Green (delivered/won), Red (cancelled/lost), Purple (quoted/shipped)
- **Tables:** White background, subtle borders, row hover highlight
- **Buttons:** Reuse `.btn-primary` (golden) and `.btn-outline` from `globals.css`
- **Typography:** Same font and color tokens as storefront

---

## File Map (Complete)

```
New files:
  middleware.ts
  src/lib/supabase/client.ts
  src/lib/supabase/server.ts
  src/lib/supabase/service.ts
  src/lib/supabase/middleware.ts
  src/app/actions/auth.ts
  src/app/actions/orders.ts
  src/app/actions/leads.ts
  src/app/actions/admin/orders.ts
  src/app/actions/admin/customers.ts
  src/app/actions/admin/leads.ts
  src/app/actions/admin/analytics.ts
  src/app/admin/layout.tsx
  src/app/admin/page.tsx
  src/app/admin/login/page.tsx
  src/app/admin/orders/page.tsx
  src/app/admin/orders/[id]/page.tsx
  src/app/admin/customers/page.tsx
  src/app/admin/customers/[id]/page.tsx
  src/app/admin/leads/page.tsx
  src/app/admin/leads/[id]/page.tsx

Modified files:
  src/app/checkout/page.tsx        ← call createOrder server action
  src/app/custom-orders/page.tsx   ← call createLead server action
```

---

## Verification Checklist

- [ ] `/admin` redirects to `/admin/login` when logged out
- [ ] Login with Supabase admin credentials lands on dashboard
- [ ] Complete a checkout on the storefront → order appears in `/admin/orders`
- [ ] Submit custom order form → lead appears in `/admin/leads`
- [ ] Update order status in admin → badge updates and persists on refresh
- [ ] Add customer notes → notes persist on refresh
- [ ] Update lead status → pipeline status changes
- [ ] Dashboard metrics reflect real data
- [ ] Logout redirects back to `/admin/login`
- [ ] Direct access to `/admin/*` while logged out redirects to login
