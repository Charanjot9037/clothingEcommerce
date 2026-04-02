"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/items/${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="hidden md:flex w-full md:w-5/6 lg:w-full lg:gap-4 px-4 items-center rounded-full bg-gray-100">
      <Search size={20} className="cursor-pointer" onClick={handleSearch} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full py-2 bg-transparent focus:outline-none"
      />
    </div>
  );
}