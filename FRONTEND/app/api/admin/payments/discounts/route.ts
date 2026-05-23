import { NextResponse } from "next/server";

// TODO (Backend Dev): Discount code management
//
// GET  /api/admin/payments/discounts
//   - Return all discount codes from DB
//   - Response: [{ code, type, value, plan, note, usageCount, active }]
//
// POST /api/admin/payments/discounts
//   - Create a new discount code
//   - Body: { code, type: "percent"|"flat", value, plan: "all"|"pro"|"elite", note }
//   - Validate: code must be unique, value > 0
//
// DELETE /api/admin/payments/discounts/:code
//   - Deactivate or delete a discount code
//
// Also create a DiscountModel in lib/models/ with fields:
//   code (unique), type, value, plan, note, usageCount, active, createdAt
//
// When user applies a code at checkout (POST /api/subscriptions):
//   1. Look up the code in DiscountModel
//   2. Validate it's active and applies to the chosen plan
//   3. Apply discount to the Razorpay/Stripe order amount
//   4. Increment usageCount

export async function GET() {
  return NextResponse.json(
    { message: "TODO (Backend Dev): implement GET /api/admin/payments/discounts" },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: "TODO (Backend Dev): implement POST /api/admin/payments/discounts" },
    { status: 501 }
  );
}
