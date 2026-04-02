"use client";
import AnnouncementBar from "../elements/AnnouncementBar";
import HeroSection from "../elements/HeroSection";
import BrandShowcase from "../elements/BrandShowcase";
import ProductSection from "../elements/ProductSection";
import DressStyleSection from "../elements/DressStyleSection";
import Testimonials from "../elements/Testimonial";
import { useEffect, useState } from "react";
import { BRANDS, HERO_STATS, DRESS_STYLES } from "../../constants/mainPage";
import Footer from "../elements/Footer";

export default function MainPage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapProduct = (p) => ({
    id:     p._id,
    image:  p.images?.[0] || p.image || "/main/card-1.png",
    title:  p.title,
    price:  p.price,
    rating: p.rating ?? 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [newRes, topRes] = await Promise.all([
          fetch("/api/products?category=new-arrivals&limit=4"),
          fetch("/api/products?category=top-selling&limit=4"),
        ]);
        const newData = await newRes.json();
        const topData = await topRes.json();

        setNewArrivals((newData.products ?? []).map(mapProduct));
        setTopSelling((topData.products ?? []).map(mapProduct).reverse());
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <AnnouncementBar
        message="Sign up and get 20% off to your first order."
        linkText="Sign Up Now"
      />

      <HeroSection
        title="FIND CLOTHES THAT MATCHES YOUR STYLE"
        description="Browse through our diverse range of garments designed to bring out your individuality."
        stats={HERO_STATS}
      />

      <BrandShowcase brands={BRANDS} />

      <ProductSection
        title="NEW ARRIVALS"
        loading={loading}
        products={newArrivals}
        onViewAll={() => console.log("View All Clicked")}
      />
      <ProductSection
        title="TOP SELLING"
        loading={loading}
        products={topSelling}
        onViewAll={() => console.log("View All Clicked")}
      />

      <DressStyleSection title="BROWSE BY DRESS STYLE" styles={DRESS_STYLES} />
      <Testimonials />
    </div>
  );
}