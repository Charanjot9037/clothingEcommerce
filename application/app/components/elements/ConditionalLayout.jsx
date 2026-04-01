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
  const isResetPassword = pathname?.startsWith("/reset-password");
  return (
    <>
      {!isAdminPage && !isLogin && !isSignUp && !isResetPassword && (
        <Navbar logo="/global/logo2.jpg" links={NAV_LINKS} />
      )}
      {children}
      {!isAdminPage && !isLogin && !isSignUp && !isResetPassword && <Newsletter />}
      {!isAdminPage && !isLogin && !isSignUp && !isResetPassword && <StyleAdvisorWidget />}
      {!isAdminPage && !isLogin && !isSignUp && !isResetPassword && <Footer />}
    </>
  );
}