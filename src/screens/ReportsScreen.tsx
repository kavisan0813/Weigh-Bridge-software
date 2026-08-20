import { useMemo, useState, lazy, Suspense } from "react";

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
import type { NavView } from "./EmployeeManagementScreen";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: NavView) => void;
}

const categories = [
  ["Weight Reports", "⚖", "24 reports"],
  ["Weighbridge Reports", "▦", "15 reports"],
  ["Vehicle Reports", "▱", "18 reports"],
  ["Material Reports", "◇", "12 reports"],
  ["Customer Reports", "⌂", "31 reports"],
  ["Operator Reports", "♙", "9 reports"],
  ["Billing Reports", "₹", "19 reports"],
] as const;

const netWeight = [
  { time: "06:00", net: 0 },
  { time: "07:00", net: 320 },
  { time: "08:00", net: 810 },
  { time: "09:00", net: 1290 },
  { time: "10:00", net: 1820 },
  { time: "10:30", net: 2095 },
];
const comparison = [
  { name: "WB-01", mt: 1245 },
  { name: "WB-02", mt: 980 },
  { name: "WB-03", mt: 1120 },
  { name: "WB-04", mt: 720 },
  { name: "WB-05", mt: 1030 },
];
const vehicleVolume = [
  { name: "WB-01", vehicles: 58 },
  { name: "WB-02", vehicles: 46 },
  { name: "WB-03", vehicles: 52 },
  { name: "WB-04", vehicles: 0 },
  { name: "WB-05", vehicles: 48 },
];

function palette(dark: boolean) {
  return {
    page: dark ? "#111827" : "#F8FAFC",
    surface: dark ? "#1F2937" : "#FFFFFF",
    elevated: dark ? "#273449" : "#FFFFFF",
    text: dark ? "#F9FAFB" : "#111827",
    secondary: dark ? "#D1D5DB" : "#4B5563",
    muted: dark ? "#9CA3AF" : "#6B7280",
    border: dark ? "#374151" : "#E5E7EB",
    divider: dark ? "#374151" : "#F1F5F9",
    navy: dark ? "#F9FAFB" : "#111827",
    input: dark ? "#111827" : "#FFFFFF",
    tooltip: dark ? "#1F2937" : "#FFFFFF",
  };
}

function StatusBadge({
  status,
}: {
  status: "Completed" | "Processing" | "Failed";
}) {
  const config = {
    Completed: ["#16A34A", "✓"],
    Processing: ["#8B5CF6", "◌"],
    Failed: ["#DC2626", "!"],
  } as const;
  const [color, icon] = config[status];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold"
      style={{ color, background: `${color}18` }}
    >
      <span aria-hidden>{icon}</span>
      {status}
    </span>
  );
}

export default function ReportsScreen({ darkMode }: Props) {
  const c = palette(darkMode);
  const [selectedCategory, setSelectedCategory] = useState("Weight Reports");
  const [filters, setFilters] = useState({
    date: "Today",
    weighbridge: "All weighbridges",
    material: "All materials",
    customer: "All customers",
    operator: "All operators",
  });
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const reportRows = useMemo(
    () =>
      [
        [
          "Daily Weight Summary",
          "Weight",
          "Today",
          "Admin",
          "10:32 AM",
          "Completed",
        ],
        [
          "Weighbridge Performance",
          "Weighbridge",
          "Today",
          "Admin",
          "09:48 AM",
          "Completed",
        ],
        [
          "Vehicle Movement Report",
          "Vehicle",
          "Yesterday",
          "Admin",
          "08:20 AM",
          "Completed",
        ],
        [
          "Material Reconciliation",
          "Material",
          "This week",
          "Priya Shah",
          "Yesterday",
          "Processing",
        ],
      ] as const,
    [],
  );
  const visibleReports = reportRows.filter((row) =>
    row.join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  const control = (key: keyof typeof filters, options: string[]) => (
    <label className="block min-w-0">
      <span
        className="mb-1 block text-[11px] font-semibold"
        style={{ color: c.secondary }}
      >
        {key === "date" ? "Date Range" : key[0].toUpperCase() + key.slice(1)}
      </span>
      <select
        value={filters[key]}
        onChange={(event) =>
          setFilters({ ...filters, [key]: event.target.value })
        }
        className="h-10 w-full rounded-lg px-3 text-[12px] outline-none"
        style={{
          background: c.input,
          color: c.navy,
          border: `1px solid ${c.border}`,
          boxShadow: "none",
        }}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );

  return (
    <main
      className="min-h-screen overflow-y-auto p-6"
      style={{
        background: c.page,
        color: c.text,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div className="mx-auto max-w-360">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className="m-0 text-[32px] font-bold leading-10"
              style={{ color: c.navy }}
            >
              Reports
            </h1>
            <p
              className="mt-1 max-w-3xl text-sm leading-5"
              style={{ color: c.muted }}
            >
              Analyze weighbridge operations, vehicle movement, material
              quantities and business performance across all 5 weighbridges.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setNotice("CSV export prepared.")}
              className="h-10 rounded-lg px-3.5 text-xs font-semibold"
              style={{
                background: c.surface,
                color: c.navy,
                border: `1px solid ${c.border}`,
                cursor: "pointer",
              }}
            >
              ↓ Export CSV
            </button>
            <button
              onClick={() => setNotice("PDF export prepared.")}
              className="h-10 rounded-lg px-3.5 text-xs font-semibold"
              style={{
                background: c.surface,
                color: c.navy,
                border: `1px solid ${c.border}`,
                cursor: "pointer",
              }}
            >
              ↓ Export PDF
            </button>
            <button
              onClick={() => setNotice("Report generation started.")}
              className="h-10 rounded-lg bg-[#F97316] px-4 text-xs font-bold text-white"
              style={{ border: 0, cursor: "pointer" }}
            >
              Generate Report
            </button>
          </div>
        </div>
        {notice && (
          <div
            className="mb-4 flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
            style={{
              color: "#16A34A",
              background: darkMode ? "#10291C" : "#F0FDF4",
              borderColor: "#16A34A",
            }}
          >
            ✓ {notice}
            <button
              onClick={() => setNotice("")}
              style={{
                border: 0,
                color: "inherit",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        <section
          className="mb-6 rounded-xl p-4"
          style={{
            background: c.surface,
            border: `1px solid ${c.border}`,
            boxShadow: "0 1px 2px rgba(15,23,42,.05)",
          }}
        >
          <div className="grid gap-3 lg:grid-cols-5">
            {control("date", ["Today", "Yesterday", "This week", "This month"])}
            {control("weighbridge", [
              "All weighbridges",
              "WB-01",
              "WB-02",
              "WB-03",
              "WB-04",
              "WB-05",
            ])}
            {control("material", ["All materials", "Granite", "Sand", "Steel"])}
            {control("customer", [
              "All customers",
              "Apex Infra",
              "Metro Materials",
            ])}
            {control("operator", [
              "All operators",
              "Admin",
              "Priya Shah",
              "Ravi Kumar",
            ])}
          </div>
        </section>

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="m-0 text-xl font-semibold" style={{ color: c.navy }}>
              Report Categories
            </h2>
            <span className="text-xs" style={{ color: c.muted }}>
              {selectedCategory}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
            {categories.map(([title, icon, count]) => {
              const active = title === selectedCategory;
              return (
                <button
                  key={title}
                  onClick={() => setSelectedCategory(title)}
                  className="rounded-xl p-4 text-left transition-all hover:-translate-y-0.5"
                  style={{
                    background: active
                      ? darkMode
                        ? "#2A1A0A"
                        : "#FFF7ED"
                      : c.surface,
                    border: `1px solid ${active ? "#F97316" : c.border}`,
                    cursor: "pointer",
                    boxShadow: active ? "0 1px 2px rgba(15,23,42,.05)" : "none",
                  }}
                >
                  <div
                    className="mb-3 text-xl"
                    style={{ color: active ? "#F97316" : c.navy }}
                  >
                    {icon}
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: c.navy }}
                  >
                    {title}
                  </div>
                  <div className="mt-1 text-[11px]" style={{ color: c.muted }}>
                    {count}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total Net Weight", "2,095 MT", "↗ 12.4%", "⚖"],
            ["Total Vehicles", "248", "↗ 8.1%", "▱"],
            ["Total Transactions", "1,248", "↗ 6.8%", "▤"],
            ["Average Net Weight", "8.45 MT", "↗ 3.2%", "◌"],
          ].map(([label, value, trend, icon]) => (
            <div
              key={label}
              className="rounded-xl p-5"
              style={{ background: c.surface, border: `1px solid ${c.border}` }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-xs font-semibold"
                  style={{ color: c.muted }}
                >
                  {label}
                </span>
                <span className="text-lg text-[#F97316]">{icon}</span>
              </div>
              <div
                className="mt-3 text-2xl font-bold tabular-nums"
                style={{ color: c.navy }}
              >
                {value}
              </div>
              <div className="mt-1 text-[11px] font-medium text-wb-success">
                {trend} <span style={{ color: c.muted }}>vs yesterday</span>
              </div>
            </div>
          ))}
        </section>

        <div className="mb-6 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
          <section
            className="rounded-xl p-6"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2
                  className="m-0 text-base font-semibold"
                  style={{ color: c.navy }}
                >
                  Net Weight Trend
                </h2>
                <p className="mt-1 text-xs" style={{ color: c.muted }}>
                  Cumulative net weight processed across all 5 weighbridges.
                </p>
              </div>
              <div className="text-right">
                <div
                  className="text-xl font-bold tabular-nums"
                  style={{ color: c.navy }}
                >
                  2,095 MT
                </div>
                <div className="text-[11px]" style={{ color: c.muted }}>
                  Today
                </div>
              </div>
            </div>
            <Suspense fallback={null}>
              <ResponsiveContainer width="100%" height={205}>
                <LineChart
                  data={netWeight}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke={c.divider}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: c.muted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: c.muted }}
                    axisLine={false}
                    tickLine={false}
                    unit=" MT"
                  />
                  <Tooltip
                    contentStyle={{
                      background: c.tooltip,
                      border: `1px solid ${c.border}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: unknown) => [
                      `${Number(value).toLocaleString()} MT`,
                      "Net weight",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#F97316"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#F97316", strokeWidth: 0 }}
                    activeDot={{
                      r: 6,
                      fill: "#F97316",
                      stroke: "#FFEDD5",
                      strokeWidth: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Suspense>
          </section>
          <section
            className="rounded-xl p-6"
            style={{ background: c.surface, border: `1px solid ${c.border}` }}
          >
            <div className="mb-5">
              <h2
                className="m-0 text-base font-semibold"
                style={{ color: c.navy }}
              >
                Weighbridge Comparison
              </h2>
              <p className="mt-1 text-xs" style={{ color: c.muted }}>
                Net weight processed today.
              </p>
            </div>
            <Suspense fallback={null}>
              <ResponsiveContainer width="100%" height={175}>
                <BarChart
                  data={comparison}
                  margin={{ top: 5, right: 0, left: -14, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke={c.divider}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: c.muted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: c.muted }}
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
                    formatter={(value: unknown) => [
                      `${Number(value).toLocaleString()} MT`,
                      "Net weight",
                    ]}
                  />
                  <Bar dataKey="mt" radius={[4, 4, 0, 0]}>
                    {comparison.map((item) => (
                      <Cell
                        key={item.name}
                        fill={
                          item.name === "WB-01"
                            ? "#F97316"
                            : item.name === "WB-04"
                              ? "#DC2626"
                              : "#C99A2E"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {comparison.map((item) => (
                <div key={item.name} className="text-center">
                  <div
                    className="text-[10px] font-semibold tabular-nums"
                    style={{
                      color: item.name === "WB-04" ? "#DC2626" : c.navy,
                    }}
                  >
                    {item.mt.toLocaleString()}
                  </div>
                  <div className="text-[10px]" style={{ color: c.muted }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section
          className="mb-6 rounded-xl p-6"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}
        >
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2
                className="m-0 text-base font-semibold"
                style={{ color: c.navy }}
              >
                Vehicle Volume
              </h2>
              <p className="mt-1 text-xs" style={{ color: c.muted }}>
                Total vehicles processed per weighbridge today.
              </p>
            </div>
            <div className="flex gap-3 text-[11px]" style={{ color: c.muted }}>
              <span>
                <i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#F97316]" />
                Active
              </span>
              <span>
                <i className="mr-1 inline-block h-2 w-2 rounded-full bg-wb-error" />
                Offline
              </span>
            </div>
          </div>
          <Suspense fallback={null}>
            <ResponsiveContainer width="100%" height={185}>
              <BarChart
                data={vehicleVolume}
                margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  stroke={c.divider}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: c.muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: c.muted }}
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
                  formatter={(value: unknown) => [
                    `${Number(value)} vehicles`,
                    "Processed",
                  ]}
                />
                <Bar dataKey="vehicles" radius={[4, 4, 0, 0]}>
                  {vehicleVolume.map((item) => (
                    <Cell
                      key={item.name}
                      fill={
                        item.name === "WB-04"
                          ? "#DC2626"
                          : item.name === "WB-01"
                            ? "#F97316"
                            : "#C99A2E"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Suspense>
          <div
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
            style={{
              color: "#DC2626",
              background: darkMode ? "#321519" : "#FEF2F2",
            }}
          >
            <span>●</span>
            <strong>WB-04 OFFLINE</strong>
            <span style={{ color: c.muted }}>
              No active transactions recorded today.
            </span>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold" style={{ color: c.navy }}>
            Operational Insights
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              [
                "↗",
                "Highest Volume",
                "WB-01 processed the highest vehicle volume today.",
                "#F97316",
              ],
              [
                "!",
                "Lowest Volume",
                "WB-04 is currently offline and has no active transactions.",
                "#DC2626",
              ],
              [
                "◇",
                "Top Material",
                "Granite accounts for the highest net weight processed today.",
                "#F97316",
              ],
            ].map(([icon, title, copy, color]) => (
              <article
                key={title}
                className="flex gap-3 rounded-xl p-5"
                style={{
                  background: c.surface,
                  border: `1px solid ${c.border}`,
                }}
              >
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base"
                  style={{ color, background: `${color}18` }}
                >
                  {icon}
                </div>
                <div>
                  <h3
                    className="m-0 text-sm font-semibold"
                    style={{ color: c.navy }}
                  >
                    {title}
                  </h3>
                  <p
                    className="mt-1 text-xs leading-5"
                    style={{ color: c.muted }}
                  >
                    {copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mb-8 overflow-hidden rounded-xl"
          style={{ background: c.surface, border: `1px solid ${c.border}` }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b p-5"
            style={{ borderColor: c.border }}
          >
            <div>
              <h2
                className="m-0 text-base font-semibold"
                style={{ color: c.navy }}
              >
                Recently Generated Reports
              </h2>
              <p className="mt-1 text-xs" style={{ color: c.muted }}>
                Latest exports and generated report history.
              </p>
            </div>
            <label className="relative">
              <span className="sr-only">Search reports</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search reports"
                className="h-9 w-52 rounded-lg px-3 pl-8 text-xs outline-none"
                style={{
                  background: c.input,
                  color: c.text,
                  border: `1px solid ${c.border}`,
                }}
              />
              <span
                className="pointer-events-none absolute left-3 top-2 text-xs"
                style={{ color: c.muted }}
              >
                ⌕
              </span>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-205 text-left">
              <thead
                className="text-[11px]"
                style={{
                  color: c.muted,
                  background: darkMode ? "#242118" : "#F8FAFC",
                }}
              >
                <tr>
                  {[
                    "Report Name",
                    "Type",
                    "Date Range",
                    "Generated By",
                    "Generated At",
                    "Status",
                    "Action",
                  ].map((head) => (
                    <th key={head} className="px-5 py-3 font-semibold">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleReports.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-t text-xs"
                    style={{ borderColor: c.divider }}
                  >
                    <td
                      className="px-5 py-4 font-semibold"
                      style={{ color: c.navy }}
                    >
                      {row[0]}
                    </td>
                    <td className="px-5 py-4" style={{ color: c.secondary }}>
                      {row[1]}
                    </td>
                    <td className="px-5 py-4" style={{ color: c.secondary }}>
                      {row[2]}
                    </td>
                    <td className="px-5 py-4" style={{ color: c.secondary }}>
                      {row[3]}
                    </td>
                    <td
                      className="px-5 py-4 tabular-nums"
                      style={{ color: c.secondary }}
                    >
                      {row[4]}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={row[5]} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          setNotice(`${row[0]} opened for preview.`)
                        }
                        className="font-semibold"
                        style={{
                          color: "#F97316",
                          background: "transparent",
                          border: 0,
                          cursor: "pointer",
                        }}
                      >
                        {row[5] === "Processing"
                          ? "View"
                          : row[0].includes("Vehicle")
                            ? "Download"
                            : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleReports.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-sm"
                      style={{ color: c.muted }}
                    >
                      No reports match your search.
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
