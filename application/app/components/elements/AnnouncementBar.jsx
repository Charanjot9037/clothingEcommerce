import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar({ message, linkText }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-black text-white text-center py-2 md:text-sm text-[10px] flex justify-center items-center md:gap-2">
      <span>{message}</span>
      <a href="/signup" className="underline">{linkText}</a>
      <button onClick={() => setVisible(false)} className="absolute right-4 cursor-pointer">
        <X size={20} className="h-7 md:h-8" />
      </button>
    </div>
  );
}