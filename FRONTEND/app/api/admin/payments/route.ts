import { NextResponse } from "next/server";

// TODO (Backend Dev): Query MongoDB PaymentModel
// import { connectDB } from "@/config/db";
// import { PaymentModel } from "@/lib/models/Payment";

export async function GET() {
  return NextResponse.json(
    { message: "TODO: connect MongoDB" },
    { status: 501 },
  );
}
