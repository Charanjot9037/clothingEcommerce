import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const APP_BASE_URL        = process.env.APP_BASE_URL;


export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // ✅ Always return same response (prevents email enumeration)
    if (!user) {
      return NextResponse.json(
        { message: "If this email exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    // ✅ Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save everything ONCE
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    user.resetPasswordOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordOtpExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // ✅ Build reset URL
    const resetUrl = `${APP_BASE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // ✅ Check env variables
    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY ||
      !EMAILJS_PRIVATE_KEY
    ) {
      throw new Error("EmailJS environment variables missing");
    }

    // ✅ Send Email
    const emailRes = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: {
            email: email,
            to_name: user.name || "User",
            link: resetUrl,
            otp: otp,
            expires_in: "15 minutes",
          },
        }),
      }
    );

    // ✅ Handle EmailJS failure
    if (!emailRes.ok) {
      console.error("EmailJS Error:", await emailRes.text());

      // rollback tokens
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpire = undefined;

      await user.save();

      return NextResponse.json(
        { message: "Failed to send reset email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "If this email exists, a reset link has been sent." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}