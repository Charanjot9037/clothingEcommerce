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

// Delivery days per status
const DELIVERY_DAYS = {
  processing: 7,
  dispatched:  4,
  shipped:     2,
  delivered:   0,
};

function getExpectedDeliveryDate(status) {
  if (status === "delivered") return new Date(); // already delivered
  const days = DELIVERY_DAYS[status] ?? 7;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// GET /api/admin/orders — all orders, paginated + filterable
export async function GET(req) {
  try {
    await connectDB();

    const admin = verifyAdmin(req);
    if (!admin)
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter = {};
    if (status && status !== "all") filter.deliveryStatus = status;

    // ⚠️ NOTE: regex on ObjectId is not ideal (explained below)
    if (search) filter.userId = { $regex: search, $options: "i" };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("userId", "name email") // 🔥 ADD THIS LINE
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return Response.json({
      success: true,
      orders,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/admin/orders error:", err.message);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/orders — update deliveryStatus + auto expectedDeliveryDate
export async function PATCH(req) {
  try {
    await connectDB();

    const admin = verifyAdmin(req);
    if (!admin)
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { orderId, deliveryStatus } = await req.json();

    const expectedDeliveryDate = getExpectedDeliveryDate(deliveryStatus);

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: { deliveryStatus, expectedDeliveryDate } },
      { new: true }
    ).populate("userId", "name email"); // 🔥 OPTIONAL (but useful)

    if (!order)
      return Response.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );

    return Response.json({ success: true, order });
  } catch (err) {
    console.error("PATCH /api/admin/orders error:", err.message);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}