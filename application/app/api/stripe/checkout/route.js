import Stripe from "stripe";
import { NextResponse } from "next/server";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is missing!");
}
    const { items, discount, deliveryFee } = await req.json();

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          // images: [item.image],
          metadata: {
            size: item.selectedSize,
            color: item.selectedColor,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Add delivery fee as a line item
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Fee" },
        unit_amount: deliveryFee * 100,
      },
      quantity: 1,
    });

    const sessionPayload = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?cancelled=true`,
      metadata: {
        discount: discount.toString(),
      },
    };

    // Apply discount as a coupon if applicable
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
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}