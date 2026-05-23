import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

async function isAdminSession(req: NextRequest): Promise<boolean> {
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyToBackend(req, path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyToBackend(req, path, "POST");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyToBackend(req, path, "PATCH");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyToBackend(req, path, "PUT");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyToBackend(req, path, "DELETE");
}

async function proxyToBackend(
  req: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join("/");
    const url = `${BACKEND_URL}/api/v1/${path}`;
    
    // Get search params from the original request
    const searchParams = req.nextUrl.searchParams.toString();
    const fullUrl = searchParams ? `${url}?${searchParams}` : url;

    // Forward headers
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      // Skip host and connection headers
      if (!["host", "connection", "content-length", "transfer-encoding"].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // If request has a valid admin session cookie, inject ADMIN_API_KEY
    // This allows admin panel operations to pass backend's restrictTo('ADMIN') check
    const adminSession = await isAdminSession(req);
    if (adminSession && process.env.ADMIN_API_KEY) {
      headers["authorization"] = `Bearer ${process.env.ADMIN_API_KEY}`;
    }

    // Get body for POST/PATCH/PUT requests
    let body: string | undefined;
    if (["POST", "PATCH", "PUT"].includes(method)) {
      const contentType = req.headers.get("content-type");
      if (contentType?.includes("multipart/form-data")) {
        // For multipart, forward as-is with content-type
        const formData = await req.arrayBuffer();
        const response = await fetch(fullUrl, {
          method,
          headers,
          body: formData,
        });
        const data = await response.text();
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
          if (!["transfer-encoding", "connection"].includes(key.toLowerCase())) {
            responseHeaders.set(key, value);
          }
        });
        return new NextResponse(data, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } else {
        body = await req.text();
      }
    }

    // Make request to backend
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    });

    // Get response data
    const data = await response.text();
    
    // Forward response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!["transfer-encoding", "connection"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to connect to backend API",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 502 }
    );
  }
}
