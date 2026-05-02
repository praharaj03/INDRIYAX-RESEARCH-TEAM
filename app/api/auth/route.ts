import { NextResponse } from "next/server";

// TODO: Implement with NextAuth.js or custom JWT
// import NextAuth from "next-auth";
// import { authOptions } from "@/config/auth";
// export const { GET, POST } = NextAuth(authOptions);

export async function GET() {
  return NextResponse.json({ message: "Auth API — integrate NextAuth or custom JWT here" });
}
