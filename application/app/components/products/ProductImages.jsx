"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImages({ image, title }) {
  // ✅ ensure it's always an array
  const images = Array.isArray(image) ? image : [image];

  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Thumbnails */}
      <div className="flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
              active === i
                ? "border-black"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <div className="relative w-full h-full bg-gray-100">
              <Image
                src={src} // ✅ Cloudinary URL works here
                alt={`${title} view ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100 min-h-[280px] sm:min-h-[380px] lg:min-h-[420px]">
        <Image
          src={images[active]} // ✅ active image
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}