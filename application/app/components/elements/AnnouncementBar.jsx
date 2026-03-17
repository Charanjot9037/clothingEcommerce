import { X } from "lucide-react";

export default function AnnouncementBar({
  message,
  linkText,
  onClose,
}) {
  return (
    <div className="bg-black text-white text-center py-2 md:text-sm text-[10px] flex justify-center  items-center md:gap-2">
      <span>{message}</span>
      <a href="/signup" className="underline">{linkText}</a>
      <button onClick={onClose} className="absolute right-4"><X size={20} className="h-7 md:h-8 "/></button>
    </div>
  );
}