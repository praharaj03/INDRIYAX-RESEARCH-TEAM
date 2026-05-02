import { NextResponse } from "next/server";

// TODO (Backend Dev): Wire to MongoDB NewsModel
// import { connectDB } from "@/config/db";
// import { NewsModel } from "@/lib/models/News";

export async function GET() {
  return NextResponse.json({ message: "TODO: connect MongoDB" }, { status: 501 });
}
export async function POST() {
  return NextResponse.json({ message: "TODO: connect MongoDB" }, { status: 501 });
}
