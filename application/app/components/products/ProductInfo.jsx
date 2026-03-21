// components/product/ProductInfo.jsx
"use client";

import { useState } from "react";
import StarRating from "../../components/products/StarRating";

export default function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(2);
  const [qty, setQty] = useState(1);

  const colors = product.colors ?? ["#4a5c3d", "#2d3a2d", "#1a3458"];
  const sizes = product.sizes ?? ["Small", "Medium", "Large", "X-Large"];

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
              onClick={() => setSelectedColor(i)}
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
      <div className="flex gap-4 items-center">
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

        <button className="flex-1 bg-black text-white py-3.5 rounded-full text-base font-semibold hover:opacity-85 transition-opacity">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
