import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

async function getAdminAuthHeader(req: NextRequest): Promise<string> {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return "";
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return "";
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return `Bearer ${process.env.ADMIN_API_KEY || ""}`;
  } catch {
    return "";
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = await getAdminAuthHeader(req);
  try {
    const res = await fetch(`${API_BASE}/api/v1/events/${id}`, {
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = await getAdminAuthHeader(req);
  const body = await req.json();
  try {
    const res = await fetch(`${API_BASE}/api/v1/events/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = await getAdminAuthHeader(req);
  try {
    const res = await fetch(`${API_BASE}/api/v1/events/${id}`, {
      method: "DELETE",
      headers: { ...(authHeader ? { Authorization: authHeader } : {}) },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}
