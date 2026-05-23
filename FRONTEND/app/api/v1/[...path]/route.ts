import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToBackend(req, params.path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToBackend(req, params.path, "POST");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToBackend(req, params.path, "PATCH");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToBackend(req, params.path, "PUT");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyToBackend(req, params.path, "DELETE");
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
      if (!["host", "connection", "content-length"].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    // Get body for POST/PATCH/PUT requests
    let body: string | FormData | undefined;
    if (["POST", "PATCH", "PUT"].includes(method)) {
      const contentType = req.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        body = await req.text();
      } else if (contentType?.includes("multipart/form-data")) {
        body = await req.formData();
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
      responseHeaders.set(key, value);
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
