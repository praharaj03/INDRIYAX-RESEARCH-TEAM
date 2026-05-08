# Backend Integration Guide — IndriyaX

This document is for the **backend developer** joining the project.
The frontend is complete. Your job is to wire up the data layer.

---

## Stack to Integrate

| Layer | Technology |
|---|---|
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | Clerk (`@clerk/nextjs`) |
| Payments | Razorpay (India) or Stripe |
| User sync | Clerk Webhooks → MongoDB |

---

## 1. Environment Variables

Fill in `.env.local` (already created at project root):

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/indriyax
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/register
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

---

## 2. Install Dependencies

```bash
npm install mongoose @clerk/nextjs svix razorpay
```

---

## 3. Files to Implement (all have TODO comments)

### DB Connection
- `lib/db/mongoose.ts` — Mongoose singleton connection

### Models
- `lib/models/Event.ts` — Event schema
- `lib/models/News.ts` — News schema
- `lib/models/Registration.ts` — Event registration schema
- `lib/models/Payment.ts` — Payment record schema
- `lib/models/User.ts` — User profile (synced from Clerk)

### Config
- `config/db.ts` — re-export `connectDB` from `lib/db/mongoose.ts`
- `config/auth.ts` — Clerk auth options if needed

### Services (replace static returns with DB calls)
- `services/eventService.ts`
- `services/newsService.ts`
- `services/authService.ts`

### API Routes (all return 501 stubs, implement each)
| Route | Method | Purpose |
|---|---|---|
| `app/api/events/route.ts` | GET | List all events from DB |
| `app/api/news/route.ts` | GET | List all news from DB |
| `app/api/registrations/route.ts` | GET, POST | User's registrations (Clerk auth required) |
| `app/api/payments/route.ts` | POST, PATCH | Create & verify payments |
| `app/api/admin/events/route.ts` | GET, POST | Admin: list & create events |
| `app/api/admin/events/[id]/route.ts` | GET, PATCH, DELETE | Admin: single event CRUD |
| `app/api/admin/news/route.ts` | GET, POST | Admin: list & create news |
| `app/api/admin/news/[id]/route.ts` | PATCH, DELETE | Admin: single news CRUD |
| `app/api/admin/registrations/route.ts` | GET | Admin: all registrations |
| `app/api/admin/payments/route.ts` | GET | Admin: all payments |
| `app/api/webhooks/clerk/route.ts` | POST | Sync Clerk users → MongoDB |

### Pages to Activate
- `app/(public)/register/page.tsx` — Replace UI mockup with `<SignUp />` from `@clerk/nextjs`
- `app/(public)/dashboard/page.tsx` — Replace mock data with `currentUser()` + DB queries
- `components/layout/Navbar.tsx` — Replace Register button with Clerk `<UserButton />` when signed in

### Wrap Root Layout
In `app/layout.tsx`, wrap with `<ClerkProvider>`:
```tsx
import { ClerkProvider } from "@clerk/nextjs";
// wrap <html> with <ClerkProvider>
```

---

## 4. Admin Panel

The admin panel at `/admin/*` is fully built with UI.
The Add Event form at `/admin/events/add` POSTs to `/api/admin/events`.
Wire that route to `EventModel.create()`.

Admin auth uses a simple cookie session (see `app/api/admin/auth/route.ts`).
Credentials are in `.env.local` → `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

---

## 5. Payments Flow (Razorpay)

1. User registers for event → POST `/api/registrations` → creates Registration (status: pending)
2. POST `/api/payments` → create Razorpay order → return `orderId` to frontend
3. Frontend opens Razorpay checkout
4. On success → PATCH `/api/payments` with `providerPaymentId` → set status: paid
5. Registration status → confirmed

---

## 6. Clerk Webhook Setup

1. Go to Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://yourdomain.com/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`, `user.deleted`
4. Copy Signing Secret → `CLERK_WEBHOOK_SECRET` in `.env.local`
5. Implement `app/api/webhooks/clerk/route.ts` using `svix` to verify + sync to `UserModel`
