import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// POST /api/payments - Submit payment for an event
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization") ?? "";
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: string | FormData;
    const headers: Record<string, string> = {};
    
    if (token) headers["Authorization"] = token;

    if (contentType.includes("multipart/form-data")) {
      // Forward multipart (screenshot upload)
      const formData = await req.arrayBuffer();
      headers["content-type"] = contentType;
      const res = await fetch(`${API_BASE}/api/v1/payments`, {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      body = await req.text();
      headers["Content-Type"] = "application/json";
      const res = await fetch(`${API_BASE}/api/v1/payments`, {
        method: "POST",
        headers,
        body,
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}

// PATCH /api/payments - Review a payment (admin)
export async function PATCH(req: NextRequest) {
  const token = req.headers.get("authorization") ?? "";
  const body = await req.json();
  try {
    const res = await fetch(`${API_BASE}/api/v1/payments/${body.id}/review`, {
      method: "PATCH",
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
