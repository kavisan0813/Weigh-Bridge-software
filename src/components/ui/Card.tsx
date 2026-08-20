import { type ReactNode, type HTMLAttributes } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  darkMode?: boolean;
  noPadding?: boolean;
  elevated?: boolean;
  children?: ReactNode;
}

export function Card({
  title,
  subtitle,
  action,
  footer,
  darkMode = false,
  noPadding = false,
  elevated = false,
  children,
  className = "",
  style,
  ...props
}: CardProps) {
  const bg = elevated
    ? darkMode
      ? "bg-[#273449]"
      : "bg-white shadow-md"
    : darkMode
    ? "bg-[#1F2937]"
    : "bg-white shadow-xs";

  const borderColor = darkMode ? "border-[#374151]" : "border-[#E5E7EB]";

  return (
    <div
      className={`rounded-xl border ${bg} ${borderColor} ${className}`}
      style={style}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className={`flex items-center justify-between px-5 py-4 border-b ${borderColor}`}>
          <div>
            {title && (
              <h3 className={`text-base font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
      {footer && (
        <div className={`px-5 py-3.5 border-t rounded-b-xl ${borderColor} ${darkMode ? "bg-gray-900/40" : "bg-gray-50/70"}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
