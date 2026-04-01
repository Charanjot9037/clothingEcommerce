import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export async function POST(req) {
  try {
    await connectDB();

    const {
      userId, productId, title, image,
      price, oldPrice, discount, category,
      rating, selectedColor, selectedSize,
    } = await req.json();

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    // same productId + color + size → increase quantity
    const existing = cart.items.find(
      (item) =>
        item.productId     === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize  === selectedSize
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({
        productId, title, image, price, oldPrice,
        discount, category, rating,
        selectedColor, selectedSize,
        quantity: 1,
      });
    }

    await cart.save();
    return Response.json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}