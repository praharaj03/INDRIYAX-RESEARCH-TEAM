import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization") ?? "";
  try {
    const res = await fetch(`${API_BASE}/api/v1/posts`, {
      headers: { ...(token ? { Authorization: token } : {}) },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization") ?? "";
  const body = await req.json();
  try {
    const res = await fetch(`${API_BASE}/api/v1/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}
