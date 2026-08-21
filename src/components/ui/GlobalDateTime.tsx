import { useState, useEffect } from "react";

export interface GlobalDateTimeProps {
  darkMode?: boolean;
}

export function useLiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const day = now.getDate().toString().padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const dateStr = `${day} ${month} ${year}`;

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = hours.toString().padStart(2, "0");

  const timeStr = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
  const shortTimeStr = `${hoursStr}:${minutes} ${ampm}`;

  return { dateStr, timeStr, shortTimeStr, now };
}

export function GlobalDateTime({ darkMode = false }: GlobalDateTimeProps) {
  const { dateStr, timeStr, shortTimeStr } = useLiveClock();

  const bg = darkMode ? "#273449" : "#F1F5F9";
  const border = darkMode ? "#374151" : "#E2E8F0";
  const textColor = darkMode ? "#F9FAFB" : "#111827";
  const mutedColor = darkMode ? "#9CA3AF" : "#6B7280";
  const orangeAccent = darkMode ? "#FB923C" : "#F97316";

  return (
    <div
      className="global-live-datetime"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 8,
        background: bg,
        border: `1px solid ${border}`,
        fontSize: 24,
        fontWeight: 1200,
        color: textColor,
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
      title="Live System Date & Time"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={orangeAccent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>

      {/* Desktop View: Preferred 20 Aug 2026 • 10:42:36 AM */}
      <div
        className="hidden md:flex"
        style={{
          alignItems: "center",
          gap: 6,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace, sans-serif",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ fontWeight: 600 }}>{timeStr}</span>
        <span style={{ fontWeight: 600 }}>|</span>
        <span style={{ fontWeight: 600, color: mutedColor }}>{dateStr}</span>
      </div>

      {/* Tablet View: Stacked Date / Time */}
      <div
        className="hidden sm:flex md:hidden"
        style={{
          flexDirection: "column",
          fontSize: 11,
          lineHeight: 1.15,
          fontFamily: "monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>{dateStr}</span>
        <span style={{ color: orangeAccent, fontWeight: 800 }}>{timeStr}</span>
      </div>

      {/* Mobile View: 10:42 AM */}
      <div
        className="flex sm:hidden"
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: orangeAccent,
          fontFamily: "monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>{shortTimeStr}</span>
      </div>
    </div>
  );
}

export const LiveDateTime = GlobalDateTime;
export default GlobalDateTime;
