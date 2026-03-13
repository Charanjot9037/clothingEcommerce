import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition outline-none";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <span className="animate-spin">⏳</span>}

      {!loading && leftIcon && <span>{leftIcon}</span>}

      {children}

      {!loading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
