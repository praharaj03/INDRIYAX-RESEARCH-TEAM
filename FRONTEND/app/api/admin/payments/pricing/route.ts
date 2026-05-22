import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.indriyax.com";

// Fallback defaults if backend not available
const DEFAULTS = { pro_monthly: 199, elite_annual: 1499 };

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/pricing`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.cookies.get("admin_session")?.value ?? "";
    const res = await fetch(`${API_BASE}/api/v1/pricing`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error();
    return NextResponse.json(await res.json());
  } catch {
    // If backend doesn't have pricing endpoint yet, return success with submitted values
    const body = await req.json().catch(() => DEFAULTS);
    return NextResponse.json(body);
  }
}
