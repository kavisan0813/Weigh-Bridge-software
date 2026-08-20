import { lazy, Suspense } from "react";

const Area = lazy(() =>
  import("recharts").then((module) => ({ default: module.Area })),
);
const AreaChart = lazy(() =>
  import("recharts").then((module) => ({ default: module.AreaChart })),
);
const CartesianGrid = lazy(() =>
  import("recharts").then((module) => ({ default: module.CartesianGrid })),
);
const ResponsiveContainer = lazy(() =>
  import("recharts").then((module) => ({
    default: module.ResponsiveContainer,
  })),
);
const Tooltip = lazy(() =>
  import("recharts").then((module) => ({ default: module.Tooltip })),
);
const XAxis = lazy(() =>
  import("recharts").then((module) => ({ default: module.XAxis })),
);
const YAxis = lazy(() =>
  import("recharts").then((module) => ({ default: module.YAxis })),
);
import AppShell from "../components/AppShell";

interface DashboardScreenProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: any) => void;
}

function TruckKpiIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
function WeightKpiIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3c0 1.5.83 2.8 2 3.46V10H7l-2 12h14L17 10h-4V8.46A3.5 3.5 0 0 0 15 5a3 3 0 0 0-3-3z" />
    </svg>
  );
}
function CheckKpiIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ClockKpiIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function ActiveWbIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

// ── Chart data ─────────────────────────────────────────────────────────────────
const weightTrend = [
  { hour: "06:00", mt: 120 },
  { hour: "07:00", mt: 380 },
  { hour: "08:00", mt: 690 },
  { hour: "09:00", mt: 1100 },
  { hour: "10:00", mt: 1580 },
  { hour: "11:00", mt: 2210 },
  { hour: "12:00", mt: 2850 },
  { hour: "13:00", mt: 3440 },
  { hour: "14:00", mt: 4285 },
];

// ── Weighbridge card data (5 weighbridges: WB-01 to WB-05) ────────────────────
interface BridgeData {
  id: string;
  name: string;
  location: string;
  status: string;
  statusColor: string;
  statusBg: string;
  vehicle: string | null;
  weight: string | null;
  weightState: string | null;
  weightColor: string | null;
  operator: string | null;
  total: number | null;
  extraInfo: { line1: string; line2: string; warning: string } | null;
}

const bridges: BridgeData[] = [
  {
    id: "WB-01",
    name: "WB-01",
    location: "Main Gate",
    status: "ONLINE",
    statusColor: "#16A34A",
    statusBg: "#F0FDF4",
    vehicle: "TN20AB1234",
    weight: "38,500 KG",
    weightState: "WEIGHT STABLE",
    weightColor: null,
    operator: "Arun Kumar",
    total: 58,
    extraInfo: null,
  },
  {
    id: "WB-02",
    name: "WB-02",
    location: "North Gate",
    status: "AVAILABLE",
    statusColor: "#2563EB",
    statusBg: "#EFF6FF",
    vehicle: null,
    weight: null,
    weightState: null,
    weightColor: null,
    operator: "Kumar",
    total: 46,
    extraInfo: null,
  },
  {
    id: "WB-03",
    name: "WB-03",
    location: "Loading Yard",
    status: "WEIGHING",
    statusColor: "#8B5CF6",
    statusBg: "#F5F3FF",
    vehicle: "TN18CD5678",
    weight: "32,100 KG",
    weightState: "STABILIZING",
    weightColor: "#8B5CF6",
    operator: "Ravi",
    total: 51,
    extraInfo: null,
  },
  {
    id: "WB-04",
    name: "WB-04",
    location: "East Gate",
    status: "OFFLINE",
    statusColor: "#DC2626",
    statusBg: "#FEF2F2",
    vehicle: null,
    weight: null,
    weightState: null,
    weightColor: null,
    operator: null,
    total: 32,
    extraInfo: {
      line1: "Weight Indicator Disconnected",
      line2: "Last online: 09:42 AM",
      warning: "Requires hardware inspection",
    },
  },
  {
    id: "WB-05",
    name: "WB-05",
    location: "West Gate",
    status: "AVAILABLE",
    statusColor: "#2563EB",
    statusBg: "#EFF6FF",
    vehicle: null,
    weight: null,
    weightState: null,
    weightColor: null,
    operator: "Suresh",
    total: 48,
    extraInfo: null,
  },
];

// ── Recent transactions sample data ───────────────────────────────────────────
const recentTx = [
  {
    ticket: "WB-2026-00458",
    wb: "WB-01",
    vehicle: "TN20AB1234",
    material: "Gravel",
    net: "25,000 KG",
    operator: "Arun",
    status: "Completed",
    time: "10:50 AM",
  },
  {
    ticket: "WB-2026-00457",
    wb: "WB-03",
    vehicle: "TN18CD5678",
    material: "Sand",
    net: "20,000 KG",
    operator: "Ravi",
    status: "Completed",
    time: "10:42 AM",
  },
  {
    ticket: "WB-2026-00456",
    wb: "WB-02",
    vehicle: "TN10EF9012",
    material: "Cement",
    net: "18,500 KG",
    operator: "Kumar",
    status: "Pending",
    time: "10:35 AM",
  },
  {
    ticket: "WB-2026-00455",
    wb: "WB-05",
    vehicle: "TN09GH3456",
    material: "Steel",
    net: "22,800 KG",
    operator: "Suresh",
    status: "Completed",
    time: "10:28 AM",
  },
];

// ── Recent alerts sample data ──────────────────────────────────────────────────
const alerts = [
  {
    color: "#DC2626",
    icon: "⊗",
    title: "WB-04 Offline",
    desc: "Weight indicator disconnected.",
    time: "09:42 AM",
    type: "Error",
  },
  {
    color: "#F59E0B",
    icon: "⚠",
    title: "Printer disconnected on WB-02",
    desc: "Thermal printer paper low.",
    time: "08:56 AM",
    type: "Warning",
  },
  {
    color: "#DC2626",
    icon: "⚠",
    title: "Overload detected on WB-03",
    desc: "Gross limit exceeded by 1.2 MT.",
    time: "08:42 AM",
    type: "Warning",
  },
  {
    color: "#2563EB",
    icon: "ℹ",
    title: "Correction request received",
    desc: "Ticket WB-2026-00451 modification.",
    time: "08:20 AM",
    type: "Info",
  },
];

// ── Color palette helper based on Master Design Tokens ─────────────────────────
function pal(dark: boolean) {
  return {
    bg: dark ? "#111827" : "#F8FAFC",
    surface: dark ? "#1F2937" : "#FFFFFF",
    elevated: dark ? "#273449" : "#FFFFFF",
    text: dark ? "#F9FAFB" : "#111827",
    secondary: dark ? "#D1D5DB" : "#4B5563",
    muted: dark ? "#9CA3AF" : "#6B7280",
    border: dark ? "#374151" : "#E5E7EB",
    divider: dark ? "#374151" : "#F1F5F9",
    sub: dark ? "#273449" : "#F8FAFC",
    tooltip: dark ? "#1F2937" : "#FFFFFF",
    sidebarBg: dark ? "#1F2937" : "#FFFFFF",
    sidebarBorder: dark ? "#374151" : "#E5E7EB",
    sidebarText: dark ? "#D1D5DB" : "#111827",
    sidebarMuted: dark ? "#6B7280" : "#9CA3AF",
    // Brand Tokens
    primaryOrange: dark ? "#FB923C" : "#F97316",
    primarySoft: dark ? "#273449" : "#FFF7ED",
    secondaryGold: dark ? "#D4A83A" : "#C99A2E",
    secondarySoft: dark ? "#422F0A" : "#FFFBEB",
    secondaryLight: dark ? "#5A430E" : "#FEF3C7",
  };
}

// ── Reusable status badge ──────────────────────────────────────────────────────
function StatusBadge({
  color,
  bg,
  label,
}: {
  color: string;
  bg: string;
  label: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.04em",
        color,
        background: bg,
        border: `1px solid ${color}30`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

// ── Transaction status badge ───────────────────────────────────────────────────
function TxBadge({ status }: { status: string }) {
  const styles: Record<string, { color: string; bg: string }> = {
    Completed: { color: "#16A34A", bg: "#F0FDF4" },
    Weighing: { color: "#8B5CF6", bg: "#F5F3FF" },
    Pending: { color: "#F59E0B", bg: "#FFFBEB" },
  };
  const s = styles[status] ?? { color: "#6B7280", bg: "#F9FAFB" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}25`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
        }}
      />
      {status}
    </span>
  );
}

// ── Main Admin Dashboard Component ─────────────────────────────────────────────
export default function DashboardScreen({
  darkMode,
  onToggleDark,
  onLogout,
  onNavigate,
}: DashboardScreenProps) {
  const c = pal(darkMode);

  const cardStyle = {
    background: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  };

  return (
    <AppShell
      activeView="dashboard"
      userRole="admin"
      userName="Arun Kumar"
      stationName="All Weighbridges"
      darkMode={darkMode}
      onToggleDark={onToggleDark}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px 40px" }}>
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 1: 5 KPI SUMMARY CARDS
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {/* Card 1: TOTAL VEHICLES (Orange Accent) */}
          <div style={{ ...cardStyle, padding: "18px 18px 16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 12, color: c.muted, fontWeight: 500 }}>
                TOTAL VEHICLES
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: c.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: c.primaryOrange,
                }}
              >
                <TruckKpiIcon />
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 30,
                fontWeight: 800,
                color: c.text,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              248
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ color: "#16A34A", fontWeight: 700 }}>
                ↑ +12.5%
              </span>
              <span style={{ color: c.muted, fontWeight: 500 }}>Today</span>
            </div>
          </div>

          {/* Card 2: TOTAL NET WEIGHT (Secondary Gold Accent per Master Design Rules) */}
          <div style={{ ...cardStyle, padding: "18px 18px 16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 12, color: c.muted, fontWeight: 500 }}>
                TOTAL NET WEIGHT
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: c.secondarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: c.secondaryGold,
                }}
              >
                <WeightKpiIcon />
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 26,
                fontWeight: 800,
                color: c.text,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              4,285{" "}
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: c.secondaryGold,
                }}
              >
                MT
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ color: "#16A34A", fontWeight: 700 }}>↑ +8.2%</span>
              <span style={{ color: c.muted, fontWeight: 500 }}>Today</span>
            </div>
          </div>

          {/* Card 3: COMPLETED (Green Success Accent) */}
          <div style={{ ...cardStyle, padding: "18px 18px 16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 12, color: c.muted, fontWeight: 500 }}>
                COMPLETED
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: darkMode ? "rgba(22, 163, 74, 0.15)" : "#F0FDF4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#16A34A",
                }}
              >
                <CheckKpiIcon />
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 30,
                fontWeight: 800,
                color: c.text,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              230
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                color: "#16A34A",
                fontWeight: 600,
              }}
            >
              92.7% completion rate
            </div>
          </div>

          {/* Card 4: PENDING (Amber Warning Accent) */}
          <div style={{ ...cardStyle, padding: "18px 18px 16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 12, color: c.muted, fontWeight: 500 }}>
                PENDING
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: darkMode ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F59E0B",
                }}
              >
                <ClockKpiIcon />
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 30,
                fontWeight: 800,
                color: c.text,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              18
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                color: "#F59E0B",
                fontWeight: 600,
              }}
            >
              Needs attention
            </div>
          </div>

          {/* Card 5: ACTIVE WEIGHBRIDGES (Red/Orange Hardware Status Accent) */}
          <div style={{ ...cardStyle, padding: "18px 18px 16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 12, color: c.muted, fontWeight: 500 }}>
                ACTIVE WEIGHBRIDGES
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: c.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: c.primaryOrange,
                }}
              >
                <ActiveWbIcon />
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 30,
                fontWeight: 800,
                color: c.text,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              4{" "}
              <span style={{ fontSize: 16, fontWeight: 500, color: c.muted }}>
                / 5
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                color: "#DC2626",
                fontWeight: 600,
              }}
            >
              1 Offline (WB-04)
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 2: FIVE WEIGHBRIDGE OVERVIEW
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: c.text,
                }}
              >
                Weighbridge Overview
              </h2>
              <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>
                Real-time status across all 5 physical weighbridges.
              </div>
            </div>
            <button
              onClick={() => onNavigate("monitoring")}
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: c.primaryOrange,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View All Details →
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 14,
            }}
          >
            {bridges.map((b) => (
              <div
                key={b.id}
                style={{
                  ...cardStyle,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Row 1: WB Name + Location & Status Badge */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{ fontSize: 15, fontWeight: 800, color: c.text }}
                      >
                        {b.name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: c.muted, marginTop: 1 }}
                      >
                        {b.location}
                      </div>
                    </div>
                    <StatusBadge
                      color={b.statusColor}
                      bg={b.statusBg}
                      label={b.status}
                    />
                  </div>

                  {/* Row 2: Operational Data / Weight Display */}
                  {b.extraInfo ? (
                    /* OFFLINE STATE */
                    <div
                      style={{
                        minHeight: 64,
                        background: darkMode ? "#2D0707" : "#FEF2F2",
                        border: "1px solid #FECACA",
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: "#DC2626",
                          marginBottom: 4,
                        }}
                      >
                        {b.extraInfo.line1}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: c.muted,
                          marginBottom: 6,
                        }}
                      >
                        {b.extraInfo.line2}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: "#DC2626",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span>⚠</span> {b.extraInfo.warning}
                      </div>
                    </div>
                  ) : b.vehicle ? (
                    /* ACTIVE / WEIGHING STATE */
                    <div style={{ minHeight: 64, marginBottom: 12 }}>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: c.muted,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Current Vehicle:{" "}
                        <span style={{ color: c.text, fontWeight: 700 }}>
                          {b.vehicle}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 22,
                          fontWeight: 800,
                          color: b.weightColor ?? c.text,
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: 1.1,
                        }}
                      >
                        {b.weight}
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 10.5,
                          fontWeight: 700,
                          color:
                            b.status === "WEIGHING" ? "#8B5CF6" : "#16A34A",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "currentColor",
                          }}
                        />
                        {b.weightState}
                      </div>
                    </div>
                  ) : (
                    /* AVAILABLE STATE */
                    <div
                      style={{
                        minHeight: 64,
                        marginBottom: 12,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: c.muted,
                          fontStyle: "italic",
                        }}
                      >
                        No vehicle on platform
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#2563EB",
                          fontWeight: 600,
                          marginTop: 4,
                        }}
                      >
                        ● Ready for next vehicle
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 3: Operator & Vehicles Count Footer */}
                <div
                  style={{
                    borderTop: `1px solid ${c.divider}`,
                    paddingTop: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: c.muted,
                      marginBottom: 6,
                    }}
                  >
                    <span>Operator:</span>
                    <span style={{ fontWeight: 600, color: c.secondary }}>
                      {b.operator || "—"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: c.muted,
                    }}
                  >
                    <span>Today's Vehicles:</span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: c.text,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {b.total !== null ? `${b.total} vehicles` : "0"}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate("monitoring")}
                    style={{
                      marginTop: 10,
                      width: "100%",
                      padding: "6px 0",
                      background: "none",
                      border: `1px solid ${c.border}`,
                      borderRadius: 6,
                      color: c.primaryOrange,
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 3: ANALYTICS & ALERTS
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 310px",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {/* LEFT: Today's Net Weight Chart */}
          <div style={{ ...cardStyle, padding: "20px 22px 18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: c.text }}>
                  Today's Net Weight Analytics
                </div>
                <div style={{ fontSize: 11.5, color: c.muted, marginTop: 2 }}>
                  Cumulative tonnage processed across all 5 weighbridges
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: c.primaryOrange,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  4,285 MT
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: c.secondaryGold,
                    fontWeight: 600,
                  }}
                >
                  Secondary Gold Comparison Active
                </div>
              </div>
            </div>

            <Suspense fallback={null}>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={weightTrend}
                  margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#F97316"
                        stopOpacity={0.22}
                      />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={c.divider}
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 10.5, fill: c.muted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10.5, fill: c.muted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: c.tooltip,
                      border: `1px solid ${c.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: unknown) => [
                      `${Number(v).toLocaleString()} MT`,
                      "Net Weight",
                    ]}
                  />
                  <Area
                    dataKey="mt"
                    type="monotone"
                    stroke="#F97316"
                    strokeWidth={2.5}
                    fill="url(#wGrad)"
                    dot={false}
                    activeDot={{
                      fill: "#F97316",
                      stroke: "#FFEDD5",
                      strokeWidth: 4,
                      r: 5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Suspense>
          </div>

          {/* RIGHT: Recent Alerts Panel */}
          <div style={{ ...cardStyle, padding: "18px 18px 10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: c.text }}>
                Recent Alerts
              </span>
              <span
                style={{
                  background: "#F97316",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                4 Active
              </span>
            </div>

            {alerts.map((a, i) => (
              <div
                key={a.title}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom:
                    i < alerts.length - 1 ? `1px solid ${c.divider}` : "none",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${a.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: a.color,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: c.text,
                      lineHeight: 1.3,
                    }}
                  >
                    {a.title}
                  </div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>
                    {a.time} • {a.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 4: RECENT TRANSACTIONS TABLE
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: c.text }}>
                Recent Transactions
              </span>
              <span style={{ fontSize: 12, color: c.muted, marginLeft: 10 }}>
                Latest weighment logs across all weighbridges
              </span>
            </div>
            <button
              onClick={() => onNavigate("transactions")}
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: c.primaryOrange,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View All Transactions →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 700,
              }}
            >
              <thead>
                <tr style={{ background: c.sub }}>
                  {[
                    "Ticket ID",
                    "Weighbridge",
                    "Vehicle Number",
                    "Material",
                    "Net Weight",
                    "Operator",
                    "Status",
                    "Time",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px",
                        textAlign: "left",
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: c.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: `1px solid ${c.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTx.map((row, i) => (
                  <tr
                    key={row.ticket}
                    style={{
                      borderBottom:
                        i < recentTx.length - 1
                          ? `1px solid ${c.divider}`
                          : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: c.text,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.ticket}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12.5,
                        color: c.secondary,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.wb}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: c.text,
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row.vehicle}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12.5,
                        color: c.secondary,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.material}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: c.text,
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row.net}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12.5,
                        color: c.secondary,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.operator}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <TxBadge status={row.status} />
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 12.5,
                        color: c.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
