# IndriyaX

India's premier optometry education platform — connecting eye care professionals through events, workshops, and curated medical news.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create a .env.local file in the root (see Environment Variables section)

# 3. Run the development server
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
```

> **Important:** Change all values before deploying to production.

---

## Project Structure

```
INDRIYAX/
├── app/                        # Next.js App Router
│   ├── (public)/               # Public-facing pages (no auth required)
│   │   ├── page.tsx            # Home page
│   │   ├── about/page.tsx      # About page
│   │   ├── contact/page.tsx    # Contact page
│   │   ├── news/page.tsx       # Medical news listing
│   │   ├── register/page.tsx   # Event registration (Google Form embed)
│   │   └── events/
│   │       ├── upcoming/page.tsx       # Upcoming events list
│   │       ├── past/page.tsx           # Past events list
│   │       └── [slug]/page.tsx         # Individual event detail page
│   ├── (auth)/                 # Auth pages (currently unused/placeholder)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (admin)/                # Admin panel (protected by middleware)
│   │   └── admin/
│   │       ├── layout.tsx              # Admin shell with sidebar + topbar
│   │       ├── login/page.tsx          # Admin login page
│   │       ├── dashboard/page.tsx      # Stats overview + quick actions
│   │       ├── events/page.tsx         # Events grid with edit/delete/restrict/hide
│   │       ├── events/add/page.tsx     # Add new event form
│   │       └── events/[id]/edit/page.tsx  # Edit event form + access control toggles
│   ├── api/                    # API routes (stubs — ready for DB integration)
│   │   ├── auth/route.ts       # Public auth endpoint placeholder
│   │   ├── events/route.ts     # GET/POST events
│   │   ├── news/route.ts       # GET/POST news
│   │   ├── subscriptions/route.ts  # GET status / POST purchase / DELETE cancel (stub)
│   │   └── admin/
│   │       ├── auth/           # Admin login/logout API
│   │       ├── events/         # Admin event CRUD API (GET, POST, PATCH, DELETE)
│   │       └── subscriptions/  # Admin subscription management (stub)
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout (Navbar + Footer)
│
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx    # Admin navigation sidebar
│   │   └── AdminTopbar.tsx     # Admin top bar
│   ├── cards/
│   │   ├── EventCard.tsx       # Reusable event card
│   │   └── NewsCard.tsx        # Reusable news card
│   ├── layout/
│   │   ├── Navbar.tsx          # Public site navbar
│   │   └── Footer.tsx          # Public site footer
│   └── ui/
│       ├── AnimateIn.tsx       # Framer Motion fade-in wrapper
│       └── SectionHeader.tsx   # Reusable section heading
│
├── config/
│   ├── site.ts                 # Site-wide config (name, links, contact info, nav)
│   ├── auth.ts                 # Auth config (NextAuth stub)
│   └── db.ts                   # Database client stub (Prisma / Mongoose)
│
├── lib/
│   ├── data/index.ts           # Static mock data (events + news arrays)
│   ├── hooks/index.ts          # Custom React hooks
│   ├── models/
│   │   ├── Event.ts            # Mongoose Event model stub
│   │   ├── News.ts             # Mongoose News model stub
│   │   ├── User.ts             # Mongoose User model stub
│   │   ├── Payment.ts          # Mongoose Payment model stub
│   │   └── Subscription.ts     # Mongoose Subscription model stub (backend dev)
│   ├── utils/index.ts          # Utility functions
│   └── validators/index.ts     # Zod / validation schemas
│
├── services/
│   ├── authService.ts          # Auth business logic
│   ├── eventService.ts         # Event fetch/mutation logic
│   ├── newsService.ts          # News fetch/mutation logic
│   └── subscriptionService.ts  # Subscription logic stub (backend dev)
│
├── store/index.ts              # Global state (Zustand / Context stub)
├── styles/custom.css           # Additional custom CSS
├── types/
│   ├── event.ts                # Event TypeScript interface
│   └── news.ts                 # News TypeScript interface
│
├── middleware.ts               # Protects /admin/* routes
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Pages & What They Do

### Public Pages

| Route | Description |
|---|---|
| `/` | Home — hero section, stats, preview of upcoming events and latest news, CTA to register |
| `/events/upcoming` | Grid of all upcoming events with cards |
| `/events/past` | Grid of all past events with cards |
| `/events/[slug]` | Individual event detail — thumbnail, speaker, date, venue, description, summary (past), recording link (past), or register button (upcoming) |
| `/news` | Grid of all medical news articles |
| `/about` | About IndriyaX — founder card, mission, vision, stats, partnerships |
| `/contact` | Contact info cards (email, phone, address, hours) + embedded Google Map |
| `/register` | Embedded Google Form for event registration |

### Admin Panel (`/admin/*`)

All admin routes are protected — unauthenticated users are redirected to `/admin/login`.

| Route | Description |
|---|---|
| `/admin/login` | Login form — submits to `/api/admin/auth`, sets `admin_session` cookie on success |
| `/admin/dashboard` | Overview stats (upcoming events, past events, news count), recent events list, quick actions, next event widget |
| `/admin/events` | Grid of all events (upcoming + past) with edit, delete, restrict, and hide/show actions |
| `/admin/events/add` | Add new event form |
| `/admin/events/[id]/edit` | Edit any event — all fields + access control toggles (restrict / hide) |

---

## Authentication

Admin auth uses a simple **cookie-based session**:

1. POST credentials to `/api/admin/auth`
2. Server validates against `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars
3. On success, sets an `admin_session=authenticated` cookie
4. `middleware.ts` checks this cookie on every `/admin/*` request and redirects to login if missing

> This is a lightweight auth system. For production, replace with NextAuth.js or a proper JWT implementation. The stubs are already in `config/auth.ts` and `app/api/auth/route.ts`.

---

## Data Layer

Currently, all data lives in **`lib/data/index.ts`** as static arrays. This is intentional — the project is structured so you can swap it out for a real database with minimal changes.

**Event shape (`types/event.ts`):**
```ts
interface Event {
  id: string;
  slug: string;
  title: string;
  type: "upcoming" | "past";
  thumbnail: string;       // URL
  description: string;
  speaker: string;
  date: string;            // ISO date string e.g. "2025-08-15"
  venue: string;
  summary?: string;        // Only for past events
  recordingLink?: string;  // Only for past events
  restricted?: boolean;    // true = only subscribed users can view full details
  isActive?: boolean;      // false = hidden from all public listings
}
```

**News shape (`types/news.ts`):**
```ts
interface News {
  id: string;
  title: string;
  description: string;
  link: string;   // External article URL
  image: string;  // URL
}
```

### Connecting a Database

1. Set up your DB client in `config/db.ts` (Prisma or Mongoose stubs are already commented in)
2. Replace the static imports in pages with calls to `services/eventService.ts` and `services/newsService.ts`
3. Wire up the API routes in `app/api/events/route.ts` and `app/api/news/route.ts`

---

## Event Access Control (Restriction & Subscription)

> **Frontend is complete.** The admin UI exposes all controls. Everything below is for the **backend developer** to implement.

### How It Works

Each event has two access control flags stored in the database:

| Field | Type | Meaning |
|---|---|---|
| `restricted` | `boolean` | `true` = only users with an active subscription can view full event details |
| `isActive` | `boolean` | `false` = event is hidden from all public listings (upcoming/past pages, home page) |

### Admin Controls (already built)

In `/admin/events`, the admin can:
- **Edit** any event (all fields + access control toggles)
- **Restrict** an event — locks full details behind a subscription paywall
- **Hide** an event — removes it from all public pages without deleting it
- **Delete** an event permanently

These actions call `PATCH /api/admin/events/:id` and `DELETE /api/admin/events/:id`.

### What the Backend Developer Must Implement

#### 1. Update the Event Model (`lib/models/Event.ts`)
Add these fields to the Mongoose schema:
```js
restricted: { type: Boolean, default: false },
isActive:   { type: Boolean, default: true },
```

#### 2. Wire up `PATCH /api/admin/events/[id]/route.ts`
Accept a partial event body and update the document in MongoDB. Already stubbed.

#### 3. Gate restricted events on the public API
In `app/api/events/[slug]/route.ts` (or the server component `app/(public)/events/[slug]/page.tsx`):
```ts
if (event.restricted && !hasActiveSubscription(userId)) {
  // Option A: return 403
  // Option B: return partial data (title/date/venue only, no description/recording)
  // Option C: redirect to /subscribe
}
```

#### 4. Filter hidden events from public listings
In `app/api/events/route.ts` and `services/eventService.ts`:
```ts
// Only return events where isActive === true
const events = await EventModel.find({ isActive: true });
```

---

## Subscription System

> All stubs are in place. Backend developer implements the logic.

### Relevant Files

| File | Purpose |
|---|---|
| `lib/models/Subscription.ts` | Mongoose model stub — fields, schema, comments |
| `services/subscriptionService.ts` | Business logic stub — `hasActiveSubscription()`, `createSubscription()`, etc. |
| `app/api/subscriptions/route.ts` | Public API — GET status, POST to initiate purchase, DELETE to cancel |
| `app/api/admin/subscriptions/route.ts` | Admin API — list all subscriptions, manually grant access |

### Subscription Model Fields

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId (ref User) | The subscriber |
| `plan` | `"monthly"` \| `"annual"` | Subscription tier |
| `status` | `"active"` \| `"expired"` \| `"cancelled"` | Current state |
| `startDate` | Date | When subscription began |
| `endDate` | Date | When subscription expires |
| `paymentId` | ObjectId (ref Payment) | Last successful payment |

### Suggested Plans

| Plan | Price | Duration |
|---|---|---|
| Monthly | ₹199/month | 30 days access to all restricted events |
| Annual | ₹1499/year | 365 days access to all restricted events |

### Payment Flow

1. User clicks "Subscribe" on a restricted event or `/subscribe` page
2. Frontend calls `POST /api/subscriptions` with `{ plan: "monthly" | "annual" }`
3. Backend creates a Razorpay/Stripe order, returns `{ orderId, amount, currency }`
4. User completes payment on frontend (Razorpay checkout)
5. Frontend calls `POST /api/payments` with payment verification data
6. Backend verifies signature, calls `createSubscription()`, sets `status = "active"`
7. User can now access all restricted events

See `app/api/payments/route.ts` and `lib/models/Payment.ts` for payment stubs.

### Checking Subscription in Server Components

```ts
// In app/(public)/events/[slug]/page.tsx
import { hasActiveSubscription } from "@/services/subscriptionService";

const session = await getServerSession(); // or Clerk auth()
const isSubscribed = session ? await hasActiveSubscription(session.user.id) : false;

if (event.restricted && !isSubscribed) {
  // Show teaser / lock UI — do NOT expose recordingLink or full description
}
```

### Environment Variables to Add

```env
# Payment gateway (choose one)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
# or
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Site Configuration

All global site info (name, contact details, nav links, social URLs) is in **`config/site.ts`**. Update this file to change anything site-wide.

---

## Registration Form

The `/register` page embeds a Google Form via `<iframe>`. To connect your own form:

1. Create a Google Form
2. Click **Send → Embed** and copy the `src` URL
3. Replace `GOOGLE_FORM_URL` in `app/(public)/register/page.tsx`

---

## Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 15 | Framework (App Router, SSR, API routes) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations (`AnimateIn` component) |
| react-icons | Icon library (Remix Icons set) |

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

1. Push the repo to GitHub
2. Import the project on Vercel
3. Add all `.env.local` variables in the Vercel dashboard under **Settings → Environment Variables**
4. Deploy

> Make sure to update `NEXT_PUBLIC_APP_URL` to your production domain and rotate all secrets before going live.
