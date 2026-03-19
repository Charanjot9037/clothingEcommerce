"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function NavLinks({ links, mobile }) {

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <div
      className={`${
        mobile
          ? "flex flex-col gap-2 text-lg"
          : "flex items-center  text-sm  mx-2  gap-8  md:gap-4 lg:gap-8 lg:text-lg"
      }`}
    >
      {links.map((item) => (
        <div key={item.label} className="relative group gap-0">

          {/* Normal Link */}
          {!item.dropdown && (
            <Link
              href={item.href}
              className={`relative transition duration-300 ${
                mobile
                  ? "flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100"
                  : ""
              }`}
            >
              {item.label}

              {!mobile && (
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
              )}
            </Link>
          )}

          {/* Dropdown */}
          {item.dropdown && (
            <>
              {/* Dropdown button */}
              <button
                onClick={() => mobile && toggleDropdown(item.label)}
                className={`flex items-center justify-between w-full gap-1 ${
                  mobile
                    ? "px-3 py-2 rounded-lg hover:bg-gray-100"
                    : ""
                }`}
              >
                {item.label}

                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    mobile && openDropdown === item.label
                      ? "rotate-180"
                      : ""
                  } ${!mobile ? "group-hover:rotate-180" : ""}`}
                />
              </button>

              {/* Desktop Dropdown */}
              {!mobile && (
                <div className="absolute left-0 top-full mt-3 w-44 bg-white border border-gray-100 rounded-xl shadow-xl py-3 flex flex-col gap-1 opacity-0 invisible scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md transition"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile Dropdown */}
             {mobile && openDropdown === item.label && (
  <div className="flex flex-col ml-4 mt-1 border-l border-gray-200 pl-3 gap-1 text-sm">
    {item.dropdown.map((sub) => (
      <Link
        key={sub.label}
        href={sub.href}
        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 hover:text-black transition-all duration-200 group"
      >
        <span className="relative">
          {sub.label}

          {/* hover underline */}
          <span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
        </span>

        <ChevronRight
          size={16}
          className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition"
        />
      </Link>
    ))}
  </div>
)}
            </>
          )}
        </div>
      ))}
    </div>
  );
}