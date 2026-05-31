// app/api/products/[id]/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

function verifyAdmin(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return null;
    return decoded;
  } catch {
    return null;
  }
}
export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findById(id).lean();
    if (!product) return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    return Response.json({ success: true, product });
  } catch (err) {
    console.error("GET /api/products/:id error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}


// ✅ Fix 1: await context.params — required in Next.js 15
export async function PATCH(req, context) {
  try {
    await connectDB();
    if (!verifyAdmin(req)) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
console.log(id)
    const updates = await req.json();
    if (updates.price    != null) updates.price    = Number(updates.price);
    if (updates.oldPrice != null) updates.oldPrice = Number(updates.oldPrice);
    if (updates.stock    != null) updates.stock    = Number(updates.stock);
    if (updates.discount != null) updates.discount = Number(updates.discount);
    if (updates.rating   != null) updates.rating   = Number(updates.rating);

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    return Response.json({ success: true, product });
  } catch (err) {
    console.error("PATCH /api/products/:id error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function DELETE(req, context) {
  try {
    await connectDB();
    if (!verifyAdmin(req)) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) return Response.json({ success: false, message: "Product not found" }, { status: 404 });

    return Response.json({ success: true, message: "Product deleted" });
  } catch (err) {
   
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
