import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

export async function DELETE(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { orderId } = await req.json();

    const order = await Order.findById(orderId);
    if (!order) return Response.json({ success: false, message: "Order not found" }, { status: 404 });

  
    if (order.userId.toString() !== decoded.userId)
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });

    if (!["cancelled","pending"].includes(order.deliveryStatus))
      return Response.json({ success: false, message: "You can only delete cancelled or delivered orders." }, { status: 400 });

    await Order.findByIdAndDelete(orderId);

    return Response.json({ success: true, message: "Order deleted successfully." });
  } catch (err) {
    console.error("Delete order error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}