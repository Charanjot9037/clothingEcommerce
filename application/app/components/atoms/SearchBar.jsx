
import { Search } from "lucide-react";

export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="hidden md:flex w-full md:w-5/6 lg:w-full lg:gap-4 px-4 items-center rounded-full bg-gray-100">
      <Search size={20} />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className=" w-full  py-2 bg-transparent focus:outline-none"
      />
    </div>
  );
}