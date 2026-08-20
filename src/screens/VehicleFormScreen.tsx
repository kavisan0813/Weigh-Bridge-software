import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";
type FormMode = "add" | "edit";

interface Props {
  mode?: FormMode;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function VehicleFormScreen({ mode: initialMode = "add", darkMode, onToggleDark, onLogout, onNavigate }: Props) {
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
  const statusError = "#DC2626";

  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [mode, setMode] = useState<FormMode>(initialMode);

  // Form state
  const prefill = mode === "edit";
  const [vehicleNo, setVehicleNo] = useState(prefill ? "TN22GH3456" : "");
  const [regNo, setRegNo] = useState(prefill ? "TN22GH3456" : "");
  const [vehicleType, setVehicleType] = useState(prefill ? "Heavy Truck" : "Heavy Truck");
  const [category, setCategory] = useState(prefill ? "Commercial" : "Commercial");
  const [make, setMake] = useState(prefill ? "Tata" : "");
  const [model, setModel] = useState(prefill ? "Prima 2830.K" : "");
  const [year, setYear] = useState(prefill ? "2023" : "2023");
  const [fuel, setFuel] = useState(prefill ? "Diesel" : "Diesel");
  const [tare, setTare] = useState(prefill ? "13450" : "");
  const [capacity, setCapacity] = useState(prefill ? "25000" : "");
  const [status, setStatus] = useState(prefill ? "ACTIVE" : "ACTIVE");
  const [driver, setDriver] = useState(prefill ? "Arun Kumar" : "");
  const [customer, setCustomer] = useState(prefill ? "Metro Builders Ltd" : "");
  const [notes, setNotes] = useState(prefill ? "Vehicle regularly operates between WB-01 and WB-02." : "");
  const [wbAccess, setWbAccess] = useState<Record<string, boolean>>({ "WB-01": true, "WB-02": true, "WB-03": prefill, "WB-04": false, "WB-05": false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showDiscard, setShowDiscard] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const dirty = () => setHasUnsaved(true);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!vehicleNo.trim()) e.vehicleNo = "Vehicle number is required.";
    if (!tare.trim()) e.tare = "Registered tare weight is required.";
    if (!capacity.trim()) e.capacity = "Maximum capacity is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsaved(false);
      showToast(mode === "add" ? "✓ Vehicle added successfully." : "✓ Vehicle updated successfully.");
      setTimeout(() => onNavigate("vehicle-detail"), 1000);
    }, 1500);
  };

  const handleCancel = () => {
    if (hasUnsaved) { setShowDiscard(true); return; }
    onNavigate(mode === "edit" ? "vehicle-detail" : "vehicles");
  };

  // Shared input style
  const inputStyle = (err?: string): React.CSSProperties => ({
    width: "100%", height: 42, borderRadius: 8, padding: "0 12px",
    background: inputBg, color: primaryText, border: `1.5px solid ${err ? statusError : border}`,
    fontSize: 13, outline: "none", boxSizing: "border-box",
  });

  const selectStyle: React.CSSProperties = {
    width: "100%", height: 42, borderRadius: 8, padding: "0 12px",
    background: inputBg, color: primaryText, border: `1.5px solid ${border}`,
    fontSize: 13, outline: "none", cursor: "pointer", boxSizing: "border-box",
  };

  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <div style={{ fontSize: 11.5, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>
      {text}{required && <span style={{ color: statusError, marginLeft: 2 }}>*</span>}
    </div>
  );

  const FieldErr = ({ msg }: { msg?: string }) => msg ? (
    <div style={{ fontSize: 11.5, color: statusError, marginTop: 4 }}>⚠ {msg}</div>
  ) : null;

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div style={{ padding: "14px 24px", borderBottom: `1px solid ${border}` }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: primaryText }}>{title}</h3>
      {subtitle && <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );

  const G2 = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>
  );

  const F = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
  );

  if (role === "operator") {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText }}>
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#F9FAFB", fontWeight: 700, fontSize: 13 }}>ADD / EDIT VEHICLE</span>
          <button onClick={() => setRole("admin")} style={{ padding: "3px 9px", borderRadius: 4, background: secondaryGold, border: "none", color: "#FFF", fontSize: 11, cursor: "pointer" }}>Switch to Admin</button>
        </header>
        <div style={{ maxWidth: 1440, margin: "0 auto", background: surface, minHeight: "calc(100vh - 49px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 900 }}>ACCESS RESTRICTED</h2>
            <p style={{ color: secondaryText, fontSize: 13.5, marginBottom: 20 }}>You do not have permission to manage vehicle information.</p>
            <button onClick={() => onNavigate("vehicles")} style={{ height: 42, padding: "0 24px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>← Back to Vehicles</button>
          </div>
        </div>
      </div>
    );
  }

  if (viewDevice === "mobile") return renderMobile();
  return renderDesktop();

  function renderDesktop() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText, display: "flex", flexDirection: "column" }}>
        {toast && <div style={{ position: "fixed", top: 20, right: 24, zIndex: 1200, background: primaryOrange, color: "#FFF", padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>{toast}</div>}
        {showDiscard && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 420, background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: 28 }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 900 }}>Discard Changes?</h3>
              <p style={{ margin: "0 0 20px 0", fontSize: 13.5, color: secondaryText }}>You have unsaved changes. Are you sure you want to leave?</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowDiscard(false)} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue Editing</button>
                <button onClick={() => { setShowDiscard(false); onNavigate(mode === "edit" ? "vehicle-detail" : "vehicles"); }} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: statusError, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Discard Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Testing Bar */}
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => onNavigate("vehicles")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#FFF", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>← Vehicles</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>SCREEN 28 — {mode === "add" ? "ADD" : "EDIT"} VEHICLE</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6, gap: 2 }}>
              {(["desktop", "mobile"] as ViewDevice[]).map(d => (
                <button key={d} onClick={() => setViewDevice(d)} style={{ padding: "3px 9px", borderRadius: 4, border: "none", background: viewDevice === d ? primaryOrange : "transparent", color: viewDevice === d ? "#FFF" : "#94A3B8", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{d === "desktop" ? "💻" : "📲"} {d}</button>
              ))}
            </div>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6, gap: 2 }}>
              {(["add", "edit"] as FormMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{ padding: "3px 9px", borderRadius: 4, border: "none", background: mode === m ? secondaryGold : "transparent", color: mode === m ? "#FFF" : "#94A3B8", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{m === "add" ? "Add Mode" : "Edit Mode"}</button>
              ))}
            </div>
            <button onClick={onToggleDark} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#F9FAFB", fontSize: 11, cursor: "pointer" }}>{dm ? "☀️" : "🌙"}</button>
          </div>
        </header>

        <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column" }}>

          {/* Page Header */}
          <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 11, color: mutedText, fontWeight: 600, marginBottom: 2, display: "flex", gap: 6 }}>
                <button onClick={() => onNavigate("vehicles")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Vehicles</button>
                {mode === "edit" && <><span>/</span><button onClick={() => onNavigate("vehicle-detail")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Vehicle Detail</button></>}
                <span>/</span>
                <span style={{ color: primaryOrange }}>{mode === "add" ? "Add Vehicle" : "Edit Vehicle"}</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>{mode === "add" ? "Add Vehicle" : "Edit Vehicle"}</h1>
              <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>
                {mode === "add" ? "Register a new vehicle for weighbridge operations." : "Update vehicle information, tare weight and assignments."}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {mode === "edit" && (
                <button style={{ height: 42, padding: "0 14px", borderRadius: 8, background: dm ? "rgba(220,38,38,0.12)" : "#FEF2F2", color: statusError, border: "1px solid #FECACA", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Deactivate</button>
              )}
              <button onClick={handleCancel} style={{ height: 42, padding: "0 18px", borderRadius: 8, background: elevated, color: primaryText, fontSize: 13, fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={isSaving} style={{ height: 42, padding: "0 24px", borderRadius: 8, background: isSaving ? mutedText : primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: isSaving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", opacity: isSaving ? 0.8 : 1 }}>
                {isSaving ? "Saving..." : mode === "add" ? "Add Vehicle" : "Save Changes"}
              </button>
            </div>
          </header>

          {/* Edit Mode Audit Strip */}
          {mode === "edit" && (
            <div style={{ padding: "10px 32px", background: secondaryGoldSoft, borderBottom: `1px solid ${border}`, display: "flex", gap: 20, fontSize: 12.5 }}>
              <span style={{ color: secondaryGold, fontWeight: 700 }}>ℹ Last Updated:</span>
              <span style={{ color: secondaryText }}>19 Aug 2026, 10:42 AM</span>
              <span style={{ color: mutedText }}>•</span>
              <span style={{ color: secondaryText }}>Updated by <strong style={{ color: primaryText }}>Admin</strong></span>
              <span style={{ color: mutedText }}>•</span>
              <span style={{ color: secondaryText }}>Vehicle: <strong style={{ color: primaryOrange }}>TN22GH3456</strong></span>
            </div>
          )}

          {/* Form Body */}
          <div style={{ flex: 1, padding: "32px 32px 48px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

              {/* LEFT — Main Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Vehicle Information */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <SectionHeader title="Vehicle Information" subtitle="Basic identification and registration details." />
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    <G2>
                      <F>
                        <Label text="Vehicle Number" required />
                        <input value={vehicleNo} onChange={e => { setVehicleNo(e.target.value); dirty(); }} placeholder="TN22GH3456" style={inputStyle(errors.vehicleNo)} onFocus={e => e.target.style.borderColor = primaryOrange} onBlur={e => e.target.style.borderColor = errors.vehicleNo ? statusError : border} />
                        {!errors.vehicleNo && vehicleNo && <div style={{ fontSize: 11.5, color: statusSuccess, marginTop: 4 }}>✓ Vehicle number available</div>}
                        <FieldErr msg={errors.vehicleNo} />
                      </F>
                      <F>
                        <Label text="Registration Number" required />
                        <input value={regNo} onChange={e => { setRegNo(e.target.value); dirty(); }} placeholder="TN22GH3456" style={inputStyle()} onFocus={e => e.target.style.borderColor = primaryOrange} onBlur={e => e.target.style.borderColor = border} />
                      </F>
                    </G2>
                    <G2>
                      <F>
                        <Label text="Vehicle Type" />
                        <select value={vehicleType} onChange={e => { setVehicleType(e.target.value); dirty(); }} style={selectStyle}>
                          {["Heavy Truck", "Medium Truck", "Light Vehicle", "Trailer", "Tanker", "Other"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </F>
                      <F>
                        <Label text="Category" />
                        <select value={category} onChange={e => { setCategory(e.target.value); dirty(); }} style={selectStyle}>
                          {["Commercial", "Private", "Government"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </F>
                    </G2>
                    <G2>
                      <F>
                        <Label text="Make" />
                        <input value={make} onChange={e => { setMake(e.target.value); dirty(); }} placeholder="Tata" style={inputStyle()} onFocus={e => e.target.style.borderColor = primaryOrange} onBlur={e => e.target.style.borderColor = border} />
                      </F>
                      <F>
                        <Label text="Model" />
                        <input value={model} onChange={e => { setModel(e.target.value); dirty(); }} placeholder="Prima 2830.K" style={inputStyle()} onFocus={e => e.target.style.borderColor = primaryOrange} onBlur={e => e.target.style.borderColor = border} />
                      </F>
                    </G2>
                    <G2>
                      <F>
                        <Label text="Manufacture Year" />
                        <select value={year} onChange={e => { setYear(e.target.value); dirty(); }} style={selectStyle}>
                          {["2024", "2023", "2022", "2021", "2020", "2019", "2018"].map(y => <option key={y}>{y}</option>)}
                        </select>
                      </F>
                      <F>
                        <Label text="Fuel Type" />
                        <select value={fuel} onChange={e => { setFuel(e.target.value); dirty(); }} style={selectStyle}>
                          {["Diesel", "Petrol", "CNG", "Electric"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </F>
                    </G2>
                  </div>
                </div>

                {/* Tare Weight */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <SectionHeader title="Tare Weight & Capacity" subtitle="Weight configuration for accurate net weight calculation." />
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    <G2>
                      <F>
                        <Label text="Registered Tare (KG)" required />
                        <input value={tare} onChange={e => { setTare(e.target.value); dirty(); }} placeholder="13450" type="number" style={inputStyle(errors.tare)} onFocus={e => e.target.style.borderColor = primaryOrange} onBlur={e => e.target.style.borderColor = errors.tare ? statusError : border} />
                        <FieldErr msg={errors.tare} />
                      </F>
                      <F>
                        <Label text="Maximum Capacity (KG)" required />
                        <input value={capacity} onChange={e => { setCapacity(e.target.value); dirty(); }} placeholder="25000" type="number" style={inputStyle(errors.capacity)} onFocus={e => e.target.style.borderColor = primaryOrange} onBlur={e => e.target.style.borderColor = errors.capacity ? statusError : border} />
                        <FieldErr msg={errors.capacity} />
                      </F>
                    </G2>
                    <div style={{ padding: 14, background: dm ? "rgba(201,154,46,0.1)" : "#FFFBEB", borderRadius: 10, border: `1px solid ${secondaryGold}`, fontSize: 12.5, color: secondaryText }}>
                      <span style={{ color: secondaryGold, fontWeight: 700 }}>ⓘ Tare Weight Note: </span>
                      Registered tare is used as the default. Actual tare is re-measured per weighment cycle.
                    </div>
                  </div>
                </div>

                {/* Weighbridge Access */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <SectionHeader title="Weighbridge Access" subtitle="Select which weighbridges this vehicle is permitted to use." />
                  <div style={{ padding: 24 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                      {Object.keys(wbAccess).map(wb => (
                        <label key={wb} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 14, borderRadius: 10, border: `1.5px solid ${wbAccess[wb] ? primaryOrange : border}`, background: wbAccess[wb] ? primaryOrangeSoft : elevated, cursor: "pointer" }}>
                          <input type="checkbox" checked={wbAccess[wb]} onChange={e => { setWbAccess(prev => ({ ...prev, [wb]: e.target.checked })); dirty(); }} style={{ display: "none" }} />
                          <div style={{ fontSize: 20 }}>⚖</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: wbAccess[wb] ? primaryOrange : primaryText }}>{wb}</div>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: wbAccess[wb] ? primaryOrange : mutedText }}>{wbAccess[wb] ? "✓ ALLOWED" : "BLOCKED"}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <SectionHeader title="Notes" />
                  <div style={{ padding: 24 }}>
                    <textarea value={notes} rows={3} onChange={e => { setNotes(e.target.value); dirty(); }} placeholder="Enter additional information about this vehicle..."
                      style={{ width: "100%", borderRadius: 8, padding: "12px 14px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                      onFocus={e => e.target.style.borderColor = primaryOrange} onBlur={e => e.target.style.borderColor = border}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT — Secondary */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Vehicle Status */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}` }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>VEHICLE STATUS</h3>
                  </div>
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    {(["ACTIVE", "INACTIVE", "SUSPENDED"] as const).map(s => {
                      const sc = s === "ACTIVE" ? statusSuccess : s === "INACTIVE" ? mutedText : "#F59E0B";
                      return (
                        <button key={s} onClick={() => { setStatus(s); dirty(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${status === s ? sc : border}`, background: status === s ? (dm ? `${sc}18` : `${sc}10`) : elevated, cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${status === s ? sc : border}`, background: status === s ? sc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {status === s && <div style={{ width: 7, height: 7, borderRadius: 999, background: "#FFF" }} />}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: status === s ? sc : primaryText }}>● {s}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assign Driver */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}` }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>ASSIGNED DRIVER</h3>
                  </div>
                  <div style={{ padding: 16 }}>
                    <select value={driver} onChange={e => { setDriver(e.target.value); dirty(); }} style={selectStyle}>
                      <option value="">No driver assigned</option>
                      {["Arun Kumar", "Ravi Sharma", "Suresh Kumar", "Manoj Kumar"].map(d => <option key={d}>{d}</option>)}
                    </select>
                    {driver && (
                      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, padding: 12, background: primaryOrangeSoft, borderRadius: 8, border: `1px solid ${primaryOrange}` }}>
                        <div style={{ width: 32, height: 32, borderRadius: 999, background: primaryOrange, color: "#FFF", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>AK</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: primaryText }}>{driver}</div>
                          <div style={{ fontSize: 11, color: statusSuccess }}>● ACTIVE</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}` }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>CUSTOMER / COMPANY</h3>
                  </div>
                  <div style={{ padding: 16 }}>
                    <select value={customer} onChange={e => { setCustomer(e.target.value); dirty(); }} style={selectStyle}>
                      <option value="">No customer assigned</option>
                      {["Metro Builders Ltd", "ABC Construction", "XYZ Logistics", "Kumar Traders"].map(c => <option key={c}>{c}</option>)}
                    </select>
                    {customer && (
                      <div style={{ marginTop: 12, padding: 10, background: secondaryGoldSoft, borderRadius: 8, border: `1px solid ${secondaryGold}`, fontSize: 12, color: secondaryText }}>
                        <div style={{ fontWeight: 700, color: primaryText }}>{customer}</div>
                        <div style={{ marginTop: 2 }}>Business • +91 98400 12345</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Unsaved warning */}
                {hasUnsaved && (
                  <div style={{ padding: 14, borderRadius: 10, background: dm ? "rgba(245,158,11,0.12)" : "#FFFBEB", border: "1px solid #FDE68A", fontSize: 12.5, color: "#F59E0B", fontWeight: 600 }}>
                    ⚠ You have unsaved changes.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div style={{ padding: "18px 0 0", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={handleCancel} style={{ height: 42, padding: "0 20px", borderRadius: 8, background: elevated, color: primaryText, border: `1px solid ${border}`, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={isSaving} style={{ height: 42, padding: "0 28px", borderRadius: 8, background: isSaving ? mutedText : primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: isSaving ? "not-allowed" : "pointer" }}>
                {isSaving ? "Saving..." : mode === "add" ? "Add Vehicle" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderMobile() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText, display: "flex", flexDirection: "column" }}>
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F9FAFB" }}>SCREEN 28 — {mode === "add" ? "ADD" : "EDIT"} VEHICLE</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setViewDevice("desktop")} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>💻</button>
            <button onClick={onToggleDark} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>{dm ? "☀️" : "🌙"}</button>
          </div>
        </header>
        {toast && <div style={{ position: "fixed", top: 20, right: 16, zIndex: 1200, background: primaryOrange, color: "#FFF", padding: "12px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}>{toast}</div>}
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 40px" }}>
          <div style={{ width: 390, minHeight: 844, background: surface, borderRadius: 24, border: `1px solid ${border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Mobile Page Header */}
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={handleCancel} style={{ background: "none", border: 0, color: primaryOrange, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>← {mode === "edit" ? "Vehicle Detail" : "Vehicles"}</button>
              <span style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>{mode === "add" ? "Add Vehicle" : "Edit Vehicle"}</span>
              <span style={{ width: 60 }} />
            </div>
            <div style={{ overflowY: "auto", padding: "16px 16px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Section helper */}
              {(["Vehicle Number *", "Registration No.", "Make", "Model", "Max Capacity (KG)", "Registered Tare (KG)"] as const).map((label, i) => {
                const vals = [vehicleNo, regNo, make, model, capacity, tare];
                const setters = [setVehicleNo, setRegNo, setMake, setModel, setCapacity, setTare];
                return (
                  <div key={label}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>{label}</div>
                    <input value={vals[i]} onChange={e => { setters[i](e.target.value); dirty(); }}
                      style={{ width: "100%", height: 48, borderRadius: 8, padding: "0 14px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = primaryOrange}
                      onBlur={e => e.target.style.borderColor = border}
                    />
                  </div>
                );
              })}
              {[["Vehicle Type", vehicleType, setVehicleType, ["Heavy Truck", "Medium Truck", "Light Vehicle", "Trailer"]],
                ["Fuel Type", fuel, setFuel, ["Diesel", "Petrol", "CNG"]],
                ["Status", status, setStatus, ["ACTIVE", "INACTIVE"]],
              ].map(([label, val, setter, opts]) => (
                <div key={label as string}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>{label as string}</div>
                  <select value={val as string} onChange={e => { (setter as (v: string) => void)(e.target.value); dirty(); }} style={{ ...selectStyle, height: 48, fontSize: 14 }}>
                    {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>Notes</div>
                <textarea value={notes} rows={3} onChange={e => { setNotes(e.target.value); dirty(); }} style={{ width: "100%", borderRadius: 8, padding: "12px 14px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }} onFocus={e => e.target.style.borderColor = primaryOrange} onBlur={e => e.target.style.borderColor = border} />
              </div>
            </div>
            {/* Sticky Actions */}
            <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, background: surface, borderTop: `1px solid ${border}`, padding: "12px 16px", display: "flex", gap: 10 }}>
              <button onClick={handleCancel} style={{ height: 48, flex: "0 0 90px", borderRadius: 10, background: elevated, color: primaryText, border: `1px solid ${border}`, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={isSaving} style={{ height: 48, flex: 1, borderRadius: 10, background: primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                {isSaving ? "Saving..." : mode === "add" ? "ADD VEHICLE" : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
