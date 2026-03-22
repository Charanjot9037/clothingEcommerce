// components/product/ReviewsSection.jsx
"use client";

import { useState } from "react";
import StarRating from "../../components/products/StarRating";

const REVIEWS = [
  {
    id: 1,
    name: "Samantha D.",
    rating: 5,
    verified: true,
    text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fashion designer, I appreciate the attention to detail. It's become my favorite go-to shirt!",
    date: "August 14, 2023",
  },
  {
    id: 2,
    name: "Alex M.",
    rating: 5,
    verified: true,
    text: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this shirt gets a thumbs up from me.",
    date: "August 15, 2023",
  },
  {
    id: 3,
    name: "Ethan R.",
    rating: 4,
    verified: true,
    text: "This t-shirt is a must-have for anyone who appreciates good design. The minimalist yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
    date: "August 16, 2023",
  },
  {
    id: 4,
    name: "Olivia P.",
    rating: 5,
    verified: true,
    text: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt hits both. The clean lines feel great to wear. It's evident the designer poured creativity into making this tee stand out.",
    date: "August 17, 2023",
  },
  {
    id: 5,
    name: "Liam K.",
    rating: 5,
    verified: true,
    text: "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art!",
    date: "August 18, 2023",
  },
  {
    id: 6,
    name: "Ava H.",
    rating: 5,
    verified: true,
    text: "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The incredible detail and thoughtful layout of the design make this shirt a wearable conversation starter.",
    date: "August 19, 2023",
  },
];

const TABS = ["Product Details", "Rating & Reviews", "FAQs"];

export default function ReviewsSection() {
  const [activeTab, setActiveTab] = useState(1);
  const [sort, setSort] = useState("Latest");
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <div className="px-4 sm:px-8 lg:px-20 pb-12">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-4 text-center text-xs sm:text-sm transition-all ${
              activeTab === i
                ? "text-black font-semibold border-b-2 border-black -mb-px"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 1 && (
        <>
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-bold">
              All Reviews{" "}
              <span className="text-gray-400 font-normal text-base">(451)</span>
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none cursor-pointer"
              >
                <option>Latest</option>
                <option>Highest</option>
                <option>Lowest</option>
              </select>
              <button className="bg-black text-white rounded-full px-5 py-2 text-sm font-semibold">
                ✎ Write a Review
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {REVIEWS.slice(0, visibleCount).map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3"
              >
                <StarRating rating={review.rating} size={16} showValue={false} />
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">{review.name}</span>
                  {review.verified && (
                    <span className="text-green-500 text-sm">✔</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  "{review.text}"
                </p>
                <p className="text-xs text-gray-400">Posted on {review.date}</p>
              </div>
            ))}
          </div>

          {visibleCount < REVIEWS.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((c) => c + 4)}
                className="px-10 py-3.5 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 0 && (
        <div className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          <p>
            Crafted from 100% premium cotton, this piece features reinforced
            stitching, pre-shrunk fabric, and a tagless collar for all-day
            comfort. Machine washable at 30°C. Fits true to size.
          </p>
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-4 max-w-2xl">
          {[
            ["What is the return policy?", "We offer a 30-day hassle-free return policy on all items."],
            ["How long does shipping take?", "Standard shipping takes 5–7 business days. Express options available."],
            ["Is this available in more colors?", "Check the color swatches on the product page for all available options."],
          ].map(([q, a]) => (
            <div key={q} className="border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-sm mb-2">{q}</p>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}