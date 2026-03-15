import React from "react";

const Card = ({
  children,
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 w-full max-w-md ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-semibold mb-1">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-gray-500 text-sm mb-4">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
};

export default Card;