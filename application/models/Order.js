import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId:     String,
  title:         String,
  image:         String,
  price:         Number,
  quantity:      Number,
  selectedSize:  String,
  selectedColor: String,
});

const addressSchema = new mongoose.Schema({
  fullName: String,
  street:   String,
  city:     String,
  state:    String,
  zip:      String,
  country:  String,
  phone:    String,
});

const orderSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items:           [orderItemSchema],
    subtotal:        Number,
    discount:        Number,
    deliveryFee:     Number,
    total:           Number,
    stripeSessionId: String,
    status:          { type: String, default: "paid" },
    deliveryStatus:  { type: String, default: "pending" }, 
    address:         addressSchema,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);