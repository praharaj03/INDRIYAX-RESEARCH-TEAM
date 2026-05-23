import { NextResponse } from "next/server";

// TODO (Backend Dev): Admin endpoint to list and manage all subscriptions
//
// GET  /api/admin/subscriptions
//   - Return paginated list of all subscriptions with user info
//   - Support query params: ?status=active|expired|cancelled&page=1&limit=20
//   - Join with User model to return { user: { name, email }, plan, status, endDate }
//
// POST /api/admin/subscriptions
//   - Manually grant a subscription to a user (admin override)
//   - Body: { userId, plan, endDate }
//   - Useful for comping access to speakers, partners, etc.
//
// import { connectDB } from "@/config/db";
// import { SubscriptionModel } from "@/lib/models/Subscription";

export async function GET() {
  return NextResponse.json(
    { message: "TODO (Backend Dev): implement GET /api/admin/subscriptions" },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: "TODO (Backend Dev): implement POST /api/admin/subscriptions" },
    { status: 501 }
  );
}
