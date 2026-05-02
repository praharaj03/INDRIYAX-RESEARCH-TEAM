import { NextResponse } from "next/server";

// TODO (Backend Dev): Query MongoDB RegistrationModel
// import { connectDB } from "@/config/db";
// import { RegistrationModel } from "@/lib/models/Registration";

export async function GET() {
  return NextResponse.json({ message: "TODO: connect MongoDB" }, { status: 501 });
}
