// components/product/ProductInfo.jsx
"use client";

import { useState } from "react";
import StarRating from "../../components/products/StarRating";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCart as setReduxCart } from "../../store/slices/cartSlice";
export default function ProductInfo({ product,activeImage, setActiveImage }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(2);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(""); // success / error message

  const router = useRouter();

  const dispatch = useDispatch();
  const colors = product.colors ?? ["#4a5c3d", "#2d3a2d", "#1a3458"];
  const sizes  = product.sizes  ?? ["Small", "Medium", "Large", "X-Large"];

  // ─── Add to Cart Handler ───────────────────────────────
  const handleAddToCart = async () => {
    // 1. check login
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // 2. decode JWT to get userId (no extra package needed)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId  = payload.userId;

    setLoading(true);
    setFeedback("");

    try {
      const res = await fetch("/api/auth/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
       userId,
          productId: product._id,       // use _id from backend
          title: product.title,
          image:
  product.images?.[activeImage] ||
  product.images?.[0] ||
  product.image,
          price: product.price,
          oldPrice: product.oldPrice ?? null,
          discount: product.discount ?? null,
          category: product.category ?? null,
          rating: product.rating ?? 0,
          selectedColor: colors[selectedColor],
          selectedSize: sizes[selectedSize],
          quantity: qty,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFeedback("success");
          dispatch(setReduxCart({ items: data.cart.items }));
      } else {
        setFeedback("error");
      }
    } catch (err) {
      console.error(err);
      setFeedback("error");
    } finally {
      setLoading(false);
      // clear feedback after 2s
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <h1 className="text-3xl font-bold uppercase tracking-tight leading-tight">
        {product.title}
      </h1>

      {/* Rating */}
      <StarRating rating={product.rating} size={18} />

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold">${product.price}</span>
        {product.oldPrice && (
          <span className="text-xl text-gray-400 line-through">
            ${product.oldPrice}
          </span>
        )}
        {product.discount && (
          <span className="bg-red-50 text-red-500 text-sm font-semibold px-3 py-1 rounded-full">
            {product.discount}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed">
        {product.description}
      </p>

      <hr className="border-gray-200" />

      {/* Colors */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Select Colors</p>
        <div className="flex gap-3">
          {colors.map((color, i) => (
            <button
              key={i}
               onClick={() => {
      setSelectedColor(i);
      setActiveImage(i); // 🔥 sync image with color
    }}
              title={color}
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full transition-all ${
                selectedColor === i
                  ? "ring-2 ring-black ring-offset-2"
                  : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
              }`}
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sizes */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Choose Size</p>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size, i) => (
            <button
              key={i}
              onClick={() => setSelectedSize(i)}
              className={`px-5 py-2 rounded-full text-sm border transition-all ${
                selectedSize === i
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-200 hover:bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Quantity + Add to Cart */}
      {/* Quantity + Add to Cart */}
<div className="flex flex-wrap gap-4 items-center">
  <div className="flex items-center gap-4 bg-gray-100 rounded-full px-5 py-3">
    <button
      onClick={() => setQty((q) => Math.max(1, q - 1))}
      className="text-xl leading-none font-medium"
    >
      −
    </button>
    <span className="text-base font-medium w-5 text-center">{qty}</span>
    <button
      onClick={() => setQty((q) => q + 1)}
      className="text-xl leading-none font-medium"
    >
      +
    </button>
  </div>

  <button
    onClick={handleAddToCart}
    disabled={loading}
    className={`flex-1 min-w-[160px] py-3.5 rounded-full text-base font-semibold transition-all ${
      feedback === "success"
        ? "bg-green-500 text-white"
        : feedback === "error"
        ? "bg-red-500 text-white"
        : "bg-black text-white hover:opacity-85"
    } disabled:opacity-60 disabled:cursor-not-allowed`}
  >
    {loading
      ? "Adding..."
      : feedback === "success"
      ? "✓ Added to Cart"
      : feedback === "error"
      ? "✗ Failed, Try Again"
      : "Add to Cart"}
  </button>
</div>
    </div>
  );
}