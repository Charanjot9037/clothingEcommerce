import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";          // your DB connection
import Order from "@/models/Order";            // your Order model
import Cart from "@/models/Cart";              // your Cart model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET      // from Stripe dashboard
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Handle Events ───────────────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Only process if payment was actually collected
    if (session.payment_status !== "paid") return NextResponse.json({ received: true });

    try {
      await connectDB();

      const { userId, items, address, subtotal, discount, deliveryFee, total } = session.metadata;

      // ✅ Save order
      await Order.create({
        userId,
        items: JSON.parse(items),
        address: JSON.parse(address),
        subtotal: Number(subtotal),
        discount: Number(discount),
        deliveryFee: Number(deliveryFee),
        total: Number(total),
        sessionId: session.id,
        paymentStatus: "paid",
      });

      // ✅ Clear cart only after order is saved
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } }
      );

      console.log(`✅ Order saved and cart cleared for user: ${userId}`);

    } catch (err) {
      console.error("Post-payment processing error:", err);
      // Return 500 so Stripe retries the webhook
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}