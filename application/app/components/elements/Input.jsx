import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      helperText,
      error,
      success,
      variant = "default",
      size = "md",
      leftIcon,
      rightIcon,
      containerClassName = "",
      labelClassName = "",
      inputClassName = "",
      required,
      loading,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles = "w-full outline-none transition rounded-md border";

    const variantStyles = {
      default: "border-gray-300 focus:border-blue-500",
      outlined: "border-2 border-gray-400 focus:border-blue-600",
      filled: "bg-gray-100 border-transparent focus:border-blue-500",
    };

    const sizeStyles = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const stateStyles = error
      ? "border-red-500 focus:border-red-600"
      : success
        ? "border-green-500 focus:border-green-600"
        : "";

    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        {label && (
          <label className={`text-sm font-medium ${labelClassName}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 flex items-center text-gray-500">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            disabled={disabled || loading}
            required={required}
            className={`
              ${baseStyles}
              ${variantStyles[variant]}
              ${sizeStyles[size]}
              ${stateStyles}
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon || loading ? "pr-10" : ""}
              ${inputClassName}
            `}
            {...props}
          />

          {loading && <span className="absolute right-3 animate-spin">⏳</span>}

          {!loading && rightIcon && (
            <span className="absolute right-3 flex items-center text-gray-500">
              {rightIcon}
            </span>
          )}
        </div>

        {error && typeof error === "string" && (
          <span className="text-red-500 text-sm">{error}</span>
        )}

        {!error && success && typeof success === "string" && (
          <span className="text-green-500 text-sm">{success}</span>
        )}

        {!error && !success && helperText && (
          <span className="text-gray-500 text-sm">{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
