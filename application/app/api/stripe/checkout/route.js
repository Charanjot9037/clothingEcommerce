import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items, discount, deliveryFee, address, subtotal, total, userId } = await req.json();

    // ── Line Items ──────────────────────────────────────────────────────────
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          metadata: {
            size: item.selectedSize,
            color: item.selectedColor,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Fee" },
        unit_amount: Math.round(deliveryFee * 100),
      },
      quantity: 1,
    });

    // ── Session Payload ─────────────────────────────────────────────────────
    const sessionPayload = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cart?cancelled=true`,

      // ✅ Store everything needed for post-payment order creation
      metadata: {
        userId,
        discount: discount.toString(),
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        total: total.toString(),
        address: JSON.stringify(address),   // stringify nested object
        items: JSON.stringify(
          items.map((item) => ({            // only store what's needed
            productId: item._id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            image: item.image,
          }))
        ),
      },
    };

    // ── Discount Coupon ─────────────────────────────────────────────────────
    if (discount > 0) {
      const coupon = await stripe.coupons.create({
        percent_off: discount,
        duration: "once",
      });
      sessionPayload.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}