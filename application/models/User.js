// models/User.js
// Adds isAdmin + isBanned to your existing { name, email, password } schema.
// Your existing login/signup routes work unchanged.
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin:  { type: Boolean, default: false },   // ← new
    isBanned: { type: Boolean, default: false },   // ← new
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
