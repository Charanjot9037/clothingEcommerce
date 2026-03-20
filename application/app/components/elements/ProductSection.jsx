
"use client";
import { useState } from "react";
import ProductCard from "../atoms/ProductCard";
import Wrapper from "../atoms/Wrapper";

export default function ProductSection({ title, products }) {
  const [showAll, setShowAll] = useState(false);

  return (
    <Wrapper>
      <div className="py-3">
        
        {/* Heading */}
        <h2 className="text-5xl font-extrabold text-center py-8">
          {title}
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full">
          {(showAll ? products : products.slice(0, 4)).map((product, index) => (
           <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="border px-6 py-2 rounded-full hover:bg-black hover:text-white  cursor-pointer transition"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      </div>
    </Wrapper>
  );
}