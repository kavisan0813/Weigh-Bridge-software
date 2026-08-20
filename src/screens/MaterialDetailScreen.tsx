import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function MaterialDetailScreen({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Props) {
  // Master Design System Color Tokens
  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const elevated = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E2E8F0";
  const divider = dm ? "#374151" : "#F1F5F9";
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const primaryOrangeSoft = dm ? "#273449" : "#FFF7ED";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";
  const secondaryGoldSoft = dm ? "#422F0A" : "#FFFBEB";

  const statusSuccess = "#16A34A";

  // State
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [activeTab, setActiveTab] = useState<"overview" | "suppliers" | "weighbridges" | "transactions">("overview");

  if (viewDevice === "mobile") {
    return renderMobileView();
  }

  return renderDesktopView();

  /* ─────────────────────────────────────────────────────────────────── */
  /*  DESKTOP VIEW                                                      */
  /* ─────────────────────────────────────────────────────────────────── */
  function renderDesktopView() {
    return (
      <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* PAGE HEADER */}
            <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 11, color: mutedText, fontWeight: 600, marginBottom: 2, display: "flex", gap: 6 }}>
                  <button onClick={() => onNavigate("materials")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Materials</button>
                  <span>/</span>
                  <span style={{ color: primaryOrange, fontFamily: "monospace", fontWeight: 700 }}>MAT-00041</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>
                  MATERIAL DETAIL
                </h1>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => onNavigate("materials")} style={{ height: 44, padding: "0 16px", borderRadius: 8, background: elevated, color: primaryText, border: `1px solid ${border}`, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Back to Materials</button>
                {role === "admin" && (
                  <button onClick={() => onNavigate("material-edit")} style={{ height: 44, padding: "0 20px", borderRadius: 8, background: primaryOrange, color: "#FFFFFF", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>✎ Edit Material</button>
                )}
              </div>
            </header>

            {/* PAGE CONTENT CONTAINER */}
            <div style={{ flex: 1, padding: "24px 32px 48px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>

              {/* MATERIAL PROFILE HEADER CARD */}
              <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 12, background: primaryOrangeSoft, border: `1px solid ${primaryOrange}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: primaryOrange }}>
                    BM
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: primaryText }}>Blue Metal 20mm</h2>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4", color: statusSuccess }}>● ACTIVE</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 13, color: mutedText, marginTop: 4 }}>
                      <span>Material ID: <strong style={{ color: primaryOrange, fontFamily: "monospace" }}>MAT-00041</strong></span>
                      <span>Category: <strong style={{ color: primaryText }}>Aggregates</strong></span>
                      <span>Measurement Unit: <strong style={{ color: secondaryGold, fontFamily: "monospace" }}>TON</strong></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 24, textAlign: "right" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, textTransform: "uppercase" }}>TOTAL WEIGHMENTS</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: secondaryGold, fontFamily: "monospace", marginTop: 2 }}>286</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, textTransform: "uppercase" }}>TOTAL NET WEIGHT</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: primaryOrange, fontFamily: "monospace", marginTop: 2 }}>8,420 TON</div>
                  </div>
                </div>
              </div>

              {/* TAB NAVIGATION */}
              <div style={{ display: "flex", gap: 8, borderBottom: `1px solid ${border}`, paddingBottom: 2 }}>
                {[
                  { key: "overview", label: "Overview & Specs" },
                  { key: "suppliers", label: "Associated Suppliers (18)" },
                  { key: "weighbridges", label: "Weighbridge Usage" },
                  { key: "transactions", label: "Recent Weighment Activity" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    style={{
                      padding: "10px 18px", borderRadius: "8px 8px 0 0", border: "none",
                      background: activeTab === tab.key ? primaryOrange : "transparent",
                      color: activeTab === tab.key ? "#FFFFFF" : secondaryText,
                      fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500, cursor: "pointer"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* OVERVIEW CONTENT SECTIONS */}
              {activeTab === "overview" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

                  {/* Material Information Card */}
                  <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 24 }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: primaryText }}>Material Specifications</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13 }}>
                      <div><span style={{ color: mutedText, fontSize: 11, fontWeight: 700, display: "block" }}>MATERIAL NAME</span><strong style={{ color: primaryText }}>Blue Metal 20mm</strong></div>
                      <div><span style={{ color: mutedText, fontSize: 11, fontWeight: 700, display: "block" }}>MATERIAL CODE</span><strong style={{ color: primaryOrange, fontFamily: "monospace" }}>MAT-00041</strong></div>
                      <div><span style={{ color: mutedText, fontSize: 11, fontWeight: 700, display: "block" }}>CATEGORY</span><strong style={{ color: primaryText }}>Aggregates</strong></div>
                      <div><span style={{ color: mutedText, fontSize: 11, fontWeight: 700, display: "block" }}>MEASUREMENT UNIT</span><strong style={{ color: secondaryGold, fontFamily: "monospace" }}>TON</strong></div>
                      <div><span style={{ color: mutedText, fontSize: 11, fontWeight: 700, display: "block" }}>DECIMAL PRECISION</span><strong style={{ color: primaryText }}>2 Decimals (0.01 TON)</strong></div>
                      <div><span style={{ color: mutedText, fontSize: 11, fontWeight: 700, display: "block" }}>STATUS</span><strong style={{ color: statusSuccess }}>Active</strong></div>
                    </div>
                  </div>

                  {/* Operational Settings Card */}
                  <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 24 }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: primaryText }}>Operational Description</h3>
                    <p style={{ margin: 0, fontSize: 13, color: secondaryText, lineHeight: 1.6 }}>
                      Standard 20mm crushed granite blue metal aggregate used for structural concrete mixes, road construction, and commercial slab foundations. Supplied across all active weighbridges (WB-01 to WB-05).
                    </p>
                  </div>

                </div>
              )}

              {/* SUPPLIERS TAB */}
              {activeTab === "suppliers" && (
                <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 24 }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: primaryText }}>Associated Suppliers</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    {["Southern Rocks Co", "Chennai Aggregates Pvt Ltd", "Deccan Quarry Works", "Kaveri Mining Corp", "Green Valley Materials", "Metro Stone Suppliers"].map((sup, i) => (
                      <div key={i} style={{ padding: 16, borderRadius: 8, background: elevated, border: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: primaryText }}>{sup}</div>
                          <div style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>Supplying: 20mm Aggregates</div>
                        </div>
                        <button onClick={() => onNavigate("supplier-detail")} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryOrange, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>View</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

          </div>
      </div>
    );
  }

  function renderMobileView() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, color: primaryText, padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Material Detail</h2>
        <button onClick={() => onNavigate("materials")} style={{ padding: "8px 16px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", marginTop: 12 }}>Back to Materials</button>
      </div>
    );
  }
}
