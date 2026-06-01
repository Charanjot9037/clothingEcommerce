"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Wrapper from "../atoms/Wrapper";
import TestimonialCard from "../atoms/TestimonialCard";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="text-2xl leading-none transition-transform hover:scale-110 focus:outline-none"
        aria-label={`${star} star`}
      >
        <span className={star <= value ? "text-black" : "text-gray-200"}>★</span>
      </button>
    ))}
  </div>
);

export default function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [reviews,     setReviews]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);
  const [form,        setForm]        = useState({ rating: 5, review: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
  setIsLoggedIn(!!getToken());
}, []);

  useEffect(() => {
    fetch("/api/review")
      .then((r) => r.json())
      .then((d) => { if (d.success) setReviews(d.reviews); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.review.trim()) return setError("Please write a review.");
    setSubmitting(true);
    setError("");

    const res  = await fetch("/api/review", {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body:    JSON.stringify(form),
    });
    const data = await res.json();

    if (!data.success) {
      setError(data.message);
    } else {
      // Update or prepend the review in state
      setReviews((prev) => {
        const exists = prev.findIndex((r) => r.userId === data.review.userId);
        if (exists > -1) {
          const next = [...prev];
          next[exists] = data.review;
          return next;
        }
        return [data.review, ...prev];
      });
      setSuccess(true);
      setShowForm(false);
      setForm({ rating: 5, review: "" });
    }
    setSubmitting(false);
  };

  return (
    <Wrapper>
      <section className="py-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <h2 className="text-2xl md:text-4xl font-extrabold">OUR HAPPY CUSTOMERS</h2>
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={() => { setShowForm((v) => !v); setSuccess(false); }}
                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition"
              >
                {showForm ? "Cancel" : "Leave a Review"}
              </button>
            )}
            <button onClick={scrollPrev} className="p-2 rounded-full hover:bg-gray-100 transition">←</button>
            <button onClick={scrollNext} className="p-2 rounded-full hover:bg-gray-100 transition">→</button>
          </div>
        </div>

        {/* Review form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 border border-gray-200 rounded-2xl p-6 max-w-lg bg-white"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Your Review</h3>

            <div className="mb-4">
              <p className="text-xs text-gray-400 font-medium mb-2">Rating</p>
              <StarRating value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 font-medium mb-2">Review</p>
              <textarea
                value={form.review}
                onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                placeholder="Share your experience…"
                rows={3}
                maxLength={500}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black resize-none transition"
              />
              <p className="text-right text-xs text-gray-300 mt-1">{form.review.length}/500</p>
            </div>

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        )}

        {success && (
          <div className="mb-6 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 font-medium max-w-lg">
            ✓ Thanks for your review!
          </div>
        )}

        {/* Not logged in nudge */}
        {!isLoggedIn && (
          <p className="text-sm text-gray-400 mb-6">
            <a href="/login" className="underline font-medium text-gray-700">Sign in</a> to leave a review.
          </p>
        )}

        {/* Carousel */}
        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-[0_0_33.33%] h-40 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 text-sm py-8">No reviews yet — be the first!</p>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((item) => (
                <div
                  key={item._id}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] px-3"
                >
                  <TestimonialCard
                    name={item.name}
                    review={item.review}
                    rating={item.rating}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Wrapper>
  );
}