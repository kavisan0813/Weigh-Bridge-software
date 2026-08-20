import { type ReactNode } from "react";

export interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  darkMode?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtext,
  change,
  changeType = "positive",
  icon,
  darkMode = false,
  className = "",
}: KPICardProps) {
  let changeColor = darkMode
    ? "text-green-400 bg-green-950/40"
    : "text-[#16A34A] bg-green-50";

  if (changeType === "negative") {
    changeColor = darkMode
      ? "text-red-400 bg-red-950/40"
      : "text-[#DC2626] bg-red-50";
  } else if (changeType === "neutral") {
    changeColor = darkMode
      ? "text-gray-400 bg-gray-800"
      : "text-gray-600 bg-gray-100";
  }

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        darkMode
          ? "bg-wb-dark-surface border-wb-dark-border"
          : "bg-white border-wb-border shadow-xs"
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span
          className={`tabular-nums text-2xl font-bold tracking-tight ${darkMode ? "text-gray-100" : "text-gray-900"}`}
        >
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${changeColor}`}
          >
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <div
          className={`mt-1.5 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}
