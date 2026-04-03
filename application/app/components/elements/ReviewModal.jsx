"use client";
import { useState } from "react";

export default function ReviewModal({ productId, onClose, onSubmitted }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rating || !comment) {
      setError("Please fill in all fields and select a rating.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onSubmitted(); // refresh reviews
      onClose(); // close modal
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-5">Write a Review</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Star Rating */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-2xl transition-colors"
                >
                  <span
                    className={
                      (hovered || rating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex M."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-full py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
