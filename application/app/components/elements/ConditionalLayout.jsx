"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Newsletter from "./Newsletter";
import StyleAdvisorWidget from "./StyleAdvisorWidget";
import { NAV_LINKS } from "../../constants/navbar";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isLogin = pathname?.startsWith("/login");
  const isSignUp = pathname?.startsWith("/signup");
  return (
    <>
      {!isAdminPage && !isLogin && !isSignUp && <Navbar logo="/global/logo.svg" links={NAV_LINKS} />}
      {children}
      {!isAdminPage && !isLogin && !isSignUp && <Newsletter />}
      {!isAdminPage && !isLogin && !isSignUp && <StyleAdvisorWidget />}
      {!isAdminPage && !isLogin && !isSignUp && <Footer />}
    </>
  );
}