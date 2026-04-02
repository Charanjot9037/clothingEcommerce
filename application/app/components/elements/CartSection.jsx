"use client";

import Wrapper from "../atoms/Wrapper";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCart as setReduxCart } from "../../store/slices/cartSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {  Trash2, Minus, Plus, Tag, ArrowRight, ShoppingBag, User, MapPin, Globe, Phone  } from "lucide-react";
import Link from "next/link";

const DELIVERY_FEE = 15;
const PROMO_CODES = { SAVE10: 10, SAVE20: 20 };

export default function CartSection() {
  const dispatch = useDispatch();

  const [cart, setCart]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [promoCode, setPromoCode]         = useState("");
  const [discount, setDiscount]           = useState(0);
  const [promoError, setPromoError]       = useState("");
  const [promoApplied, setPromoApplied]   = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false); // ← NEW
const [address, setAddress] = useState({
  fullName: "",
  street:   "",
  city:     "",
  state:    "",
  zip:      "",
  country:  "",
  phone:    "",
});
  const router = useRouter();

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return null; }
    return token;
  };

  const getUserId = (token) => JSON.parse(atob(token.split(".")[1])).userId;

  const authHeaders = (token, json = false) => ({
    ...(json && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res  = await fetch("/api/auth/cart", { headers: authHeaders(token) });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        dispatch(setReduxCart({ items: data.cart.items ?? [] }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (item) => {
    const token = getToken(); if (!token) return;
    setActionLoading(`inc-${item.productId}-${item.selectedSize}`);
    await fetch("/api/auth/cart/increase", {
      method: "PATCH",
      headers: authHeaders(token, true),
      body: JSON.stringify({
        userId: getUserId(token), productId: item.productId,
        selectedColor: item.selectedColor, selectedSize: item.selectedSize,
      }),
    });
    await fetchCart();
    setActionLoading("");
  };

  const handleDecrease = async (item) => {
    const token = getToken(); if (!token) return;
    setActionLoading(`dec-${item.productId}-${item.selectedSize}`);
    await fetch("/api/auth/cart/decrease", {
      method: "PATCH",
      headers: authHeaders(token, true),
      body: JSON.stringify({
        userId: getUserId(token), productId: item.productId,
        selectedColor: item.selectedColor, selectedSize: item.selectedSize,
      }),
    });
    await fetchCart();
    setActionLoading("");
  };

  const handleRemove = async (item) => {
    const token = getToken(); if (!token) return;
    setActionLoading(`rem-${item.productId}-${item.selectedSize}`);
    await fetch("/api/auth/cart/remove", {
      method: "DELETE",
      headers: authHeaders(token, true),
      body: JSON.stringify({
        userId: getUserId(token), productId: item.productId,
        selectedColor: item.selectedColor, selectedSize: item.selectedSize,
      }),
    });
    await fetchCart();
    setActionLoading("");
  };

  const handleClear = async () => {
    const token = getToken(); if (!token) return;
    setActionLoading("clear");
    await fetch("/api/auth/cart/clear", {
      method: "DELETE",
      headers: authHeaders(token, true),
      body: JSON.stringify({ userId: getUserId(token) }),
    });
    await fetchCart();
    setActionLoading("");
    setDiscount(0); setPromoApplied(""); setPromoCode("");
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]); setPromoApplied(code); setPromoError("");
    } else {
      setPromoError("Invalid promo code"); setDiscount(0); setPromoApplied("");
    }
  };

  // ─── STRIPE CHECKOUT ───────────────────────────────────────────────────────
  const handleCheckout = async () => {
    const token = getToken(); if (!token) return;
    setCheckoutLoading(true);
    try {
      // 1. Create Stripe checkout session
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, discount, deliveryFee: DELIVERY_FEE }),
      });
      const data = await res.json();
      console.log("data from checkout session API", data);
      if (!data.url) throw new Error("Failed to create checkout session");

      // 2. Save order to DB before redirecting
      await fetch("/api/auth/orders", {
        method: "POST",
        headers: authHeaders(token, true),
        body: JSON.stringify({
          items,
          address,
          subtotal,
          discount,
          deliveryFee: DELIVERY_FEE,
          total,
          sessionId: data.url.split("cs_")[1]?.split("/")[0] ?? "",
        }),
      });

      // 3. Clear cart
      await fetch("/api/auth/cart/clear", {
        method: "DELETE",
        headers: authHeaders(token, true),
        body: JSON.stringify({ userId: getUserId(token) }),
      });

      // 4. Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };
  // ───────────────────────────────────────────────────────────────────────────

  const items          = cart?.items ?? [];
  const subtotal       = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = Math.round((subtotal * discount) / 100);
  const total          = subtotal - discountAmount + DELIVERY_FEE;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!items.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <ShoppingBag size={64} strokeWidth={1} className="text-gray-300" />
      <h2 className="text-2xl font-bold">Your cart is empty</h2>
      <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
      <Link href="/" className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <Wrapper>
      <div className="max-w-7xl mx-auto px-4">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black font-medium">Cart</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight">Your Cart</h1>
          <button
            onClick={handleClear}
            disabled={actionLoading === "clear"}
            className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
          >
            {actionLoading === "clear" ? "Clearing..." : "Clear All"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* Cart Items */}
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const key       = `${item.productId}-${item.selectedColor}-${item.selectedSize}`;
              const isLoading = actionLoading.includes(item.productId);
              return (
                <div
                  key={key}
                  className={`flex gap-4 p-3 border border-gray-200 rounded-2xl bg-white transition-opacity ${
                    isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="w-30 h-30 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 gap-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm leading-snug truncate">{item.title}</h3>
                      <button onClick={() => handleRemove(item)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                        <Trash2 size={23} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 text-xs text-gray-400">
                      <span>Size: <span className="text-gray-600 font-medium">{item.selectedSize}</span></span>
                      <span className="flex items-center gap-1">
                        Color:
                        <span className="inline-block w-3 h-3 rounded-full border border-gray-200 ml-1" style={{ backgroundColor: item.selectedColor }} />
                      </span>
                      <span>Rating: <span className="text-gray-600 font-medium">{item.rating}</span></span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="font-bold text-base">${item.price * item.quantity}</span>
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-1.5">
                        <button onClick={() => handleDecrease(item)} className="text-gray-600 hover:text-black transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleIncrease(item)} className="text-gray-600 hover:text-black transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-3 h-fit flex flex-col gap-5">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount ({discount}%)</span>
                  <span className="font-semibold text-red-500">-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-semibold">${DELIVERY_FEE}</span>
              </div>
              <hr className="border-gray-100 my-1" />
              <div className="flex justify-between text-base font-black">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
{/* ── DELIVERY ADDRESS ── */}
<div className="flex flex-col gap-3">
  <h3 className="text-sm font-semibold text-gray-700">Delivery Address</h3>

  {/* Full Name */}
  <div className="flex items-center gap-2 border-2 border-gray-300 rounded-full px-4 py-2.5">
    <User size={14} className="text-gray-400 flex-shrink-0" />
    <input
      type="text"
      placeholder="Full Name"
      value={address.fullName}
      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
      className="text-sm outline-none bg-transparent placeholder-gray-400 w-full"
    />
  </div>

  {/* Street Address */}
  <div className="flex items-center gap-2 border-2 border-gray-300 rounded-full px-4 py-2.5">
    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
    <input
      type="text"
      placeholder="Street Address"
      value={address.street}
      onChange={(e) => setAddress({ ...address, street: e.target.value })}
      className="text-sm outline-none bg-transparent placeholder-gray-400 w-full"
    />
  </div>

  {/* City + State + ZIP — compact row */}
  <div className="flex gap-2">
    <div className="flex items-center gap-2 border-2 border-gray-300 rounded-full px-4 py-2.5 flex-1 min-w-0">
      <input
        type="text"
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
        className="text-sm outline-none bg-transparent placeholder-gray-400 w-full"
      />
    </div>
    <div className="flex items-center gap-2 border-2 border-gray-300 rounded-full px-4 py-2.5 w-24 flex-shrink-0">
      <input
        type="text"
        placeholder="State"
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
        className="text-sm outline-none bg-transparent placeholder-gray-400 w-full"
      />
    </div>
    <div className="flex items-center gap-2 border-2 border-gray-300 rounded-full px-4 py-2.5 w-24 flex-shrink-0">
      <input
        type="text"
        placeholder="ZIP"
        value={address.zip}
        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
        className="text-sm outline-none bg-transparent placeholder-gray-400 w-full"
      />
    </div>
  </div>

  {/* Country */}
  <div className="flex items-center gap-2 border-2 border-gray-300 rounded-full px-4 py-2.5">
    <Globe size={14} className="text-gray-400 flex-shrink-0" />
    <select
      value={address.country}
      onChange={(e) => setAddress({ ...address, country: e.target.value })}
      className="text-sm outline-none bg-transparent text-gray-700 w-full appearance-none cursor-pointer"
    >
      <option value="">Select Country</option>
      <option value="US">United States</option>
      <option value="IN">India</option>
      <option value="GB">United Kingdom</option>
      <option value="CA">Canada</option>
      <option value="AU">Australia</option>
    </select>
  </div>

  {/* Phone */}
  <div className="flex items-center gap-2 border-2 border-gray-300 rounded-full px-4 py-2.5">
    <Phone size={14} className="text-gray-400 flex-shrink-0" />
    <input
      type="tel"
      placeholder="Phone Number"
      value={address.phone}
      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
      className="text-sm outline-none bg-transparent placeholder-gray-400 w-full"
    />
  </div>
</div>
            {/* Promo */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0 border-2 border-gray-300 rounded-full px-4 py-2.5">
                  <Tag size={14} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Add promo code"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                    className="text-sm outline-none bg-transparent placeholder-gray-400 w-full"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
                >
                  Apply
                </button>
              </div>
              {promoError   && <p className="text-red-500 text-xs pl-2">{promoError}</p>}
              {promoApplied && <p className="text-green-500 text-xs pl-2">✓ Code <strong>{promoApplied}</strong> applied — {discount}% off!</p>}
            </div>

            {/* ── CHECKOUT BUTTON ── */}
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-85 transition-opacity disabled:opacity-50"
            >
              {checkoutLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>Go to Checkout <ArrowRight size={18} /></>
              )}
            </button>
          </div>

        </div>
      </div>
    </Wrapper>
  );
}