export default function BrandShowcase({ brands }) {
  return (
    <div className="bg-black text-white py-6 flex justify-around text-lg font-semibold">
      {brands.map((brand) => (
        <span key={brand}>{brand}</span>
      ))}
    </div>
  );
}