import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function verifyAdminSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return false;
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminSession(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminApiKey = process.env.ADMIN_API_KEY;
  if (!adminApiKey) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/posts/${id}`, {
      headers: { "Authorization": `Bearer ${adminApiKey}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin news GET [id] error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminSession(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminApiKey = process.env.ADMIN_API_KEY;
  if (!adminApiKey) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { id } = await params;
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${adminApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin news PATCH [id] error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminSession(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminApiKey = process.env.ADMIN_API_KEY;
  if (!adminApiKey) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/posts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${adminApiKey}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Admin news DELETE [id] error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
