import { NextResponse } from "next/server";

// This route is not needed in the Supabase auth architecture.
// Supabase handles user management internally.
// Keeping this endpoint as a no-op for compatibility.

export async function POST() {
  return NextResponse.json(
    { success: true, message: "Webhook not required — using Supabase Auth" },
    { status: 200 }
  );
}
