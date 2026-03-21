import { testimonials } from "@/app/constants/testimonal";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">OUR HAPPY CUSTOMERS</h2>

        <div className="flex gap-3">
          <button className="p-2 border rounded-full hover:bg-gray-100">
            ←
          </button>
          <button className="p-2 border rounded-full hover:bg-gray-100">
            →
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="min-w-[300px] md:min-w-[350px] bg-white border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex gap-1 mb-3 text-yellow-500">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <span className="text-green-500 text-sm">✔</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              {item.review}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
