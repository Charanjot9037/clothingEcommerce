// app/api/admin/orders/route.js
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.isAdmin) return null;
  return decoded;
}

// GET /api/admin/orders — all orders, paginated + filterable
export async function GET(req) {
  try {
    await connectDB();

    const admin = verifyAdmin(req);
    if (!admin) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page   = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const status = searchParams.get("status"); // e.g. "pending"
    const search = searchParams.get("search"); // search by userId

    const filter = {};
    if (status && status !== "all")  filter.deliveryStatus = status;
    if (search) filter.userId = { $regex: search, $options: "i" };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return Response.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("GET /api/admin/orders error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/orders — update deliveryStatus
export async function PATCH(req) {
  try {
    await connectDB();

    const admin = verifyAdmin(req);
    if (!admin) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { orderId, deliveryStatus } = await req.json();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: { deliveryStatus } },
      { new: true }
    );

    if (!order) return Response.json({ success: false, message: "Order not found" }, { status: 404 });

    return Response.json({ success: true, order });
  } catch (err) {
    console.error("PATCH /api/admin/orders error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
