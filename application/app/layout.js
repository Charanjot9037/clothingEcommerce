"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/elements/Navbar";
import Footer from "./components/elements/Footer";
import Newsletter from "./components/elements/Newsletter";
import { NAV_LINKS } from "./constants/navbar";
import { store } from "./store/store";
import { Provider } from "react-redux";
import StyleAdvisorWidget from "./components/elements/StyleAdvisorWidget";
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <Navbar logo="/global/logo.svg" links={NAV_LINKS} />

          {children}
          <Newsletter />
          <StyleAdvisorWidget />
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
