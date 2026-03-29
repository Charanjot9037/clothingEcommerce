"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/elements/ConditionalLayout";
import { store } from "./store/store";
import { Provider } from "react-redux";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Provider>
      </body>
    </html>
  );
}