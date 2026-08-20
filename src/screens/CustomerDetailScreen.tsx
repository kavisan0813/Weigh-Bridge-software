import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const WEIGHMENTS_HISTORY = [
  { date: "19 Aug 2026", ticket: "WB-2026-00462", vehicle: "TN22GH3456", driver: "Arun Kumar", material: "Gravel", gross: "42,500 KG", tare: "17,650 KG", net: "24,850 KG", wb: "WB-01", status: "COMPLETED", statusColor: "#16A34A" },
  { date: "19 Aug 2026", ticket: "WB-2026-00459", vehicle: "TN09AB7821", driver: "Ravi Kumar", material: "Sand", gross: "38,200 KG", tare: "16,400 KG", net: "21,800 KG", wb: "WB-01", status: "COMPLETED", statusColor: "#16A34A" },
  { date: "18 Aug 2026", ticket: "WB-2026-00448", vehicle: "TN38CD5567", driver: "Priya Kumar", material: "Cement", gross: "34,600 KG", tare: "16,000 KG", net: "18,600 KG", wb: "WB-02", status: "COMPLETED", statusColor: "#16A34A" },
  { date: "17 Aug 2026", ticket: "WB-2026-00441", vehicle: "TN22GH3456", driver: "Arun Kumar", material: "M-Sand", gross: "39,900 KG", tare: "17,500 KG", net: "22,400 KG", wb: "WB-01", status: "COMPLETED", statusColor: "#16A34A" },
  { date: "17 Aug 2026", ticket: "WB-2026-00438", vehicle: "TN09AB7821", driver: "Ravi Kumar", material: "Gravel", gross: "41,100 KG", tare: "16,450 KG", net: "24,650 KG", wb: "WB-03", status: "COMPLETED", statusColor: "#16A34A" },
];

const VEHICLES = [
  { no: "TN22GH3456", type: "Truck", driver: "Arun Kumar", wb: "WB-01", lastUsed: "19 Aug 2026", status: "ACTIVE" },
  { no: "TN09AB7821", type: "Truck", driver: "Ravi Kumar", wb: "WB-01", lastUsed: "19 Aug 2026", status: "ACTIVE" },
  { no: "TN38CD5567", type: "Tipper", driver: "Priya Kumar", wb: "WB-02", lastUsed: "18 Aug 2026", status: "ACTIVE" },
  { no: "TN11EF9021", type: "Trailer", driver: "Manoj Kumar", wb: "WB-03", lastUsed: "15 Aug 2026", status: "INACTIVE" },
];

const DRIVERS = [
  { name: "Arun Kumar", id: "DRV-00124", vehicle: "TN22GH3456", licenseStatus: "VALID", lastUsed: "19 Aug 2026", status: "ACTIVE" },
  { name: "Ravi Kumar", id: "DRV-00125", vehicle: "TN09AB7821", licenseStatus: "VALID", lastUsed: "19 Aug 2026", status: "ACTIVE" },
  { name: "Priya Kumar", id: "DRV-00126", vehicle: "TN38CD5567", licenseStatus: "EXPIRING SOON", lastUsed: "18 Aug 2026", status: "ACTIVE" },
];

const DOCUMENTS = [
  { name: "Business Registration", type: "PDF", uploaded: "12 Jan 2024", status: "VALID" },
  { name: "GST / Tax Certificate", type: "PDF", uploaded: "12 Jan 2024", status: "VALID" },
  { name: "Annual Supply Contract", type: "PDF", uploaded: "01 Jan 2026", status: "VALID" },
];

const TIMELINE = [
  { date: "19 Aug 2026", title: "Weighment completed", desc: "Ticket WB-2026-00462 · 24,850 KG Net Gravel" },
  { date: "18 Aug 2026", title: "Driver assigned", desc: "Arun Kumar → TN22GH3456" },
  { date: "15 Aug 2026", title: "Vehicle registered", desc: "TN38CD5567 added to account" },
  { date: "10 Aug 2026", title: "Customer information updated", desc: "Tax ID & address updated by Admin" },
];

export default function CustomerDetailScreen({ darkMode, onToggleDark, onLogout, onNavigate }: Props) {
  const dm = darkMode;
  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const elevated = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const divider = dm ? "#374151" : "#F1F5F9";
  const inputBg = dm ? "#111827" : "#FFFFFF";
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const primaryOrangeSoft = dm ? "#2A1809" : "#FFF7ED";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";
  const secondaryGoldSoft = dm ? "#422F0A" : "#FFFBEB";
  const statusSuccess = "#16A34A";
  const statusWarning = "#F59E0B";
  const statusError = "#DC2626";

  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const thStyle: React.CSSProperties = {
    padding: "10px 20px", fontSize: 11, fontWeight: 700, color: mutedText,
    letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "left",
    background: elevated, borderBottom: `1px solid ${border}`, whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    padding: "14px 20px", fontSize: 13, color: primaryText,
    borderBottom: `1px solid ${divider}`, verticalAlign: "middle",
  };

  const InfoRow = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
    <div style={{ display: "flex", flexDirection: "column", padding: "12px 0", borderBottom: `1px solid ${divider}` }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: mutedText, letterSpacing: "0.04em" }}>{label.toUpperCase()}</span>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: accent || primaryText, marginTop: 3 }}>{value}</span>
    </div>
  );

  if (viewDevice === "mobile") return renderMobile();
  return renderDesktop();

  function renderDesktop() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText, display: "flex", flexDirection: "column" }}>

        {/* Deactivate Modal */}
        {showDeactivateModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 440, background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 900, color: primaryText }}>Deactivate Customer?</h3>
              <p style={{ margin: "0 0 8px 0", fontSize: 13.5, color: secondaryText }}>Metro Builders Ltd will no longer be permitted to perform new weighbridge operations.</p>
              <p style={{ margin: "0 0 20px 0", fontSize: 12.5, color: mutedText }}>Historical transactions will remain accessible in reports.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowDeactivateModal(false)} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => setShowDeactivateModal(false)} style={{ height: 40, padding: "0 18px", borderRadius: 8, background: statusError, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Deactivate Customer</button>
              </div>
            </div>
          </div>
        )}



        <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 49px)" }}>

          {/* Page Header */}
          <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 11, color: mutedText, fontWeight: 600, marginBottom: 2, display: "flex", gap: 6 }}>
                <button onClick={() => onNavigate("customers")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Customers</button>
                <span>/</span>
                <span style={{ color: primaryOrange }}>Metro Builders Ltd</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>Customer Detail</h1>
              <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>Customer information, vehicles, drivers and weighment activity.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {role === "admin" && (
                <>
                  <button onClick={() => setShowDeactivateModal(true)} style={{ height: 42, padding: "0 14px", borderRadius: 8, background: dm ? "rgba(220,38,38,0.12)" : "#FEF2F2", color: statusError, border: "1px solid #FECACA", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Deactivate</button>
                  <button onClick={() => onNavigate("customer-edit")} style={{ height: 42, padding: "0 18px", borderRadius: 8, background: primaryOrange, color: "#FFFFFF", fontSize: 13, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>✎ Edit Customer</button>
                  <button style={{ height: 42, padding: "0 14px", borderRadius: 8, background: surface, color: secondaryText, fontSize: 13, fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>••• More</button>
                </>
              )}
            </div>
          </header>

          {/* Body */}
          <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>

            {/* Profile Header Card */}
            <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: primaryOrange, color: "#FFF", fontWeight: 900, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>MB</div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: primaryText }}>Metro Builders Ltd</h2>
                  <div style={{ fontSize: 13, color: mutedText, marginTop: 2 }}>CUS-00124 · Commercial Company</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● ACTIVE</span>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: primaryOrangeSoft, color: primaryOrange }}>Tax Verified</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>CUSTOMER SINCE</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: primaryText, marginTop: 4 }}>12 Jan 2024</div>
                </div>
                <div style={{ width: 1, background: border }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>LAST WEIGHMENT</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: primaryText, marginTop: 4 }}>19 Aug 2026 · 11:14 AM</div>
                </div>
              </div>
            </div>

            {/* KPI Summary Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "VEHICLES", value: "24", valueColor: primaryOrange, sub: "Registered vehicles" },
                { label: "DRIVERS", value: "18", valueColor: secondaryGold, sub: "Assigned drivers" },
                { label: "TOTAL WEIGHMENTS", value: "1,248", valueColor: primaryText, sub: "All time transactions" },
                { label: "TOTAL NET WEIGHT", value: "28,450 TON", valueColor: statusSuccess, sub: "Material delivered" },
              ].map(k => (
                <div key={k.label} style={{ padding: 18, borderRadius: 12, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, letterSpacing: "0.05em" }}>{k.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: k.valueColor, marginTop: 4 }}>{k.value}</div>
                  <div style={{ fontSize: 11.5, color: secondaryText, marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${border}` }}>
              {[["overview", "Overview"], ["vehicles", "Vehicles (24)"], ["drivers", "Drivers (18)"], ["weighments", "Recent Weighments"], ["documents", "Documents"], ["history", "Activity Timeline"]].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: activeTab === key ? 800 : 500, color: activeTab === key ? primaryOrange : mutedText, background: "none", border: "none", borderBottom: activeTab === key ? `2.5px solid ${primaryOrange}` : "2.5px solid transparent", cursor: "pointer", marginBottom: -1 }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
                  {/* Left Column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Customer Information Card */}
                    <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Customer Information</h3>
                        <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>Basic company identification and business details.</div>
                      </div>
                      <div style={{ padding: "0 20px 8px" }}>
                        <InfoRow label="Company Name" value="Metro Builders Ltd" />
                        <InfoRow label="Customer ID" value="CUS-00124" accent={primaryOrange} />
                        <InfoRow label="Customer Type" value="Commercial Company" />
                        <InfoRow label="Primary Contact" value="Arun Kumar" />
                        <InfoRow label="Phone Number" value="+91 98400 12345" />
                        <InfoRow label="Email Address" value="contact@metrobuilders.com" />
                        <InfoRow label="Business Address" value="No. 45 Industrial Estate, Guindy, Chennai, Tamil Nadu" />
                        <InfoRow label="Tax / Business ID (GSTIN)" value="33ABCDE1234F1Z5" accent={secondaryGold} />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Weighbridge Activity Card */}
                    <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, padding: 20 }}>
                      <h3 style={{ margin: "0 0 14px 0", fontSize: 14, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>WEIGHBRIDGE ACTIVITY</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                          { wb: "WB-01 (Main Gate)", count: "846 weighments", active: true },
                          { wb: "WB-02 (North Gate)", count: "302 weighments", active: true },
                          { wb: "WB-03 (Loading Yard)", count: "100 weighments", active: true },
                          { wb: "WB-04 (Dispatch Gate)", count: "—", active: false },
                          { wb: "WB-05 (Raw Material)", count: "—", active: false },
                        ].map(st => (
                          <div key={st.wb} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, fontSize: 12.5 }}>
                            <span style={{ fontWeight: 700, color: primaryText }}>{st.wb}</span>
                            <span style={{ fontSize: 11.5, color: st.active ? primaryOrange : mutedText, fontWeight: st.active ? 700 : 400 }}>{st.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Material Activity Card */}
                    <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, padding: 20 }}>
                      <h3 style={{ margin: "0 0 14px 0", fontSize: 14, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>MOST USED MATERIALS</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                          { name: "Gravel", count: "486 weighments", weight: "12,400 TON" },
                          { name: "Sand", count: "328 weighments", weight: "8,150 TON" },
                          { name: "M-Sand", count: "241 weighments", weight: "5,300 TON" },
                          { name: "Cement", count: "193 weighments", weight: "2,600 TON" },
                        ].map(m => (
                          <div key={m.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 0", borderBottom: `1px solid ${divider}` }}>
                            <div>
                              <div style={{ fontWeight: 700, color: primaryText }}>{m.name}</div>
                              <div style={{ fontSize: 11, color: mutedText }}>{m.count}</div>
                            </div>
                            <span style={{ fontWeight: 800, color: secondaryGold }}>{m.weight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === "vehicles" && (
              <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Assigned Vehicles</h3>
                    <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>24 vehicles associated with Metro Builders Ltd.</div>
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                  <thead>
                    <tr>
                      {["Vehicle #", "Type", "Driver", "Weighbridge", "Last Weighment", "Status", "Action"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {VEHICLES.map(v => (
                      <tr key={v.no} style={{ cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = dm ? "#273449" : "#F8FAFC")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <td style={tdStyle}><span style={{ color: primaryOrange, fontWeight: 700, fontFamily: "monospace" }}>{v.no}</span></td>
                        <td style={tdStyle}>{v.type}</td>
                        <td style={tdStyle}>{v.driver}</td>
                        <td style={tdStyle}><span style={{ padding: "3px 8px", borderRadius: 6, background: primaryOrangeSoft, color: primaryOrange, fontSize: 11, fontWeight: 700 }}>{v.wb}</span></td>
                        <td style={tdStyle}>{v.lastUsed}</td>
                        <td style={tdStyle}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: v.status === "ACTIVE" ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : elevated, color: v.status === "ACTIVE" ? statusSuccess : mutedText }}>● {v.status}</span></td>
                        <td style={tdStyle}>
                          <button onClick={() => onNavigate("vehicle-detail")} style={{ height: 32, padding: "0 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Details →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Drivers Tab */}
            {activeTab === "drivers" && (
              <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Assigned Drivers</h3>
                    <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>18 drivers associated with Metro Builders Ltd.</div>
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                  <thead>
                    <tr>
                      {["Driver", "Driver ID", "Vehicle", "License Status", "Last Weighment", "Status", "Action"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {DRIVERS.map(d => (
                      <tr key={d.id} style={{ cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = dm ? "#273449" : "#F8FAFC")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <td style={tdStyle}><span style={{ fontWeight: 700, color: primaryText }}>{d.name}</span></td>
                        <td style={tdStyle}><span style={{ color: primaryOrange, fontWeight: 700, fontFamily: "monospace" }}>{d.id}</span></td>
                        <td style={tdStyle}><span style={{ fontFamily: "monospace", fontWeight: 700 }}>{d.vehicle}</span></td>
                        <td style={tdStyle}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: d.licenseStatus === "VALID" ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : (dm ? "rgba(245,158,11,0.15)" : "#FFFBEB"), color: d.licenseStatus === "VALID" ? statusSuccess : statusWarning }}>● {d.licenseStatus}</span></td>
                        <td style={tdStyle}>{d.lastUsed}</td>
                        <td style={tdStyle}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● {d.status}</span></td>
                        <td style={tdStyle}>
                          <button onClick={() => onNavigate("driver-detail")} style={{ height: 32, padding: "0 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Details →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Recent Weighments Tab */}
            {activeTab === "weighments" && (
              <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Recent Weighments</h3>
                    <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>1,248 total transactions for Metro Builders Ltd.</div>
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                  <thead>
                    <tr>
                      {["Ticket #", "Vehicle", "Driver", "Material", "Gross", "Tare", "Net", "Weighbridge", "Date", "Status"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {WEIGHMENTS_HISTORY.map((row, i) => (
                      <tr key={i} style={{ cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = dm ? "#273449" : "#F8FAFC")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <td style={tdStyle}><span style={{ color: primaryOrange, fontWeight: 700, fontFamily: "monospace" }}>{row.ticket}</span></td>
                        <td style={tdStyle}><span style={{ fontFamily: "monospace", fontWeight: 700 }}>{row.vehicle}</span></td>
                        <td style={tdStyle}>{row.driver}</td>
                        <td style={tdStyle}>{row.material}</td>
                        <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}>{row.gross}</td>
                        <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}>{row.tare}</td>
                        <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums", fontWeight: 700, color: secondaryGold }}>{row.net}</td>
                        <td style={tdStyle}><span style={{ padding: "3px 8px", borderRadius: 6, background: primaryOrangeSoft, color: primaryOrange, fontSize: 11, fontWeight: 700 }}>{row.wb}</span></td>
                        <td style={tdStyle}>{row.date}</td>
                        <td style={tdStyle}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● {row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Customer Documents</h3>
                    <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>Legal and compliance documentation.</div>
                  </div>
                  {role === "admin" && (
                    <button style={{ height: 36, padding: "0 14px", borderRadius: 8, background: primaryOrangeSoft, border: `1px solid ${primaryOrange}`, color: primaryOrange, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>+ Upload Document</button>
                  )}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                  <thead>
                    <tr>{["Document", "Type", "Uploaded Date", "Status", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {DOCUMENTS.map(doc => (
                      <tr key={doc.name}>
                        <td style={tdStyle}><span style={{ fontWeight: 700 }}>{doc.name}</span></td>
                        <td style={tdStyle}>{doc.type}</td>
                        <td style={tdStyle}>{doc.uploaded}</td>
                        <td style={tdStyle}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● {doc.status}</span></td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: secondaryText, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>View</button>
                            <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: secondaryText, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Download</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, padding: 24 }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: 16, fontWeight: 800, color: primaryText }}>Customer Activity Timeline</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {TIMELINE.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 999, background: primaryOrange, marginTop: 4 }} />
                        {idx < TIMELINE.length - 1 && <div style={{ width: 2, height: 32, background: border, marginTop: 4 }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: primaryText }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: secondaryText, marginTop: 2 }}>{item.desc}</div>
                        <div style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderMobile() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText, display: "flex", flexDirection: "column" }}>
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F9FAFB" }}>CUSTOMER DETAIL</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setViewDevice("desktop")} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>💻</button>
            <button onClick={onToggleDark} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>{dm ? "☀️" : "🌙"}</button>
          </div>
        </header>

        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 40px" }}>
          <div style={{ width: 390, minHeight: 844, background: surface, borderRadius: 24, border: `1px solid ${border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={() => onNavigate("customers")} style={{ background: "none", border: 0, color: primaryOrange, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>← Customers</button>
              <span style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>Customer Detail</span>
              {role === "admin" ? <button onClick={() => alert("Opening Add/Edit Customer Screen 34")} style={{ background: "none", border: 0, color: primaryOrange, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Edit</button> : <span style={{ width: 40 }} />}
            </div>

            <div style={{ overflowY: "auto", padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Profile Card */}
              <div style={{ background: elevated, borderRadius: 14, border: `1px solid ${border}`, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, background: primaryOrange, color: "#FFF", fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>MB</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: primaryText }}>Metro Builders Ltd</div>
                  <div style={{ fontSize: 12, color: mutedText }}>CUS-00124 · Commercial</div>
                  <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 800, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess, display: "inline-block", marginTop: 4 }}>● ACTIVE</span>
                </div>
              </div>

              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["VEHICLES", "24", primaryOrange], ["DRIVERS", "18", secondaryGold], ["WEIGHMENTS", "1,248", primaryText], ["NET WEIGHT", "28,450 T", statusSuccess]].map(([l, v, c]) => (
                  <div key={l} style={{ padding: 14, borderRadius: 12, background: elevated, border: `1px solid ${border}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: mutedText }}>{l}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c as string, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Info rows */}
              {[["Contact", "Arun Kumar"], ["Phone", "+91 98400 12345"], ["Email", "contact@metrobuilders.com"], ["GSTIN", "33ABCDE1234F1Z5"], ["City", "Chennai, Tamil Nadu"]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${divider}` }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: mutedText }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: primaryText }}>{val}</span>
                </div>
              ))}

              {/* Recent weighments */}
              <div style={{ background: elevated, borderRadius: 12, border: `1px solid ${border}`, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, marginBottom: 12, letterSpacing: "0.06em" }}>RECENT WEIGHMENTS</div>
                {WEIGHMENTS_HISTORY.slice(0, 3).map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${divider}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: primaryOrange, fontFamily: "monospace" }}>{row.ticket}</div>
                      <div style={{ fontSize: 11, color: mutedText }}>{row.vehicle} · {row.material}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: secondaryGold, fontVariantNumeric: "tabular-nums" }}>{row.net}</div>
                      <div style={{ fontSize: 11, color: statusSuccess }}>● COMPLETED</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
