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

export default function DriverFormScreen({ mode: initialMode = "add", darkMode, onToggleDark, onLogout, onNavigate }: Props) {
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
  const [mode, setMode] = useState<FormMode>(initialMode);

  const prefill = mode === "edit";

  // Personal Information
  const [firstName, setFirstName] = useState(prefill ? "Arun" : "");
  const [lastName, setLastName] = useState(prefill ? "Kumar" : "");
  const [phone, setPhone] = useState(prefill ? "+91 98765 43210" : "");
  const [email, setEmail] = useState(prefill ? "arun@example.com" : "");
  const [dob, setDob] = useState(prefill ? "1990-01-15" : "");
  const [city, setCity] = useState(prefill ? "Chennai" : "");
  const [state, setState] = useState(prefill ? "Tamil Nadu" : "Tamil Nadu");
  const [notes, setNotes] = useState(prefill ? "Experienced driver for WB-01 and WB-02 routes." : "");

  // License Information
  const [licenseNo, setLicenseNo] = useState(prefill ? "TN-XX-XXXXXXXX" : "");
  const [licenseType, setLicenseType] = useState(prefill ? "Heavy Vehicle" : "Heavy Vehicle");
  const [licenseIssue, setLicenseIssue] = useState(prefill ? "2024-01-15" : "");
  const [licenseExpiry, setLicenseExpiry] = useState(prefill ? "2027-01-15" : "");
  const [issuingAuth, setIssuingAuth] = useState(prefill ? "Regional Transport Office" : "");

  // Assignment & Status
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED">(prefill ? "ACTIVE" : "ACTIVE");
  const [customer, setCustomer] = useState(prefill ? "Metro Builders Ltd" : "");
  const [vehicle1, setVehicle1] = useState(prefill ? "TN22GH3456" : "");
  const [vehicle2, setVehicle2] = useState(prefill ? "TN38AB7821" : "");

  // Uploaded documents
  const [docLicense, setDocLicense] = useState(prefill ? "driving_license.pdf" : "");
  const [docIdProof, setDocIdProof] = useState(prefill ? "aadhar_card.pdf" : "");
  const [docMedical, setDocMedical] = useState("");
  const [docTraining, setDocTraining] = useState(prefill ? "training_cert.pdf" : "");

  // Form control
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showDiscard, setShowDiscard] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [activeSection, setActiveSection] = useState<"personal" | "license" | "assignment" | "documents">("personal");

  const dirty = () => setHasUnsaved(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    if (!licenseNo.trim()) e.licenseNo = "License number is required.";
    if (!licenseExpiry) e.licenseExpiry = "License expiry date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setActiveSection("personal");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsaved(false);
      showToast(mode === "add" ? "✓ Driver added successfully." : "✓ Driver updated successfully.");
      setTimeout(() => onNavigate("driver-detail"), 1000);
    }, 1500);
  };

  const handleCancel = () => {
    if (hasUnsaved) { setShowDiscard(true); return; }
    onNavigate(mode === "edit" ? "driver-detail" : "drivers");
  };

  // Styles
  const inputStyle = (errKey?: string): React.CSSProperties => ({
    width: "100%", height: 42, borderRadius: 8, padding: "0 12px",
    background: inputBg, color: primaryText,
    border: `1.5px solid ${errKey && errors[errKey] ? statusError : border}`,
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

  const FieldErr = ({ errKey }: { errKey: string }) =>
    errors[errKey] ? <div style={{ fontSize: 11.5, color: statusError, marginTop: 4 }}>⚠ {errors[errKey]}</div> : null;

  const SectionCard = ({
    title, subtitle, children,
  }: { title: string; subtitle?: string; children: React.ReactNode }) => (
    <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
      <div style={{ padding: "14px 24px", borderBottom: `1px solid ${border}` }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: primaryText }}>{title}</h3>
        {subtitle && <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );

  const G2 = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>
  );

  const G3 = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>{children}</div>
  );

  const F = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
  );

  const SECTIONS: Array<{ key: typeof activeSection; label: string }> = [
    { key: "personal", label: "Personal Info" },
    { key: "license", label: "License" },
    { key: "assignment", label: "Assignment & Status" },
    { key: "documents", label: "Documents" },
  ];

  // Operator blocked
  if (role === "operator") {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText }}>
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#F9FAFB", fontWeight: 700, fontSize: 13 }}>{mode === "add" ? "ADD" : "EDIT"} DRIVER</span>
          <button onClick={() => setRole("admin")} style={{ padding: "3px 9px", borderRadius: 4, background: secondaryGold, border: "none", color: "#FFF", fontSize: 11, cursor: "pointer" }}>Switch to Admin</button>
        </header>
        <div style={{ maxWidth: 1440, margin: "0 auto", background: surface, minHeight: "calc(100vh - 49px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 900 }}>ACCESS RESTRICTED</h2>
            <p style={{ color: secondaryText, fontSize: 13.5, marginBottom: 20 }}>You do not have permission to manage driver information.</p>
            <button onClick={() => onNavigate("drivers")} style={{ height: 42, padding: "0 24px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>← Back to Drivers</button>
          </div>
        </div>
      </div>
    );
  }

  if (viewDevice === "mobile") return renderMobile();
  return renderDesktop();

  /* ─────────────────────────────────────────────────────────────────── */
  /*  DESKTOP LAYOUT                                                      */
  /* ─────────────────────────────────────────────────────────────────── */
  function renderDesktop() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText, display: "flex", flexDirection: "column" }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: "fixed", top: 20, right: 24, zIndex: 1200, background: primaryOrange, color: "#FFF", padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            {toast}
          </div>
        )}

        {/* Discard Modal */}
        {showDiscard && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 420, background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: 28 }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 900, color: primaryText }}>Discard Changes?</h3>
              <p style={{ margin: "0 0 20px 0", fontSize: 13.5, color: secondaryText }}>You have unsaved changes. This action cannot be undone.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowDiscard(false)} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue Editing</button>
                <button onClick={() => { setShowDiscard(false); onNavigate(mode === "edit" ? "driver-detail" : "drivers"); }} style={{ height: 40, padding: "0 18px", borderRadius: 8, background: statusError, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Discard Changes</button>
              </div>
            </div>
          </div>
        )}



        <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column" }}>

          {/* Page Header */}
          <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 11, color: mutedText, fontWeight: 600, marginBottom: 2, display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={() => onNavigate("drivers")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Drivers</button>
                {mode === "edit" && (
                  <>
                    <span>/</span>
                    <button onClick={() => onNavigate("driver-detail")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Arun Kumar</button>
                  </>
                )}
                <span>/</span>
                <span style={{ color: primaryOrange }}>{mode === "add" ? "Add Driver" : "Edit Driver"}</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>
                {mode === "add" ? "Add Driver" : "Edit Driver"}
              </h1>
              <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>
                {mode === "add"
                  ? "Register a new driver and assign vehicles and license information."
                  : "Update driver information, license details and vehicle assignments."}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {mode === "edit" && (
                <button style={{ height: 42, padding: "0 14px", borderRadius: 8, background: dm ? "rgba(220,38,38,0.12)" : "#FEF2F2", color: statusError, border: "1px solid #FECACA", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Deactivate
                </button>
              )}
              <button onClick={handleCancel} style={{ height: 42, padding: "0 18px", borderRadius: 8, background: elevated, color: primaryText, fontSize: 13, fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} style={{ height: 42, padding: "0 24px", borderRadius: 8, background: isSaving ? mutedText : primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: isSaving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", opacity: isSaving ? 0.8 : 1 }}>
                {isSaving ? "Saving..." : mode === "add" ? "Add Driver" : "Save Changes"}
              </button>
            </div>
          </header>

          {/* Edit Mode Audit Strip */}
          {mode === "edit" && (
            <div style={{ padding: "10px 32px", background: secondaryGoldSoft, borderBottom: `1px solid ${border}`, display: "flex", gap: 20, fontSize: 12.5, flexWrap: "wrap" }}>
              <span style={{ color: secondaryGold, fontWeight: 700 }}>ℹ Last Updated:</span>
              <span style={{ color: secondaryText }}>19 Aug 2026, 10:30 AM</span>
              <span style={{ color: mutedText }}>•</span>
              <span style={{ color: secondaryText }}>By <strong style={{ color: primaryText }}>Admin</strong></span>
              <span style={{ color: mutedText }}>•</span>
              <span style={{ color: secondaryText }}>Driver ID: <strong style={{ color: primaryOrange }}>DRV-00124</strong></span>
            </div>
          )}

          {/* Form Body */}
          <div style={{ flex: 1, padding: "32px 32px 48px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>

            {/* Section Navigation Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${border}` }}>
              {SECTIONS.map(sec => (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  style={{
                    padding: "10px 20px", fontSize: 13,
                    fontWeight: activeSection === sec.key ? 800 : 500,
                    color: activeSection === sec.key ? primaryOrange : mutedText,
                    background: "none", border: "none",
                    borderBottom: activeSection === sec.key ? `2.5px solid ${primaryOrange}` : "2.5px solid transparent",
                    cursor: "pointer", marginBottom: -1,
                  }}
                >
                  {sec.label}
                  {Object.keys(errors).length > 0 && sec.key === "personal" && (
                    <span style={{ marginLeft: 6, width: 6, height: 6, borderRadius: 999, background: statusError, display: "inline-block", verticalAlign: "middle" }} />
                  )}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

              {/* LEFT — Section Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* ── PERSONAL INFORMATION ── */}
                {activeSection === "personal" && (
                  <>
                    <SectionCard title="Personal Information" subtitle="Driver's name, contact and address details.">
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <G2>
                          <F>
                            <Label text="First Name" required />
                            <input value={firstName} onChange={e => { setFirstName(e.target.value); dirty(); }}
                              placeholder="Arun" style={inputStyle("firstName")}
                              onFocus={e => e.target.style.borderColor = primaryOrange}
                              onBlur={e => e.target.style.borderColor = errors.firstName ? statusError : border} />
                            <FieldErr errKey="firstName" />
                          </F>
                          <F>
                            <Label text="Last Name" required />
                            <input value={lastName} onChange={e => { setLastName(e.target.value); dirty(); }}
                              placeholder="Kumar" style={inputStyle("lastName")}
                              onFocus={e => e.target.style.borderColor = primaryOrange}
                              onBlur={e => e.target.style.borderColor = errors.lastName ? statusError : border} />
                            <FieldErr errKey="lastName" />
                          </F>
                        </G2>
                        <G2>
                          <F>
                            <Label text="Phone Number" required />
                            <input value={phone} onChange={e => { setPhone(e.target.value); dirty(); }}
                              placeholder="+91 98765 43210" style={inputStyle("phone")}
                              onFocus={e => e.target.style.borderColor = primaryOrange}
                              onBlur={e => e.target.style.borderColor = errors.phone ? statusError : border} />
                            <FieldErr errKey="phone" />
                          </F>
                          <F>
                            <Label text="Email Address" />
                            <input value={email} type="email" onChange={e => { setEmail(e.target.value); dirty(); }}
                              placeholder="arun@example.com" style={inputStyle()}
                              onFocus={e => e.target.style.borderColor = primaryOrange}
                              onBlur={e => e.target.style.borderColor = border} />
                          </F>
                        </G2>
                        <G2>
                          <F>
                            <Label text="Date of Birth" />
                            <input value={dob} type="date" onChange={e => { setDob(e.target.value); dirty(); }}
                              style={{ ...inputStyle(), cursor: "pointer" }}
                              onFocus={e => e.target.style.borderColor = primaryOrange}
                              onBlur={e => e.target.style.borderColor = border} />
                          </F>
                          <F>
                            <Label text="City" />
                            <input value={city} onChange={e => { setCity(e.target.value); dirty(); }}
                              placeholder="Chennai" style={inputStyle()}
                              onFocus={e => e.target.style.borderColor = primaryOrange}
                              onBlur={e => e.target.style.borderColor = border} />
                          </F>
                        </G2>
                        <G2>
                          <F>
                            <Label text="State" />
                            <select value={state} onChange={e => { setState(e.target.value); dirty(); }} style={selectStyle}>
                              {["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra"].map(s => <option key={s}>{s}</option>)}
                            </select>
                          </F>
                        </G2>
                        <F>
                          <Label text="Notes / Remarks" />
                          <textarea value={notes} rows={3} onChange={e => { setNotes(e.target.value); dirty(); }}
                            placeholder="Additional notes about this driver..."
                            style={{ width: "100%", borderRadius: 8, padding: "10px 12px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                            onFocus={e => e.target.style.borderColor = primaryOrange}
                            onBlur={e => e.target.style.borderColor = border} />
                        </F>
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── LICENSE INFORMATION ── */}
                {activeSection === "license" && (
                  <SectionCard title="License Information" subtitle="Driving license details and verification status.">
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <G2>
                        <F>
                          <Label text="License Number" required />
                          <input value={licenseNo} onChange={e => { setLicenseNo(e.target.value); dirty(); }}
                            placeholder="TN-XX-XXXXXXXX" style={inputStyle("licenseNo")}
                            onFocus={e => e.target.style.borderColor = primaryOrange}
                            onBlur={e => e.target.style.borderColor = errors.licenseNo ? statusError : border} />
                          <FieldErr errKey="licenseNo" />
                        </F>
                        <F>
                          <Label text="License Type" />
                          <select value={licenseType} onChange={e => { setLicenseType(e.target.value); dirty(); }} style={selectStyle}>
                            {["Heavy Vehicle", "Medium Vehicle", "Light Vehicle", "Commercial"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </F>
                      </G2>
                      <G3>
                        <F>
                          <Label text="Issue Date" />
                          <input value={licenseIssue} type="date" onChange={e => { setLicenseIssue(e.target.value); dirty(); }}
                            style={{ ...inputStyle(), cursor: "pointer" }}
                            onFocus={e => e.target.style.borderColor = primaryOrange}
                            onBlur={e => e.target.style.borderColor = border} />
                        </F>
                        <F>
                          <Label text="Expiry Date" required />
                          <input value={licenseExpiry} type="date" onChange={e => { setLicenseExpiry(e.target.value); dirty(); }}
                            style={{ ...inputStyle("licenseExpiry"), cursor: "pointer" }}
                            onFocus={e => e.target.style.borderColor = primaryOrange}
                            onBlur={e => e.target.style.borderColor = errors.licenseExpiry ? statusError : border} />
                          <FieldErr errKey="licenseExpiry" />
                        </F>
                        <F>
                          <Label text="Issuing Authority" />
                          <input value={issuingAuth} onChange={e => { setIssuingAuth(e.target.value); dirty(); }}
                            placeholder="RTO Office" style={inputStyle()}
                            onFocus={e => e.target.style.borderColor = primaryOrange}
                            onBlur={e => e.target.style.borderColor = border} />
                        </F>
                      </G3>
                      {/* License expiry indicator */}
                      {licenseExpiry && (() => {
                        const exp = new Date(licenseExpiry);
                        const now = new Date();
                        const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        const isExpired = diff < 0;
                        const isSoon = diff >= 0 && diff <= 90;
                        const color = isExpired ? statusError : isSoon ? statusWarning : statusSuccess;
                        const msg = isExpired ? `Expired ${Math.abs(diff)} days ago.` : isSoon ? `Expires in ${diff} days.` : `Valid for ${diff} days.`;
                        return (
                          <div style={{ padding: 14, borderRadius: 10, background: dm ? `${color}18` : `${color}12`, border: `1px solid ${color}`, fontSize: 12.5, color, fontWeight: 700 }}>
                            {isExpired ? "⛔" : isSoon ? "⚠" : "✓"} {msg}
                          </div>
                        );
                      })()}
                    </div>
                  </SectionCard>
                )}

                {/* ── ASSIGNMENT & STATUS ── */}
                {activeSection === "assignment" && (
                  <>
                    <SectionCard title="Vehicle Assignments" subtitle="Assign one or more vehicles to this driver.">
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <G2>
                          <F>
                            <Label text="Primary Vehicle" />
                            <select value={vehicle1} onChange={e => { setVehicle1(e.target.value); dirty(); }} style={selectStyle}>
                              <option value="">No vehicle assigned</option>
                              {["TN22GH3456", "TN38AB7821", "TN11EF9021", "TN09AB7821"].map(v => <option key={v}>{v}</option>)}
                            </select>
                          </F>
                          <F>
                            <Label text="Secondary Vehicle" />
                            <select value={vehicle2} onChange={e => { setVehicle2(e.target.value); dirty(); }} style={selectStyle}>
                              <option value="">No vehicle assigned</option>
                              {["TN22GH3456", "TN38AB7821", "TN11EF9021", "TN09AB7821"].map(v => <option key={v}>{v}</option>)}
                            </select>
                          </F>
                        </G2>
                        {vehicle1 && (
                          <div style={{ padding: 14, background: primaryOrangeSoft, borderRadius: 10, border: `1px solid ${primaryOrange}`, display: "flex", gap: 10, alignItems: "center", fontSize: 12.5 }}>
                            <span style={{ fontSize: 20 }}>🚚</span>
                            <div>
                              <div style={{ fontWeight: 800, color: primaryOrange }}>{vehicle1}</div>
                              <div style={{ color: secondaryText, marginTop: 2 }}>Heavy Truck • Tata Prima 2830.K • WB-01</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard title="Customer Assignment" subtitle="Associate this driver with a customer or company.">
                      <F>
                        <Label text="Customer / Company" />
                        <select value={customer} onChange={e => { setCustomer(e.target.value); dirty(); }} style={selectStyle}>
                          <option value="">No customer assigned</option>
                          {["Metro Builders Ltd", "ABC Construction", "XYZ Logistics", "Kumar Traders", "Delta Mining Corp"].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </F>
                      {customer && (
                        <div style={{ marginTop: 12, padding: 12, background: secondaryGoldSoft, borderRadius: 8, border: `1px solid ${secondaryGold}`, fontSize: 12.5 }}>
                          <div style={{ fontWeight: 800, color: primaryText }}>{customer}</div>
                          <div style={{ color: mutedText, marginTop: 2 }}>Business • Active Customer</div>
                        </div>
                      )}
                    </SectionCard>
                  </>
                )}

                {/* ── DOCUMENTS ── */}
                {activeSection === "documents" && (
                  <SectionCard title="Driver Documents" subtitle="Upload and manage driver compliance documents.">
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {([
                        { key: "license", label: "Driving License", value: docLicense, setter: setDocLicense, required: true },
                        { key: "id", label: "Identity Proof (Aadhar / PAN)", value: docIdProof, setter: setDocIdProof, required: true },
                        { key: "medical", label: "Medical Certificate", value: docMedical, setter: setDocMedical, required: false },
                        { key: "training", label: "Training Certificate", value: docTraining, setter: setDocTraining, required: false },
                      ] as const).map(doc => (
                        <div key={doc.key} style={{ padding: 16, borderRadius: 10, background: elevated, border: `1px solid ${doc.value ? primaryOrange : border}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: primaryText }}>
                                {doc.label}
                                {doc.required && <span style={{ color: statusError, marginLeft: 4 }}>*</span>}
                              </div>
                              {doc.value ? (
                                <div style={{ fontSize: 12, color: statusSuccess, marginTop: 3 }}>✓ {doc.value}</div>
                              ) : (
                                <div style={{ fontSize: 12, color: mutedText, marginTop: 3 }}>No file uploaded</div>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              {doc.value && (
                                <button style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: surface, color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View</button>
                              )}
                              <button
                                onClick={() => { (doc.setter as (v: string) => void)(doc.value ? "" : `${doc.key}_document.pdf`); dirty(); }}
                                style={{ height: 36, padding: "0 14px", borderRadius: 8, border: `1px solid ${doc.value ? statusError : primaryOrange}`, background: doc.value ? (dm ? "rgba(220,38,38,0.1)" : "#FEF2F2") : primaryOrangeSoft, color: doc.value ? statusError : primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                {doc.value ? "Remove" : "Upload"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div style={{ padding: 12, background: dm ? "rgba(201,154,46,0.1)" : "#FFFBEB", borderRadius: 10, border: `1px solid ${secondaryGold}`, fontSize: 12.5, color: secondaryText }}>
                        <span style={{ color: secondaryGold, fontWeight: 700 }}>ℹ Accepted formats: </span>
                        PDF, JPG, PNG. Maximum file size: 5 MB per document.
                      </div>
                    </div>
                  </SectionCard>
                )}
              </div>

              {/* RIGHT — Summary Panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Driver Status */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}` }}>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>DRIVER STATUS</h3>
                  </div>
                  <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {(["ACTIVE", "INACTIVE", "SUSPENDED"] as const).map(s => {
                      const sc = s === "ACTIVE" ? statusSuccess : s === "INACTIVE" ? mutedText : statusWarning;
                      return (
                        <button key={s} onClick={() => { setStatus(s); dirty(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${status === s ? sc : border}`, background: status === s ? (dm ? `${sc}18` : `${sc}10`) : elevated, cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${status === s ? sc : border}`, background: status === s ? sc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {status === s && <div style={{ width: 6, height: 6, borderRadius: 999, background: "#FFF" }} />}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: status === s ? sc : primaryText }}>● {s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary Card */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}` }}>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>DRIVER SUMMARY</h3>
                  </div>
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Full Name", value: `${firstName} ${lastName}`.trim() || "—" },
                      { label: "Phone", value: phone || "—" },
                      { label: "License Type", value: licenseType },
                      { label: "License No.", value: licenseNo || "—" },
                      { label: "Primary Vehicle", value: vehicle1 || "None" },
                      { label: "Customer", value: customer || "None" },
                      { label: "Status", value: status },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                        <span style={{ color: mutedText }}>{label}</span>
                        <span style={{ color: primaryText, fontWeight: 600, textAlign: "right", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}` }}>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>COMPLETION CHECKLIST</h3>
                  </div>
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Personal information", done: !!(firstName && lastName && phone) },
                      { label: "License details", done: !!(licenseNo && licenseExpiry) },
                      { label: "Vehicle assigned", done: !!vehicle1 },
                      { label: "Driving license uploaded", done: !!docLicense },
                      { label: "Identity proof uploaded", done: !!docIdProof },
                    ].map(({ label, done }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${done ? statusSuccess : border}`, background: done ? statusSuccess : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {done && <span style={{ color: "#FFF", fontSize: 10, fontWeight: 900 }}>✓</span>}
                        </div>
                        <span style={{ color: done ? primaryText : mutedText }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unsaved indicator */}
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
                {isSaving ? "Saving..." : mode === "add" ? "Add Driver" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────── */
  /*  MOBILE LAYOUT                                                       */
  /* ─────────────────────────────────────────────────────────────────── */
  function renderMobile() {
    const STEPS = ["Personal", "License", "Assignment", "Documents"];
    const stepIndex = STEPS.findIndex(s => s.toLowerCase().startsWith(activeSection));

    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText, display: "flex", flexDirection: "column" }}>


        {toast && <div style={{ position: "fixed", top: 20, right: 16, zIndex: 1200, background: primaryOrange, color: "#FFF", padding: "12px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}>{toast}</div>}

        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 40px" }}>
          <div style={{ width: 390, minHeight: 844, background: surface, borderRadius: 24, border: `1px solid ${border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>

            {/* Mobile Page Header */}
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={handleCancel} style={{ background: "none", border: 0, color: primaryOrange, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                ← {mode === "edit" ? "Driver" : "Drivers"}
              </button>
              <span style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>{mode === "add" ? "Add Driver" : "Edit Driver"}</span>
              <span style={{ width: 60 }} />
            </div>

            {/* Mobile Step Indicator */}
            <div style={{ display: "flex", borderBottom: `1px solid ${border}` }}>
              {STEPS.map((step, idx) => (
                <button
                  key={step}
                  onClick={() => setActiveSection(step.toLowerCase() as typeof activeSection)}
                  style={{ flex: 1, padding: "10px 0", fontSize: 10.5, fontWeight: idx === stepIndex ? 800 : 500, color: idx === stepIndex ? primaryOrange : mutedText, background: "none", border: "none", borderBottom: idx === stepIndex ? `2px solid ${primaryOrange}` : "2px solid transparent", cursor: "pointer" }}
                >
                  {step}
                </button>
              ))}
            </div>

            {/* Mobile Form Body */}
            <div style={{ overflowY: "auto", padding: "16px 16px 100px", display: "flex", flexDirection: "column", gap: 14 }}>
              {activeSection === "personal" && (
                <>
                  {([
                    ["First Name *", firstName, setFirstName, "text", "Arun"],
                    ["Last Name *", lastName, setLastName, "text", "Kumar"],
                    ["Phone *", phone, setPhone, "tel", "+91 98765 43210"],
                    ["Email", email, setEmail, "email", "arun@example.com"],
                    ["City", city, setCity, "text", "Chennai"],
                  ] as const).map(([label, val, setter, type, placeholder]) => (
                    <div key={label as string}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>{label as string}</div>
                      <input value={val as string} type={type as string} onChange={e => { (setter as (v: string) => void)(e.target.value); dirty(); }}
                        placeholder={placeholder as string}
                        style={{ width: "100%", height: 48, borderRadius: 8, padding: "0 14px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                        onFocus={e => e.target.style.borderColor = primaryOrange}
                        onBlur={e => e.target.style.borderColor = border} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>Notes</div>
                    <textarea value={notes} rows={3} onChange={e => { setNotes(e.target.value); dirty(); }}
                      style={{ width: "100%", borderRadius: 8, padding: "10px 14px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                      onFocus={e => e.target.style.borderColor = primaryOrange}
                      onBlur={e => e.target.style.borderColor = border} />
                  </div>
                </>
              )}
              {activeSection === "license" && (
                <>
                  {([
                    ["License Number *", licenseNo, setLicenseNo, "text", "TN-XX-XXXXXXXX"],
                  ] as const).map(([label, val, setter, type, placeholder]) => (
                    <div key={label as string}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>{label as string}</div>
                      <input value={val as string} type={type as string} onChange={e => { (setter as (v: string) => void)(e.target.value); dirty(); }}
                        placeholder={placeholder as string}
                        style={{ width: "100%", height: 48, borderRadius: 8, padding: "0 14px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                        onFocus={e => e.target.style.borderColor = primaryOrange}
                        onBlur={e => e.target.style.borderColor = border} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>License Type</div>
                    <select value={licenseType} onChange={e => { setLicenseType(e.target.value); dirty(); }} style={{ ...selectStyle, height: 48, fontSize: 14 }}>
                      {["Heavy Vehicle", "Medium Vehicle", "Light Vehicle"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  {[["Issue Date", licenseIssue, setLicenseIssue], ["Expiry Date *", licenseExpiry, setLicenseExpiry]].map(([label, val, setter]) => (
                    <div key={label as string}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>{label as string}</div>
                      <input value={val as string} type="date" onChange={e => { (setter as (v: string) => void)(e.target.value); dirty(); }}
                        style={{ width: "100%", height: 48, borderRadius: 8, padding: "0 14px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 14, outline: "none", boxSizing: "border-box", cursor: "pointer" }}
                        onFocus={e => e.target.style.borderColor = primaryOrange}
                        onBlur={e => e.target.style.borderColor = border} />
                    </div>
                  ))}
                </>
              )}
              {activeSection === "assignment" && (
                <>
                  {[
                    ["Primary Vehicle", vehicle1, setVehicle1, ["No vehicle", "TN22GH3456", "TN38AB7821", "TN11EF9021"]],
                    ["Customer", customer, setCustomer, ["No customer", "Metro Builders Ltd", "ABC Construction", "XYZ Logistics"]],
                  ].map(([label, val, setter, opts]) => (
                    <div key={label as string}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>{label as string}</div>
                      <select value={val as string} onChange={e => { (setter as (v: string) => void)(e.target.value); dirty(); }} style={{ ...selectStyle, height: 48, fontSize: 14 }}>
                        {(opts as string[]).map(o => <option key={o} value={o.startsWith("No") ? "" : o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 8 }}>Driver Status</div>
                    {(["ACTIVE", "INACTIVE"] as const).map(s => {
                      const sc = s === "ACTIVE" ? statusSuccess : mutedText;
                      return (
                        <button key={s} onClick={() => { setStatus(s); dirty(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${status === s ? sc : border}`, background: status === s ? `${sc}12` : elevated, cursor: "pointer", width: "100%", marginBottom: 8 }}>
                          <div style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${status === s ? sc : border}`, background: status === s ? sc : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {status === s && <div style={{ width: 6, height: 6, borderRadius: 999, background: "#FFF" }} />}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: status === s ? sc : primaryText }}>● {s}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {activeSection === "documents" && (
                <>
                  {([
                    { label: "Driving License *", value: docLicense, setter: setDocLicense },
                    { label: "Identity Proof *", value: docIdProof, setter: setDocIdProof },
                    { label: "Medical Certificate", value: docMedical, setter: setDocMedical },
                    { label: "Training Certificate", value: docTraining, setter: setDocTraining },
                  ]).map(doc => (
                    <div key={doc.label} style={{ padding: 14, borderRadius: 10, background: elevated, border: `1px solid ${doc.value ? primaryOrange : border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: primaryText }}>{doc.label}</div>
                          <div style={{ fontSize: 11.5, color: doc.value ? statusSuccess : mutedText, marginTop: 2 }}>
                            {doc.value ? `✓ ${doc.value}` : "No file uploaded"}
                          </div>
                        </div>
                        <button onClick={() => { doc.setter(doc.value ? "" : `${doc.label.toLowerCase().replace(/\s/g, "_")}.pdf`); dirty(); }}
                          style={{ height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${doc.value ? statusError : primaryOrange}`, background: doc.value ? "rgba(220,38,38,0.1)" : primaryOrangeSoft, color: doc.value ? statusError : primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          {doc.value ? "Remove" : "Upload"}
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Sticky Mobile Action Bar */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: surface, borderTop: `1px solid ${border}`, padding: "12px 16px", display: "flex", gap: 10 }}>
              <button onClick={handleCancel} style={{ height: 48, flex: "0 0 90px", borderRadius: 10, background: elevated, color: primaryText, border: `1px solid ${border}`, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={isSaving} style={{ height: 48, flex: 1, borderRadius: 10, background: primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: isSaving ? "not-allowed" : "pointer" }}>
                {isSaving ? "Saving..." : mode === "add" ? "ADD DRIVER" : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
