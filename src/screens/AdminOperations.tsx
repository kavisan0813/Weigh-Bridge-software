import { useMemo, useState, type ReactNode } from "react";
import TransactionDetailScreen from "./TransactionDetailScreen";
import WeighbridgeDetailScreen from "./WeighbridgeDetailScreen";
import TransactionsScreen from "./TransactionsScreen";
import VehicleManagementScreen from "./VehicleManagementScreen";
import VehicleDetailScreen from "./VehicleDetailScreen";
import VehicleFormScreen from "./VehicleFormScreen";
import DriverManagementScreen from "./DriverManagementScreen";
import DriverDetailScreen from "./DriverDetailScreen";
import DriverFormScreen from "./DriverFormScreen";
import CustomerManagementScreen from "./CustomerManagementScreen";
import CustomerDetailScreen from "./CustomerDetailScreen";
import CustomerFormScreen from "./CustomerFormScreen";
import SupplierManagementScreen from "./SupplierManagementScreen";
import SupplierDetailScreen from "./SupplierDetailScreen";
import SupplierFormScreen from "./SupplierFormScreen";
import MaterialManagementScreen from "./MaterialManagementScreen";
import MaterialDetailScreen from "./MaterialDetailScreen";
import MaterialFormScreen from "./MaterialFormScreen";
import TicketManagementScreen from "./TicketManagementScreen";
import TicketDetailScreen from "./TicketDetailScreen";
import AlertsCenterScreen from "./AlertsCenterScreen";
import BillingScreen from "./BillingScreen";
import EmployeeManagementScreen from "./EmployeeManagementScreen";
import ReportsScreen from "./ReportsScreen";
import SettingsScreen from "./SettingsScreen";
import AuditLogsScreen from "./AuditLogsScreen";

export type AdminView = "monitoring" | "detail" | "transactions" | "transaction-detail" | "vehicles" | "vehicle-detail" | "vehicle-add" | "vehicle-edit" | "drivers" | "driver-detail" | "driver-add" | "driver-edit" | "customers" | "customer-detail" | "customer-add" | "customer-edit" | "suppliers" | "supplier-detail" | "supplier-add" | "supplier-edit" | "materials" | "material-detail" | "material-add" | "material-edit" | "tickets" | "ticket-detail" | "alerts" | "billing" | "employees" | "reports" | "auditlogs" | "settings";

import AppShell from "../components/AppShell";

interface AdminOperationsProps {
  view: AdminView;
  userRole?: "admin" | "operator" | "maintenance" | "manager";
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

type Palette = ReturnType<typeof usePalette>;

const bridges = [
  { id: "WB-01", location: "Main Gate", status: "online", vehicle: "TN20AB1234", weight: "38,500 KG", state: "WEIGHT STABLE", operator: "Arun", count: 58, hardware: "All systems connected" },
  { id: "WB-02", location: "North Yard", status: "available", vehicle: "No vehicle", weight: null, state: "READY FOR NEXT VEHICLE", operator: "Kumar", count: 46, hardware: "All systems connected" },
  { id: "WB-03", location: "Loading Bay", status: "weighing", vehicle: "TN18CD5678", weight: "32,100 KG", state: "STABILIZING", operator: "Ravi", count: 51, hardware: "Indicator & camera connected" },
  { id: "WB-04", location: "Dispatch Gate", status: "offline", vehicle: "Weight indicator disconnected", weight: null, state: "LAST ONLINE 09:42 AM", operator: "—", count: 0, hardware: "Hardware connection required" },
  { id: "WB-05", location: "Raw Material Yard", status: "available", vehicle: "No vehicle", weight: null, state: "READY FOR NEXT VEHICLE", operator: "Suresh", count: 48, hardware: "All systems connected" },
] as const;

const transactions = [
  ["WB-2026-00458", "WB-01", "TN20AB1234", "ABC Construction", "Gravel", "38,500 KG", "13,500 KG", "25,000 KG", "Arun", "Completed", "Today, 10:24 AM"],
  ["WB-2026-00459", "WB-03", "TN18CD5678", "XYZ Industries", "Sand", "32,100 KG", "12,100 KG", "20,000 KG", "Ravi", "Completed", "Today, 10:18 AM"],
  ["WB-2026-00460", "WB-02", "TN10EF9012", "Kumar Traders", "Cement", "40,000 KG", "—", "—", "Kumar", "Pending", "Today, 10:08 AM"],
  ["WB-2026-00457", "WB-05", "TN37GH3345", "Metro Infra", "M-Sand", "36,800 KG", "12,600 KG", "24,200 KG", "Suresh", "Completed", "Today, 09:56 AM"],
  ["WB-2026-00456", "WB-01", "TN22JK7102", "ABC Construction", "Gravel", "42,100 KG", "14,100 KG", "28,000 KG", "Arun", "Completed", "Today, 09:42 AM"],
];

function usePalette(dm: boolean) {
  return {
    bg: dm ? "#111827" : "#F8FAFC", surface: dm ? "#1F2937" : "#FFFFFF", elevated: dm ? "#273449" : "#FFFFFF",
    text: dm ? "#F9FAFB" : "#111827", secondary: dm ? "#D1D5DB" : "#4B5563", muted: dm ? "#9CA3AF" : "#6B7280",
    border: dm ? "#374151" : "#E5E7EB", sub: dm ? "#374151" : "#F1F5F9", input: dm ? "#111827" : "#FFFFFF",
    divider: dm ? "#374151" : "#F1F5F9", sidebarBg: dm ? "#1F2937" : "#FFFFFF",
  };
}

function Shell({ children, darkMode: dm, onToggleDark, onLogout, onNavigate, view, userRole = "admin" }: AdminOperationsProps & { children: ReactNode }) {
  return (
    <AppShell
      activeView={view}
      userRole={userRole}
      userName={userRole === "operator" ? "Ravi Kumar" : "Arun Kumar"}
      stationName={userRole === "operator" ? "WB-01 Main Gate" : "All Weighbridges"}
      darkMode={dm}
      onToggleDark={onToggleDark}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      {children}
    </AppShell>
  );
}

const Status = ({ status }: { status: string }) => { const c = status === "online" || status === "completed" ? "#16A34A" : status === "weighing" ? "#8B5CF6" : status === "offline" ? "#DC2626" : status === "pending" ? "#F59E0B" : "#2563EB"; return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: `${c}16`, color: c, border: `1px solid ${c}35` }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{status}</span>; };

function PageHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) { return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="m-0 text-2xl font-bold tracking-[-.02em] md:text-[28px]" style={{ color: "inherit" }}>{title}</h1><p className="mt-1 text-[13px]" style={{ color: "inherit", opacity: .65 }}>{subtitle}</p></div>{action}</div>; }

function Monitoring({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Omit<AdminOperationsProps, "view">) {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const p = usePalette(dm);

  // Full 5 Weighbridge dataset with detailed hardware health & live status
  const fullBridges = [
    {
      id: "WB-01", location: "Main Gate", status: "online", statusLabel: "● ONLINE", statusColor: "#16A34A", statusBg: dm ? "#052E16" : "#F0FDF4",
      vehicle: "TN20AB1234", weight: "38,500 KG", weightState: "WEIGHT STABLE", weightColor: dm ? "#F9FAFB" : "#111827",
      operator: "Arun Kumar", count: 58, lastTime: "10:50 AM",
      hw: [
        { name: "Indicator", ok: true },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ]
    },
    {
      id: "WB-02", location: "North Gate", status: "available", statusLabel: "● AVAILABLE", statusColor: "#2563EB", statusBg: dm ? "#172554" : "#EFF6FF",
      vehicle: null, weight: "-- KG", weightState: "READY FOR NEXT VEHICLE", weightColor: p.muted,
      operator: "Kumar", count: 46, lastTime: "10:46 AM",
      hw: [
        { name: "Indicator", ok: true },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ]
    },
    {
      id: "WB-03", location: "Loading Yard", status: "weighing", statusLabel: "● WEIGHING", statusColor: "#8B5CF6", statusBg: dm ? "#2E1065" : "#F5F3FF",
      vehicle: "TN18CD5678", weight: "32,100 KG", weightState: "STABILIZING...", weightColor: "#8B5CF6",
      operator: "Ravi", count: 51, lastTime: "10:48 AM",
      hw: [
        { name: "Indicator", ok: true },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ]
    },
    {
      id: "WB-04", location: "East Gate", status: "offline", statusLabel: "● OFFLINE", statusColor: "#DC2626", statusBg: dm ? "#450A0A" : "#FEF2F2",
      vehicle: null, weight: "-- KG", weightState: "INDICATOR OFFLINE", weightColor: "#DC2626",
      operator: null, count: 32, lastTime: "09:42 AM",
      hw: [
        { name: "Indicator", ok: false },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ]
    },
    {
      id: "WB-05", location: "West Gate", status: "available", statusLabel: "● AVAILABLE", statusColor: "#2563EB", statusBg: dm ? "#172554" : "#EFF6FF",
      vehicle: null, weight: "-- KG", weightState: "READY FOR NEXT VEHICLE", weightColor: p.muted,
      operator: "Suresh", count: 48, lastTime: "10:45 AM",
      hw: [
        { name: "Indicator", ok: true },
        { name: "Camera", ok: true },
        { name: "Printer", ok: true },
      ]
    },
  ];

  const filtered = fullBridges.filter(b => {
    const matchesFilter = filter === "All" || b.status === filter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || b.id.toLowerCase().includes(q) || (b.vehicle && b.vehicle.toLowerCase().includes(q)) || (b.operator && b.operator.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="flex-1 overflow-y-auto p-5 md:p-7" style={{ color: p.text }}>
        
        {/* Page Title Header with Pulsing Live Status Indicator */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="m-0 text-2xl font-bold tracking-tight md:text-3xl" style={{ color: p.text }}>
                Live Weighbridge Monitoring
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-[#16A34A]" style={{ background: dm ? "#052E16" : "#F0FDF4", border: "1px solid rgba(22,163,74,0.3)" }}>
                <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                Live ● <span style={{ color: p.muted, fontWeight: 500 }}>Updated just now</span>
              </span>
            </div>
            <p className="mt-1 text-xs" style={{ color: p.muted }}>
              Real-time operational control center monitoring all 5 physical weighbridges.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate("transactions")} className="rounded-lg px-3.5 py-2 text-xs font-semibold" style={{ background: p.surface, color: p.text, border: `1px solid ${p.border}`, cursor: "pointer" }}>
              View Transactions
            </button>
            <button onClick={() => onNavigate("detail")} className="rounded-lg px-3.5 py-2 text-xs font-bold text-white" style={{ background: "#F97316", border: 0, cursor: "pointer" }}>
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
            <div key={label} className="rounded-xl px-4 py-3.5" style={{ background: bg, border: `1px solid ${p.border}` }}>
              <div className="text-2xl font-bold tabular-nums" style={{ color: col }}>{val}</div>
              <div className="mt-0.5 text-[10.5px] font-bold tracking-wider uppercase" style={{ color: p.muted }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── FILTER & CONTROL BAR ── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl p-3.5" style={{ background: p.surface, border: `1px solid ${p.border}` }}>
          {/* Left: Search input */}
          <div className="flex flex-1 items-center gap-2 min-w-[240px]">
            <span style={{ color: p.muted, fontSize: 13 }}>⌕</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search WB-01, vehicle number or operator..."
              className="w-full bg-transparent text-xs outline-none"
              style={{ color: p.text }}
            />
          </div>

          {/* Center: Filter Chips */}
          <div className="flex items-center gap-1.5">
            {["All", "Online", "Weighing", "Available", "Offline"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                style={{
                  cursor: "pointer",
                  border: filter === f ? "1px solid #F97316" : `1px solid ${p.border}`,
                  background: filter === f ? "#FFF7ED" : "transparent",
                  color: filter === f ? "#F97316" : p.secondary,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Right: Auto refresh toggle */}
          <div className="flex items-center gap-2 pl-2" style={{ borderLeft: `1px solid ${p.border}` }}>
            <span className="text-[11px] font-semibold" style={{ color: p.muted }}>Auto Refresh</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider"
              style={{
                background: autoRefresh ? "#16A34A" : p.sub,
                color: autoRefresh ? "white" : p.muted,
                border: 0, cursor: "pointer"
              }}
            >
              {autoRefresh ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* ── MAIN 5-WEIGHBRIDGE MONITORING GRID ── */}
        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filtered.map(b => {
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
                  boxShadow: isOffline ? "0 4px 12px rgba(220,38,38,0.1)" : "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                {/* Header: WB ID + Status Badge */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-base font-extrabold" style={{ color: p.text }}>{b.id}</div>
                      <div className="text-[11px]" style={{ color: p.muted }}>{b.location}</div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tracking-wider" style={{ color: b.statusColor, background: b.statusBg, border: `1px solid ${b.statusColor}35` }}>
                      {b.statusLabel}
                    </span>
                  </div>

                  {/* Vehicle & Weight Display Container */}
                  <div className="my-3 rounded-lg p-3" style={{ background: isOffline ? (dm ? "#2D0707" : "#FEF2F2") : p.sub, border: `1px solid ${p.border}` }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isOffline ? "#DC2626" : p.muted }}>
                      {isOffline ? "ALERT CONDITION" : "CURRENT VEHICLE"}
                    </div>

                    <div className="mt-1 text-xs font-bold" style={{ color: p.text }}>
                      {b.vehicle ? b.vehicle : isOffline ? "Indicator Disconnected" : "No vehicle on scale"}
                    </div>

                    {/* Weight Readout */}
                    <div className="mt-3">
                      <div className="text-2xl font-black leading-none tabular-nums" style={{ color: b.weightColor }}>
                        {b.weight}
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-[10.5px] font-bold" style={{ color: isOffline ? "#DC2626" : isWeighing ? "#8B5CF6" : "#16A34A" }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
                        {b.weightState}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hardware Health Status Row */}
                <div>
                  <div className="mb-3 space-y-1 rounded-md p-2 text-[11px]" style={{ background: p.sub }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: p.muted }}>Hardware Health</div>
                    <div className="flex flex-wrap gap-2">
                      {b.hw.map(h => (
                        <span key={h.name} className="inline-flex items-center gap-1 text-[10.5px]" style={{ color: h.ok ? "#16A34A" : "#DC2626", fontWeight: 600 }}>
                          <span>●</span>{h.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer details: Operator + Today Count */}
                  <div className="space-y-1 text-[11.5px] border-t pt-2.5" style={{ borderColor: p.divider }}>
                    <div className="flex justify-between">
                      <span style={{ color: p.muted }}>Operator:</span>
                      <b style={{ color: p.secondary }}>{b.operator || "—"}</b>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: p.muted }}>Today&apos;s Count:</span>
                      <b className="tabular-nums" style={{ color: p.text }}>{b.count} vehicles</b>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => onNavigate("detail")}
                      className="w-full rounded-md py-1.5 text-center text-xs font-bold text-[#F97316] transition-colors"
                      style={{ border: `1px solid rgba(249,115,22,0.3)`, background: "transparent", cursor: "pointer" }}
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
          <section className="rounded-xl p-5" style={{ background: p.surface, border: `1px solid ${p.border}` }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="m-0 text-sm font-bold" style={{ color: p.text }}>Live Activity Timeline</h3>
                <div className="text-[11px]" style={{ color: p.muted }}>Real-time event stream across 5 weighbridges</div>
              </div>
              <span className="text-[11px] font-semibold text-[#16A34A]">● Streaming</span>
            </div>

            <div className="space-y-3.5">
              {[
                ["10:50 AM", "WB-01", "Gross weight captured — TN20AB1234", "38,500 KG", "#16A34A"],
                ["10:48 AM", "WB-03", "Vehicle positioned on platform — TN18CD5678", "32,100 KG", "#8B5CF6"],
                ["10:46 AM", "WB-02", "Weighment completed, ticket issued", "WB-2026-00457", "#16A34A"],
                ["10:42 AM", "WB-05", "Vehicle departed platform", "Tare saved", "#2563EB"],
              ].map(([time, wbId, desc, tag, color]) => (
                <div key={time} className="flex items-center justify-between rounded-lg p-3 text-xs" style={{ background: p.sub, border: `1px solid ${p.border}` }}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-bold" style={{ color: p.muted }}>{time}</span>
                    <span className="rounded px-1.5 py-0.5 font-bold text-[10px] text-white" style={{ background: "#F97316" }}>{wbId}</span>
                    <span style={{ color: p.text, fontWeight: 500 }}>{desc}</span>
                  </div>
                  <span className="font-semibold text-[11px]" style={{ color }}>{tag}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT: Active Hardware & System Alerts */}
          <section className="rounded-xl p-5" style={{ background: p.surface, border: `1px solid ${p.border}` }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="m-0 text-sm font-bold" style={{ color: p.text }}>Active Operational Alerts</h3>
              <span className="rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-bold text-white">4 Active</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                ["WB-04 Offline", "Weight indicator disconnected from port COM3", "09:42 AM", "#DC2626"],
                ["Printer Low Paper", "WB-02 thermal printer roll near empty", "08:56 AM", "#F59E0B"],
                ["Overload Alert", "WB-03 gross weight limit warning +1.2 MT", "08:42 AM", "#DC2626"],
                ["Correction Request", "Ticket WB-2026-00451 tare re-check requested", "08:20 AM", "#2563EB"],
              ].map(([title, desc, time, color]) => (
                <div key={title} className="rounded-lg p-3" style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color }}>{title}</span>
                    <span className="text-[10.5px]" style={{ color: p.muted }}>{time}</span>
                  </div>
                  <div className="mt-1 text-[11.5px]" style={{ color: p.secondary }}>{desc}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>
  );
}

function Detail({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Omit<AdminOperationsProps, "view">) { const p = usePalette(dm); const hardware = ["Weight Indicator", "Camera", "RFID", "Printer", "Barrier", "Traffic Light"]; return <main className="flex-1 overflow-y-auto p-5 md:p-8" style={{ color: p.text }}><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><button onClick={() => onNavigate("monitoring")} className="mb-3 text-xs font-semibold" style={{ border: 0, background: "none", color: "#F97316", cursor: "pointer" }}>← All weighbridges</button><h1 className="m-0 text-[28px] font-bold">WB-01 <span className="font-medium" style={{ color: p.muted }}>— Main Gate</span></h1><div className="mt-2"><Status status="online" /></div></div><div className="flex gap-2">{["Edit", "Configure", "Maintenance"].map((x, i) => <button key={x} className="rounded-lg px-3.5 py-2 text-xs font-semibold" style={{ cursor: "pointer", border: `1px solid ${i === 2 ? "#F59E0B" : p.border}`, background: i === 2 ? (dm ? "#451A03" : "#FFFBEB") : p.surface, color: i === 2 ? "#B45309" : p.secondary }}>{x}</button>)}</div></div>
  <section className="mb-6 rounded-xl p-6" style={{ background: p.surface, border: `1px solid ${p.border}` }}><div className="mb-5 flex items-center justify-between"><h2 className="m-0 text-base font-semibold">Current operation</h2><span className="text-[11px]" style={{ color: p.muted }}>Live from WB-01</span></div><div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div className="rounded-xl p-6" style={{ background: p.sub, border: `1px solid ${p.border}` }}><div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: p.muted }}>Live weight</div><div className="mt-3 text-[44px] font-bold leading-none tabular-nums md:text-[56px]">38,500 <span className="text-xl md:text-2xl">KG</span></div><div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#16A34A]"><span className="h-2 w-2 rounded-full bg-[#16A34A]" />WEIGHT STABLE</div></div><div className="grid grid-cols-2 gap-3">{[["Vehicle", "TN20AB1234"], ["Operator", "Arun Kumar"], ["Transaction", "WB-2026-00458"], ["Entry", "10:18 AM"]].map(([k,v]) => <div key={k} className="rounded-lg p-4" style={{ border: `1px solid ${p.border}` }}><div className="text-[11px]" style={{ color: p.muted }}>{k}</div><div className="mt-1 text-[13px] font-semibold tabular-nums">{v}</div></div>)}</div></div></section>
  <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]"><div><section className="mb-6 rounded-xl p-5" style={{ background: p.surface, border: `1px solid ${p.border}` }}><h2 className="mb-4 text-base font-semibold">Hardware status</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{hardware.map(x => <div key={x} className="rounded-lg p-3.5" style={{ background: p.sub, border: `1px solid ${p.border}` }}><div className="text-[12px] font-semibold">{x}</div><div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#16A34A]"><span>●</span>Connected</div></div>)}</div></section><section className="overflow-hidden rounded-xl" style={{ background: p.surface, border: `1px solid ${p.border}` }}><div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${p.border}` }}><h2 className="text-base font-semibold">Recent transactions</h2><button onClick={() => onNavigate("transactions")} className="text-xs font-semibold" style={{ color: "#F97316", border: 0, background: "none", cursor: "pointer" }}>View all</button></div><MiniTable p={p} /></section></div><div><section className="mb-6 rounded-xl p-5" style={{ background: p.surface, border: `1px solid ${p.border}` }}><h2 className="mb-4 text-base font-semibold">Today’s performance</h2><div className="grid grid-cols-2 gap-3">{[["58", "Vehicles"], ["1,420 MT", "Total Gross"], ["1,245 MT", "Total Net"], ["6 min", "Avg. processing"]].map(([v,k]) => <div key={k} className="rounded-lg p-3.5" style={{ background: p.sub }}><div className="text-lg font-bold tabular-nums">{v}</div><div className="mt-1 text-[11px]" style={{ color: p.muted }}>{k}</div></div>)}</div></section><section className="rounded-xl p-5" style={{ background: p.surface, border: `1px solid ${p.border}` }}><h2 className="mb-5 text-base font-semibold">Activity timeline</h2><div className="space-y-5">{[["10:24 AM", "Transaction completed"], ["10:22 AM", "Gross captured"], ["10:20 AM", "Vehicle positioned"], ["10:18 AM", "Vehicle detected"]].map(([t,e], i) => <div className="flex gap-3" key={e}><div className="flex flex-col items-center"><span className="h-2.5 w-2.5 rounded-full" style={{ background: i === 0 ? "#16A34A" : "#F97316" }} />{i < 3 && <span className="mt-1 h-7 w-px" style={{ background: p.border }} />}</div><div><div className="text-[12px] font-semibold">{e}</div><div className="mt-0.5 text-[11px]" style={{ color: p.muted }}>{t}</div></div></div>)}</div></section></div></div></main>; }

function MiniTable({ p }: { p: Palette }) { return <div className="overflow-x-auto"><table className="w-full min-w-[500px] border-collapse text-left text-xs"><thead style={{ color: p.muted, background: p.sub }}><tr>{["Ticket", "Vehicle", "Net", "Status"].map(x => <th className="px-5 py-3 text-[11px] font-semibold" key={x}>{x}</th>)}</tr></thead><tbody>{transactions.slice(0, 3).map(r => <tr key={r[0]} style={{ borderTop: `1px solid ${p.border}` }}><td className="px-5 py-3.5 font-semibold">{r[0]}</td><td className="px-5 py-3.5 tabular-nums">{r[2]}</td><td className="px-5 py-3.5 tabular-nums">{r[7]}</td><td className="px-5 py-3.5"><Status status={r[9].toLowerCase()} /></td></tr>)}</tbody></table></div>; }

function Transactions({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Omit<AdminOperationsProps, "view">) { const p = usePalette(dm); const [selected, setSelected] = useState<string | null>(null); const [query, setQuery] = useState(""); const rows = useMemo(() => transactions.filter(r => `${r[0]} ${r[2]}`.toLowerCase().includes(query.toLowerCase())), [query]); const filters = ["Date range", "Weighbridge", "Operator", "Customer", "Material", "Status"]; return <main className="flex-1 overflow-y-auto p-5 md:p-8" style={{ color: p.text }}><PageHeading title="Transactions" subtitle="View and manage all weighment transactions across the 5 weighbridges." action={<button className="rounded-lg px-4 py-2.5 text-xs font-semibold text-white" style={{ background: "#F97316", border: 0, cursor: "pointer" }}>↓&nbsp; Export</button>} />
  <div className="mb-5 grid gap-3 rounded-xl p-4 md:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(130px,.45fr))]" style={{ background: p.surface, border: `1px solid ${p.border}` }}><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search ticket or vehicle" className="h-10 rounded-lg px-3 text-xs outline-none" style={{ background: p.input, color: p.text, border: `1px solid ${p.border}` }} />{filters.slice(0, 3).map(x => <button key={x} className="flex h-10 items-center justify-between rounded-lg px-3 text-xs" style={{ background: p.input, color: p.secondary, border: `1px solid ${p.border}`, cursor: "pointer" }}>{x}<span>⌄</span></button>)}<div className="md:col-span-4 flex flex-wrap gap-2">{filters.slice(3).map(x => <button key={x} className="rounded-md px-3 py-1.5 text-[11px]" style={{ background: p.sub, border: `1px solid ${p.border}`, color: p.secondary, cursor: "pointer" }}>{x} <span className="ml-1">⌄</span></button>)}</div></div>
  <section className="overflow-hidden rounded-xl" style={{ background: p.surface, border: `1px solid ${p.border}` }}><div className="overflow-x-auto"><table className="w-full min-w-[1250px] border-collapse text-left"><thead className="sticky top-0 z-10" style={{ background: dm ? "#242118" : "#F8FAFC", color: p.muted }}><tr>{["Ticket", "Weighbridge", "Vehicle", "Customer", "Material", "Gross", "Tare", "Net", "Operator", "Status", "Date/Time", "Actions"].map(h => <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r => { const chosen = selected === r[0]; return <tr key={r[0]} onClick={() => setSelected(chosen ? null : r[0])} className="transition-colors" style={{ cursor: "pointer", background: chosen ? (dm ? "#24354A" : "#FFF7ED") : "transparent", borderTop: `1px solid ${p.border}` }} onMouseEnter={e => { if (!chosen) e.currentTarget.style.background = dm ? "#273449" : "#F8FAFC"; }} onMouseLeave={e => { if (!chosen) e.currentTarget.style.background = "transparent"; }}>{r.map((cell,i) => <td key={i} className="whitespace-nowrap px-4 py-4 text-[12px]" style={{ color: i === 0 ? p.text : i === 9 ? p.text : p.secondary, fontWeight: i === 0 ? 600 : 400 }}>{i === 9 ? <Status status={cell.toLowerCase()} /> : <span className={i >= 5 && i <= 7 ? "tabular-nums" : ""}>{cell}</span>}</td>)}<td className="px-4 py-4"><button onClick={e => { e.stopPropagation(); onNavigate("transaction-detail"); }} className="rounded-md px-2 py-1 text-[11px] font-semibold" style={{ color: "#F97316", background: "transparent", border: 0, cursor: "pointer" }}>View</button></td></tr>; })}</tbody></table></div><div className="flex items-center justify-between px-5 py-4" style={{ borderTop: `1px solid ${p.border}` }}><span className="text-[12px]" style={{ color: p.muted }}>Showing {rows.length} of 248 transactions</span><div className="flex gap-1">{["‹", "1", "2", "3", "›"].map(x => <button key={x} className="grid h-8 min-w-8 place-items-center rounded-md text-xs" style={{ border: `1px solid ${x === "1" ? "#F97316" : p.border}`, background: x === "1" ? "#F97316" : p.surface, color: x === "1" ? "white" : p.secondary, cursor: "pointer" }}>{x}</button>)}</div></div></section></main>; }

export default function AdminOperations(props: AdminOperationsProps) {
  const renderContent = () => {
    if (props.view === "monitoring") return <Monitoring {...props} />;
    if (props.view === "detail") return <WeighbridgeDetailScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "transaction-detail") return <TransactionDetailScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "vehicle-detail") return <VehicleDetailScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "vehicle-add") return <VehicleFormScreen mode="add" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "vehicle-edit") return <VehicleFormScreen mode="edit" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "vehicles") return <VehicleManagementScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "drivers") return <DriverManagementScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "driver-detail") return <DriverDetailScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "driver-add") return <DriverFormScreen mode="add" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "driver-edit") return <DriverFormScreen mode="edit" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "customers") return <CustomerManagementScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "customer-detail") return <CustomerDetailScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "customer-add") return <CustomerFormScreen mode="add" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "customer-edit") return <CustomerFormScreen mode="edit" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "suppliers") return <SupplierManagementScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "supplier-detail") return <SupplierDetailScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "supplier-add") return <SupplierFormScreen mode="add" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "supplier-edit") return <SupplierFormScreen mode="edit" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "materials") return <MaterialManagementScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "material-detail") return <MaterialDetailScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "material-add") return <MaterialFormScreen mode="add" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "material-edit") return <MaterialFormScreen mode="edit" darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "tickets") return <TicketManagementScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "ticket-detail") return <TicketDetailScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "alerts") return <AlertsCenterScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "billing") return <BillingScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "employees") return <EmployeeManagementScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "reports") return <ReportsScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "auditlogs") return <AuditLogsScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    if (props.view === "settings") return <SettingsScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
    return <TransactionsScreen darkMode={props.darkMode} onToggleDark={props.onToggleDark} onLogout={props.onLogout} onNavigate={props.onNavigate} />;
  };

  // If view is monitoring, Monitoring component already contains its own internal layout structure if needed,
  // but wrapping all views in Shell guarantees persistent AppShell.
  if (props.view === "monitoring") return <Shell {...props}>{renderContent()}</Shell>;

  return <Shell {...props}>{renderContent()}</Shell>;
}

