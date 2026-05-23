import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

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

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminSession(req);
  
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Proxy to backend
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  
  try {
    const adminApiKey = process.env.ADMIN_API_KEY || "";
    const response = await fetch(`${backendUrl}/api/v1/dashboard/overall`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminApiKey}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
