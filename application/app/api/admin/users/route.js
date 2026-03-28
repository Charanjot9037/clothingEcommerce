// app/api/admin/users/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.isAdmin) return null;
  return decoded;
}

// GET /api/admin/users — all users, paginated + searchable
export async function GET(req) {
  try {
    await connectDB();

    const admin = verifyAdmin(req);
    if (!admin) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page   = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const search = searchParams.get("search");

    const filter = {};
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")          // never return password
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return Response.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("GET /api/admin/users error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/users — ban / unban or promote to admin
export async function PATCH(req) {
  try {
    await connectDB();

    const admin = verifyAdmin(req);
    if (!admin) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { userId, updates } = await req.json();
    // updates can be: { isAdmin: true } or { isBanned: true }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, select: "-password" }
    );

    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

    return Response.json({ success: true, user });
  } catch (err) {
    console.error("PATCH /api/admin/users error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
