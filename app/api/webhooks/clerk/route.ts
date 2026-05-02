import { NextResponse } from "next/server";

// TODO (Backend Dev): Verify Clerk webhook signature and sync users to MongoDB
// 1. npm install svix
// 2. Add CLERK_WEBHOOK_SECRET to .env.local
// 3. Configure webhook URL in Clerk Dashboard → Webhooks
//    URL: https://yourdomain.com/api/webhooks/clerk
//    Events: user.created, user.updated, user.deleted
//
// import { Webhook } from "svix";
// import { connectDB } from "@/config/db";
// import { UserModel } from "@/lib/models/User";

export async function POST() {
  return NextResponse.json({ message: "TODO: implement Clerk webhook handler" }, { status: 501 });
}
