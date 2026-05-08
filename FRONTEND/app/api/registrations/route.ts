import { NextResponse } from "next/server";

// TODO (Backend Dev):
// 1. Install @clerk/nextjs and add keys to .env.local
// 2. Use auth() from @clerk/nextjs/server to get userId
// 3. Connect MongoDB RegistrationModel
// import { auth } from "@clerk/nextjs/server";
// import { connectDB } from "@/config/db";
// import { RegistrationModel } from "@/lib/models/Registration";

export async function GET() {
  return NextResponse.json(
    { message: "TODO: connect Clerk + MongoDB" },
    { status: 501 },
  );
}
export async function POST() {
  return NextResponse.json(
    { message: "TODO: connect Clerk + MongoDB" },
    { status: 501 },
  );
}
