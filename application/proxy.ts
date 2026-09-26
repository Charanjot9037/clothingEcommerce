import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  console.log("🔥 PROXY RUNNING:", pathname);

  // Protect only admin pages and admin APIs
  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  // --------------------------------------------------
  // 1. Get token from Authorization header OR cookie
  // --------------------------------------------------

  const authHeader = request.headers.get("authorization");

  let token: string | undefined;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    token = request.headers
      ? request.headers.get("cookie")
        ? request.headers
            .get("cookie")
            ?.split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith("token="))
            ?.substring("token=".length)
        : undefined
      : undefined;
  }

  console.log("TOKEN EXISTS:", !!token);
  console.log("TOKEN TYPE:", typeof token);
  console.log("TOKEN PARTS:", token?.split(".").length);

  // --------------------------------------------------
  // 2. No token
  // --------------------------------------------------

  if (!token) {
    console.log("❌ NO TOKEN");

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

  // --------------------------------------------------
  // 3. Basic JWT format validation
  // --------------------------------------------------

  const jwtParts = token.split(".");

  if (jwtParts.length !== 3) {
    console.log("❌ MALFORMED JWT");

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

  // --------------------------------------------------
  // 4. Verify JWT
  // --------------------------------------------------

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

    // --------------------------------------------------
    // 5. Check admin permission
    // --------------------------------------------------

    if (payload.isAdmin !== true) {
      console.log("❌ USER IS NOT ADMIN");

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

    // --------------------------------------------------
    // 6. Valid admin JWT
    // --------------------------------------------------

    console.log("✅ ADMIN AUTHORIZED");

    return NextResponse.next();

  } catch (error) {
    console.error("❌ JWT VERIFICATION FAILED:", error);

    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
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