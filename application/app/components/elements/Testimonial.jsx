"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import TestimonialCard from "../atoms/TestimonialCard";
import Wrapper from "../atoms/Wrapper";

const testimonialsData = [
  {
    name: "Sarah M.",
    review:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Alex K.",
    review:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
    rating: 5,
  },
  {
    name: "James ",
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co.",
    rating: 5,
  },
  {
    name: "James g.",
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co.",
    rating: 5,
  },
  {
    name: "James L",
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co.",
    rating: 5,
  },
  {
    name: "James Lion.",
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co.",
    rating: 5,
  },
  {
    name: "JamLion.",
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co.",
    rating: 5,
  },
];
export default function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <Wrapper>
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-4xl font-extrabold">
            OUR HAPPY CUSTOMERS
          </h2>

          <div className="flex gap-3">
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              ←
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              →
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonialsData.map((item) => (
              <div
                key={item.name}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] px-3"
              >
                <TestimonialCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Wrapper>
  );
}
