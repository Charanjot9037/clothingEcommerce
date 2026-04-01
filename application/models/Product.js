// models/Product.js
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    date:    { type: Date, default: Date.now },
  },
  { _id: true }
);
const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});
const ProductSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    price:       { type: Number, required: true, min: 0 },
    oldPrice:    { type: Number, default: null },
    discount:    { type: Number, default: 0 },
    category:    { type: String, required: true },
    image:       { type: String, default: "" },          // ← keep for cart compatibility
    images:      [{ type: String }],                     // ← array of Cloudinary URLs
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, default: "" },
    sizes:       [{ type: String }],
    colors:      [{ type: String }],
    featured:    { type: Boolean, default: false },
    stock:       { type: Number, default: 0, min: 0 },
    reviews:     [ReviewSchema],                         // ← array of review objects
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", category: "text" });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);