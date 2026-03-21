
"use client"
import AnnouncementBar from "../elements/AnnouncementBar";
import HeroSection from "../elements/HeroSection";
import BrandShowcase from "../elements/BrandShowcase";
import ProductSection from "../elements/ProductSection";
import DressStyleSection from "../elements/DressStyleSection";
import {  NEW_ARRIVALS,TOP_SELLING,BRANDS, HERO_STATS,DRESS_STYLES} from "../../constants/mainPage";

export default function MainPage() {
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

     <BrandShowcase
  brands={BRANDS}
/>
  <ProductSection
      title="NEW ARRIVALS"
      products={NEW_ARRIVALS}
      onViewAll={() => console.log("View All Clicked")}
    />
      <ProductSection
      title="TOP SELLING"
      products={TOP_SELLING}
      onViewAll={() => console.log("View All Clicked")}
    />
    <DressStyleSection
  title="BROWSE BY DRESS STYLE"
  styles={DRESS_STYLES}
/>

    </div>
  );
}