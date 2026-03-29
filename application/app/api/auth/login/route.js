import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server"; // ✅ IMPORTANT

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, isAdmin: user.isAdmin ?? false },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // ✅ CREATE RESPONSE
    const response = NextResponse.json({
      message: "Login successful",
      token,
      isAdmin: user.isAdmin ?? false,
      user: {
        id: user._id,
        email: user.email,
      },
    });

    // ✅ SET COOKIE (THIS FIXES YOUR ISSUE)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // 🔁 change to true in production (HTTPS)
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
