import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.indriyax.com";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = _.headers.get("authorization") ?? "";
  const res = await fetch(`${API_BASE}/api/v1/posts/${id}`, {
    headers: { ...(token ? { Authorization: token } : {}) },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.headers.get("authorization") ?? "";
  const body = await req.json();
  const res = await fetch(`${API_BASE}/api/v1/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: token } : {}) },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.headers.get("authorization") ?? "";
  const res = await fetch(`${API_BASE}/api/v1/posts/${id}`, {
    method: "DELETE",
    headers: { ...(token ? { Authorization: token } : {}) },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
