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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminApiKey = process.env.ADMIN_API_KEY;
  if (!adminApiKey) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const response = await fetch(`${BACKEND_URL}/api/v1/payments/${id}/review`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${adminApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Admin payment review error:", error);
    return NextResponse.json({ error: "Failed to review payment" }, { status: 500 });
  }
}
