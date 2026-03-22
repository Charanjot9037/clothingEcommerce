// models/Cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId:     { type: String, required: true },
  title:         { type: String, required: true },
  image:         { type: String, required: true },
  price:         { type: Number, required: true },
  oldPrice:      { type: Number },
  discount:      { type: String },
  category:      { type: String },
  rating:        { type: Number },
  selectedColor: { type: String, required: true },
  selectedSize:  { type: String, required: true },
  quantity:      { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items:  [cartItemSchema],
  },
  { timestamps: true }
);

// ✅ prevents "Cannot overwrite model" error in Next.js
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;