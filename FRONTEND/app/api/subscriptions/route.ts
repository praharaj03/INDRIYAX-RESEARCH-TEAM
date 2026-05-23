import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// GET /api/subscriptions - Get user's enrollment/subscription status
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization") ?? "";
  try {
    const res = await fetch(`${API_BASE}/api/v1/payments/my`, {
      headers: { ...(token ? { Authorization: token } : {}) },
    });
    const data = await res.json();
    // Transform backend enrollment data into subscription-like response
    const payments = data.data ?? [];
    const activeEnrollments = payments.filter((p: { status: string }) => p.status === "SUCCESS");
    
    return NextResponse.json({
      success: true,
      data: {
        status: activeEnrollments.length > 0 ? "active" : "none",
        enrollments: activeEnrollments,
        total: activeEnrollments.length,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Backend unreachable" }, { status: 502 });
  }
}

// POST /api/subscriptions - Create enrollment (pay for event)
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization") ?? "";
  const body = await req.json();
  try {
    const res = await fetch(`${API_BASE}/api/v1/payments`, {
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

export async function DELETE() {
  // Enrollment cancellation not supported in current backend
  return NextResponse.json(
    { success: false, message: "Enrollment cancellation not implemented" },
    { status: 501 }
  );
}
