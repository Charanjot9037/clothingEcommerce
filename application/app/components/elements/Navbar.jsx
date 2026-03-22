"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCart, clearCartState } from "../../store/slices/cartSlice";
import Wrapper from "../atoms/Wrapper";
import NavLinks from "../atoms/NavLinks";
import SearchBar from "../atoms/SearchBar";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";

export default function Navbar({ logo, links }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [userName, setUserName] = useState(null);

  const router     = useRouter();
  const dispatch   = useDispatch();
  const totalCount = useSelector((state) => state.cart.totalCount); // ← from Redux

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.name) setUserName(payload.name);
      fetchCartCount(token);
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  const fetchCartCount = async (token) => {
    try {
      const res  = await fetch("/api/auth/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setCart({ items: data.cart.items ?? [] })); // ← update Redux
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const handleCartClick = () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    router.push("/cart");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName(null);
    dispatch(clearCartState());
    router.push("/login");
  };

  return (
    <Wrapper>
      <div className="flex items-center justify-between py-6">

        <button className="lg:hidden" onClick={() => setOpenMenu(true)}>
          <Menu size={26} />
        </button>

        <Image src={logo} alt="Logo" width={180} height={90} className="w-[125px] lg:w-1/7" />

        <div className="hidden lg:flex">
          <NavLinks links={links} />
        </div>

        <div className="hidden lg:block">
          <SearchBar placeholder="Search for products..." />
        </div>

        <div className="flex items-center gap-4">
          <Search size={22} className="lg:hidden" />

          {/* Cart with live Redux count */}
          <button onClick={handleCartClick} className="relative">
            <ShoppingCart size={24} />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </button>

          {userName ? (
            <div className="flex items-center gap-2 group relative">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block text-sm font-medium">{userName}</span>
              </div>
              <div className="absolute right-0 top-8 w-36 bg-white border border-gray-100 rounded-xl shadow-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 rounded-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => router.push("/login")}>
              <User size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[260px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${openMenu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-5 border-b">
          <Image src={logo} alt="logo" width={100} height={50} />
          <button onClick={() => setOpenMenu(false)}><X size={24} /></button>
        </div>
        <div className="p-5">
          <NavLinks links={links} mobile />
        </div>
        {userName && (
          <div className="px-5 pt-4 border-t">
            <p className="text-sm font-medium">{userName}</p>
            <button onClick={handleLogout} className="text-sm text-red-500 mt-1">Logout</button>
          </div>
        )}
      </div>

      {openMenu && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpenMenu(false)} />
      )}
    </Wrapper>
  );
}