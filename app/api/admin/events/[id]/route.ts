import { NextResponse } from "next/server";

// TODO (Backend Dev): Implement GET, PATCH, DELETE for single event by MongoDB _id
// import { connectDB } from "@/config/db";
// import { EventModel } from "@/lib/models/Event";

export async function GET() {
  return NextResponse.json({ message: "TODO: connect MongoDB" }, { status: 501 });
}
export async function PATCH() {
  return NextResponse.json({ message: "TODO: connect MongoDB" }, { status: 501 });
}
export async function DELETE() {
  return NextResponse.json({ message: "TODO: connect MongoDB" }, { status: 501 });
}
