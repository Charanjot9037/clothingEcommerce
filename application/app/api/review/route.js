import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/db";
import Review from "@/models/review";
import User from "@/models/User";

// GET — public, returns all reviews newest first
export async function GET() {
  await connectDB();
  const reviews = await Review.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, reviews });
}

// POST — requires JWT in Authorization header
export async function POST(req) {
  await connectDB();

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id ?? decoded._id ?? decoded.userId;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }

  const user = await User.findById(userId).select("name isBanned");
  if (!user)      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  if (user.isBanned) return NextResponse.json({ success: false, message: "Account suspended" }, { status: 403 });

  const { rating, review } = await req.json();
  if (!rating || !review?.trim())
    return NextResponse.json({ success: false, message: "Rating and review are required" }, { status: 400 });

  // One review per user — upsert so they can update it
  const saved = await Review.findOneAndUpdate(
    { userId },
    { userId, name: user.name, rating, review: review.trim() },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, review: saved });
}