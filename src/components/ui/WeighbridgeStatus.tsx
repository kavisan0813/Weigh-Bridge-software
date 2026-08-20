import { StatusBadge, type StatusType } from "./StatusBadge";

export interface WeighbridgeStatusProps {
  id: string;
  location?: string;
  status: StatusType | string;
  darkMode?: boolean;
  operator?: string;
  compact?: boolean;
  className?: string;
}

export function WeighbridgeStatus({
  id,
  location,
  status,
  darkMode = false,
  operator,
  compact = false,
  className = "",
}: WeighbridgeStatusProps) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span
          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${darkMode ? "bg-gray-800 text-amber-400" : "bg-gray-100 text-gray-800"}`}
        >
          {id}
        </span>
        <StatusBadge status={status} darkMode={darkMode} size="sm" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border ${
        darkMode
          ? "bg-wb-dark-surface border-wb-dark-border"
          : "bg-white border-wb-border"
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#F97316]/10 text-[#F97316] font-bold font-mono flex items-center justify-center text-sm border border-[#F97316]/20">
          {id}
        </div>
        <div>
          <div
            className={`text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}
          >
            {id} {location ? `• ${location}` : ""}
          </div>
          {operator && (
            <div
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Op: {operator}
            </div>
          )}
        </div>
      </div>
      <StatusBadge status={status} darkMode={darkMode} />
    </div>
  );
}
