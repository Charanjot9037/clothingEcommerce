
"use client";

import { useState } from "react";
import Image from "next/image";
import Wrapper from "../atoms/Wrapper";
import NavLinks from "../atoms/NavLinks";
import SearchBar from "../atoms/SearchBar";

import { ShoppingCart, User, Menu, X, Search } from "lucide-react";

export default function Navbar({ logo, links }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Wrapper>
      <div className="flex items-center justify-between py-6 ">

        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          onClick={() => setOpenMenu(true)}
        >
          <Menu size={26} />
        </button>

        {/* Logo */}
        <Image
          src={logo}
          alt="Logo"
          width={180}
          height={90}
          className="w-[125px] lg:w-1/7"
        />

        {/* Desktop NavLinks */}
        <div className="hidden lg:flex">
          <NavLinks links={links} />
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:block">
          <SearchBar placeholder="Search for products..." />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Search size={22} className="lg:hidden" />

          <ShoppingCart size={24} />
          <User size={24} />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">

          <Image src={logo} alt="logo" width={100} height={50} />

          <button onClick={() => setOpenMenu(false)}>
            <X size={24} />
          </button>

        </div>

        <div className="p-5">
          <NavLinks links={links} mobile />
        </div>
      </div>

      {/* overlay */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpenMenu(false)}
        />
      )}
    </Wrapper>
  );
}