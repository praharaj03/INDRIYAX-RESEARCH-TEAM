import { NextResponse } from "next/server";
import { events } from "@/lib/data/index";

// TODO (Backend Dev): Wire to MongoDB EventModel
// import { connectDB } from "@/config/db";
// import { EventModel } from "@/lib/models/Event";

export async function GET() {
  return NextResponse.json(events);
}

export async function POST() {
  return NextResponse.json(
    { message: "TODO: connect MongoDB" },
    { status: 501 },
  );
}
