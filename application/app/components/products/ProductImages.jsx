// components/product/ProductImages.jsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImages({ image, title }) {
  const [active, setActive] = useState(0);

  // Generate 3 thumbnail variations (same image in real use — swap per product data)
  const thumbs = [image, image, image];

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {thumbs.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              active === i
                ? "border-black"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <div className="relative w-full h-full bg-gray-100">
              <Image
                src={src}
                alt={`${title} view ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100 min-h-[420px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
