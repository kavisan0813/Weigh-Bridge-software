import { useState, useMemo } from "react";

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
    input:         dark ? "#111827" : "#FFFFFF",
    primaryOrange: dark ? "#FB923C" : "#F97316",
    primarySoft:   dark ? "#273449" : "#FFF7ED",
    secondaryGold: dark ? "#D4A83A" : "#C99A2E",
    secondarySoft: dark ? "#422F0A" : "#FFFBEB",
  };
}

const REGISTERED_VEHICLES = [
  { no: "TN20AB1234", type: "Truck (10-Wheeler)", customer: "ABC Construction", tare: "13,500 KG", lastWeighed: "Today, 10:50 AM", count: 3, docStatus: "VALID", docColor: "#16A34A", status: "ACTIVE", statusColor: "#16A34A", make: "Tata", model: "Prima 2024", driver: "Ravi Kumar" },
  { no: "TN18CD5678", type: "Trailer", customer: "XYZ Logistics", tare: "12,100 KG", lastWeighed: "Today, 10:42 AM", count: 2, docStatus: "VALID", docColor: "#16A34A", status: "ACTIVE", statusColor: "#16A34A", make: "Ashok Leyland", model: "AVTR 2023", driver: "Suresh M." },
  { no: "TN10EF9012", type: "Tanker", customer: "Global Cement", tare: "15,800 KG", lastWeighed: "Yesterday", count: 0, docStatus: "EXPIRING SOON", docColor: "#F59E0B", status: "ACTIVE", statusColor: "#16A34A", make: "BharatBenz", model: "3528C", driver: "Vijay K." },
  { no: "TN09GH3456", type: "Tipper", customer: "ABC Steel", tare: "20,000 KG", lastWeighed: "05 Aug 2026", count: 0, docStatus: "EXPIRED", docColor: "#DC2626", status: "BLOCKED", statusColor: "#DC2626", make: "MAN Truck", model: "CLA 25.280", driver: "Mani R." },
  { no: "TN22JK7102", type: "Container", customer: "Infrastructure Ltd", tare: "16,200 KG", lastWeighed: "12 Aug 2026", count: 1, docStatus: "VALID", docColor: "#16A34A", status: "ACTIVE", statusColor: "#16A34A", make: "Tata", model: "Signa 4825", driver: "Karthik P." },
  { no: "TN37GH3345", type: "Lorry", customer: "Metro Highways", tare: "12,600 KG", lastWeighed: "18 Aug 2026", count: 0, docStatus: "VALID", docColor: "#16A34A", status: "INACTIVE", statusColor: "#64748B", make: "Eicher", model: "Pro 6035", driver: "Selvam T." },
];

export default function VehicleManagementScreen({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Props) {
  const p = pal(dm);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailDrawerItem, setDetailDrawerItem] = useState<typeof REGISTERED_VEHICLES[0] | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // New vehicle form fields
  const [newNo, setNewNo] = useState("");
  const [newType, setNewType] = useState("Truck");
  const [newCustomer, setNewCustomer] = useState("ABC Construction");
  const [newTare, setNewTare] = useState("13,500 KG");

  const filtered = useMemo(() => {
    return REGISTERED_VEHICLES.filter(v => {
      const matchQ = `${v.no} ${v.customer} ${v.driver}`.toLowerCase().includes(query.toLowerCase());
      const matchType = typeFilter === "All" || v.type.includes(typeFilter);
      const matchStatus = statusFilter === "All" || v.status === statusFilter;
      return matchQ && matchType && matchStatus;
    });
  }, [query, typeFilter, statusFilter]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: p.bg, color: p.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* ── LEFT SIDEBAR ── */}
      <aside style={{ width: 248, minWidth: 248, height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", background: p.surface, borderRight: `1px solid ${p.border}`, flexShrink: 0, zIndex: 40 }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${p.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: p.primaryOrange, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2a3 3 0 0 0-3 3c0 1.5.83 2.8 2 3.46V10H7l-2 12h14L17 10h-4V8.46A3.5 3.5 0 0 0 15 5a3 3 0 0 0-3-3z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.13em", color: p.primaryOrange }}>WEIGHBRIDGE</div>
            <div style={{ fontSize: 10.5, color: p.muted }}>ABC Industries</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {[
            { key: "dashboard", label: "Dashboard", icon: "▦" },
            { key: "monitoring", label: "Weighbridges", icon: "⚖" },
            { key: "transactions", label: "Transactions", icon: "▤" },
            { key: "vehicles", label: "Vehicles", icon: "▱" },
            { key: "employees", label: "Employees", icon: "♙" },
            { key: "reports", label: "Reports", icon: "▥" },
            { key: "settings", label: "Settings", icon: "⚙" },
          ].map(({ key, label, icon }) => {
            const active = key === "vehicles";
            return (
              <button key={key} onClick={() => onNavigate(key as any)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", marginBottom: 3, padding: "9.5px 12px", borderRadius: 8, border: "none", background: active ? (dm ? "rgba(251, 146, 60, 0.15)" : "#FFF7ED") : "transparent", color: active ? p.primaryOrange : p.secondary, fontWeight: active ? 700 : 400, fontSize: 13.5, cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 14, color: active ? p.primaryOrange : p.secondaryGold }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 14, borderTop: `1px solid ${p.border}` }}>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, border: 0, background: "transparent", color: p.muted, fontSize: 13.5, cursor: "pointer" }}>
            ↪ Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN COLUMN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* TOP HEADER */}
        <header style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: p.surface, borderBottom: `1px solid ${p.border}`, position: "sticky", top: 0, zIndex: 30 }}>
          <div>
            <div style={{ fontSize: 11, color: p.muted, display: "flex", alignItems: "center", gap: 6 }}>
              <span>Admin</span>
              <span>/</span>
              <span>Vehicles</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: p.text, marginTop: 1 }}>
              Vehicle Master-Data & Tare Weights
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => onNavigate("vehicle-add")} style={{ padding: "8px 16px", borderRadius: 8, border: 0, background: p.primaryOrange, color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              + Add Vehicle
            </button>
            <button onClick={onToggleDark} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${p.border}`, background: "transparent", color: p.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {dm ? "☼" : "◐"}
            </button>
          </div>
        </header>

        {/* MAIN BODY */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px 40px" }}>
          
          {/* SUMMARY 4 KPI CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase" }}>TOTAL VEHICLES</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: p.text, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>1,284</div>
              <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>Registered Fleet</div>
            </div>

            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase" }}>ACTIVE VEHICLES</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#16A34A", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>1,241</div>
              <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>Eligible for weighing</div>
            </div>

            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase" }}>INACTIVE / BLOCKED</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#DC2626", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>43</div>
              <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>Blocked or expired docs</div>
            </div>

            <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase" }}>TODAY'S WEIGHMENTS</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: p.secondaryGold, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>248</div>
              <div style={{ fontSize: 11, color: p.secondaryGold, fontWeight: 700, marginTop: 4 }}>Secondary Gold Metric</div>
            </div>
          </div>

          {/* FILTER & SEARCH TOOLBAR */}
          <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <div style={{ flex: "1 1 240px" }}>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search vehicle number, customer, driver..."
                style={{ width: "100%", height: 42, borderRadius: 8, border: `1px solid ${p.border}`, background: p.input, color: p.text, padding: "0 14px", fontSize: 13, outline: "none" }} />
            </div>

            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ height: 42, borderRadius: 8, border: `1px solid ${p.border}`, background: p.input, color: p.text, padding: "0 12px", fontSize: 12, fontWeight: 600, outline: "none" }}>
              <option value="All">All Vehicle Types</option>
              <option value="Truck">Truck</option>
              <option value="Trailer">Trailer</option>
              <option value="Tanker">Tanker</option>
              <option value="Tipper">Tipper</option>
              <option value="Container">Container</option>
            </select>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ height: 42, borderRadius: 8, border: `1px solid ${p.border}`, background: p.input, color: p.text, padding: "0 12px", fontSize: 12, fontWeight: 600, outline: "none" }}>
              <option value="All">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
            </select>

            <button onClick={() => { setQuery(""); setTypeFilter("All"); setStatusFilter("All"); }}
              style={{ height: 42, padding: "0 14px", borderRadius: 8, border: `1px solid ${p.border}`, background: "transparent", color: p.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Clear Filters
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button onClick={() => setImportModalOpen(true)} style={{ height: 42, padding: "0 14px", borderRadius: 8, border: `1px solid ${p.border}`, background: p.surface, color: p.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Import Bulk
              </button>
            </div>
          </div>

          {/* MAIN VEHICLE DATA TABLE */}
          <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${p.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 800, color: p.text }}>Registered Fleet</span>
                <span style={{ fontSize: 12, color: p.muted, marginLeft: 8 }}>({filtered.length} vehicles)</span>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: p.sub, color: p.muted }}>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11 }}>VEHICLE NUMBER</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11 }}>TYPE</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11 }}>CUSTOMER / OWNER</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11 }}>TARE WEIGHT</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11 }}>LAST WEIGHED</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11 }}>TODAY</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11 }}>DOCUMENTS</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11 }}>STATUS</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700, fontSize: 11, textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <tr key={v.no} style={{ borderTop: `1px solid ${p.divider}` }}>
                      <td style={{ padding: "14px 16px", fontWeight: 800, color: p.primaryOrange, fontVariantNumeric: "tabular-nums" }}>{v.no}</td>
                      <td style={{ padding: "14px 16px", color: p.text, fontWeight: 600 }}>{v.type}</td>
                      <td style={{ padding: "14px 16px", color: p.secondary }}>{v.customer}</td>
                      <td style={{ padding: "14px 16px", fontWeight: 800, color: p.text, fontVariantNumeric: "tabular-nums" }}>{v.tare}</td>
                      <td style={{ padding: "14px 16px", color: p.muted }}>{v.lastWeighed}</td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: p.text, fontVariantNumeric: "tabular-nums" }}>{v.count}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: v.docColor }}>{v.docStatus}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: `${v.statusColor}18`, color: v.statusColor, border: `1px solid ${v.statusColor}35` }}>
                          ● {v.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button onClick={() => onNavigate("vehicle-detail")} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${p.border}`, background: p.surface, color: p.primaryOrange, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* VEHICLE DETAIL DRAWER */}
      {detailDrawerItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 440, background: p.surface, height: "100%", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "-4px 0 20px rgba(0,0,0,0.2)" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: p.muted, fontWeight: 700 }}>VEHICLE MASTER RECORD</div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: p.primaryOrange }}>{detailDrawerItem.no}</h3>
                </div>
                <button onClick={() => setDetailDrawerItem(null)} style={{ background: "none", border: 0, fontSize: 18, color: p.muted, cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ background: p.sub, border: `1px solid ${p.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: p.muted }}>REGISTERED TARE WEIGHT</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: p.text, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{detailDrawerItem.tare}</div>
                <div style={{ fontSize: 11.5, color: "#16A34A", fontWeight: 700, marginTop: 4 }}>✓ Calibrated on WB-01</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                  <span style={{ color: p.muted }}>Type</span>
                  <b>{detailDrawerItem.type}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                  <span style={{ color: p.muted }}>Make & Model</span>
                  <b>{detailDrawerItem.make} {detailDrawerItem.model}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                  <span style={{ color: p.muted }}>Driver</span>
                  <b>{detailDrawerItem.driver}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                  <span style={{ color: p.muted }}>Customer</span>
                  <b>{detailDrawerItem.customer}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                  <span style={{ color: p.muted }}>Compliance</span>
                  <b style={{ color: detailDrawerItem.docColor }}>{detailDrawerItem.docStatus}</b>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${p.border}`, paddingTop: 16 }}>
              <button onClick={() => { setDetailDrawerItem(null); onNavigate("vehicle-detail"); }} style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: 0, background: p.primaryOrange, color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                View Full Vehicle Profile →
              </button>
              <button onClick={() => setDetailDrawerItem(null)} style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: `1px solid ${p.border}`, background: p.surface, color: p.secondary, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {addModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 480, background: p.surface, border: `1px solid ${p.border}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 800, color: p.text }}>Add New Vehicle</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: p.secondary, marginBottom: 4 }}>Vehicle Registration Number *</label>
                <input value={newNo} onChange={e => setNewNo(e.target.value.toUpperCase())} placeholder="e.g. TN20AB1234"
                  style={{ width: "100%", height: 42, borderRadius: 8, border: `1px solid ${p.border}`, background: p.input, color: p.text, padding: "0 12px", fontSize: 13, outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: p.secondary, marginBottom: 4 }}>Vehicle Type *</label>
                <select value={newType} onChange={e => setNewType(e.target.value)} style={{ width: "100%", height: 42, borderRadius: 8, border: `1px solid ${p.border}`, background: p.input, color: p.text, padding: "0 12px", fontSize: 13 }}>
                  <option>Truck (10-Wheeler)</option>
                  <option>Trailer</option>
                  <option>Tanker</option>
                  <option>Tipper</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: p.secondary, marginBottom: 4 }}>Customer / Owner *</label>
                <select value={newCustomer} onChange={e => setNewCustomer(e.target.value)} style={{ width: "100%", height: 42, borderRadius: 8, border: `1px solid ${p.border}`, background: p.input, color: p.text, padding: "0 12px", fontSize: 13 }}>
                  <option>ABC Construction</option>
                  <option>XYZ Logistics</option>
                  <option>Global Cement</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: p.secondary, marginBottom: 4 }}>Registered Tare Weight *</label>
                <input value={newTare} onChange={e => setNewTare(e.target.value)} placeholder="13,500 KG"
                  style={{ width: "100%", height: 42, borderRadius: 8, border: `1px solid ${p.border}`, background: p.input, color: p.text, padding: "0 12px", fontSize: 13, outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={() => { setAddModalOpen(false); alert("Vehicle registered successfully."); }} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: 0, background: p.primaryOrange, color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Save Vehicle
              </button>
              <button onClick={() => setAddModalOpen(false)} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `1px solid ${p.border}`, background: p.surface, color: p.secondary, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {importModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 440, background: p.surface, border: `1px solid ${p.border}`, borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 800, color: p.text }}>Bulk Import Vehicles</h3>
            <p style={{ fontSize: 13, color: p.secondary, margin: "0 0 16px 0" }}>Upload a CSV or Excel spreadsheet containing vehicle registration numbers and tare weights.</p>
            <div style={{ border: `2px dashed ${p.border}`, borderRadius: 10, padding: 28, textAlign: "center", background: p.sub, marginBottom: 20 }}>
              <div style={{ fontSize: 24 }}>📄</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: p.text, marginTop: 6 }}>Drag and drop fleet file here</div>
              <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>Supports CSV, XLSX up to 10MB</div>
            </div>
            <button onClick={() => setImportModalOpen(false)} style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: `1px solid ${p.border}`, background: p.surface, color: p.secondary, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
