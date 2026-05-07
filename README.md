# IndriyaX

India's premier optometry education platform — connecting eye care professionals through events, workshops, and curated medical news.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
ADMIN_JWT_SECRET=change-this-to-a-long-random-secret-before-deploy
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment gateway (choose one)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
# or
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> **Important:** Rotate all secrets before deploying to production.

---

## Project Structure

```
INDRIYAX/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Home page
│   │   ├── about/page.tsx              # About page
│   │   ├── contact/page.tsx            # Contact page
│   │   ├── news/page.tsx               # Medical news listing
│   │   ├── subscribe/page.tsx          # 3-tier subscription pricing page
│   │   ├── register/page.tsx           # Google Form embed
│   │   └── events/
│   │       ├── upcoming/page.tsx
│   │       ├── past/page.tsx
│   │       └── [slug]/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx              # User login
│   │   └── signup/page.tsx             # User signup with plan selector
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── login/page.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── events/page.tsx
│   │       ├── events/add/page.tsx
│   │       ├── events/[id]/edit/page.tsx
│   │       ├── payments/page.tsx       # Payments & subscriptions dashboard
│   │       └── analytics/page.tsx
│   ├── api/
│   │   ├── auth/route.ts
│   │   ├── events/route.ts
│   │   ├── news/route.ts
│   │   ├── payments/route.ts
│   │   ├── subscriptions/route.ts
│   │   ├── registrations/route.ts
│   │   └── admin/
│   │       ├── auth/route.ts           # Admin login
│   │       ├── auth/logout/route.ts    # Admin logout
│   │       ├── events/route.ts         # GET/POST events
│   │       ├── events/[id]/route.ts    # GET/PATCH/DELETE single event
│   │       ├── news/route.ts
│   │       ├── news/[id]/route.ts
│   │       ├── payments/route.ts       # GET all payments
│   │       ├── payments/discounts/route.ts  # Discount code CRUD
│   │       ├── registrations/route.ts
│   │       └── subscriptions/route.ts  # GET/POST subscriptions
│
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminTopbar.tsx
│   │   ├── analytics/
│   │   │   ├── AnalyticsBreakdown.tsx
│   │   │   ├── AnalyticsSpeakers.tsx
│   │   │   ├── AnalyticsPerformance.tsx
│   │   │   └── AnalyticsSubscriptions.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── DashboardRecentEvents.tsx
│   │   │   ├── DashboardNextEvent.tsx
│   │   │   └── DashboardQuickActions.tsx
│   │   └── payments/
│   │       ├── PaymentKPIs.tsx         # 6 KPI stat cards
│   │       ├── RevenueChart.tsx        # Monthly stacked bar chart
│   │       ├── PlanDistribution.tsx    # Donut chart — Free/Pro/Elite split
│   │       ├── RecentTransactions.tsx  # Payments table
│   │       ├── SubscriptionRoster.tsx  # Subscribers table
│   │       └── PricingControls.tsx     # Change rates + manage discount codes
│   ├── cards/
│   │   ├── EventCard.tsx
│   │   └── NewsCard.tsx
│   ├── events/
│   │   ├── EventDetailMeta.tsx
│   │   └── EventDetailActions.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── EventsPreviewSection.tsx
│   │   ├── NewsPreviewSection.tsx
│   │   └── CTASection.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── AnimateIn.tsx
│       └── SectionHeader.tsx
│
├── config/
│   ├── site.ts                         # Nav links, contact info, social URLs
│   ├── auth.ts                         # Auth config stub
│   └── db.ts                           # DB client stub (Mongoose / Prisma)
│
├── lib/
│   ├── data/index.ts                   # Static mock data (events + news)
│   ├── db/mongoose.ts                  # Mongoose connection helper
│   ├── models/
│   │   ├── Event.ts
│   │   ├── News.ts
│   │   ├── User.ts
│   │   ├── Payment.ts
│   │   ├── Subscription.ts
│   │   └── Registration.ts
│   ├── hooks/index.ts
│   ├── utils/index.ts
│   └── validators/index.ts
│
├── services/
│   ├── authService.ts
│   ├── eventService.ts
│   ├── newsService.ts
│   └── subscriptionService.ts
│
├── types/
│   ├── event.ts
│   └── news.ts
│
├── proxy.ts                            # Route protection (replaces middleware)
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Pages & What They Do

### Public Pages

| Route | Description |
|---|---|
| `/` | Home — hero, stats, upcoming events preview, past events preview, news preview, CTA |
| `/events/upcoming` | Grid of all upcoming events |
| `/events/past` | Grid of all past events |
| `/events/[slug]` | Event detail — thumbnail, speaker, date, venue, description, summary, recording or register CTA |
| `/news` | Medical news grid |
| `/subscribe` | 3-tier pricing page — Free, Pro (₹199/mo), Elite (₹1,499/yr) with feature comparison and FAQ |
| `/about` | About IndriyaX — founder, mission, vision, stats, partnerships |
| `/contact` | Contact cards + embedded Google Map |
| `/register` | Embedded Google Form for event registration |

### Auth Pages

| Route | Description |
|---|---|
| `/login` | User login — email + password. TODO: wire to `/api/auth/login` |
| `/signup` | User signup — name, email, password, plan selector (pre-filled from `?plan=` param) |

### Admin Panel (`/admin/*`)

All admin routes are protected by `proxy.ts` — redirects to `/admin/login` if no session cookie.

| Route | Description |
|---|---|
| `/admin/login` | Admin login — sets `admin_session` cookie (8h) |
| `/admin/dashboard` | Stats, recent events, next event widget, quick actions |
| `/admin/events` | Events grid — edit, delete, restrict, hide/show |
| `/admin/events/add` | Add new event |
| `/admin/events/[id]/edit` | Edit event + access control toggles |
| `/admin/payments` | **Payments & subscriptions dashboard** — KPIs, revenue chart, plan distribution, transactions, subscriber roster, pricing controls, discount codes |
| `/admin/analytics` | Content analytics — event breakdown, speakers, subscription stats, web performance |

---

## Authentication

### Admin Auth
Cookie-based session (`admin_session`, 8h):
1. POST to `/api/admin/auth` with `{ username, password }`
2. Validated against `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars
3. `proxy.ts` protects all `/admin/*` routes — already logged-in admins skip the login page

### User Auth (TODO — Backend Dev)
Stubs are in place at `/login`, `/signup`, `app/api/auth/route.ts`, and `services/authService.ts`.
Implement with NextAuth.js, Clerk, or a custom JWT flow.

---

## Data Layer

All data currently lives in `lib/data/index.ts` as static arrays. Swap for real DB calls with minimal changes.

**Event shape (`types/event.ts`):**
```ts
interface Event {
  id: string;
  slug: string;
  title: string;
  type: "upcoming" | "past";
  thumbnail: string;
  description: string;
  speaker: string;
  date: string;            // ISO e.g. "2025-08-15"
  venue: string;
  summary?: string;        // Past events only
  recordingLink?: string;  // Past events only
  restricted?: boolean;    // true = subscribers only
  isActive?: boolean;      // false = hidden from public
}
```

### Connecting a Database
1. Set up DB client in `config/db.ts`
2. Replace static imports with calls to `services/eventService.ts` / `services/newsService.ts`
3. Wire up API routes in `app/api/events/route.ts` and `app/api/news/route.ts`

---

## Event Access Control

Each event has two flags:

| Field | Type | Meaning |
|---|---|---|
| `restricted` | `boolean` | `true` = subscribers only can view full details |
| `isActive` | `boolean` | `false` = hidden from all public listings |

### What the Backend Developer Must Implement

**1. Event Model** (`lib/models/Event.ts`):
```js
restricted: { type: Boolean, default: false },
isActive:   { type: Boolean, default: true },
```

**2. PATCH `/api/admin/events/[id]`** — already stubbed, accept partial body and update MongoDB.

**3. Gate restricted events** in `app/(public)/events/[slug]/page.tsx`:
```ts
if (event.restricted && !hasActiveSubscription(userId)) {
  redirect("/subscribe");
}
```

**4. Filter hidden events** in `services/eventService.ts`:
```ts
const events = await EventModel.find({ isActive: true });
```

---

## Subscription System

### Plans

| Plan | Price | Duration | Access |
|---|---|---|---|
| Free | ₹0 | Forever | Browse events, news, register for free events |
| Pro | ₹199/month | 30 days | + recordings, restricted events, resources, certificates |
| Elite | ₹1,499/year | 365 days | + mentorship, VIP conference, speaker Q&A, branded kit |

### Relevant Files

| File | Purpose |
|---|---|
| `lib/models/Subscription.ts` | Mongoose model stub |
| `services/subscriptionService.ts` | `hasActiveSubscription()`, `createSubscription()`, `cancelSubscription()` stubs |
| `app/api/subscriptions/route.ts` | GET status, POST purchase, DELETE cancel |
| `app/api/admin/subscriptions/route.ts` | List all subs, manually grant access |

### Payment Flow
1. User selects plan on `/subscribe` → clicks CTA → goes to `/signup?plan=pro`
2. After signup, frontend calls `POST /api/subscriptions` with `{ plan }`
3. Backend creates Razorpay/Stripe order → returns `{ orderId, amount, currency }`
4. User completes payment on frontend
5. Frontend calls `POST /api/payments` with verification data
6. Backend verifies signature → calls `createSubscription()` → `status = "active"`

### Checking Subscription in Server Components
```ts
import { hasActiveSubscription } from "@/services/subscriptionService";

const session = await getServerSession();
const isSubscribed = session ? await hasActiveSubscription(session.user.id) : false;

if (event.restricted && !isSubscribed) {
  // Show lock UI — do NOT expose recordingLink or full description
}
```

---

## Admin Payments Dashboard (`/admin/payments`)

> **Frontend is complete.** All panels are built. Backend developer wires up the data.

### Panels

| Panel | Component | Description |
|---|---|---|
| KPI Cards | `PaymentKPIs` | Total revenue, MRR, active subscribers, Elite count, Pro count, refunds |
| Revenue Chart | `RevenueChart` | Monthly stacked bar chart — Pro + Elite — 12 months |
| Plan Distribution | `PlanDistribution` | Donut chart — Free / Pro / Elite user split |
| Recent Transactions | `RecentTransactions` | Latest payments table with status badges |
| Subscriber Roster | `SubscriptionRoster` | Full subscriber table — plan, status, start, expiry |
| Pricing Controls | `PricingControls` | Change Pro monthly rate and Elite annual rate |
| Discount Codes | `PricingControls` | Create, view, and remove discount codes |

### What the Backend Developer Must Implement

**1. Pricing (`PATCH /api/admin/payments/pricing`)**
Store plan prices in DB. The `/subscribe` page should read from this endpoint instead of hardcoded values.

**2. Discount Codes (`/api/admin/payments/discounts`)**
See `app/api/admin/payments/discounts/route.ts` for full spec. Create a `DiscountModel`:
```js
{ code, type: "percent"|"flat", value, plan: "all"|"pro"|"elite", note, usageCount, active }
```
Apply at checkout: validate code → apply to Razorpay/Stripe order amount → increment `usageCount`.

**3. Revenue Chart (`GET /api/admin/payments?group=monthly`)**
```js
PaymentModel.aggregate([
  { $match: { status: "paid" } },
  { $group: {
    _id: { month: { $month: "$createdAt" }, plan: "$plan" },
    total: { $sum: "$amount" }
  }}
])
```

**4. KPI Aggregations**
```js
// MRR  = active Pro count × 199
// ARR  = active Elite count × 1499
// Active = SubscriptionModel.countDocuments({ status: "active" })
```

**5. Transactions Table (`GET /api/admin/payments`)**
```js
PaymentModel.find().sort({ createdAt: -1 }).limit(20).populate("userId", "name email")
```

**6. Subscriber Roster (`GET /api/admin/subscriptions`)**
Already stubbed. Return paginated subscriptions with user info populated.

---

## Site Configuration

All global site info is in `config/site.ts` — name, nav links, contact details, social URLs.

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 15 | Framework (App Router, SSR, API routes) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| react-icons | Icons (Remix Icons) |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add all `.env.local` variables under **Settings → Environment Variables**
4. Deploy

> Update `NEXT_PUBLIC_APP_URL` to your production domain and rotate all secrets before going live.
