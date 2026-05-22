import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.indriyax.com";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = req.headers.get("authorization") ?? "";

    const res = await fetch(`${API_BASE}/api/v1/uploads/image`, {
      method: "POST",
      headers: { ...(token ? { Authorization: token } : {}) },
      body: formData,
    });

    const data = await res.json();
    if (!data.success) return NextResponse.json({ error: data.message }, { status: res.status });
    return NextResponse.json({ url: data.data.url });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
