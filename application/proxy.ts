// proxy.ts

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  console.log("🔥 PROXY RUNNING:", pathname);

  // Only protect admin pages and admin APIs
  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  // Authorization header
  const authHeader = request.headers.get("authorization");

  // Get token from Authorization header OR cookie
  const token =
    authHeader?.split(" ")[1] ??
    request.headers
      .get("cookie")
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("token="))
      ?.split("=")
      .slice(1)
      .join("=");

  // No token
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("❌ JWT_SECRET is missing");

      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Server configuration error",
          },
          { status: 500 }
        );
      }

      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    const encodedSecret = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(
      token,
      encodedSecret
    );

    console.log("✅ JWT VERIFIED");
    console.log("isAdmin:", payload.isAdmin);

    // Check admin permission
    if (!payload.isAdmin) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Forbidden",
          },
          { status: 403 }
        );
      }

      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    // Valid admin token
    return NextResponse.next();

  } catch (error) {
    console.error("❌ JWT VERIFICATION FAILED:", error);

    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};