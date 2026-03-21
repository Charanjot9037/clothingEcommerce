import { Star } from "lucide-react";

export default function TestimonialCard({ name, review, rating }) {
  return (
    <div className="w-full h-44  bg-white border rounded-2xl p-6 shadow-sm">
      <div className="flex gap-1 mb-3 text-yellow-500">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-green-500 text-sm">✔</span>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed">{review}</p>
    </div>
  );
}
