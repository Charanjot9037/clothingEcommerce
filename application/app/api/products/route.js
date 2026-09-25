// app/api/products/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

// GET /api/products — public, used by shop pages
export async function GET(req) {
  try {


    
    await connectDB();
const REAL_CATEGORIES = ["men", "women", "kids"];
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search   = searchParams.get("search");
    const page     = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "12"));

    const filter = {};
    if (category && REAL_CATEGORIES.includes(category)) {
  filter.category = category;
}
    if (featured === "true") filter.featured = true;
    if (search)              filter.title    = { $regex: search, $options: "i" };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return Response.json({ success: true, products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("GET /api/products error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST /api/products — admin only, create product
export async function POST(req) {
  try {
    await connectDB();

    // verify admin token
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return Response.json({ success: false, message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, price, category } = body;

    if (!title?.trim() || !price || !category) {
      return Response.json({ success: false, message: "title, price and category are required" }, { status: 400 });
    }

    const product = await Product.create({
      title:       body.title.trim(),
      price:       Number(body.price),
      oldPrice:    body.oldPrice  ? Number(body.oldPrice) : null,
      discount:    body.discount  ? Number(body.discount) : 0,
      category:    body.category,
     
      images:      Array.isArray(body.images)                    // ← NEW
                     ? body.images.filter(Boolean)
                     : [],
      rating:      body.rating       ?? 0,
      description: body.description  ?? "",
      sizes:       body.sizes        ?? [],
      colors:      body.colors       ?? [],
      featured:    body.featured     ?? false,
      stock:       Number(body.stock) || 0,
      reviews:     Array.isArray(body.reviews)                   // ← NEW
                     ? body.reviews.filter(r => r?.user && r?.rating)
                     : [],
    });

    return Response.json({ success: true, product }, { status: 201 });
  } catch (err) {
    console.error("POST /api/products error:", err.message);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}