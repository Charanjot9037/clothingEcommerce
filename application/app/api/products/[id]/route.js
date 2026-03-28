// app/api/products/[id]/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.isAdmin) return null;
  return decoded;
}

// PATCH /api/products/[id] — edit product (admin only)
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    if (!verifyAdmin(req)) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const updates = await req.json();
    if (updates.price)    updates.price    = Number(updates.price);
    if (updates.oldPrice) updates.oldPrice = Number(updates.oldPrice);
    if (updates.stock)    updates.stock    = Number(updates.stock);

    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    );

    if (!product) return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    return Response.json({ success: true, product });
  } catch (err) {
    console.error("PATCH /api/products/:id error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE /api/products/[id] — remove product (admin only)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    if (!verifyAdmin(req)) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await Product.findByIdAndDelete(params.id);
    return Response.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("DELETE /api/products/:id error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
