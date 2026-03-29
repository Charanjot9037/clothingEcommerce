// models/Product.js
// Field names match exactly what your cart already stores:
// title, image, price, oldPrice, discount, category, rating
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    price:       { type: Number, required: true, min: 0 },
    oldPrice:    { type: Number, default: null },
    discount:    { type: Number, default: 0 },
    category:    { type: String, required: true },
    image:       { type: String, default: "" },
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, default: "" },
    sizes:       [{ type: String }],
    colors:      [{ type: String }],
    featured:    { type: Boolean, default: false },
    stock:       { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", category: "text" });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
