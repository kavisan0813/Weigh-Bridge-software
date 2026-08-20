import { useState, type ReactNode } from "react";

export type AdminView =
  | "monitoring"
  | "detail"
  | "transactions"
  | "transaction-detail"
  | "vehicles"
  | "vehicle-detail"
  | "vehicle-add"
  | "vehicle-edit"
  | "drivers"
  | "driver-detail"
  | "driver-add"
  | "driver-edit"
  | "customers"
  | "customer-detail"
  | "customer-add"
  | "customer-edit"
  | "suppliers"
  | "supplier-detail"
  | "supplier-add"
  | "supplier-edit"
  | "materials"
  | "material-detail"
  | "material-add"
  | "material-edit"
  | "tickets"
  | "ticket-detail"
  | "alerts"
  | "billing"
  | "employees"
  | "reports"
  | "auditlogs"
  | "settings";

import AppShell from "../components/AppShell";

export interface AdminOperationsProps {
  view: AdminView;
  userRole?: "admin" | "operator" | "maintenance" | "manager";
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

function usePalette(dm: boolean) {
  return {
    bg: dm ? "#111827" : "#F8FAFC",
    surface: dm ? "#1F2937" : "#FFFFFF",
    elevated: dm ? "#273449" : "#FFFFFF",
    text: dm ? "#F9FAFB" : "#111827",
    secondary: dm ? "#D1D5DB" : "#4B5563",
    muted: dm ? "#9CA3AF" : "#6B7280",
    border: dm ? "#374151" : "#E5E7EB",
    sub: dm ? "#374151" : "#F1F5F9",
    input: dm ? "#111827" : "#FFFFFF",
    divider: dm ? "#374151" : "#F1F5F9",
    sidebarBg: dm ? "#1F2937" : "#FFFFFF",
  };
}

export function Shell({
  children,
  darkMode: dm,
  onToggleDark,
  onLogout,
  onNavigate,
  view,
  userRole = "admin",
}: AdminOperationsProps & { children: ReactNode }) {
  return (
    <AppShell
      activeView={view}
      userRole={userRole}
      userName={userRole === "operator" ? "Ravi Kumar" : "Arun Kumar"}
      stationName={
        userRole === "operator" ? "WB-01 Main Gate" : "All Weighbridges"
      }
      darkMode={dm}
      onToggleDark={onToggleDark}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      {children}
    </AppShell>
  );
}

export function Monitoring({
  darkMode: dm,
  onNavigate,
}: Omit<AdminOperationsProps, "view">) {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const p = usePalette(dm);

  // Full 5 Weighbridge dataset with detailed hardware health & live status
  const fullBridges = [
    {
      id: "WB-01",
      location: "Main Gate",
      status: "online",
      statusLabel: "● ONLINE",
      statusColor: "#16A34A",
      statusBg: dm ? "#052E16" : "#F0FDF4",
      vehicle: "TN20AB1234",
      weight: "38,500 KG",
      weightState: "WEIGHT STABLE",
      weightColor: dm ? "#F9FAFB" : "#111827",
      operator: "Arun Kumar",
      count: 58,
      lastTime: "10:50 AM",
      hw: [
        { name: "Indicator", ok: true },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ],
    },
    {
      id: "WB-02",
      location: "North Gate",
      status: "available",
      statusLabel: "● AVAILABLE",
      statusColor: "#2563EB",
      statusBg: dm ? "#172554" : "#EFF6FF",
      vehicle: null,
      weight: "-- KG",
      weightState: "READY FOR NEXT VEHICLE",
      weightColor: p.muted,
      operator: "Kumar",
      count: 46,
      lastTime: "10:46 AM",
      hw: [
        { name: "Indicator", ok: true },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ],
    },
    {
      id: "WB-03",
      location: "Loading Yard",
      status: "weighing",
      statusLabel: "● WEIGHING",
      statusColor: "#8B5CF6",
      statusBg: dm ? "#2E1065" : "#F5F3FF",
      vehicle: "TN18CD5678",
      weight: "32,100 KG",
      weightState: "STABILIZING...",
      weightColor: "#8B5CF6",
      operator: "Ravi",
      count: 51,
      lastTime: "10:48 AM",
      hw: [
        { name: "Indicator", ok: true },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ],
    },
    {
      id: "WB-04",
      location: "East Gate",
      status: "offline",
      statusLabel: "● OFFLINE",
      statusColor: "#DC2626",
      statusBg: dm ? "#450A0A" : "#FEF2F2",
      vehicle: null,
      weight: "-- KG",
      weightState: "INDICATOR OFFLINE",
      weightColor: "#DC2626",
      operator: null,
      count: 32,
      lastTime: "09:42 AM",
      hw: [
        { name: "Indicator", ok: false },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ],
    },
    {
      id: "WB-05",
      location: "West Gate",
      status: "available",
      statusLabel: "● AVAILABLE",
      statusColor: "#2563EB",
      statusBg: dm ? "#172554" : "#EFF6FF",
      vehicle: null,
      weight: "-- KG",
      weightState: "READY FOR NEXT VEHICLE",
      weightColor: p.muted,
      operator: "Suresh",
      count: 48,
      lastTime: "10:45 AM",
      hw: [
        { name: "Indicator", ok: true },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ],
    },
  ];

  const filtered = fullBridges.filter((b) => {
    const matchesFilter = filter === "All" || b.status === filter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.id.toLowerCase().includes(q) ||
      (b.vehicle && b.vehicle.toLowerCase().includes(q)) ||
      (b.operator && b.operator.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <main
      className="flex-1 overflow-y-auto p-5 md:p-7"
      style={{ color: p.text }}
    >
      {/* Page Title Header with Pulsing Live Status Indicator */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="m-0 text-2xl font-bold tracking-tight md:text-3xl"
              style={{ color: p.text }}
            >
              Live Weighbridge Monitoring
            </h1>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-wb-success"
              style={{
                background: dm ? "#052E16" : "#F0FDF4",
                border: "1px solid rgba(22,163,74,0.3)",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-wb-success animate-pulse" />
              Live ●{" "}
              <span style={{ color: p.muted, fontWeight: 500 }}>
                Updated just now
              </span>
            </span>
          </div>
          <p className="mt-1 text-xs" style={{ color: p.muted }}>
            Real-time operational control center monitoring all 5 physical
            weighbridges.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("transactions")}
            className="rounded-lg px-3.5 py-2 text-xs font-semibold"
            style={{
              background: p.surface,
              color: p.text,
              border: `1px solid ${p.border}`,
              cursor: "pointer",
            }}
          >
            View Transactions
          </button>
          <button
            onClick={() => onNavigate("detail")}
            className="rounded-lg px-3.5 py-2 text-xs font-bold text-white"
            style={{ background: "#F97316", border: 0, cursor: "pointer" }}
          >
            WB-01 Live Control
          </button>
        </div>
      </div>

      {/* ── TOP SUMMARY (5 Compact Operational Metrics) ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["5", "TOTAL WEIGHBRIDGES", p.text, p.surface],
          ["4", "ONLINE", "#16A34A", dm ? "#052E16" : "#F0FDF4"],
          ["1", "CURRENTLY WEIGHING", "#8B5CF6", dm ? "#2E1065" : "#F5F3FF"],
          ["2", "AVAILABLE", "#2563EB", dm ? "#172554" : "#EFF6FF"],
          ["1", "OFFLINE", "#DC2626", dm ? "#450A0A" : "#FEF2F2"],
        ].map(([val, label, col, bg]) => (
          <div
            key={label}
            className="rounded-xl px-4 py-3.5"
            style={{ background: bg, border: `1px solid ${p.border}` }}
          >
            <div
              className="text-2xl font-bold tabular-nums"
              style={{ color: col }}
            >
              {val}
            </div>
            <div
              className="mt-0.5 text-[10.5px] font-bold tracking-wider uppercase"
              style={{ color: p.muted }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTER & CONTROL BAR ── */}
      <div
        className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl p-3.5"
        style={{ background: p.surface, border: `1px solid ${p.border}` }}
      >
        {/* Left: Search input */}
        <div className="flex flex-1 items-center gap-2 min-w-60">
          <span style={{ color: p.muted, fontSize: 13 }}>⌕</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search WB-01, vehicle number or operator..."
            className="w-full bg-transparent text-xs outline-none"
            style={{ color: p.text }}
          />
        </div>

        {/* Center: Filter Chips */}
        <div className="flex items-center gap-1.5">
          {["All", "Online", "Weighing", "Available", "Offline"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
              style={{
                cursor: "pointer",
                border:
                  filter === f ? "1px solid #F97316" : `1px solid ${p.border}`,
                background: filter === f ? "#FFF7ED" : "transparent",
                color: filter === f ? "#F97316" : p.secondary,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Right: Auto refresh toggle */}
        <div
          className="flex items-center gap-2 pl-2"
          style={{ borderLeft: `1px solid ${p.border}` }}
        >
          <span
            className="text-[11px] font-semibold"
            style={{ color: p.muted }}
          >
            Auto Refresh
          </span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider"
            style={{
              background: autoRefresh ? "#16A34A" : p.sub,
              color: autoRefresh ? "white" : p.muted,
              border: 0,
              cursor: "pointer",
            }}
          >
            {autoRefresh ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* ── MAIN 5-WEIGHBRIDGE MONITORING GRID ── */}
      <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {filtered.map((b) => {
          const isOffline = b.status === "offline";
          const isWeighing = b.status === "weighing";
          return (
            <article
              key={b.id}
              className="flex flex-col justify-between rounded-xl p-4.5 transition-all"
              style={{
                background: p.surface,
                border: isOffline
                  ? "1.5px solid #DC2626"
                  : isWeighing
                    ? "1.5px solid #8B5CF6"
                    : `1px solid ${p.border}`,
                boxShadow: isOffline
                  ? "0 4px 12px rgba(220,38,38,0.1)"
                  : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {/* Header: WB ID + Status Badge */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div
                      className="text-base font-extrabold"
                      style={{ color: p.text }}
                    >
                      {b.id}
                    </div>
                    <div className="text-[11px]" style={{ color: p.muted }}>
                      {b.location}
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tracking-wider"
                    style={{
                      color: b.statusColor,
                      background: b.statusBg,
                      border: `1px solid ${b.statusColor}35`,
                    }}
                  >
                    {b.statusLabel}
                  </span>
                </div>

                {/* Vehicle & Weight Display Container */}
                <div
                  className="my-3 rounded-lg p-3"
                  style={{
                    background: isOffline
                      ? dm
                        ? "#2D0707"
                        : "#FEF2F2"
                      : p.sub,
                    border: `1px solid ${p.border}`,
                  }}
                >
                  <div
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: isOffline ? "#DC2626" : p.muted }}
                  >
                    {isOffline ? "ALERT CONDITION" : "CURRENT VEHICLE"}
                  </div>

                  <div
                    className="mt-1 text-xs font-bold"
                    style={{ color: p.text }}
                  >
                    {b.vehicle
                      ? b.vehicle
                      : isOffline
                        ? "Indicator Disconnected"
                        : "No vehicle on scale"}
                  </div>

                  {/* Weight Readout */}
                  <div className="mt-3">
                    <div
                      className="text-2xl font-black leading-none tabular-nums"
                      style={{ color: b.weightColor }}
                    >
                      {b.weight}
                    </div>
                    <div
                      className="mt-1.5 flex items-center gap-1 text-[10.5px] font-bold"
                      style={{
                        color: isOffline
                          ? "#DC2626"
                          : isWeighing
                            ? "#8B5CF6"
                            : "#16A34A",
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: "currentColor" }}
                      />
                      {b.weightState}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hardware Health Status Row */}
              <div>
                <div
                  className="mb-3 space-y-1 rounded-md p-2 text-[11px]"
                  style={{ background: p.sub }}
                >
                  <div
                    className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: p.muted }}
                  >
                    Hardware Health
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {b.hw.map((h) => (
                      <span
                        key={h.name}
                        className="inline-flex items-center gap-1 text-[10.5px]"
                        style={{
                          color: h.ok ? "#16A34A" : "#DC2626",
                          fontWeight: 600,
                        }}
                      >
                        <span>●</span>
                        {h.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer details: Operator + Today Count */}
                <div
                  className="space-y-1 text-[11.5px] border-t pt-2.5"
                  style={{ borderColor: p.divider }}
                >
                  <div className="flex justify-between">
                    <span style={{ color: p.muted }}>Operator:</span>
                    <b style={{ color: p.secondary }}>{b.operator || "—"}</b>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: p.muted }}>Today&apos;s Count:</span>
                    <b className="tabular-nums" style={{ color: p.text }}>
                      {b.count} vehicles
                    </b>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate("detail")}
                    className="w-full rounded-md py-1.5 text-center text-xs font-bold text-[#F97316] transition-colors"
                    style={{
                      border: `1px solid rgba(249,115,22,0.3)`,
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── LOWER SECTION: LIVE ACTIVITY FEED + ACTIVE ALERTS ── */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* LEFT: Live Operational Activity Feed */}
        <section
          className="rounded-xl p-5"
          style={{ background: p.surface, border: `1px solid ${p.border}` }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="m-0 text-sm font-bold" style={{ color: p.text }}>
                Live Activity Timeline
              </h3>
              <div className="text-[11px]" style={{ color: p.muted }}>
                Real-time event stream across 5 weighbridges
              </div>
            </div>
            <span className="text-[11px] font-semibold text-wb-success">
              ● Streaming
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              [
                "10:50 AM",
                "WB-01",
                "Gross weight captured — TN20AB1234",
                "38,500 KG",
                "#16A34A",
              ],
              [
                "10:48 AM",
                "WB-03",
                "Vehicle positioned on platform — TN18CD5678",
                "32,100 KG",
                "#8B5CF6",
              ],
              [
                "10:46 AM",
                "WB-02",
                "Weighment completed, ticket issued",
                "WB-2026-00457",
                "#16A34A",
              ],
              [
                "10:42 AM",
                "WB-05",
                "Vehicle departed platform",
                "Tare saved",
                "#2563EB",
              ],
            ].map(([time, wbId, desc, tag, color]) => (
              <div
                key={time}
                className="flex items-center justify-between rounded-lg p-3 text-xs"
                style={{ background: p.sub, border: `1px solid ${p.border}` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[11px] font-bold"
                    style={{ color: p.muted }}
                  >
                    {time}
                  </span>
                  <span
                    className="rounded px-1.5 py-0.5 font-bold text-[10px] text-white"
                    style={{ background: "#F97316" }}
                  >
                    {wbId}
                  </span>
                  <span style={{ color: p.text, fontWeight: 500 }}>{desc}</span>
                </div>
                <span className="font-semibold text-[11px]" style={{ color }}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: Active Hardware & System Alerts */}
        <section
          className="rounded-xl p-5"
          style={{ background: p.surface, border: `1px solid ${p.border}` }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="m-0 text-sm font-bold" style={{ color: p.text }}>
              Active Operational Alerts
            </h3>
            <span className="rounded-full bg-wb-error px-2 py-0.5 text-[10px] font-bold text-white">
              4 Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              [
                "WB-04 Offline",
                "Weight indicator disconnected from port COM3",
                "09:42 AM",
                "#DC2626",
              ],
              [
                "Printer Low Paper",
                "WB-02 thermal printer roll near empty",
                "08:56 AM",
                "#F59E0B",
              ],
              [
                "Overload Alert",
                "WB-03 gross weight limit warning +1.2 MT",
                "08:42 AM",
                "#DC2626",
              ],
              [
                "Correction Request",
                "Ticket WB-2026-00451 tare re-check requested",
                "08:20 AM",
                "#2563EB",
              ],
            ].map(([title, desc, time, color]) => (
              <div
                key={title}
                className="rounded-lg p-3"
                style={{
                  background: `${color}10`,
                  border: `1px solid ${color}30`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color }}>
                    {title}
                  </span>
                  <span className="text-[10.5px]" style={{ color: p.muted }}>
                    {time}
                  </span>
                </div>
                <div
                  className="mt-1 text-[11.5px]"
                  style={{ color: p.secondary }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
