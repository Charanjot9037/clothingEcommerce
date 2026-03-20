"use client";
import { useRouter } from "next/navigation";


export default function ProductCard({
   id,
  image,
  title,
  price,
  oldPrice,
  rating,
  discount,
}) {
   const router=useRouter();
  return (
   
    <div  onClick={() => router.push(`/product/${id}`)} className="bg-white rounded-xl p-4 shadow-sm  hover:shadow-md  hover:scale-105 delay-75  transition-all ease-in ">
      
      {/* Image (NO background, fully adjustable) */}
      <div className="flex justify-center items-center h-72 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Title */}
      <h3 className="mt-3 text-sm font-medium leading-tight">
        {title}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
        {"★".repeat(Math.floor(rating))}
        <span className="text-gray-500 text-xs ml-1">{rating}/5</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="font-semibold text-lg">${price}</span>

        {oldPrice && (
          <span className="text-gray-400 line-through text-sm">
            ${oldPrice}
          </span>
        )}

        {discount && (
          <span className="text-red-500 text-xs bg-red-100 px-2 py-0.5 rounded">
            {discount}
          </span>
        )}
      </div>
    </div>
  );
}

