// app/api/cart/route.js
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token   = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId  = payload.userId;

    const cart = await Cart.findOne({ userId });
    return Response.json({ success: true, cart: cart || { items: [] } });

  } catch (error) {
    console.log(error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
