// middleware.js
import { NextResponse } from 'next/server';

const ipHits = new Map();

export function middleware(req) {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const windowMs = 60_000; // 1 min
  const limit = 60;

  const record = ipHits.get(ip) || { count: 0, start: now };
  if (now - record.start > windowMs) {
    record.count = 0;
    record.start = now;
  }

  record.count += 1;
  ipHits.set(ip, record);

  if (record.count > limit) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/api/:path*',   // all API routes
    '/admin/:path*', // admin pages
  ],
};