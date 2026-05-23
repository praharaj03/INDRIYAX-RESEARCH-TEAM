import { NextResponse } from "next/server";

// TODO (Backend Dev): Public subscription endpoints (requires user auth)
//
// GET  /api/subscriptions
//   - Return the current user's subscription status
//   - Requires: valid user session (NextAuth / Clerk / JWT)
//   - Response: { status: "active"|"expired"|"none", plan, endDate }
//
// POST /api/subscriptions
//   - Initiate a new subscription purchase
//   - Body: { plan: "monthly" | "annual" }
//   - Flow:
//       1. Create a payment order (Razorpay / Stripe)
//       2. Return { orderId, amount, currency } to the client
//       3. Client completes payment on frontend
//       4. On success, client calls POST /api/payments to verify + activate subscription
//   - See services/subscriptionService.ts for createSubscription() logic
//
// DELETE /api/subscriptions
//   - Cancel the current user's subscription
//   - Sets status = "cancelled" in DB
//   - User retains access until endDate
//
// import { connectDB } from "@/config/db";
// import { SubscriptionModel } from "@/lib/models/Subscription";
// import { hasActiveSubscription } from "@/services/subscriptionService";

export async function GET() {
  return NextResponse.json(
    { message: "TODO (Backend Dev): implement GET /api/subscriptions" },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: "TODO (Backend Dev): implement POST /api/subscriptions" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "TODO (Backend Dev): implement DELETE /api/subscriptions" },
    { status: 501 }
  );
}
