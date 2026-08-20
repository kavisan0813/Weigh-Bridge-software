import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const HISTORY = [
  { date: "19 Aug 2026", ticket: "WB-2026-00461", vehicle: "TN22GH3456", wb: "WB-01", gross: "38,500", tare: "13,450", net: "25,050", status: "COMPLETED", statusColor: "#16A34A" },
  { date: "18 Aug 2026", ticket: "WB-2026-00455", vehicle: "TN22GH3456", wb: "WB-01", gross: "37,800", tare: "13,450", net: "24,350", status: "COMPLETED", statusColor: "#16A34A" },
  { date: "18 Aug 2026", ticket: "WB-2026-00448", vehicle: "TN38AB7821", wb: "WB-02", gross: "39,200", tare: "13,500", net: "25,700", status: "COMPLETED", statusColor: "#16A34A" },
  { date: "17 Aug 2026", ticket: "WB-2026-00441", vehicle: "TN22GH3456", wb: "WB-01", gross: "36,900", tare: "13,400", net: "23,500", status: "COMPLETED", statusColor: "#16A34A" },
  { date: "17 Aug 2026", ticket: "WB-2026-00438", vehicle: "TN38AB7821", wb: "WB-03", gross: "38,100", tare: "13,450", net: "24,650", status: "COMPLETED", statusColor: "#16A34A" },
];

const VEHICLES = [
  { no: "TN22GH3456", type: "Heavy Truck", status: "ACTIVE", wb: "WB-01", lastUsed: "19 Aug 2026" },
  { no: "TN38AB7821", type: "Medium Truck", status: "ACTIVE", wb: "WB-02", lastUsed: "18 Aug 2026" },
];

const DOCS = [
  { name: "Driving License", status: "VALID", expiry: "15 Jan 2027" },
  { name: "Identity Proof (Aadhar)", status: "VALID", expiry: "Permanent" },
  { name: "Medical Certificate", status: "EXPIRING SOON", expiry: "30 Sep 2026" },
  { name: "Training Certificate", status: "NOT UPLOADED", expiry: "—" },
];

export default function DriverDetailScreen({ darkMode, onToggleDark, onLogout, onNavigate }: Props) {
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
              <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 900, color: primaryText }}>Deactivate Driver?</h3>
              <p style={{ margin: "0 0 8px 0", fontSize: 13.5, color: secondaryText }}>Arun Kumar will no longer be available for new weighbridge operations.</p>
              <p style={{ margin: "0 0 20px 0", fontSize: 12.5, color: mutedText }}>Historical transactions will remain available and unchanged.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowDeactivateModal(false)} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => setShowDeactivateModal(false)} style={{ height: 40, padding: "0 18px", borderRadius: 8, background: statusError, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Deactivate Driver</button>
              </div>
            </div>
          </div>
        )}



        <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 49px)" }}>

          {/* Page Header */}
          <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 11, color: mutedText, fontWeight: 600, marginBottom: 2, display: "flex", gap: 6 }}>
                <button onClick={() => onNavigate("drivers")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Drivers</button>
                <span>/</span>
                <span style={{ color: primaryOrange }}>Arun Kumar</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>Driver Detail</h1>
              <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>Complete driver information, license status and weighment activity.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {role === "admin" && (
                <>
                  <button onClick={() => setShowDeactivateModal(true)} style={{ height: 42, padding: "0 14px", borderRadius: 8, background: dm ? "rgba(220,38,38,0.12)" : "#FEF2F2", color: statusError, border: "1px solid #FECACA", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Deactivate</button>
                  <button onClick={() => onNavigate("driver-edit")} style={{ height: 42, padding: "0 18px", borderRadius: 8, background: primaryOrange, color: "#FFFFFF", fontSize: 13, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>✎ Edit Driver</button>
                  <button style={{ height: 42, padding: "0 14px", borderRadius: 8, background: surface, color: secondaryText, fontSize: 13, fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>••• More</button>
                </>
              )}
            </div>
          </header>

          {/* Body */}
          <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>

            {/* Driver Profile Card */}
            <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: primaryOrange, color: "#FFF", fontWeight: 900, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>AK</div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: primaryText }}>Arun Kumar</h2>
                  <div style={{ fontSize: 13, color: mutedText, marginTop: 2 }}>DRV-00124</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● ACTIVE</span>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: primaryOrangeSoft, color: primaryOrange }}>Heavy Vehicle License</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>CUSTOMER</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: primaryText, marginTop: 4 }}>Metro Builders Ltd</div>
                </div>
                <div style={{ width: 1, background: border }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>LAST WEIGHMENT</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: primaryText, marginTop: 4 }}>19 Aug 2026</div>
                </div>
                <div style={{ width: 1, background: border }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>LICENSE EXPIRY</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: statusSuccess, marginTop: 4 }}>15 Jan 2027</div>
                </div>
              </div>
            </div>

            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "TOTAL WEIGHMENTS", value: "248", valueColor: primaryOrange, sub: "All time" },
                { label: "THIS MONTH", value: "32", valueColor: secondaryGold, sub: "August 2026" },
                { label: "VEHICLES ASSIGNED", value: "2", valueColor: primaryText, sub: "Active vehicles" },
                { label: "COMPLETION RATE", value: "96.8%", valueColor: statusSuccess, sub: "Last 90 days" },
              ].map(k => (
                <div key={k.label} style={{ padding: 18, borderRadius: 12, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, letterSpacing: "0.05em" }}>{k.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: k.valueColor, marginTop: 4 }}>{k.value}</div>
                  <div style={{ fontSize: 11.5, color: secondaryText, marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${border}` }}>
              {[["overview", "Overview"], ["history", "Weighment History"], ["documents", "Documents"]].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: activeTab === key ? 800 : 500, color: activeTab === key ? primaryOrange : mutedText, background: "none", border: "none", borderBottom: activeTab === key ? `2.5px solid ${primaryOrange}` : "2.5px solid transparent", cursor: "pointer", marginBottom: -1 }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Two-column Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* Driver Information */}
                  <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}` }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Driver Information</h3>
                      <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>Basic details and contact information.</div>
                    </div>
                    <div style={{ padding: "0 20px 4px" }}>
                      <InfoRow label="Full Name" value="Arun Kumar" />
                      <InfoRow label="Driver ID" value="DRV-00124" accent={primaryOrange} />
                      <InfoRow label="Phone" value="+91 98765 43210" />
                      <InfoRow label="Email" value="arun@example.com" />
                      <InfoRow label="Date of Birth" value="15 Jan 1990" />
                      <InfoRow label="City / State" value="Chennai, Tamil Nadu" />
                      <InfoRow label="Customer" value="Metro Builders Ltd" accent={secondaryGold} />
                    </div>
                  </div>
                  {/* License Information */}
                  <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Driver License</h3>
                        <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>License and verification details.</div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● VALID</span>
                    </div>
                    <div style={{ padding: "0 20px 4px" }}>
                      <InfoRow label="License Number" value="TN-XX-XXXXXXXX" />
                      <InfoRow label="License Type" value="Heavy Vehicle" />
                      <InfoRow label="Issue Date" value="15 Jan 2024" />
                      <InfoRow label="Expiry Date" value="15 Jan 2027" accent={statusSuccess} />
                      <InfoRow label="Issuing Authority" value="Regional Transport Office" />
                      <InfoRow label="Verification" value="Verified" accent={statusSuccess} />
                    </div>
                  </div>
                </div>

                {/* Assigned Vehicles */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Assigned Vehicles</h3>
                      <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>2 vehicles assigned to this driver.</div>
                    </div>
                    {role === "admin" && (
                      <button onClick={() => onNavigate("driver-edit")} style={{ height: 36, padding: "0 14px", borderRadius: 8, background: primaryOrangeSoft, border: `1px solid ${primaryOrange}`, color: primaryOrange, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Manage Vehicles</button>
                    )}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                      <thead>
                        <tr>
                          {["Vehicle #", "Type", "Status", "Weighbridge", "Last Used", "Action"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {VEHICLES.map(v => (
                          <tr key={v.no} style={{ cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = dm ? "#273449" : "#F8FAFC")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <td style={tdStyle}><span style={{ color: primaryOrange, fontWeight: 700, fontFamily: "monospace" }}>{v.no}</span></td>
                            <td style={tdStyle}>{v.type}</td>
                            <td style={tdStyle}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● {v.status}</span></td>
                            <td style={tdStyle}><span style={{ padding: "3px 8px", borderRadius: 6, background: primaryOrangeSoft, color: primaryOrange, fontSize: 11, fontWeight: 700 }}>{v.wb}</span></td>
                            <td style={tdStyle}>{v.lastUsed}</td>
                            <td style={tdStyle}>
                              <button onClick={() => onNavigate("vehicle-detail")} style={{ height: 32, padding: "0 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>View →</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Weighment History</h3>
                    <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>248 total weighments by Arun Kumar.</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input placeholder="Search tickets..." style={{ height: 38, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 12.5, outline: "none" }} />
                    <select style={{ height: 38, padding: "0 10px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 12.5 }}>
                      <option>All Weighbridges</option>
                      <option>WB-01</option><option>WB-02</option><option>WB-03</option>
                    </select>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                    <thead>
                      <tr>
                        {["Date", "Ticket #", "Vehicle #", "Weighbridge", "Gross (KG)", "Tare (KG)", "Net (KG)", "Status"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {HISTORY.map((row, i) => (
                        <tr key={i} style={{ cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = dm ? "#273449" : "#F8FAFC")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <td style={tdStyle}>{row.date}</td>
                          <td style={tdStyle}><span style={{ color: primaryOrange, fontWeight: 700, fontFamily: "monospace" }}>{row.ticket}</span></td>
                          <td style={tdStyle}><span style={{ color: primaryText, fontWeight: 600, fontFamily: "monospace" }}>{row.vehicle}</span></td>
                          <td style={tdStyle}><span style={{ padding: "3px 8px", borderRadius: 6, background: primaryOrangeSoft, color: primaryOrange, fontSize: 11, fontWeight: 700 }}>{row.wb}</span></td>
                          <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{row.gross}</td>
                          <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}>{row.tare}</td>
                          <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums", fontWeight: 700, color: secondaryGold }}>{row.net}</td>
                          <td style={tdStyle}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● {row.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: "14px 20px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: mutedText }}>
                  <span>Showing 5 of 248 weighments</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["← Prev", "1", "2", "3", "Next →"].map(p => (
                      <button key={p} style={{ height: 32, padding: "0 10px", borderRadius: 6, border: `1px solid ${border}`, background: p === "1" ? primaryOrange : surface, color: p === "1" ? "#FFF" : primaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>Driver Documents</h3>
                    <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>License, identity, and compliance documents.</div>
                  </div>
                  {role === "admin" && <button style={{ height: 36, padding: "0 14px", borderRadius: 8, background: primaryOrangeSoft, border: `1px solid ${primaryOrange}`, color: primaryOrange, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>+ Upload Document</button>}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                  <thead>
                    <tr>{["Document", "Status", "Expiry Date", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {DOCS.map(doc => {
                      const color = doc.status === "VALID" ? statusSuccess : doc.status === "EXPIRING SOON" ? statusWarning : doc.status === "NOT UPLOADED" ? mutedText : statusError;
                      const bg2 = doc.status === "VALID" ? (dm ? "rgba(22,163,74,0.12)" : "#F0FDF4") : doc.status === "EXPIRING SOON" ? (dm ? "rgba(245,158,11,0.12)" : "#FFFBEB") : elevated;
                      return (
                        <tr key={doc.name}>
                          <td style={tdStyle}><span style={{ fontWeight: 700 }}>{doc.name}</span></td>
                          <td style={tdStyle}><span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: bg2, color }}>{doc.status !== "NOT UPLOADED" ? "● " : ""}{doc.status}</span></td>
                          <td style={{ ...tdStyle, color: doc.status === "EXPIRING SOON" ? statusWarning : primaryText, fontWeight: doc.status === "EXPIRING SOON" ? 700 : 400 }}>{doc.expiry}</td>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: 6 }}>
                              {doc.status !== "NOT UPLOADED" && <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: secondaryText, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>View</button>}
                              {role === "admin" && <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryOrange, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>{doc.status === "NOT UPLOADED" ? "Upload" : "Replace"}</button>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F9FAFB" }}>DRIVER DETAIL</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setViewDevice("desktop")} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>💻</button>
            <button onClick={onToggleDark} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>{dm ? "☀️" : "🌙"}</button>
          </div>
        </header>
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 40px" }}>
          <div style={{ width: 390, minHeight: 844, background: surface, borderRadius: 24, border: `1px solid ${border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={() => onNavigate("drivers")} style={{ background: "none", border: 0, color: primaryOrange, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>← Drivers</button>
              <span style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>Driver Detail</span>
              {role === "admin" ? <button onClick={() => onNavigate("driver-edit")} style={{ background: "none", border: 0, color: primaryOrange, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Edit</button> : <span style={{ width: 40 }} />}
            </div>
            <div style={{ overflowY: "auto", padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Profile */}
              <div style={{ background: elevated, borderRadius: 14, border: `1px solid ${border}`, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 999, background: primaryOrange, color: "#FFF", fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>AK</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: primaryText }}>Arun Kumar</div>
                  <div style={{ fontSize: 12, color: mutedText }}>DRV-00124 • Metro Builders</div>
                  <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 800, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess, display: "inline-block", marginTop: 4 }}>● ACTIVE</span>
                </div>
              </div>
              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["TOTAL WEIGHMENTS", "248", primaryOrange], ["THIS MONTH", "32", secondaryGold], ["VEHICLES", "2", primaryText], ["COMPLETION", "96.8%", statusSuccess]].map(([l, v, c]) => (
                  <div key={l} style={{ padding: 14, borderRadius: 12, background: elevated, border: `1px solid ${border}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: mutedText }}>{l}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: c as string, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Info rows */}
              {[["Phone", "+91 98765 43210"], ["License No.", "TN-XX-XXXXXXXX"], ["License Type", "Heavy Vehicle"], ["License Expiry", "15 Jan 2027"], ["City", "Chennai, Tamil Nadu"]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${divider}` }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: mutedText }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: primaryText }}>{val}</span>
                </div>
              ))}
              {/* Recent weighments */}
              <div style={{ background: elevated, borderRadius: 12, border: `1px solid ${border}`, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, marginBottom: 12, letterSpacing: "0.06em" }}>RECENT WEIGHMENTS</div>
                {HISTORY.slice(0, 3).map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${divider}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: primaryOrange, fontFamily: "monospace" }}>{row.ticket}</div>
                      <div style={{ fontSize: 11, color: mutedText }}>{row.date} • {row.wb}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: secondaryGold, fontVariantNumeric: "tabular-nums" }}>{row.net} KG</div>
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
