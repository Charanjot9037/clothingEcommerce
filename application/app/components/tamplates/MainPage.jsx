
"use client"
import AnnouncementBar from "../elements/AnnouncementBar";
import Navbar from "../elements/Navbar";
import HeroSection from "../elements/HeroSection";
import BrandShowcase from "../elements/BrandShowcase";
import ProductSection from "../elements/ProductSection";
export  const NAV_LINKS = [
  {
    label: "Shop",
    dropdown: [
      { label: "Men", href: "/shop/men" },
      { label: "Women", href: "/shop/women" },
      { label: "Kids", href: "/shop/kids" },
    ],
  },
  {
    label: "On Sale",
    href: "/sale",
  },
  {
    label: "New Arrivals",
    href: "/new-arrivals",
  },
  {
    label: "Brands",
    href: "/brands",
  },
];
 const products = [
  {
    id: "p1",
    image: "/main/card-1.png",
    title: "T-shirt with Tape Details",
    price: 120,
    rating: 4.5,
  },
  {
    id: "p2",
    image: "/main/card-2.png",
    title: "Skinny Fit Jeans",
    price: 240,
    oldPrice: 260,
    rating: 3.5,
    discount: "-20%",
  },
  {
    id: "p3",
    image: "/main/card-3.png",
    title: "Checkered Shirt",
    price: 180,
    rating: 4.5,
  },
  {
    id: "p4",
    image: "/main/card-4.png",
    title: "Sleeve Striped T-shirt",
    price: 130,
    oldPrice: 160,
    rating: 4.5,
    discount: "-30%",
  },
];
 const topSelling = [
  {
    id: "p5",
    image: "/main/card-5.png",
    title: "Casual Printed T-shirt",
    price: 150,
    rating: 4.2,
  },
  {
    id: "p6",
    image: "/main/card-6.png",
    title: "Denim Jacket",
    price: 320,
    oldPrice: 400,
    rating: 4.7,
    discount: "-20%",
  },
  {
    id: "p7",
    image: "/main/card-7.png",
    title: "Formal White Shirt",
    price: 210,
    rating: 4.4,
  },
  {
    id: "p8",
    image: "/main/card-8.png",
    title: "Black Hoodie",
    price: 280,
    oldPrice: 350,
    rating: 4.6,
    discount: "-25%",
  },
  {
    id: "p9",
    image: "/main/card-5.png",
    title: "Slim Fit Trousers",
    price: 260,
    rating: 4.3,
  },
  {
    id: "p10",
    image: "/main/card-6.png",
    title: "Oversized Sweatshirt",
    price: 300,
    oldPrice: 380,
    rating: 4.8,
    discount: "-21%",
  },
  {
    id: "p11",
    image: "/main/card-7.png",
    title: "Cotton Polo T-shirt",
    price: 190,
    rating: 4.1,
  },
  {
    id: "p12",
    image: "/main/card-8.png",
    title: "Classic Blue Jeans",
    price: 270,
    oldPrice: 330,
    rating: 4.5,
    discount: "-18%",
  },
];

export default function MainPage() {
  return (
    <div>
       <AnnouncementBar
        message="Sign up and get 20% off to your first order."
        linkText="Sign Up Now"
      />

     

      <Navbar
        logo="/global/logo.svg"
        links={NAV_LINKS}
      />

      <HeroSection
        title="FIND CLOTHES THAT MATCHES YOUR STYLE"
        description="Browse through our diverse range of garments designed to bring out your individuality."
      
        stats={[
          { number: "200+", label: "International Brands" },
          { number: "2,000+", label: "High Quality Products" },
          { number: "30,000+", label: "Happy Customers" },
        ]}
      />

     <BrandShowcase
  brands={[
    "/main/brand-1.svg",
 "main/brand-2.svg",
 "main/brand-3.svg",
 "main/brand-4.svg",
 "main/brand-5.svg"
  ]}
/>
  <ProductSection
      title="NEW ARRIVALS"
      products={products}
      onViewAll={() => console.log("View All Clicked")}
    />
      <ProductSection
      title="TOP SELLING"
      products={topSelling}
      onViewAll={() => console.log("View All Clicked")}
    />

    </div>
  );
}