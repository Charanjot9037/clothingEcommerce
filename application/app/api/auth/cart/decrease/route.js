import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export async function PATCH(req) {
  try {
    await connectDB();
    const { userId, productId, selectedColor, selectedSize } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) return Response.json({ success: false, message: "Cart not found" }, { status: 404 });

    const item = cart.items.find(
      (i) =>
        i.productId     === productId &&
        i.selectedColor === selectedColor &&
        i.selectedSize  === selectedSize
    );

    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => !(i.productId === productId && i.selectedColor === selectedColor && i.selectedSize === selectedSize)
        );
      }
    }

    await cart.save();
    return Response.json({ success: true, cart });
  } catch (error) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}