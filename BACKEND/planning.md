# IndriyaX Backend

> Production-grade, FAANG-level scalable backend for the IndriyaX platform.

---

## Overview

IndriyaX backend is a dedicated **Node.js + Express.js** REST API service built following enterprise backend engineering standards. The frontend (Next.js) is already complete — this service powers all data, authentication, payments, and business logic.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API server |
| Supabase Auth | Authentication & session management |
| Supabase PostgreSQL | Primary database |
| Supabase Storage | File/image storage |
| Prisma ORM | Database abstraction |
| UPI / QR Code | Manual payment collection |
| Bravo | Transactional emails |
| Zod | Request validation |
| JWT | Internal tokens / admin security |
| Winston / Pino | Logging |

---

## System Architecture

```
┌──────────────────────────┐
│     Next.js Frontend     │
└────────────┬─────────────┘
             │ HTTPS
             ▼
┌──────────────────────────┐
│    Express.js Backend    │
│    REST API Server       │
└────────────┬─────────────┘
             │
   ┌─────────┼──────────────┐
   ▼         ▼              ▼
Supabase  Supabase       Supabase
Auth      PostgreSQL      Storage
             │
             ▼
         Prisma ORM
             │
             ▼
   Manual Payment Verification
      (UPI / QR + Admin)
```

---

## Layered Architecture

```
Route Layer
    ↓
Controller Layer   →  Request/response handling
    ↓
Service Layer      →  Business logic
    ↓
Repository Layer   →  Database operations
    ↓
Database Layer
```

| Layer | Responsibility |
|---|---|
| Routes | API endpoint definitions |
| Controllers | Request parsing, response sending |
| Services | Business logic, authorization, orchestration |
| Repositories | Prisma queries, database operations |
| Validators | Input validation via Zod |
| Middlewares | Auth, error handling, security |
| Utils | Shared reusable helpers |

---

## Folder Structure

```
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── env.config.js
│   │   ├── prisma.config.js
│   │   ├── supabase.config.js        ← Auth + DB + Storage client
│   │   └── logger.config.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.validator.js
│   │   │   ├── auth.middleware.js
│   │   │   └── auth.types.js
│   │   │
│   │   ├── events/
│   │   │   ├── event.routes.js
│   │   │   ├── event.controller.js
│   │   │   ├── event.service.js
│   │   │   ├── event.repository.js
│   │   │   ├── event.validator.js
│   │   │   ├── event.constants.js
│   │   │   └── event.types.js
│   │   │
│   │   ├── news/
│   │   ├── subscriptions/
│   │   ├── payments/
│   │   ├── uploads/
│   │   └── admin/
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── requestLogger.middleware.js
│   │   └── notFound.middleware.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── shared/
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── utils/
│   │   ├── helpers/
│   │   ├── responses/
│   │   ├── exceptions/
│   │   └── validators/
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   └── docs/
│       └── swagger/
│
├── tests/
│   ├── integration/
│   └── unit/
│
├── logs/
│   ├── combined.log
│   ├── error.log
│   ├── payment.log
│   └── security.log
│
├── .env
├── package.json
├── Dockerfile
└── README.md
```

---

## Authentication (Supabase Auth)

Supabase Auth handles the full authentication lifecycle — sign up, sign in, OAuth (Google, GitHub, etc.), email verification, password reset, and JWT session management. No external auth provider is needed.

```
Frontend Login / Sign Up
       ↓
Supabase Auth (email / OAuth)
       ↓
Supabase Issues JWT Access Token
       ↓
Frontend Sends Bearer Token
       ↓
Backend Verifies JWT via Supabase
       ↓
Request Authorized
```

### Auth Middleware

```js
import { supabase } from '../config/supabase.config.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw new UnauthorizedException('No token provided');

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) throw new UnauthorizedException('Invalid or expired token');

  req.user = user;
  next();
};
```

### Supabase Client Setup

```js
// config/supabase.config.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

> The **service role key** is used server-side only. It bypasses Row Level Security and must never be exposed to the frontend.

### User Synchronization

Supabase Auth manages credentials, but an internal `User` table in PostgreSQL is maintained via Prisma to track:

- subscription status
- payment history
- admin roles
- analytics and activity

A user record is created or synced on first authenticated request using the Supabase `auth.uid()` as the foreign key.

---

## Database Schema (Prisma)

### User
```prisma
model User {
  id            String   @id @default(cuid())
  supabaseId    String   @unique          // maps to auth.uid() from Supabase Auth
  email         String   @unique
  fullName      String?
  imageUrl      String?
  role          Role     @default(USER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  subscriptions Subscription[]
  payments      Payment[]
}
```

### Event
```prisma
model Event {
  id            String    @id @default(cuid())
  slug          String    @unique
  title         String
  description   String
  speaker       String
  thumbnail     String
  venue         String
  type          EventType
  restricted    Boolean   @default(false)
  isActive      Boolean   @default(true)
  summary       String?
  recordingLink String?
  date          DateTime
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Subscription
```prisma
model Subscription {
  id         String             @id @default(cuid())
  userId     String
  plan       Plan
  status     SubscriptionStatus
  startDate  DateTime
  expiryDate DateTime
  createdAt  DateTime           @default(now())

  user       User @relation(fields: [userId], references: [id])
}
```

### Payment
```prisma
model Payment {
  id              String        @id @default(cuid())
  userId          String
  plan            Plan
  amount          Int           // Exact INR amount e.g. 199

  // Manual Verification Data
  utr             String?       @unique
  screenshotUrl   String?

  status          PaymentStatus @default(PENDING)

  // Admin Review Tracking
  reviewedById    String?
  rejectionReason String?
  reviewedAt      DateTime?

  // Relations
  user            User          @relation("UserPayments", fields: [userId], references: [id], onDelete: Cascade)
  reviewer        User?         @relation("AdminReviewer", fields: [reviewedById], references: [id])

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([userId])
  @@index([utr])
  @@index([status])
}
```

---

## API Design

### Versioned Endpoints
```
/api/v1/events
/api/v1/payments
/api/v1/admin
```

### REST Conventions
```
GET    /events             → List events (paginated)
GET    /events/:slug       → Single event
POST   /admin/events       → Create event
PATCH  /admin/events/:id   → Update event
DELETE /admin/events/:id   → Delete event
```

### Pagination
All list endpoints support:
```
?page=1&limit=10
```
Along with filtering, sorting, and searching.

### Standard Response Structure

**Success**
```json
{
  "success": true,
  "message": "Events fetched successfully",
  "data": []
}
```

**Error**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Validation (Zod)

All request bodies are validated before reaching the controller.

```js
export const createEventSchema = z.object({
  title:       z.string().min(3),
  description: z.string().min(10),
  speaker:     z.string(),
  venue:       z.string()
});
```

Applied via:
```js
router.post('/', validate(createEventSchema), eventController.createEvent);
```

---

## Error Handling

Custom exception classes with a central error middleware:

```
BadRequestException
UnauthorizedException
ForbiddenException
NotFoundException
ConflictException
```

All unhandled errors are caught by `app.use(errorMiddleware)` which returns structured, production-safe responses with full logging.

---

## Payment System (Manual UPI Verification)

IndriyaX uses a manual UPI/QR-based payment verification flow — no payment gateway required. This keeps the MVP simple, cheap, and fully under admin control.

### Full Payment Flow

```
User Selects Plan (e.g. Pro → ₹199)
       ↓
Frontend Shows QR Code + UPI ID + Amount
       ↓
User Pays via UPI App
       ↓
User Submits Verification Form (UTR + optional screenshot)
       ↓
Backend Creates PENDING Payment Record
       ↓
Confirmation Email Sent to User
       ↓
Frontend Shows "Verification Pending" (est. 1–6 hours)
       ↓
Admin Reviews in Dashboard (UTR / bank statement check)
       ↓
Admin Approves or Rejects
       ↓
On Approval → payment.status = SUCCESS
            → subscription.status = ACTIVE
            → Success Email Sent to User
```

### Payment Status Lifecycle

```
PENDING → SUCCESS
        → REJECTED
        → EXPIRED
```

### User Submission Form Fields

| Field | Required |
|---|---|
| UTR / Transaction ID | YES |
| Screenshot | Optional |
| Plan | YES |

### Admin Dashboard View

| User | Plan | Amount | UTR | Screenshot | Status | Actions |
|---|---|---|---|---|---|---|
| user@email.com | PRO | ₹199 | 234234234 | view | PENDING | Approve / Reject |

---

## Supabase Storage

Buckets:
- `event-thumbnails`
- `news-images`
- `admin-assets`

Upload flow: validate file → upload to bucket → get public URL → store URL in PostgreSQL.

---

## Security

| Practice | Implementation |
|---|---|
| Secure HTTP headers | `helmet()` |
| CORS restriction | `origin: ['https://indriyax.com']` |
| Request size limit | `express.json({ limit: '10mb' })` |
| File validation | MIME type, size, extension checks |
| Internal auth | JWT for admin APIs and service-to-service calls |
| Service role key | Server-side only, never exposed to client |

---

## Logging

| Log | Purpose |
|---|---|
| `combined.log` | All API traffic |
| `error.log` | Runtime errors |
| `payment.log` | Financial tracing |
| `security.log` | Auth events and anomalies |

---

## Environment Variables

```env
PORT=5000
NODE_ENV=production

DATABASE_URL=
DIRECT_URL=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

# Email (Nodemailer / Resend)
EMAIL_FROM=
RESEND_API_KEY=

# UPI Details (served to frontend for QR display)
UPI_ID=payments@upi
UPI_QR_IMAGE_URL=

JWT_SECRET=

FRONTEND_URL=https://indriyax.com
```

> `SUPABASE_SERVICE_ROLE_KEY` is used exclusively on the backend. `SUPABASE_ANON_KEY` is safe for the frontend.

---

## Development Roadmap

| Phase | Scope |
|---|---|
| **Phase 1** | Core infrastructure — Express, Prisma, Supabase Auth, logging, error handling, validation |
| **Phase 2** | Events & News — CRUD, admin management, uploads, pagination, filtering |
| **Phase 3** | Payments & Subscriptions — UPI/QR flow, manual UTR submission, admin approval, email notifications, subscription activation |
| **Phase 4** | Production hardening — optimization, security, monitoring, Swagger docs, testing, audit logs |

---

## Deployment

| Platform | Notes |
|---|---|
| Railway | Recommended for MVP |
| Render | Good alternative |
| AWS ECS | Enterprise scale |
| DigitalOcean | Solid mid-tier option |

**Database, Auth & Storage:** Supabase (fully managed)

---

## Final Stack Summary

```
Frontend   →  Next.js
Backend    →  Node.js + Express.js
Auth       →  Supabase Auth
Database   →  Supabase PostgreSQL
Storage    →  Supabase Storage
ORM        →  Prisma
Payments   →  UPI / QR (Manual Verification)
Email      →  Nodemailer / Resend
Validation →  Zod
Logging    →  Winston / Pino
```