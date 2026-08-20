export interface WeightDisplayProps {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  isNet?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  darkMode?: boolean;
  subtext?: string;
  className?: string;
}

export function WeightDisplay({
  label,
  value,
  unit = "KG",
  isNet = false,
  size = "md",
  darkMode = false,
  subtext,
  className = "",
}: WeightDisplayProps) {
  const formattedValue =
    value === null || value === undefined || value === ""
      ? "—"
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

  let valueTextSize = "text-xl";
  if (size === "sm") valueTextSize = "text-sm font-semibold";
  if (size === "lg") valueTextSize = "text-2xl font-bold";
  if (size === "xl") valueTextSize = "text-4xl font-extrabold";

  const containerBg = isNet
    ? darkMode
      ? "bg-[#273449] border-[#FB923C]/40"
      : "bg-[#FFF7ED] border-[#F97316]/30"
    : darkMode
    ? "bg-[#1F2937] border-[#374151]"
    : "bg-white border-[#E5E7EB]";

  const labelColor = isNet
    ? darkMode
      ? "text-[#FB923C]"
      : "text-[#EA580C]"
    : darkMode
    ? "text-gray-400"
    : "text-gray-600";

  const valueColor = isNet
    ? darkMode
      ? "text-[#F9FAFB]"
      : "text-gray-900"
    : darkMode
    ? "text-gray-100"
    : "text-gray-900";

  return (
    <div
      className={`flex flex-col p-3 rounded-xl border transition-all ${containerBg} ${className}`}
    >
      <div className={`text-xs font-bold uppercase tracking-wider ${labelColor} flex items-center justify-between`}>
        <span>{label}</span>
        {isNet && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F97316]/10 text-[#F97316] font-semibold">
            FINAL
          </span>
        )}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`tabular-nums tracking-tight font-sans ${valueTextSize} ${valueColor}`}>
          {formattedValue}
        </span>
        {formattedValue !== "—" && (
          <span className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {unit}
          </span>
        )}
      </div>
      {subtext && (
        <span className={`text-[11px] mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {subtext}
        </span>
      )}
    </div>
  );
}
