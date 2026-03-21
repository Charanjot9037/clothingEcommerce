
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/elements/Navbar";
import {NAV_LINKS} from "./constants/navbar";

const inter=Inter({
  subsets: ["latin"],
  weight: ["300","400","500","600"],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
       className={inter.className}
      >
          <Navbar
                logo="/global/logo.svg"
                links={NAV_LINKS}
              />
        
        {children}
      </body>
    </html>
  );
}
