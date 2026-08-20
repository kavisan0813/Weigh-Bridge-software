import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger" | "icon" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  darkMode?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  darkMode = false,
  children,
  disabled,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  // Base sizing
  let padding = "px-4 py-2.5 text-sm";
  let minHeight = "min-h-[44px]";

  if (size === "sm") {
    padding = "px-3 py-1.5 text-xs";
    minHeight = "min-h-[36px]";
  } else if (size === "lg") {
    padding = "px-6 py-3.5 text-base";
    minHeight = "min-h-[52px]";
  }

  if (variant === "icon") {
    padding = size === "sm" ? "p-2" : size === "lg" ? "p-3.5" : "p-2.5";
  }

  // Variant styling
  let baseColors = "";

  if (variant === "primary") {
    baseColors = darkMode
      ? "bg-[#FB923C] hover:bg-[#F97316] active:bg-[#EA580C] text-gray-900 font-semibold shadow-sm"
      : "bg-[#F97316] hover:bg-[#EA580C] active:bg-[#C2410C] text-white font-semibold shadow-sm";
  } else if (variant === "secondary") {
    baseColors = darkMode
      ? "bg-[#D4A83A] hover:bg-[#C99A2E] active:bg-[#A97C1F] text-gray-950 font-semibold shadow-sm"
      : "bg-[#C99A2E] hover:bg-[#A97C1F] active:bg-[#8C6415] text-white font-semibold shadow-sm";
  } else if (variant === "tertiary") {
    baseColors = darkMode
      ? "bg-[#273449] hover:bg-[#374151] active:bg-[#1F2937] text-gray-200 border border-[#374151]"
      : "bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-[#E5E7EB] shadow-xs";
  } else if (variant === "danger") {
    baseColors = "bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white font-semibold shadow-sm";
  } else if (variant === "icon" || variant === "text") {
    baseColors = darkMode
      ? "bg-transparent hover:bg-[#273449] text-gray-300 hover:text-white"
      : "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900";
  }

  const disabledStyles = isDisabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "cursor-pointer transition-all duration-150 active:scale-[0.98]";

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 ${padding} ${minHeight} ${baseColors} ${disabledStyles} ${className}`}
      style={style}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
