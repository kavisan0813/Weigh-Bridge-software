import { useState, useMemo, lazy, Suspense } from "react";

// Recharts components lazy loaded for optimal performance
const Bar = lazy(() =>
  import("recharts").then((module) => ({ default: module.Bar })),
);
const BarChart = lazy(() =>
  import("recharts").then((module) => ({ default: module.BarChart })),
);
const CartesianGrid = lazy(() =>
  import("recharts").then((module) => ({ default: module.CartesianGrid })),
);
const Cell = lazy(() =>
  import("recharts").then((module) => ({ default: module.Cell })),
);
const Line = lazy(() =>
  import("recharts").then((module) => ({ default: module.Line })),
);
const LineChart = lazy(() =>
  import("recharts").then((module) => ({ default: module.LineChart })),
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

export interface ReportsScreenProps {
  darkMode: boolean;
  onToggleDark?: () => void;
  onLogout?: () => void;
  onNavigate?: (view: string) => void;
}

// ── Color Palette Helper ─────────────────────────────────────────────────────
function getPalette(dark: boolean) {
  return {
    bg: dark ? "#111827" : "#F8FAFC",
    surface: dark ? "#1F2937" : "#FFFFFF",
    elevated: dark ? "#273449" : "#FFFFFF",
    textPrimary: dark ? "#F9FAFB" : "#111827",
    textSecondary: dark ? "#D1D5DB" : "#4B5563",
    textMuted: dark ? "#9CA3AF" : "#6B7280",
    border: dark ? "#374151" : "#E2E8F0",
    divider: dark ? "#374151" : "#F1F5F9",
    inputBg: dark ? "#111827" : "#FFFFFF",
    tooltipBg: dark ? "#1F2937" : "#FFFFFF",
    primaryOrange: dark ? "#FB923C" : "#F97316",
    primaryHover: dark ? "#F97316" : "#EA580C",
    secondaryGold: dark ? "#D4A83A" : "#C99A2E",
    secondaryGoldSoft: dark ? "#422F0A" : "#FFFBEB",
    primarySoft: dark ? "rgba(249, 115, 22, 0.15)" : "#FFF7ED",
    tableHeaderBg: dark ? "#1A2332" : "#F8FAFC",
    badgeSuccessBg: dark ? "#052E16" : "#F0FDF4",
    badgeSuccessText: "#16A34A",
    badgeWarningBg: dark ? "#451A03" : "#FFFBEB",
    badgeWarningText: "#F59E0B",
    badgeInfoBg: dark ? "#172554" : "#EFF6FF",
    badgeInfoText: "#2563EB",
  };
}

// ── SVG Line Icons ──────────────────────────────────────────────────────────
function ScaleLineIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function PerformanceIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function UsersGroupIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChartSummaryIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ChevronDownIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ArrowRightIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function DownloadIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// ── Status Badge Component (ICON + COLOR + TEXT) ──────────────────────────
function StatusBadge({
  status,
  darkMode,
}: {
  status: "Ready" | "Completed" | "Pending" | "Processing" | "Error";
  darkMode: boolean;
}) {
  const p = getPalette(darkMode);
  let color = p.badgeSuccessText;
  let bg = p.badgeSuccessBg;
  let icon = "●";

  if (status === "Ready" || status === "Completed") {
    color = p.badgeSuccessText;
    bg = p.badgeSuccessBg;
    icon = "✓";
  } else if (status === "Pending" || status === "Processing") {
    color = p.badgeWarningText;
    bg = p.badgeWarningBg;
    icon = "⏳";
  } else if (status === "Error") {
    color = "#DC2626";
    bg = darkMode ? "#450A0A" : "#FEF2F2";
    icon = "⚠";
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ color, background: bg, border: `1px solid ${color}30` }}
    >
      <span aria-hidden="true" className="text-[10px]">{icon}</span>
      {status.toUpperCase()}
    </span>
  );
}

// ── Main ReportsScreen Component (Screen 41) ─────────────────────────────────
export default function ReportsScreen({
  darkMode,
  onNavigate,
}: ReportsScreenProps) {
  const p = getPalette(darkMode);

  // Export dropdown state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [notification, setNotification] = useState("");

  // Filters State
  const [dateRange, setDateRange] = useState("01 Aug – 21 Aug 2026");
  const [weighbridgeFilter, setWeighbridgeFilter] = useState("All Weighbridges");
  const [customerFilter, setCustomerFilter] = useState("All Customers");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [materialFilter, setMaterialFilter] = useState("All Materials");

  // Chart Period State
  const [chartPeriod, setChartPeriod] = useState("7 Days");

  // Recent Reports Table Filter
  const [tableSearch, setTableSearch] = useState("");

  // Handler for Exporting Report
  const handleExport = (type: "CSV" | "Excel" | "PDF") => {
    setIsExportOpen(false);
    setNotification(`Report exported as ${type} successfully.`);
    setTimeout(() => setNotification(""), 4000);
  };

  // Handler for Applying Filters
  const handleApplyFilters = () => {
    setNotification("Report filters applied successfully.");
    setTimeout(() => setNotification(""), 3000);
  };

  // Handler for Resetting Filters
  const handleResetFilters = () => {
    setDateRange("01 Aug – 21 Aug 2026");
    setWeighbridgeFilter("All Weighbridges");
    setCustomerFilter("All Customers");
    setSupplierFilter("All Suppliers");
    setMaterialFilter("All Materials");
    setNotification("Filters reset to default.");
    setTimeout(() => setNotification(""), 3000);
  };

  // ── Mock Chart Data ──────────────────────────────────────────────────────
  const chartData7Days = [
    { day: "15 Aug", weighments: 162, weight: 3680 },
    { day: "16 Aug", weighments: 178, weight: 4120 },
    { day: "17 Aug", weighments: 195, weight: 4490 },
    { day: "18 Aug", weighments: 142, weight: 3210 },
    { day: "19 Aug", weighments: 188, weight: 4310 },
    { day: "20 Aug", weighments: 205, weight: 4720 },
    { day: "21 Aug", weighments: 178, weight: 3920 },
  ];

  const chartData30Days = [
    { day: "Week 1", weighments: 1120, weight: 25400 },
    { day: "Week 2", weighments: 1240, weight: 28100 },
    { day: "Week 3", weighments: 1180, weight: 26800 },
    { day: "Week 4", weighments: 1290, weight: 29400 },
  ];

  const activeChartData = chartPeriod === "30 Days" || chartPeriod === "This Month" ? chartData30Days : chartData7Days;

  // Station Usage Data (WB-01 to WB-05)
  const stationUsage = [
    { id: "WB-01", location: "Main Gate", percentage: 42, count: 524, weight: "11,949 T", active: true },
    { id: "WB-02", location: "North Gate", percentage: 31, count: 386, weight: "8,820 T", active: true },
    { id: "WB-03", location: "Loading Yard", percentage: 18, count: 225, weight: "5,121 T", active: true },
    { id: "WB-04", location: "East Gate", percentage: 6, count: 75, weight: "1,707 T", active: false },
    { id: "WB-05", location: "West Gate", percentage: 3, count: 38, weight: "853 T", active: true },
  ];

  // Recent Reports Table Data
  const recentReports = useMemo(() => [
    { id: 1, name: "Weighment Report", period: "01 Aug – 21 Aug 2026", generated: "Just now", status: "Ready" as const, screenView: "weighment-report" },
    { id: 2, name: "Weighbridge Performance", period: "01 Aug – 21 Aug 2026", generated: "10 min ago", status: "Ready" as const, screenView: "performance-report" },
    { id: 3, name: "Customer Activity", period: "01 Aug – 21 Aug 2026", generated: "Yesterday", status: "Ready" as const, screenView: "customer-report" },
    { id: 4, name: "Material Summary", period: "01 Aug – 20 Aug 2026", generated: "1 day ago", status: "Ready" as const, screenView: "weighment-report" },
    { id: 5, name: "Daily Shift Audit", period: "20 Aug 2026", generated: "Yesterday", status: "Pending" as const, screenView: "performance-report" },
    { id: 6, name: "Supplier Movement", period: "01 Aug – 15 Aug 2026", generated: "5 days ago", status: "Ready" as const, screenView: "customer-report" },
  ], []);

  const filteredReports = recentReports.filter(r =>
    r.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    r.period.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <main
      className="min-h-screen overflow-y-auto p-5 md:p-8"
      style={{
        background: p.bg,
        color: p.textPrimary,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div className="mx-auto max-w-7xl">
        
        {/* ── 2. PAGE HEADER ──────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1
              className="m-0 text-3xl font-bold tracking-tight"
              style={{ color: p.textPrimary }}
            >
              Reports
            </h1>
            <p
              className="mt-1 text-sm leading-5"
              style={{ color: p.textMuted }}
            >
              View operational, weighment, weighbridge and customer activity reports.
            </p>
          </div>

          {/* Right Action: Secondary Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="inline-flex h-11 items-center gap-2 rounded-lg px-4 text-xs font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              style={{
                background: p.surface,
                color: p.textPrimary,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
                cursor: "pointer",
              }}
            >
              <DownloadIcon color={p.textSecondary} />
              <span>Export Report</span>
              <ChevronDownIcon color={p.textMuted} />
            </button>

            {/* Export Popover Dropdown */}
            {isExportOpen && (
              <div
                className="absolute right-0 top-12 z-50 w-48 rounded-lg py-1 shadow-lg border"
                style={{
                  background: p.surface,
                  borderColor: p.border,
                }}
              >
                <button
                  onClick={() => handleExport("CSV")}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ color: p.textPrimary, background: "transparent", border: 0, cursor: "pointer" }}
                >
                  <span className="font-mono font-bold text-wb-primary">📄</span> Export CSV
                </button>
                <button
                  onClick={() => handleExport("Excel")}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ color: p.textPrimary, background: "transparent", border: 0, cursor: "pointer" }}
                >
                  <span className="font-mono font-bold text-wb-success">📊</span> Export Excel
                </button>
                <button
                  onClick={() => handleExport("PDF")}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  style={{ color: p.textPrimary, background: "transparent", border: 0, cursor: "pointer" }}
                >
                  <span className="font-mono font-bold text-wb-error">📕</span> Export PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Operational Notice Banner */}
        {notification && (
          <div
            className="mb-6 flex items-center justify-between rounded-lg border px-4 py-3 text-xs font-semibold"
            style={{
              color: p.badgeSuccessText,
              background: p.badgeSuccessBg,
              borderColor: `${p.badgeSuccessText}40`,
            }}
          >
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification("")}
              style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── 3. REPORT CATEGORY SECTION ───────────────────────────────────── */}
        <section className="mb-8">
          <div className="mb-4">
            <h2
              className="m-0 text-xs font-bold tracking-wider text-slate-500 uppercase"
              style={{ color: p.textMuted }}
            >
              REPORTS
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: p.textMuted }}>
              Select a report to view detailed operational information.
            </p>
          </div>

          {/* Clean 2 x 2 Desktop Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            
            {/* CARD 1: WEIGHMENT REPORT (Screen 42) */}
            <article
              className="flex flex-col justify-between rounded-xl p-5 transition-all hover:border-amber-500/50"
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg"
                    style={{ background: p.primarySoft, color: p.primaryOrange }}
                  >
                    <ScaleLineIcon color={p.primaryOrange} />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    SCREEN 42
                  </span>
                </div>
                <h3
                  className="m-0 text-base font-bold tracking-tight"
                  style={{ color: p.textPrimary }}
                >
                  WEIGHMENT REPORT
                </h3>
                <p className="mt-1.5 text-xs leading-5" style={{ color: p.textMuted }}>
                  Detailed vehicle weighment and transaction history.
                </p>
              </div>
              <div className="mt-5 border-t pt-3" style={{ borderColor: p.divider }}>
                <button
                  onClick={() => onNavigate?.("weighment-report")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-wb-primary transition-colors hover:underline"
                  style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", color: p.primaryOrange }}
                >
                  <span>View Report</span>
                  <ArrowRightIcon color={p.primaryOrange} />
                </button>
              </div>
            </article>

            {/* CARD 2: WEIGHBRIDGE PERFORMANCE (Screen 43) */}
            <article
              className="flex flex-col justify-between rounded-xl p-5 transition-all hover:border-amber-500/50"
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg"
                    style={{ background: p.secondaryGoldSoft, color: p.secondaryGold }}
                  >
                    <PerformanceIcon color={p.secondaryGold} />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    SCREEN 43
                  </span>
                </div>
                <h3
                  className="m-0 text-base font-bold tracking-tight"
                  style={{ color: p.textPrimary }}
                >
                  WEIGHBRIDGE PERFORMANCE
                </h3>
                <p className="mt-1.5 text-xs leading-5" style={{ color: p.textMuted }}>
                  Monitor station activity, usage and operational performance.
                </p>
              </div>
              <div className="mt-5 border-t pt-3" style={{ borderColor: p.divider }}>
                <button
                  onClick={() => onNavigate?.("performance-report")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-wb-primary transition-colors hover:underline"
                  style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", color: p.secondaryGold }}
                >
                  <span>View Report</span>
                  <ArrowRightIcon color={p.secondaryGold} />
                </button>
              </div>
            </article>

            {/* CARD 3: CUSTOMER / SUPPLIER REPORT (Screen 44) */}
            <article
              className="flex flex-col justify-between rounded-xl p-5 transition-all hover:border-amber-500/50"
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg"
                    style={{ background: p.primarySoft, color: p.primaryOrange }}
                  >
                    <UsersGroupIcon color={p.primaryOrange} />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    SCREEN 44
                  </span>
                </div>
                <h3
                  className="m-0 text-base font-bold tracking-tight"
                  style={{ color: p.textPrimary }}
                >
                  CUSTOMER / SUPPLIER REPORT
                </h3>
                <p className="mt-1.5 text-xs leading-5" style={{ color: p.textMuted }}>
                  View customer and supplier weighment activity and summaries.
                </p>
              </div>
              <div className="mt-5 border-t pt-3" style={{ borderColor: p.divider }}>
                <button
                  onClick={() => onNavigate?.("customer-report")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
                  style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", color: p.primaryOrange }}
                >
                  <span>View Report</span>
                  <ArrowRightIcon color={p.primaryOrange} />
                </button>
              </div>
            </article>

            {/* CARD 4: REPORT SUMMARY */}
            <article
              className="flex flex-col justify-between rounded-xl p-5 transition-all hover:border-amber-500/50"
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg"
                    style={{ background: p.secondaryGoldSoft, color: p.secondaryGold }}
                  >
                    <ChartSummaryIcon color={p.secondaryGold} />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    SUMMARY
                  </span>
                </div>
                <h3
                  className="m-0 text-base font-bold tracking-tight"
                  style={{ color: p.textPrimary }}
                >
                  REPORT SUMMARY
                </h3>
                <p className="mt-1.5 text-xs leading-5" style={{ color: p.textMuted }}>
                  Quick overview of key operational reporting metrics.
                </p>
              </div>
              <div className="mt-5 border-t pt-3" style={{ borderColor: p.divider }}>
                <button
                  onClick={() => {
                    const elem = document.getElementById("report-summary-section");
                    if (elem) elem.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
                  style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer", color: p.secondaryGold }}
                >
                  <span>View Summary</span>
                  <ArrowRightIcon color={p.secondaryGold} />
                </button>
              </div>
            </article>

          </div>
        </section>

        {/* ── 5. GLOBAL REPORT FILTERS ──────────────────────────────────────── */}
        <section
          className="mb-8 rounded-xl p-5"
          style={{
            background: p.surface,
            border: `1px solid ${p.border}`,
            boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
          }}
        >
          <div className="mb-4">
            <h2
              className="m-0 text-xs font-bold tracking-wider uppercase"
              style={{ color: p.textMuted }}
            >
              REPORT FILTERS
            </h2>
          </div>

          <div className="flex flex-wrap items-end gap-3.5">
            {/* Filter 1: Date Range */}
            <div className="min-w-44 flex-1">
              <label className="mb-1 block text-[11px] font-semibold" style={{ color: p.textSecondary }}>
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="h-11 w-full rounded-lg px-3 text-xs outline-none transition-colors focus:border-amber-500"
                style={{
                  background: p.inputBg,
                  color: p.textPrimary,
                  border: `1px solid ${p.border}`,
                }}
              >
                <option>Today</option>
                <option>Yesterday</option>
                <option>01 Aug – 21 Aug 2026</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Month</option>
              </select>
            </div>

            {/* Filter 2: Weighbridge */}
            <div className="min-w-40 flex-1">
              <label className="mb-1 block text-[11px] font-semibold" style={{ color: p.textSecondary }}>
                Weighbridge
              </label>
              <select
                value={weighbridgeFilter}
                onChange={(e) => setWeighbridgeFilter(e.target.value)}
                className="h-11 w-full rounded-lg px-3 text-xs outline-none transition-colors focus:border-amber-500"
                style={{
                  background: p.inputBg,
                  color: p.textPrimary,
                  border: `1px solid ${p.border}`,
                }}
              >
                <option>All Weighbridges</option>
                <option>WB-01 (Main Gate)</option>
                <option>WB-02 (North Gate)</option>
                <option>WB-03 (Loading Yard)</option>
                <option>WB-04 (East Gate)</option>
                <option>WB-05 (West Gate)</option>
              </select>
            </div>

            {/* Filter 3: Customer */}
            <div className="min-w-40 flex-1">
              <label className="mb-1 block text-[11px] font-semibold" style={{ color: p.textSecondary }}>
                Customer
              </label>
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="h-11 w-full rounded-lg px-3 text-xs outline-none transition-colors focus:border-amber-500"
                style={{
                  background: p.inputBg,
                  color: p.textPrimary,
                  border: `1px solid ${p.border}`,
                }}
              >
                <option>All Customers</option>
                <option>Apex Infra Ltd</option>
                <option>Metro Materials Ltd</option>
                <option>UltraTech Cement</option>
                <option>Southern Builders</option>
              </select>
            </div>

            {/* Filter 4: Supplier */}
            <div className="min-w-40 flex-1">
              <label className="mb-1 block text-[11px] font-semibold" style={{ color: p.textSecondary }}>
                Supplier
              </label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="h-11 w-full rounded-lg px-3 text-xs outline-none transition-colors focus:border-amber-500"
                style={{
                  background: p.inputBg,
                  color: p.textPrimary,
                  border: `1px solid ${p.border}`,
                }}
              >
                <option>All Suppliers</option>
                <option>Southern Quarries</option>
                <option>Apex Mining Corp</option>
                <option>Global Aggregates</option>
              </select>
            </div>

            {/* Filter 5: Material */}
            <div className="min-w-40 flex-1">
              <label className="mb-1 block text-[11px] font-semibold" style={{ color: p.textSecondary }}>
                Material
              </label>
              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="h-11 w-full rounded-lg px-3 text-xs outline-none transition-colors focus:border-amber-500"
                style={{
                  background: p.inputBg,
                  color: p.textPrimary,
                  border: `1px solid ${p.border}`,
                }}
              >
                <option>All Materials</option>
                <option>Aggregates 20mm</option>
                <option>M-Sand</option>
                <option>Cement Grade 53</option>
                <option>Steel Rebar</option>
                <option>Granite</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                onClick={handleApplyFilters}
                className="h-11 rounded-lg px-4 text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{
                  background: p.primaryOrange,
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="h-11 rounded-lg px-3.5 text-xs font-semibold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                style={{
                  background: "transparent",
                  color: p.textSecondary,
                  border: `1px solid ${p.border}`,
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>

          </div>
        </section>

        {/* ── 6. SUMMARY KPI SECTION ───────────────────────────────────────── */}
        <section id="report-summary-section" className="mb-8">
          <div className="mb-4">
            <h2
              className="m-0 text-xs font-bold tracking-wider uppercase"
              style={{ color: p.textMuted }}
            >
              REPORT SUMMARY
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            
            {/* KPI 1: TOTAL WEIGHMENTS */}
            <div
              className="rounded-xl p-5"
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div className="text-[11px] font-bold tracking-wider uppercase" style={{ color: p.textMuted }}>
                TOTAL WEIGHMENTS
              </div>
              <div
                className="mt-2 text-3xl font-bold tabular-nums"
                style={{ color: p.textPrimary }}
              >
                1,248
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-wb-success">
                <span>↗ +8.4%</span>
                <span style={{ color: p.textMuted }}>vs last period</span>
              </div>
            </div>

            {/* KPI 2: TOTAL WEIGHT */}
            <div
              className="rounded-xl p-5"
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div className="text-[11px] font-bold tracking-wider uppercase" style={{ color: p.textMuted }}>
                TOTAL WEIGHT
              </div>
              <div
                className="mt-2 text-3xl font-bold tabular-nums"
                style={{ color: p.primaryOrange }}
              >
                28,450 T
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-wb-success">
                <span>↗ +12.1%</span>
                <span style={{ color: p.textMuted }}>vs last period</span>
              </div>
            </div>

            {/* KPI 3: VEHICLES */}
            <div
              className="rounded-xl p-5"
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div className="text-[11px] font-bold tracking-wider uppercase" style={{ color: p.textMuted }}>
                VEHICLES
              </div>
              <div
                className="mt-2 text-3xl font-bold tabular-nums"
                style={{ color: p.secondaryGold }}
              >
                486
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-wb-success">
                <span>↗ +5.2%</span>
                <span style={{ color: p.textMuted }}>vs last period</span>
              </div>
            </div>

            {/* KPI 4: AVG. WAIT TIME */}
            <div
              className="rounded-xl p-5"
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
              }}
            >
              <div className="text-[11px] font-bold tracking-wider uppercase" style={{ color: p.textMuted }}>
                AVG. WAIT TIME
              </div>
              <div
                className="mt-2 text-3xl font-bold tabular-nums"
                style={{ color: p.textPrimary }}
              >
                18 min
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-wb-success">
                <span>↘ -2 min</span>
                <span style={{ color: p.textMuted }}>improved efficiency</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── 7. ANALYTICS SECTION ─────────────────────────────────────────── */}
        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* LEFT: WEIGHMENT ACTIVITY */}
          <div
            className="rounded-xl p-6"
            style={{
              background: p.surface,
              border: `1px solid ${p.border}`,
              boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
            }}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3
                  className="m-0 text-base font-bold tracking-tight"
                  style={{ color: p.textPrimary }}
                >
                  WEIGHMENT ACTIVITY
                </h3>
                <p className="mt-0.5 text-xs" style={{ color: p.textMuted }}>
                  Daily weighments
                </p>
              </div>

              {/* Period Selector */}
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                className="h-8 rounded-md px-2.5 text-xs font-medium outline-none"
                style={{
                  background: p.inputBg,
                  color: p.textPrimary,
                  border: `1px solid ${p.border}`,
                }}
              >
                <option>7 Days</option>
                <option>30 Days</option>
                <option>This Month</option>
              </select>
            </div>

            {/* Line / Bar Trend Chart */}
            <div className="h-56 w-full">
              <Suspense fallback={<div className="h-full w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke={p.divider} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: p.textMuted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: p.textMuted }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: p.tooltipBg,
                        border: `1px solid ${p.border}`,
                        borderRadius: 8,
                        fontSize: 12,
                        color: p.textPrimary,
                      }}
                      formatter={(val: unknown) => [`${Number(val)} weighments`, "Daily Volume"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weighments"
                      stroke={p.primaryOrange}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: p.primaryOrange, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: p.primaryOrange, stroke: p.bg, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
          </div>

          {/* RIGHT: WEIGHBRIDGE USAGE */}
          <div
            className="rounded-xl p-6"
            style={{
              background: p.surface,
              border: `1px solid ${p.border}`,
              boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
            }}
          >
            <div className="mb-5">
              <h3
                className="m-0 text-base font-bold tracking-tight"
                style={{ color: p.textPrimary }}
              >
                WEIGHBRIDGE USAGE
              </h3>
              <p className="mt-0.5 text-xs" style={{ color: p.textMuted }}>
                Station utilization breakdown
              </p>
            </div>

            {/* Station Progress Bars */}
            <div className="space-y-4">
              {stationUsage.map((station) => (
                <div key={station.id}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold" style={{ color: p.textPrimary }}>
                      <span className="font-mono">{station.id}</span>
                      <span className="text-[11px] font-normal" style={{ color: p.textMuted }}>
                        ({station.location})
                      </span>
                      {!station.active && (
                        <span className="rounded px-1.5 py-0.2 text-[10px] font-bold text-wb-error bg-red-50 dark:bg-red-950/50">
                          OFFLINE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 font-mono font-bold text-xs">
                      <span style={{ color: p.textMuted }}>{station.count} trips</span>
                      <span style={{ color: station.id === "WB-01" ? p.primaryOrange : p.secondaryGold }}>
                        {station.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Track */}
                  <div
                    className="h-2.5 w-full overflow-hidden rounded-full"
                    style={{ background: p.divider }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${station.percentage}%`,
                        background: station.id === "WB-01"
                          ? p.primaryOrange
                          : station.id === "WB-04"
                            ? "#DC2626"
                            : p.secondaryGold,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ── 8. RECENT REPORTS TABLE ──────────────────────────────────────── */}
        <section
          className="mb-8 overflow-hidden rounded-xl"
          style={{
            background: p.surface,
            border: `1px solid ${p.border}`,
            boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
          }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-4 border-b p-5"
            style={{ borderColor: p.border }}
          >
            <div>
              <h2
                className="m-0 text-base font-bold tracking-tight"
                style={{ color: p.textPrimary }}
              >
                RECENT REPORTS
              </h2>
              <p className="mt-0.5 text-xs" style={{ color: p.textMuted }}>
                Recently generated reports.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-64">
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search recent reports..."
                className="h-9 w-full rounded-lg pl-9 pr-3 text-xs outline-none"
                style={{
                  background: p.inputBg,
                  color: p.textPrimary,
                  border: `1px solid ${p.border}`,
                }}
              />
              <div className="pointer-events-none absolute left-3 top-2.5">
                <SearchIcon color={p.textMuted} />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left border-collapse">
              <thead>
                <tr
                  className="border-b text-[11px] font-bold tracking-wider uppercase"
                  style={{
                    background: p.tableHeaderBg,
                    borderColor: p.border,
                    color: p.textMuted,
                  }}
                >
                  <th className="px-5 py-3.5">REPORT</th>
                  <th className="px-5 py-3.5">PERIOD</th>
                  <th className="px-5 py-3.5">GENERATED</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs" style={{ borderColor: p.divider }}>
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-4 font-semibold" style={{ color: p.textPrimary }}>
                      {report.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px]" style={{ color: p.textSecondary }}>
                      {report.period}
                    </td>
                    <td className="px-5 py-4" style={{ color: p.textMuted }}>
                      {report.generated}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={report.status} darkMode={darkMode} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onNavigate?.(report.screenView)}
                        className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-xs font-semibold transition-all hover:bg-amber-500/10"
                        style={{
                          background: "transparent",
                          color: p.primaryOrange,
                          border: `1px solid ${p.primaryOrange}40`,
                          cursor: "pointer",
                        }}
                      >
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs" style={{ color: p.textMuted }}>
                      No reports found matching &quot;{tableSearch}&quot;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}
