"use client";
import { useState } from "react";
import ProductCard from "../atoms/ProductCard";
import Wrapper from "../atoms/Wrapper";

// 🔹 Skeleton Card
const ProductSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 h-64 w-full rounded-lg mb-4"></div>
      <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/2 mb-2 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
    </div>
  );
};

export default function ProductSection({ title, products, loading }) {
  const [showAll, setShowAll] = useState(false);

  const visibleProducts = showAll ? products : products.slice(0, 4);

  return (
    <Wrapper>
      <div className="py-3">
        
        {/* Heading */}
        <h2 className="text-5xl font-extrabold text-center py-8">
          {title}
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full">
          
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : visibleProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
              
        </div>

        {/* View All Button */}
        {!loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="border px-6 py-2 rounded-full hover:bg-black hover:text-white cursor-pointer transition"
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  );
}