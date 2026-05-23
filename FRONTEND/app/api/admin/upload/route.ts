import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminSession(req);
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    
    // Use admin API key to authenticate with backend
    const adminApiKey = process.env.ADMIN_API_KEY;
    if (!adminApiKey) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const res = await fetch(`${API_BASE}/api/v1/uploads/image`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${adminApiKey}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!data.success) return NextResponse.json({ error: data.message }, { status: res.status });
    return NextResponse.json({ url: data.data.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
