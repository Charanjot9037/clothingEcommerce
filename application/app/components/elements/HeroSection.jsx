import Button from "./Button";
import StatsItem from "../atoms/StatsItem";
import Wrapper from "../atoms/Wrapper";
import Link from "next/link";

export default function HeroSection({
  title,
  description,
 
  stats,
}) {
  return (
   <section className="bg-[url('/main/hero.jpg')] bg-cover bg-center  py-6 lg:py-25">
      <Wrapper>
        <div className="flex items-end  pt-1 lg:pt-2 justify-start w-full lg:w-1/2">

          <div className="w-8/12 lg:w-3/4">

            <h1 className=" text-2xl lg:text-6xl font-extrabold ">
              {title}
            </h1>

            <p className="text-gray-600 mt-4 font-thin">
              {description}
            </p>

            <div className="mt-6 ">
              <Button variant="dark" ><Link href="shop/new-arrivals">Shop Now</Link></Button>
            </div>

            <div className="flex gap-8  mt-10">
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