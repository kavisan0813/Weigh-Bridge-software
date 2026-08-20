import { type ReactNode } from "react";

export type StatusType =
  | "ONLINE"
  | "OFFLINE"
  | "COMPLETED"
  | "PENDING"
  | "AWAITING SECOND"
  | "OVERDUE"
  | "READY"
  | "ON HOLD"
  | "ERROR"
  | "CANCELLED"
  | "WEIGHING"
  | "AVAILABLE";

export interface StatusBadgeProps {
  status: StatusType | string;
  darkMode?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({
  status,
  darkMode = false,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const normalizedStatus = String(status).toUpperCase();

  let colorClasses = "";
  let icon: ReactNode = null;

  switch (normalizedStatus) {
    case "ONLINE":
    case "COMPLETED":
    case "READY":
      colorClasses = darkMode
        ? "bg-green-950/50 text-green-400 border-green-800/50"
        : "bg-green-50 text-[#16A34A] border-green-200";
      icon = (
        <span className="w-1.5 h-1.5 rounded-full bg-wb-success animate-pulse" />
      );
      break;

    case "PENDING":
    case "AWAITING SECOND":
    case "ON HOLD":
      colorClasses = darkMode
        ? "bg-amber-950/50 text-amber-400 border-amber-800/50"
        : "bg-amber-50 text-[#F59E0B] border-amber-200";
      icon = (
        <svg
          className="w-3 h-3 text-wb-warning"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
      break;

    case "OFFLINE":
    case "ERROR":
    case "OVERDUE":
    case "CANCELLED":
      colorClasses = darkMode
        ? "bg-red-950/50 text-red-400 border-red-800/50"
        : "bg-red-50 text-[#DC2626] border-red-200";
      icon = <span className="w-1.5 h-1.5 rounded-full bg-wb-error" />;
      break;

    case "WEIGHING":
    case "PROCESSING":
      colorClasses = darkMode
        ? "bg-purple-950/50 text-purple-400 border-purple-800/50"
        : "bg-purple-50 text-[#8B5CF6] border-purple-200";
      icon = (
        <svg
          className="w-3 h-3 text-wb-purple animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
      );
      break;

    case "AVAILABLE":
    case "INFO":
    default:
      colorClasses = darkMode
        ? "bg-blue-950/50 text-blue-400 border-blue-800/50"
        : "bg-blue-50 text-[#2563EB] border-blue-200";
      icon = <span className="w-1.5 h-1.5 rounded-full bg-wb-info" />;
      break;
  }

  const py = size === "sm" ? "py-0.5 px-2 text-[11px]" : "py-1 px-2.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${py} ${colorClasses} ${className}`}
    >
      {icon}
      <span>{normalizedStatus}</span>
    </span>
  );
}
