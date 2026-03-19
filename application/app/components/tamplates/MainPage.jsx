import AnnouncementBar from "../elements/AnnouncementBar";
import Navbar from "../elements/Navbar";
import HeroSection from "../elements/HeroSection";
import BrandShowcase from "../elements/BrandShowcase";
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
        brands={["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"]}
      />
    

    </div>
  );
}