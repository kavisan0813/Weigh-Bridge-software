import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";

export interface BaseInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  darkMode?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, darkMode = false, className = "", disabled, ...props }, ref) => {
    const baseBorder = error
      ? "border-[#DC2626] focus:ring-[#DC2626]/30"
      : darkMode
      ? "border-[#374151] focus:border-[#FB923C] focus:ring-[#FB923C]/20"
      : "border-[#E5E7EB] focus:border-[#F97316] focus:ring-[#F97316]/20";

    const bgColors = darkMode ? "bg-[#111827] text-gray-100 placeholder-gray-500" : "bg-white text-gray-900 placeholder-gray-400";
    const pl = leftIcon ? "pl-10" : "pl-3.5";
    const pr = rightIcon ? "pr-10" : "pr-3.5";

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className={`absolute left-3 pointer-events-none ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`w-full h-11 ${pl} ${pr} py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${bgColors} ${baseBorder} ${
              disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : ""
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className={`absolute right-3 pointer-events-none ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-[#DC2626] font-medium">{error}</span>}
        {helperText && !error && (
          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{helperText}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, leftIcon, darkMode = false, className = "", disabled, children, ...props }, ref) => {
    const baseBorder = error
      ? "border-[#DC2626] focus:ring-[#DC2626]/30"
      : darkMode
      ? "border-[#374151] focus:border-[#FB923C] focus:ring-[#FB923C]/20"
      : "border-[#E5E7EB] focus:border-[#F97316] focus:ring-[#F97316]/20";

    const bgColors = darkMode ? "bg-[#111827] text-gray-100" : "bg-white text-gray-900";
    const pl = leftIcon ? "pl-10" : "pl-3.5";

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className={`absolute left-3 pointer-events-none ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {leftIcon}
            </div>
          )}
          <select
            ref={ref}
            disabled={disabled}
            className={`w-full h-11 ${pl} pr-10 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 appearance-none transition-all ${bgColors} ${baseBorder} ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className={`absolute right-3 pointer-events-none ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-[#DC2626] font-medium">{error}</span>}
        {helperText && !error && (
          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{helperText}</span>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export interface SearchInputProps extends InputProps {}

export function SearchInput(props: SearchInputProps) {
  return (
    <Input
      type="text"
      placeholder="Search..."
      leftIcon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      }
      {...props}
    />
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, darkMode = false, className = "", disabled, ...props }, ref) => {
    const baseBorder = error
      ? "border-[#DC2626] focus:ring-[#DC2626]/30"
      : darkMode
      ? "border-[#374151] focus:border-[#FB923C] focus:ring-[#FB923C]/20"
      : "border-[#E5E7EB] focus:border-[#F97316] focus:ring-[#F97316]/20";

    const bgColors = darkMode ? "bg-[#111827] text-gray-100 placeholder-gray-500" : "bg-white text-gray-900 placeholder-gray-400";

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className={`text-xs font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          className={`w-full p-3 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${bgColors} ${baseBorder} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-[#DC2626] font-medium">{error}</span>}
        {helperText && !error && (
          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{helperText}</span>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
