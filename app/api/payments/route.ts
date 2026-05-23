import { NextResponse } from "next/server";

// TODO (Backend Dev):
// 1. Integrate Razorpay (India) or Stripe
// 2. Connect MongoDB PaymentModel
// 3. Use Clerk auth() for userId
// RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET in .env.local

export async function POST() {
  return NextResponse.json(
    { message: "TODO: connect payment provider + MongoDB" },
    { status: 501 },
  );
}
export async function PATCH() {
  return NextResponse.json(
    { message: "TODO: connect payment provider + MongoDB" },
    { status: 501 },
  );
}
