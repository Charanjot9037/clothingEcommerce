"use client";
import Wrapper from "../atoms/Wrapper";

export default function DressStyleSection({ title, styles }) {
  return (
    <Wrapper>
    <div className="bg-gray-100  flex-col    justify-center rounded-3xl p-6 md:p-15 md:px-20 my-12">
      
      {/* Heading */}
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-10">
        {title}
      </h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Casual */}
        <div className="relative bg-white rounded-2xl overflow-hidden h-40 md:h-52">
          <img
            src={styles[0].image}
            alt={styles[0].title}
            className="absolute right-0 bottom-0 h-full object-cover"
          />
          <h3 className="absolute top-4 left-4 text-xl font-semibold">
            {styles[0].title}
          </h3>
        </div>

        {/* Formal */}
        <div className="relative bg-white rounded-2xl overflow-hidden md:col-span-2 h-40 md:h-52">
          <img
            src={styles[1].image}
            alt={styles[1].title}
            className="absolute right-0 bottom-0 h-full object-cover"
          />
          <h3 className="absolute top-4 left-4 text-xl font-semibold">
            {styles[1].title}
          </h3>
        </div>

        {/* Party (big one) */}
        <div className="relative bg-white rounded-2xl overflow-hidden md:col-span-2 h-40 md:h-52">
          <img
            src={styles[2].image}
            alt={styles[2].title}
            className="absolute right-0 bottom-0 h-full object-cover"
          />
          <h3 className="absolute top-4 left-4 text-xl font-semibold">
            {styles[2].title}
          </h3>
        </div>

        {/* Gym */}
        <div className="relative bg-white rounded-2xl overflow-hidden h-40 md:h-52">
          <img
            src={styles[3].image}
            alt={styles[3].title}
            className="absolute right-0 bottom-0 h-full object-cover"
          />
          <h3 className="absolute top-4 left-4 text-xl font-semibold">
            {styles[3].title}
          </h3>
        </div>

      </div>
    </div>
    </Wrapper>
  );
}