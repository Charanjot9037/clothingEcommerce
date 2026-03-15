import React from "react";

const Divider = ({ text = "OR" }) => {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-200"></div>
      <span className="text-sm text-gray-400">{text}</span>
      <div className="flex-1 h-px bg-gray-200"></div>
    </div>
  );
};

export default Divider;
