import Image from "next/image";

export default function BrandShowcase({ brands }) {
  return (
    <div className="bg-black py-4 flex-wrap flex justify-around items-center">
      {brands.map((brand, index) => (
        <div key={index} className="relative w-24 h-20">
          <Image
            src={brand}
            alt={`brand-${index}`}
            fill
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
}