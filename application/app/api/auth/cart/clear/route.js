// app/api/auth/cart/clear/route.js
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export async function DELETE(req) {
  try {
    await connectDB();

    const { userId } = await req.json();  // ← read from body

    const cart = await Cart.findOne({ userId });
    if (!cart) return Response.json({ success: false, message: "Cart not found" }, { status: 404 });

    cart.items = [];
    await cart.save();
    return Response.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}