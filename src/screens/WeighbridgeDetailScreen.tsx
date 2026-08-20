import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

function pal(dark: boolean) {
  return {
    bg:            dark ? "#111827" : "#F8FAFC",
    surface:       dark ? "#1F2937" : "#FFFFFF",
    elevated:      dark ? "#273449" : "#FFFFFF",
    text:          dark ? "#F9FAFB" : "#111827",
    secondary:     dark ? "#D1D5DB" : "#4B5563",
    muted:         dark ? "#9CA3AF" : "#6B7280",
    border:        dark ? "#374151" : "#E5E7EB",
    divider:       dark ? "#374151" : "#F1F5F9",
    sub:           dark ? "#273449" : "#F8FAFC",
    tooltip:       dark ? "#1F2937" : "#FFFFFF",
    sidebarBg:     dark ? "#1F2937" : "#FFFFFF",
    sidebarBorder: dark ? "#374151" : "#E5E7EB",
    primaryOrange: dark ? "#FB923C" : "#F97316",
    primarySoft:   dark ? "#273449" : "#FFF7ED",
    secondaryGold: dark ? "#D4A83A" : "#C99A2E",
    secondarySoft: dark ? "#422F0A" : "#FFFBEB",
  };
}

const NAV_LINKS = [
  { key: "dashboard",    label: "Dashboard",    icon: "▦" },
  { key: "monitoring",   label: "Weighbridges", icon: "⚖" },
  { key: "transactions", label: "Transactions", icon: "▤" },
  { key: "vehicles",     label: "Vehicles",     icon: "▱" },
  { key: "drivers",      label: "Drivers",      icon: "◉" },
  { key: "customers",    label: "Customers",    icon: "⌂" },
  { key: "suppliers",    label: "Suppliers",    icon: "⊞" },
  { key: "materials",    label: "Materials",    icon: "◇" },
  { key: "employees",    label: "Employees",    icon: "♙" },
  { key: "tickets",      label: "Tickets",      icon: "▭" },
  { key: "billing",      label: "Billing",      icon: "◎" },
  { key: "reports",      label: "Reports",      icon: "▥" },
  { key: "auditlogs",    label: "Audit Logs",   icon: "≡" },
  { key: "settings",     label: "Settings",     icon: "⚙" },
];

const NAVIGABLE = new Set(["dashboard", "monitoring", "transactions"]);

const hourlyActivity = [
  { time: "06:00", vehicles: 4 },
  { time: "07:00", vehicles: 9 },
  { time: "08:00", vehicles: 14 },
  { time: "09:00", vehicles: 12 },
  { time: "10:00", vehicles: 19 },
];

const recentTransactions = [
  { ticket: "WB-2026-00458", vehicle: "TN20AB1234", material: "Gravel", gross: "38,500 KG", tare: "13,500 KG", net: "25,000 KG", operator: "Arun", status: "Completed", time: "10:50 AM" },
  { ticket: "WB-2026-00455", vehicle: "TN09GH3456", material: "Steel", gross: "42,800 KG", tare: "20,000 KG", net: "22,800 KG", operator: "Arun", status: "Completed", time: "10:28 AM" },
  { ticket: "WB-2026-00451", vehicle: "TN12JK7890", material: "Sand", gross: "31,500 KG", tare: "12,000 KG", net: "19,500 KG", operator: "Arun", status: "Completed", time: "09:56 AM" },
];

export default function WeighbridgeDetailScreen({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Props) {
  const p = pal(dm);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);

  const hardwareList = [
    { name: "Weight Indicator", status: "CONNECTED", detail: "Avery E1310 • Port COM3", signal: "Strong", ok: true },
    { name: "Camera (ANPR)", status: "CONNECTED", detail: "Hikvision 4K • IP 192.168.1.104", signal: "Online", ok: true },
    { name: "RFID Reader", status: "CONNECTED", detail: "Zebra FX9600 • Antenna 1 & 2", signal: "99% RSSI", ok: true },
    { name: "Thermal Printer", status: "CONNECTED", detail: "Epson TM-T88VI • Paper 85%", signal: "Ready", ok: true },
    { name: "Automatic Barrier", status: "CONNECTED", detail: "MC92/2M • Gate Position DOWN", signal: "Normal", ok: true },
    { name: "Traffic Light", status: "CONNECTED", detail: "3-Color LED • Signal RED", signal: "Active", ok: true },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: p.bg, color: p.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* ── LEFT SIDEBAR ── */}
      <aside style={{ width: 248, minWidth: 248, height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", background: p.sidebarBg, borderRight: `1px solid ${p.sidebarBorder}`, overflowY: "auto", zIndex: 40, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: `1px solid ${p.sidebarBorder}` }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3c0 1.5.83 2.8 2 3.46V10H7l-2 12h14L17 10h-4V8.46A3.5 3.5 0 0 0 15 5a3 3 0 0 0-3-3z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.13em", color: "#F97316", lineHeight: 1.2 }}>WEIGHBRIDGE</div>
            <div style={{ fontSize: 10.5, color: p.muted, marginTop: 2 }}>ABC Industries</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 10px 0" }}>
          {NAV_LINKS.map(({ key, label, icon }) => {
            const active = key === "monitoring";
            const isNav = NAVIGABLE.has(key);
            return (
              <button key={key} onClick={() => isNav && onNavigate(key as "dashboard" | "monitoring" | "transactions")}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", marginBottom: 3, padding: "9.5px 12px", borderRadius: 8, border: "none", background: active ? (dm ? "rgba(251, 146, 60, 0.15)" : "#FFF7ED") : "transparent", color: active ? p.primaryOrange : p.secondary, fontWeight: active ? 700 : 400, fontSize: 13.5, cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 14, width: 16, textAlign: "center", flexShrink: 0, color: active ? p.primaryOrange : p.secondaryGold }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "10px 10px 16px", borderTop: `1px solid ${p.sidebarBorder}`, marginTop: 8 }}>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: p.muted, fontSize: 13.5, cursor: "pointer", textAlign: "left" }}>↪&nbsp; Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN COLUMN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        
        {/* TOP HEADER */}
        <header style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: p.surface, borderBottom: `1px solid ${p.border}`, position: "sticky", top: 0, zIndex: 30 }}>
          <div>
            <div style={{ fontSize: 11, color: p.muted, display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => onNavigate("monitoring")} style={{ background: "none", border: 0, color: p.primaryOrange, cursor: "pointer", fontWeight: 600, padding: 0 }}>Weighbridges</button>
              <span>/</span>
              <span>WB-01</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: p.text }}>WB-01 — Main Gate</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: dm ? "#052E16" : "#F0FDF4", color: "#16A34A", border: "1px solid rgba(22,163,74,0.3)" }}>
                ● ONLINE
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setConfigDrawerOpen(true)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${p.border}`, background: p.surface, color: p.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              ⚙ Configure Hardware
            </button>
            <button onClick={onToggleDark} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${p.border}`, background: "transparent", color: p.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {dm ? "☼" : "◐"}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px 40px" }}>
          
          {/* WEIGHBRIDGE SUMMARY HEADER ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>OPERATIONAL UNIT</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: p.text, marginTop: 4 }}>WB-01 — Main Gate</div>
              <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }} />
                Operational Status: ONLINE (100% Health)
              </div>
            </div>

            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: p.muted }}>TODAY'S VEHICLES</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: p.text, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>58</div>
              <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600, marginTop: 4 }}>↑ +14% vs yesterday</div>
            </div>

            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: p.muted }}>TODAY'S NET WEIGHT</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: p.secondaryGold, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                1,245 <span style={{ fontSize: 14 }}>MT</span>
              </div>
              <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>Secondary Gold Accent</div>
            </div>

            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: p.muted }}>AVG PROCESSING TIME</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: p.text, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>6 min</div>
              <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600, marginTop: 4 }}>Fast throughput</div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 1: CURRENT OPERATION PANEL (TWO COLUMNS)
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: p.text }}>Section 1 — Current Live Operation</h2>
                <div style={{ fontSize: 12, color: p.muted, marginTop: 2 }}>Real-time scale data and vehicle positioned on WB-01</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.primaryOrange, background: p.primarySoft, padding: "4px 10px", borderRadius: 6 }}>
                Active Scale Readout
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20 }}>
              {/* LEFT SIDE: Current Vehicle Information */}
              <div style={{ background: p.sub, border: `1px solid ${p.border}`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                  Current Vehicle Information
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: p.muted }}>Vehicle Number</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: p.text, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>TN20AB1234</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: p.muted }}>Customer</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginTop: 2 }}>ABC Construction</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: p.muted }}>Material</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginTop: 2 }}>Gravel (Aggregates)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: p.muted }}>Driver</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginTop: 2 }}>Ravi Kumar</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: p.muted }}>Transaction Ticket</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: p.primaryOrange, marginTop: 2 }}>WB-2026-00458</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: p.muted }}>Assigned Operator</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginTop: 2 }}>Arun Kumar</div>
                  </div>
                </div>

                <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>
                    ● VEHICLE POSITIONED ON PLATFORM
                  </div>
                  <button onClick={() => onNavigate("transaction-detail")} style={{ background: p.primaryOrange, color: "white", border: 0, borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    View Transaction →
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE: Live Weight Readout Component */}
              <div style={{ background: p.sub, border: `1px solid ${p.border}`, borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>LIVE WEIGHT COMPONENT</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A" }}>Indicator COM3</span>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: p.text, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
                      38,500 <span style={{ fontSize: 24, fontWeight: 700, color: p.muted }}>KG</span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: "#16A34A", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
                      ● WEIGHT STABLE (Gross captured)
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${p.border}`, paddingTop: 14, marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 11 }}>
                  <div>
                    <span style={{ color: p.muted }}>Indicator:</span>
                    <div style={{ fontWeight: 700, color: "#16A34A", marginTop: 2 }}>● CONNECTED</div>
                  </div>
                  <div>
                    <span style={{ color: p.muted }}>Last Reading:</span>
                    <div style={{ fontWeight: 600, color: p.text, marginTop: 2 }}>10:50:32 AM</div>
                  </div>
                  <div>
                    <span style={{ color: p.muted }}>Signal Quality:</span>
                    <div style={{ fontWeight: 600, color: p.text, marginTop: 2 }}>Strong (100%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 2: WEIGHBRIDGE HARDWARE (6 CARDS GRID)
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: p.text }}>Section 2 — Hardware Connectivity & Devices</h2>
              <div style={{ fontSize: 12, color: p.muted, marginTop: 2 }}>Real-time status for all equipment connected to WB-01</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
              {hardwareList.map(h => (
                <div key={h.name} style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: p.text, lineHeight: 1.3 }}>{h.name}</div>
                  <div style={{ marginTop: 8, fontSize: 10.5, fontWeight: 700, color: "#16A34A", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A" }} />
                    {h.status}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: p.muted, lineHeight: 1.3 }}>{h.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 3 & 4: TODAY'S PERFORMANCE & WEIGHING CHART
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 14, marginBottom: 24 }}>
            {/* Today's Performance 4 KPI Cards */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 20 }}>
              <h2 style={{ margin: "0 0 14px 0", fontSize: 15, fontWeight: 700, color: p.text }}>Section 3 — Today's Performance</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: p.sub, border: `1px solid ${p.border}`, borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 11, color: p.muted, fontWeight: 600 }}>VEHICLES PROCESSED</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: p.text, marginTop: 4 }}>58</div>
                </div>
                <div style={{ background: p.sub, border: `1px solid ${p.border}`, borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 11, color: p.muted, fontWeight: 600 }}>TOTAL GROSS</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: p.text, marginTop: 4 }}>1,420 MT</div>
                </div>
                <div style={{ background: p.sub, border: `1px solid ${p.border}`, borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 11, color: p.muted, fontWeight: 600 }}>TOTAL TARE</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: p.text, marginTop: 4 }}>175 MT</div>
                </div>
                <div style={{ background: p.secondarySoft, border: `1.5px solid ${p.secondaryGold}`, borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 11, color: p.secondaryGold, fontWeight: 700 }}>TOTAL NET (GOLD HIGHLIGHT)</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: p.secondaryGold, marginTop: 4 }}>1,245 MT</div>
                </div>
              </div>
            </div>

            {/* Today's Weighing Activity Chart */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 20 }}>
              <h2 style={{ margin: "0 0 4px 0", fontSize: 15, fontWeight: 700, color: p.text }}>Section 4 — Today's Hourly Throughput</h2>
              <div style={{ fontSize: 11.5, color: p.muted, marginBottom: 14 }}>Vehicles processed per hour on WB-01</div>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={hourlyActivity} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke={p.divider} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: p.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: p.muted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: p.tooltip, border: `1px solid ${p.border}`, borderRadius: 8, fontSize: 12 }} />
                  <Area dataKey="vehicles" type="monotone" stroke="#F97316" strokeWidth={2.5} fill="#FFF7ED" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 5 & 6: RECENT TRANSACTIONS & TIMELINE
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 24 }}>
            {/* Recent Transactions Table */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${p.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: p.text }}>Section 5 — WB-01 Recent Transactions</span>
                <button onClick={() => onNavigate("transactions")} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  View All →
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: p.sub, color: p.muted }}>
                      <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700 }}>TICKET</th>
                      <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700 }}>VEHICLE</th>
                      <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700 }}>MATERIAL</th>
                      <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700 }}>NET WEIGHT</th>
                      <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700 }}>TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.ticket} style={{ borderTop: `1px solid ${p.divider}` }}>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: p.text }}>{tx.ticket}</td>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: p.secondary }}>{tx.vehicle}</td>
                        <td style={{ padding: "12px 16px", color: p.secondary }}>{tx.material}</td>
                        <td style={{ padding: "12px 16px", fontWeight: 800, color: p.text }}>{tx.net}</td>
                        <td style={{ padding: "12px 16px", color: p.muted }}>{tx.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 6: Activity Timeline */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 20 }}>
              <h2 style={{ margin: "0 0 14px 0", fontSize: 15, fontWeight: 700, color: p.text }}>Section 6 — Activity Timeline</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["10:50 AM", "Transaction completed", "WB-2026-00458", "#16A34A"],
                  ["10:49 AM", "Tare weight captured", "13,500 KG", "#F97316"],
                  ["10:48 AM", "Vehicle positioned on scale", "TN20AB1234", "#8B5CF6"],
                  ["10:47 AM", "Vehicle detected by ANPR", "TN20AB1234", "#2563EB"],
                ].map(([time, event, tag, color]) => (
                  <div key={time} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: p.text }}>{event}</div>
                      <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>{time} • {tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SECTION 7, 8, 9: ALERTS, INFO & OPERATOR CARDS
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {/* Section 7: Alerts Card */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: p.text, marginBottom: 10 }}>Section 7 — System Alerts</div>
              <div style={{ background: dm ? "#052E16" : "#F0FDF4", border: "1px solid rgba(22,163,74,0.3)", borderRadius: 8, padding: 12, color: "#16A34A", fontSize: 12, fontWeight: 600 }}>
                ✓ No active alerts — All WB-01 hardware operating normally.
              </div>
            </div>

            {/* Section 8: Weighbridge Info Card */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: p.text, marginBottom: 10 }}>Section 8 — Weighbridge Info</div>
              <div style={{ fontSize: 11.5, color: p.secondary, lineHeight: 1.6 }}>
                Capacity: <b>60,000 KG</b><br />
                Platform: <b>18m × 3m</b><br />
                Installed: <b>12 Jan 2025</b><br />
                Next Maintenance: <b>05 Sep 2026</b>
              </div>
            </div>

            {/* Section 9: Current Operator Card */}
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: p.text, marginBottom: 10 }}>Section 9 — Assigned Operator</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: p.text }}>Arun Kumar (EMP001)</div>
              <div style={{ fontSize: 11.5, color: p.muted, marginTop: 4 }}>Shift: 08:00 AM – 04:00 PM • Status: <span style={{ color: "#16A34A", fontWeight: 700 }}>● ACTIVE</span></div>
            </div>
          </div>

        </main>
      </div>

      {/* ── HARDWARE CONFIGURATION SLIDE-OVER DRAWER STATE ── */}
      {configDrawerOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 400, background: p.surface, height: "100%", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "-4px 0 20px rgba(0,0,0,0.2)" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Hardware Configuration</h3>
                <button onClick={() => setConfigDrawerOpen(false)} style={{ background: "none", border: 0, fontSize: 18, color: p.muted, cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {hardwareList.map(h => (
                  <div key={h.name} style={{ background: p.sub, border: `1px solid ${p.border}`, borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>{h.name}</div>
                      <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>{h.detail}</div>
                    </div>
                    <button style={{ background: p.primaryOrange, color: "white", border: 0, borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Configure</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, borderTop: `1px solid ${p.border}`, paddingTop: 16 }}>
              <button onClick={() => setConfigDrawerOpen(false)} style={{ flex: 1, padding: "10px 0", background: p.primaryOrange, color: "white", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                Save Changes
              </button>
              <button onClick={() => setConfigDrawerOpen(false)} style={{ flex: 1, padding: "10px 0", background: "transparent", color: p.secondary, border: `1px solid ${p.border}`, borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
