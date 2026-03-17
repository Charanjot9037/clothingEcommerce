import Button from "./Button";
import StatsItem from "../atoms/StatsItem";

export default function HeroSection({
  title,
  description,
  image,
  stats,
}) {
  return (
    <section className="flex items-center justify-between px-12 py-16">

      <div className="max-w-xl">

        <h1 className="text-5xl font-bold leading-tight">
          {title}
        </h1>

        <p className="text-gray-600 mt-4">
          {description}
        </p>

        <div className="mt-6">
          <Button>Shop Now</Button>
        </div>

        <div className="flex gap-8 mt-10">
          {stats.map((item) => (
            <StatsItem
              key={item.label}
              number={item.number}
              label={item.label}
            />
          ))}
        </div>

      </div>

      <img src={image} className="w-[500px]" />

    </section>
  );
}