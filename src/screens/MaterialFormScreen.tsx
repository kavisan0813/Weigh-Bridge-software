import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";

interface Props {
  mode: "add" | "edit";
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function MaterialFormScreen({ mode, darkMode: dm, onToggleDark, onLogout, onNavigate }: Props) {
  // Master Design System Color Tokens
  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const elevated = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E2E8F0";
  const divider = dm ? "#374151" : "#F1F5F9";
  const inputBg = dm ? "#111827" : "#FFFFFF";
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";

  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");

  // Form Fields State
  const [materialName, setMaterialName] = useState(mode === "edit" ? "Blue Metal 20mm" : "");
  const [materialCode, setMaterialCode] = useState(mode === "edit" ? "MAT-00041" : "MAT-00047");
  const [category, setCategory] = useState(mode === "edit" ? "Aggregates" : "Aggregates");
  const [unit, setUnit] = useState(mode === "edit" ? "TON" : "TON");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [description, setDescription] = useState(mode === "edit" ? "Standard 20mm crushed granite blue metal aggregate." : "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate("materials");
  };

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
                <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>
                  {mode === "add" ? "ADD MATERIAL" : "EDIT MATERIAL"}
                </h1>
                <p style={{ fontSize: 14, color: mutedText, margin: "2px 0 0 0" }}>
                  Configure material specifications, unit settings and weighbridge assignments.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="button" onClick={() => onNavigate("materials")} style={{ height: 44, padding: "0 20px", borderRadius: 8, background: elevated, color: primaryText, border: `1px solid ${border}`, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" form="material-form" style={{ height: 44, padding: "0 24px", borderRadius: 8, background: primaryOrange, color: "#FFFFFF", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>Save Material</button>
              </div>
            </header>

            {/* FORM CONTAINER */}
            <form id="material-form" onSubmit={handleSave} style={{ flex: 1, padding: "24px 32px 48px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>

              {/* SECTION 1: MATERIAL INFORMATION */}
              <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: primaryText, borderBottom: `1px solid ${divider}`, paddingBottom: 12 }}>MATERIAL INFORMATION</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>MATERIAL NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Blue Metal 20mm"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      style={inputStyle(border, inputBg, primaryText, primaryOrange)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>MATERIAL CODE *</label>
                    <input
                      type="text"
                      required
                      readOnly={mode === "add"}
                      value={materialCode}
                      onChange={(e) => setMaterialCode(e.target.value)}
                      style={{ ...inputStyle(border, inputBg, primaryText, primaryOrange), fontFamily: "monospace", color: primaryOrange, fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>CATEGORY *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={inputStyle(border, inputBg, primaryText, primaryOrange)}
                    >
                      <option value="Aggregates">Aggregates</option>
                      <option value="Sand">Sand</option>
                      <option value="Fines">Fines</option>
                      <option value="Raw Materials">Raw Materials</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>UNIT OF MEASURE *</label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      style={inputStyle(border, inputBg, primaryText, primaryOrange)}
                    >
                      <option value="TON">TON (Metric Tonne)</option>
                      <option value="KG">KG (Kilogram)</option>
                      <option value="CFT">CFT (Cubic Feet)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>STATUS</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      style={inputStyle(border, inputBg, primaryText, primaryOrange)}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ADDITIONAL INFORMATION */}
              <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: primaryText, borderBottom: `1px solid ${divider}`, paddingBottom: 12 }}>ADDITIONAL INFORMATION</h3>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>DESCRIPTION & OPERATIONAL NOTES</label>
                  <textarea
                    rows={3}
                    placeholder="Enter material specifications, density notes or handling guidelines..."
                    value={description}
                  />
                </div>
              </div>
            </form>
          </div>
    );
  }

  function renderMobileView() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, color: primaryText, padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>{mode === "add" ? "Add Material" : "Edit Material"}</h2>
        <button onClick={() => onNavigate("materials")} style={{ padding: "8px 16px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", marginTop: 12 }}>Back to Materials</button>
      </div>
    );
  }
}

// Input Focus Style Helper
const inputStyle = (border: string, inputBg: string, primaryText: string, primaryOrange: string): React.CSSProperties => ({
  width: "100%",
  height: 44,
  padding: "0 14px",
  borderRadius: 8,
  border: `1px solid ${border}`,
  background: inputBg,
  color: primaryText,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease",
});
