import { connectDB } from "../../../../lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    console.log("connected to DB")

    const authHeader = req.headers.get("authorization");
    const token      = authHeader?.split(" ")[1];
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const { items, subtotal, discount, deliveryFee, total, sessionId,  address } = await req.json();

    const order = await Order.create({
      userId:          decoded.userId ?? decoded.id,
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      deliveryStatus: "pending",
      address,
      stripeSessionId: sessionId ?? "",
      status:          "paid",
    });


    return Response.json({ success: true, order });

  } catch (err) {
    console.error("❌ POST /api/auth/orders error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token      = authHeader?.split(" ")[1];
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const orders = await Order.find({
      userId: decoded.userId ?? decoded.id,
    }).sort({ createdAt: -1 });

    return Response.json({ success: true, orders });

  } catch (err) {

    return Response.json({ error: err.message }, { status: 500 });
  }
}