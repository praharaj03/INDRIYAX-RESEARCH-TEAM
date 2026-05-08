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
| Clerk | Authentication & session management |
| Supabase PostgreSQL | Primary database |
| Supabase Storage | File/image storage |
| Prisma ORM | Database abstraction |
| Razorpay / Stripe | Payment gateway |
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
   ┌─────────┼─────────┐
   ▼         ▼         ▼
Clerk     Supabase   Supabase
Auth      PostgreSQL  Storage
             │
             ▼
         Prisma ORM
             │
             ▼
      Payment Gateways
     (Razorpay / Stripe)
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
│   │   ├── clerk.config.js
│   │   ├── supabase.config.js
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

## Authentication (Clerk)

Clerk handles authentication, OAuth, session management, and token lifecycle. The backend verifies Clerk JWTs on every protected request.

```
Frontend Login → Clerk Authenticates → Session Token Issued
→ Bearer Token Sent → Backend Verifies JWT → Request Authorized
```

An internal `User` table is maintained in PostgreSQL to track subscriptions, payments, roles, and analytics independently of Clerk.

---

## Database Schema (Prisma)

### User
```prisma
model User {
  id            String   @id @default(cuid())
  clerkId       String   @unique
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
  id               String        @id @default(cuid())
  userId           String
  plan             Plan
  amount           Int
  currency         String
  paymentGateway   String
  gatewayPaymentId String
  gatewayOrderId   String
  status           PaymentStatus
  createdAt        DateTime      @default(now())
  user             User @relation(fields: [userId], references: [id])
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

## Payment Flow (Razorpay)

```
User Selects Plan
  → Backend Creates Razorpay Order
  → Frontend Opens Razorpay Checkout
  → Payment Completed
  → Backend Verifies Signature (HMAC SHA-256)
  → Payment Record Stored
  → Subscription Activated
  → Success Response
```

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

CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

JWT_SECRET=

FRONTEND_URL=https://indriyax.com
```

---

## Development Roadmap

| Phase | Scope |
|---|---|
| **Phase 1** | Core infrastructure — Express, Prisma, Clerk, Supabase, logging, error handling, validation |
| **Phase 2** | Events & News — CRUD, admin management, uploads, pagination, filtering |
| **Phase 3** | Payments & Subscriptions — Razorpay, verification, access control, discount system |
| **Phase 4** | Production hardening — optimization, security, monitoring, Swagger docs, testing, audit logs |

---

## Deployment

| Platform | Notes |
|---|---|
| Railway | Recommended for MVP |
| Render | Good alternative |
| AWS ECS | Enterprise scale |
| DigitalOcean | Solid mid-tier option |

**Database & Storage:** Supabase (managed PostgreSQL + object storage)

---

## Final Stack Summary

```
Frontend   →  Next.js
Backend    →  Node.js + Express.js
Auth       →  Clerk
Database   →  Supabase PostgreSQL
Storage    →  Supabase Storage
ORM        →  Prisma
Payments   →  Razorpay / Stripe
Validation →  Zod
Logging    →  Winston / Pino
```