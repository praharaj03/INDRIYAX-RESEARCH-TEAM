import { NextResponse } from "next/server";
import { news } from "@/lib/data/index";

// TODO (Backend Dev): Replace with MongoDB query
// import { connectDB } from "@/config/db";
// import { NewsModel } from "@/lib/models/News";

export async function GET() {
  return NextResponse.json(news);
}

export async function POST() {
  return NextResponse.json({ message: "TODO: connect MongoDB" }, { status: 501 });
}
