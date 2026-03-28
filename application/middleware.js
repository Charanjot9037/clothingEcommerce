// middleware.js
// Uses the same custom JWT pattern as your existing login route.
// Checks for isAdmin: true in the token payload.
import { NextResponse } from "next/server";
import { jwtVerify }    from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const token      = authHeader?.split(" ")[1]
                  ?? request.cookies.get("token")?.value; // fallback for page route

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret  = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload.isAdmin) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
