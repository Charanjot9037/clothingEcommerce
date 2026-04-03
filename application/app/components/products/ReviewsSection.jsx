// components/product/ReviewsSection.jsx
"use client";

import { useState, useEffect } from "react";
import StarRating from "../../components/products/StarRating";
import ReviewModal from "../elements/ReviewModal";

const TABS = ["Product Details", "Rating & Reviews", "FAQs"];

export default function ReviewsSection({ productId }) {
  const [activeTab, setActiveTab] = useState(1);
  const [sort, setSort] = useState("Latest");
  const [visibleCount, setVisibleCount] = useState(6);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ── Fetch reviews from DB ──────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // ── Sort reviews ───────────────────────────────────────────────────
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "Latest") return new Date(b.date) - new Date(a.date);
    if (sort === "Highest") return b.rating - a.rating;
    if (sort === "Lowest") return a.rating - b.rating;
    return 0;
  });

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

      {/* ── Rating & Reviews Tab ── */}
      {activeTab === 1 && (
        <>
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-bold">
              All Reviews{" "}
              <span className="text-gray-400 font-normal text-base">
                ({reviews.length})
              </span>
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
              <button
                onClick={() => setShowModal(true)}
                className="bg-black text-white rounded-full px-5 py-2 text-sm font-semibold"
              >
                ✎ Write a Review
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 w-1/3 rounded mb-3" />
                  <div className="h-3 bg-gray-200 w-full rounded mb-2" />
                  <div className="h-3 bg-gray-200 w-5/6 rounded mb-2" />
                  <div className="h-3 bg-gray-200 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            // Empty State
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            // Reviews Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {sortedReviews.slice(0, visibleCount).map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3"
                >
                  <StarRating
                    rating={review.rating}
                    size={16}
                    showValue={false}
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm">{review.user}</span>
                    <span className="text-green-500 text-sm">✔</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {review.comment}
                  </p>
                  <p className="text-xs text-gray-400">
                    Posted on{" "}
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && visibleCount < sortedReviews.length && (
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

      {/* ── Product Details Tab ── */}
      {activeTab === 0 && (
        <div className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          <p>
            Crafted from 100% premium cotton, this piece features reinforced
            stitching, pre-shrunk fabric, and a tagless collar for all-day
            comfort. Machine washable at 30°C. Fits true to size.
          </p>
        </div>
      )}

      {/* ── FAQs Tab ── */}
      {activeTab === 2 && (
        <div className="space-y-4 max-w-2xl">
          {[
            [
              "What is the return policy?",
              "We offer a 30-day hassle-free return policy on all items.",
            ],
            [
              "How long does shipping take?",
              "Standard shipping takes 5–7 business days. Express options available.",
            ],
            [
              "Is this available in more colors?",
              "Check the color swatches on the product page for all available options.",
            ],
          ].map(([q, a]) => (
            <div key={q} className="border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-sm mb-2">{q}</p>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ReviewModal
          productId={productId}
          onClose={() => setShowModal(false)}
          onSubmitted={fetchReviews}
        />
      )}
    </div>
  );
}
