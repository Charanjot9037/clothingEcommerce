import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findById(id).select("reviews");
    if (!product) return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    return Response.json({ success: true, reviews: product.reviews });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}

export async function POST(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { name, rating, comment } = await req.json();

    if (!name || !rating || !comment) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          reviews: {
            user: name,
            rating,
            comment,
            productId: id,
            date: new Date(),
          },
        },
      },
      { new: true }
    ).select("reviews");

    if (!product) return Response.json({ success: false, message: "Product not found" }, { status: 404 });

    const newReview = product.reviews[product.reviews.length - 1];
    return Response.json({ success: true, review: newReview }, { status: 201 });
  } catch (e) {
    return Response.json({ success: false, message: e.message }, { status: 500 });
  }
}