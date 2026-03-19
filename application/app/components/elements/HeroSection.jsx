import Button from "./Button";
import StatsItem from "../atoms/StatsItem";
import Wrapper from "../atoms/Wrapper";

export default function HeroSection({
  title,
  description,
 
  stats,
}) {
  return (
   <section className="bg-[url('/main/hero.jpg')] bg-cover bg-center py-20">
      <Wrapper>
        <div className="flex items-end pt-2 justify-start w-1/2">

          <div className="border-2 w-3/4">

            <h1 className="text-6xl font-extrabold ">
              {title}
            </h1>

            <p className="text-gray-600 mt-4 font-thin">
              {description}
            </p>

            <div className="mt-6">
              <Button variant="dark" >Shop Now</Button>
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

        </div>
      </Wrapper>
    </section>
  );
}