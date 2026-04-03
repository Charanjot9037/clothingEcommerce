// app/api/admin/orders/[id]/route.js
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.isAdmin ? decoded : null;
  } catch { return null; }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    if (!verifyAdmin(req)) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    // Safety check — only allow deleting cancelled orders
    const order = await Order.findById(id);
    if (!order) return Response.json({ success: false, message: "Order not found" }, { status: 404 });
    if (order.deliveryStatus !== "cancelled") {
      return Response.json({ success: false, message: "Only cancelled orders can be deleted" }, { status: 400 });
    }

    await Order.findByIdAndDelete(id);
    return Response.json({ success: true, message: "Order deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/orders/:id error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}