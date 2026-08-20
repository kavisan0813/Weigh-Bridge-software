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

export default function CustomerFormScreen({ mode: initialMode = "add", darkMode, onToggleDark, onLogout, onNavigate }: Props) {
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

  // Customer Information
  const [companyName, setCompanyName] = useState(prefill ? "Metro Builders Ltd" : "");
  const [custType, setCustType] = useState(prefill ? "Company" : "Company");
  const [category, setCategory] = useState(prefill ? "Construction" : "Construction");
  const [description, setDescription] = useState(prefill ? "Leading commercial infrastructure builder in Tamil Nadu." : "");

  // Contact Information
  const [contactName, setContactName] = useState(prefill ? "Arun Kumar" : "");
  const [phone, setPhone] = useState(prefill ? "+91 98400 12345" : "");
  const [email, setEmail] = useState(prefill ? "contact@metrobuilders.com" : "");
  const [altPhone, setAltPhone] = useState(prefill ? "+91 98400 99887" : "");
  const [website, setWebsite] = useState(prefill ? "www.metrobuilders.com" : "");

  // Business Information
  const [gstin, setGstin] = useState(prefill ? "33ABCDE1234F1Z5" : "");
  const [regNo, setRegNo] = useState(prefill ? "REG-2024-9988" : "");
  const [billingContact, setBillingContact] = useState(prefill ? "Accounts Dept" : "");
  const [paymentTerms, setPaymentTerms] = useState(prefill ? "30 Days" : "30 Days");

  // Address
  const [address1, setAddress1] = useState(prefill ? "No. 45 Industrial Estate" : "");
  const [address2, setAddress2] = useState(prefill ? "Guindy" : "");
  const [city, setCity] = useState(prefill ? "Chennai" : "");
  const [state, setState] = useState(prefill ? "Tamil Nadu" : "Tamil Nadu");
  const [country, setCountry] = useState("India");
  const [postalCode, setPostalCode] = useState(prefill ? "600032" : "");

  // Operational Configuration
  const [wbAccess, setWbAccess] = useState<Record<string, boolean>>({ "WB-01": true, "WB-02": true, "WB-03": prefill, "WB-04": false, "WB-05": false });
  const [defaultWb, setDefaultWb] = useState(prefill ? "WB-01" : "WB-01");
  const [defaultMaterial, setDefaultMaterial] = useState(prefill ? "Gravel" : "Gravel");
  const [txStatus, setTxStatus] = useState(prefill ? "Active" : "Active");

  // Associated Resources
  const [assignedVehicles, setAssignedVehicles] = useState<string[]>(prefill ? ["TN22GH3456", "TN09AB7821", "TN38CD5567"] : []);
  const [assignedDrivers, setAssignedDrivers] = useState<string[]>(prefill ? ["Arun Kumar", "Ravi Kumar", "Priya Kumar"] : []);

  // Customer Status & Notes
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLOCKED">(prefill ? "ACTIVE" : "ACTIVE");
  const [notes, setNotes] = useState(prefill ? "Priority customer. Credit limit pre-approved." : "");

  // Form Controls
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showDiscard, setShowDiscard] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [activeSection, setActiveSection] = useState<"info" | "contact" | "business" | "address" | "ops" | "documents">("info");

  const dirty = () => setHasUnsaved(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = "Company name is required.";
    if (!contactName.trim()) e.contactName = "Primary contact name is required.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    if (!address1.trim()) e.address1 = "Address Line 1 is required.";
    if (!city.trim()) e.city = "City is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setActiveSection("info");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsaved(false);
      showToast(mode === "add" ? "✓ Customer created successfully." : "✓ Customer updated successfully.");
      setTimeout(() => onNavigate("customer-detail"), 1000);
    }, 1500);
  };

  const handleCancel = () => {
    if (hasUnsaved) { setShowDiscard(true); return; }
    onNavigate(mode === "edit" ? "customer-detail" : "customers");
  };

  // Input styles
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

  const SectionCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
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

  const F = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
  );

  // Restricted Access for Operator
  if (role === "operator") {
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText }}>
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#F9FAFB", fontWeight: 700, fontSize: 13 }}>SCREEN 34 — {mode === "add" ? "ADD" : "EDIT"} CUSTOMER</span>
          <button onClick={() => setRole("admin")} style={{ padding: "3px 9px", borderRadius: 4, background: secondaryGold, border: "none", color: "#FFF", fontSize: 11, cursor: "pointer" }}>Switch to Admin</button>
        </header>
        <div style={{ maxWidth: 1440, margin: "0 auto", background: surface, minHeight: "calc(100vh - 49px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 900 }}>ACCESS RESTRICTED</h2>
            <p style={{ color: secondaryText, fontSize: 13.5, marginBottom: 20 }}>You do not have permission to manage customer accounts.</p>
            <button onClick={() => onNavigate("customers")} style={{ height: 42, padding: "0 24px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>← Back to Customers</button>
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
              <p style={{ margin: "0 0 20px 0", fontSize: 13.5, color: secondaryText }}>You have unsaved changes. Are you sure you want to leave this page?</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowDiscard(false)} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue Editing</button>
                <button onClick={() => { setShowDiscard(false); onNavigate(mode === "edit" ? "customer-detail" : "customers"); }} style={{ height: 40, padding: "0 18px", borderRadius: 8, background: statusError, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Discard Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Testing Bar */}
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => onNavigate("customers")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#FFF", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>← Customers</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>SCREEN 34 — {mode === "add" ? "ADD" : "EDIT"} CUSTOMER</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6, gap: 2 }}>
              {(["desktop", "mobile"] as ViewDevice[]).map(d => (
                <button key={d} onClick={() => setViewDevice(d)} style={{ padding: "3px 9px", borderRadius: 4, border: "none", background: viewDevice === d ? primaryOrange : "transparent", color: viewDevice === d ? "#FFF" : "#94A3B8", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {d === "desktop" ? "💻" : "📲"} {d}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6, gap: 2 }}>
              {(["add", "edit"] as FormMode[]).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{ padding: "3px 9px", borderRadius: 4, border: "none", background: mode === m ? secondaryGold : "transparent", color: mode === m ? "#FFF" : "#94A3B8", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {m === "add" ? "Add Mode" : "Edit Mode"}
                </button>
              ))}
            </div>
            <button onClick={onToggleDark} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#F9FAFB", fontSize: 11, cursor: "pointer" }}>
              {dm ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column" }}>

          {/* Page Header */}
          <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 11, color: mutedText, fontWeight: 600, marginBottom: 2, display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={() => onNavigate("customers")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Customers</button>
                {mode === "edit" && (
                  <>
                    <span>/</span>
                    <button onClick={() => onNavigate("customer-detail")} style={{ background: "none", border: 0, color: mutedText, cursor: "pointer", padding: 0, fontSize: 11 }}>Metro Builders Ltd</button>
                  </>
                )}
                <span>/</span>
                <span style={{ color: primaryOrange }}>{mode === "add" ? "Add Customer" : "Edit"}</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>
                {mode === "add" ? "ADD CUSTOMER" : "EDIT CUSTOMER"}
              </h1>
              <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>
                {mode === "add"
                  ? "Create a new customer profile and configure their business and operational information."
                  : "Update customer information and operational settings."}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={handleCancel} style={{ height: 42, padding: "0 18px", borderRadius: 8, background: elevated, color: primaryText, fontSize: 13, fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} style={{ height: 42, padding: "0 24px", borderRadius: 8, background: isSaving ? mutedText : primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: isSaving ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", opacity: isSaving ? 0.8 : 1 }}>
                {isSaving ? "Saving..." : mode === "add" ? "Save Customer" : "Save Changes"}
              </button>
            </div>
          </header>

          {/* Edit Mode Audit Strip */}
          {mode === "edit" && (
            <div style={{ padding: "10px 32px", background: secondaryGoldSoft, borderBottom: `1px solid ${border}`, display: "flex", gap: 20, fontSize: 12.5, flexWrap: "wrap" }}>
              <span style={{ color: secondaryGold, fontWeight: 700 }}>ℹ Last Updated:</span>
              <span style={{ color: secondaryText }}>19 Aug 2026, 10:30 AM</span>
              <span style={{ color: mutedText }}>•</span>
              <span style={{ color: secondaryText }}>Updated By: <strong style={{ color: primaryText }}>Admin User</strong></span>
              <span style={{ color: mutedText }}>•</span>
              <span style={{ color: secondaryText }}>Customer ID: <strong style={{ color: primaryOrange }}>CUS-00124</strong></span>
            </div>
          )}

          {/* Form Body */}
          <div style={{ flex: 1, padding: "32px 32px 48px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

              {/* LEFT COLUMN (~70%) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Section 1: Customer Information */}
                <SectionCard title="Customer Information" subtitle="Basic customer and company details.">
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <G2>
                      <F>
                        <Label text="Customer / Company Name" required />
                        <input value={companyName} onChange={e => { setCompanyName(e.target.value); dirty(); }}
                          placeholder="Metro Builders Ltd" style={inputStyle("companyName")}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = errors.companyName ? statusError : border} />
                        <FieldErr errKey="companyName" />
                      </F>
                      <F>
                        <Label text="Customer ID" />
                        <input value={mode === "add" ? "CUS-00124 (Auto-generated)" : "CUS-00124"} disabled
                          style={{ ...inputStyle(), background: dm ? "#111827" : "#F1F5F9", color: mutedText, fontWeight: 700, fontFamily: "monospace" }} />
                      </F>
                    </G2>
                    <G2>
                      <F>
                        <Label text="Customer Type" required />
                        <select value={custType} onChange={e => { setCustType(e.target.value); dirty(); }} style={selectStyle}>
                          {["Company", "Contractor", "Supplier / Customer", "Individual"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </F>
                      <F>
                        <Label text="Business Category" />
                        <select value={category} onChange={e => { setCategory(e.target.value); dirty(); }} style={selectStyle}>
                          {["Construction", "Mining", "Manufacturing", "Logistics", "Other"].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </F>
                    </G2>
                    <F>
                      <Label text="Description / Overview" />
                      <textarea value={description} rows={3} onChange={e => { setDescription(e.target.value); dirty(); }}
                        placeholder="Optional customer description..."
                        style={{ width: "100%", borderRadius: 8, padding: "10px 12px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                        onFocus={e => e.target.style.borderColor = primaryOrange}
                        onBlur={e => e.target.style.borderColor = border} />
                    </F>
                  </div>
                </SectionCard>

                {/* Section 2: Contact Information */}
                <SectionCard title="Contact Information" subtitle="Primary contact and communication details.">
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <G2>
                      <F>
                        <Label text="Primary Contact Name" required />
                        <input value={contactName} onChange={e => { setContactName(e.target.value); dirty(); }}
                          placeholder="Arun Kumar" style={inputStyle("contactName")}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = errors.contactName ? statusError : border} />
                        <FieldErr errKey="contactName" />
                      </F>
                      <F>
                        <Label text="Phone Number" required />
                        <input value={phone} onChange={e => { setPhone(e.target.value); dirty(); }}
                          placeholder="+91 98400 12345" style={inputStyle("phone")}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = errors.phone ? statusError : border} />
                        <FieldErr errKey="phone" />
                      </F>
                    </G2>
                    <G2>
                      <F>
                        <Label text="Email Address" />
                        <input value={email} type="email" onChange={e => { setEmail(e.target.value); dirty(); }}
                          placeholder="contact@company.com" style={inputStyle()}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = border} />
                      </F>
                      <F>
                        <Label text="Alternate Phone" />
                        <input value={altPhone} onChange={e => { setAltPhone(e.target.value); dirty(); }}
                          placeholder="+91 98400 99887" style={inputStyle()}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = border} />
                      </F>
                    </G2>
                  </div>
                </SectionCard>

                {/* Section 3: Business Information */}
                <SectionCard title="Business Information" subtitle="Tax identification and payment configuration.">
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <G2>
                      <F>
                        <Label text="GSTIN / Tax ID" />
                        <input value={gstin} onChange={e => { setGstin(e.target.value); dirty(); }}
                          placeholder="33ABCDE1234F1Z5" style={{ ...inputStyle(), fontFamily: "monospace" }}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = border} />
                      </F>
                      <F>
                        <Label text="Registration Number" />
                        <input value={regNo} onChange={e => { setRegNo(e.target.value); dirty(); }}
                          placeholder="REG-2024-9988" style={inputStyle()}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = border} />
                      </F>
                    </G2>
                    <G2>
                      <F>
                        <Label text="Billing Contact" />
                        <input value={billingContact} onChange={e => { setBillingContact(e.target.value); dirty(); }}
                          placeholder="Accounts Dept" style={inputStyle()}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = border} />
                      </F>
                      <F>
                        <Label text="Payment Terms" />
                        <select value={paymentTerms} onChange={e => { setPaymentTerms(e.target.value); dirty(); }} style={selectStyle}>
                          {["Immediate", "7 Days", "15 Days", "30 Days", "Custom"].map(pt => <option key={pt}>{pt}</option>)}
                        </select>
                      </F>
                    </G2>
                  </div>
                </SectionCard>

                {/* Section 4: Address */}
                <SectionCard title="Address Details" subtitle="Primary business location address.">
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <G2>
                      <F>
                        <Label text="Address Line 1" required />
                        <input value={address1} onChange={e => { setAddress1(e.target.value); dirty(); }}
                          placeholder="No. 45 Industrial Estate" style={inputStyle("address1")}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = errors.address1 ? statusError : border} />
                        <FieldErr errKey="address1" />
                      </F>
                      <F>
                        <Label text="Address Line 2" />
                        <input value={address2} onChange={e => { setAddress2(e.target.value); dirty(); }}
                          placeholder="Guindy" style={inputStyle()}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = border} />
                      </F>
                    </G2>
                    <G2>
                      <F>
                        <Label text="City" required />
                        <input value={city} onChange={e => { setCity(e.target.value); dirty(); }}
                          placeholder="Chennai" style={inputStyle("city")}
                          onFocus={e => e.target.style.borderColor = primaryOrange}
                          onBlur={e => e.target.style.borderColor = errors.city ? statusError : border} />
                        <FieldErr errKey="city" />
                      </F>
                      <F>
                        <Label text="State" />
                        <select value={state} onChange={e => { setState(e.target.value); dirty(); }} style={selectStyle}>
                          {["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra"].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </F>
                    </G2>
                  </div>
                </SectionCard>

                {/* Section 5: Operational Configuration */}
                <SectionCard title="Operational Configuration" subtitle="Configure permitted weighbridges and material defaults.">
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <Label text="Assigned Weighbridges" />
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 6 }}>
                        {Object.keys(wbAccess).map(wb => (
                          <label key={wb} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 12, borderRadius: 10, border: `1.5px solid ${wbAccess[wb] ? primaryOrange : border}`, background: wbAccess[wb] ? primaryOrangeSoft : elevated, cursor: "pointer" }}>
                            <input type="checkbox" checked={wbAccess[wb]} onChange={e => { setWbAccess(prev => ({ ...prev, [wb]: e.target.checked })); dirty(); }} style={{ display: "none" }} />
                            <div style={{ fontSize: 18 }}>⚖</div>
                            <div style={{ fontSize: 12.5, fontWeight: 800, color: wbAccess[wb] ? primaryOrange : primaryText }}>{wb}</div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: wbAccess[wb] ? primaryOrange : mutedText }}>{wbAccess[wb] ? "✓ ALLOWED" : "BLOCKED"}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <G2>
                      <F>
                        <Label text="Default Weighbridge" />
                        <select value={defaultWb} onChange={e => { setDefaultWb(e.target.value); dirty(); }} style={selectStyle}>
                          {["WB-01", "WB-02", "WB-03", "WB-04", "WB-05"].map(w => <option key={w}>{w}</option>)}
                        </select>
                      </F>
                      <F>
                        <Label text="Default Material" />
                        <select value={defaultMaterial} onChange={e => { setDefaultMaterial(e.target.value); dirty(); }} style={selectStyle}>
                          {["Gravel", "Sand", "M-Sand", "Cement", "Steel"].map(m => <option key={m}>{m}</option>)}
                        </select>
                      </F>
                    </G2>
                  </div>
                </SectionCard>

                {/* Section 6: Customer Documents */}
                <SectionCard title="Customer Documents" subtitle="Upload business registration and contracts.">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { name: "Business Registration", key: "reg" },
                      { name: "GST Certificate", key: "gst" },
                      { name: "Supply Contract", key: "contract" },
                    ].map(doc => (
                      <div key={doc.key} style={{ padding: 14, borderRadius: 10, background: elevated, border: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: primaryText }}>{doc.name}</div>
                          <div style={{ fontSize: 11.5, color: statusSuccess, marginTop: 2 }}>✓ PDF document attached</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={{ height: 34, padding: "0 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View</button>
                          <button style={{ height: 34, padding: "0 12px", borderRadius: 6, border: `1px solid ${primaryOrange}`, background: primaryOrangeSoft, color: primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Replace</button>
                        </div>
                      </div>
                    ))}
                    <button style={{ marginTop: 6, height: 40, width: "100%", borderRadius: 8, background: primaryOrangeSoft, border: `1px dashed ${primaryOrange}`, color: primaryOrange, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      + UPLOAD NEW DOCUMENT
                    </button>
                  </div>
                </SectionCard>

                {/* Section 7: Internal Notes */}
                <SectionCard title="Internal Notes" subtitle="Private notes for authorized staff members.">
                  <textarea value={notes} rows={3} onChange={e => { setNotes(e.target.value); dirty(); }}
                    placeholder="Add internal operational notes about this customer..."
                    style={{ width: "100%", borderRadius: 8, padding: "10px 12px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                    onFocus={e => e.target.style.borderColor = primaryOrange}
                    onBlur={e => e.target.style.borderColor = border} />
                  <div style={{ fontSize: 11.5, color: mutedText, marginTop: 6 }}>
                    ℹ Internal notes are visible only to platform staff and admins.
                  </div>
                </SectionCard>
              </div>

              {/* RIGHT COLUMN (~30%) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Customer Status Switcher */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}` }}>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>CUSTOMER STATUS</h3>
                  </div>
                  <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    {(["ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED"] as const).map(s => {
                      const sc = s === "ACTIVE" ? statusSuccess : s === "INACTIVE" ? mutedText : s === "SUSPENDED" ? statusWarning : statusError;
                      return (
                        <button key={s} onClick={() => { setStatus(s); dirty(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${status === s ? sc : border}`, background: status === s ? (dm ? `${sc}18` : `${sc}10`) : elevated, cursor: "pointer" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${status === s ? sc : border}`, background: status === s ? sc : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {status === s && <div style={{ width: 6, height: 6, borderRadius: 999, background: "#FFF" }} />}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: status === s ? sc : primaryText }}>● {s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* EDIT Mode Read-Only Summary */}
                {mode === "edit" && (
                  <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}` }}>
                      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>CUSTOMER SUMMARY</h3>
                    </div>
                    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { label: "Customer ID", value: "CUS-00124" },
                        { label: "Vehicles", value: "24" },
                        { label: "Drivers", value: "18" },
                        { label: "Total Weighments", value: "1,248" },
                        { label: "Last Weighment", value: "19 Aug 2026" },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                          <span style={{ color: mutedText }}>{label}</span>
                          <span style={{ color: primaryText, fontWeight: 700, fontFamily: label.includes("ID") ? "monospace" : "inherit" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completion Checklist */}
                <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}` }}>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: mutedText, letterSpacing: "0.06em" }}>COMPLETION CHECKLIST</h3>
                  </div>
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Company name entered", done: !!companyName },
                      { label: "Primary contact details", done: !!(contactName && phone) },
                      { label: "Address information", done: !!(address1 && city) },
                      { label: "Weighbridge assigned", done: Object.values(wbAccess).some(Boolean) },
                      { label: "Documents attached", done: true },
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
                {isSaving ? "Saving..." : mode === "add" ? "Save Customer" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────── */
  /*  MOBILE LAYOUT (390 × 844)                                          */
  /* ─────────────────────────────────────────────────────────────────── */
  function renderMobile() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText, display: "flex", flexDirection: "column" }}>

        {/* Testing Bar */}
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F9FAFB" }}>SCREEN 34 — {mode === "add" ? "ADD" : "EDIT"} CUSTOMER</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setViewDevice("desktop")} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>💻</button>
            <button onClick={onToggleDark} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>{dm ? "☀️" : "🌙"}</button>
          </div>
        </header>

        {toast && <div style={{ position: "fixed", top: 20, right: 16, zIndex: 1200, background: primaryOrange, color: "#FFF", padding: "12px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}>{toast}</div>}

        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 40px" }}>
          <div style={{ width: 390, minHeight: 844, background: surface, borderRadius: 24, border: `1px solid ${border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>

            {/* Mobile Header */}
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={handleCancel} style={{ background: "none", border: 0, color: primaryOrange, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>← {mode === "edit" ? "Customer" : "Customers"}</button>
              <span style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>{mode === "add" ? "Add Customer" : "Edit Customer"}</span>
              <span style={{ width: 60 }} />
            </div>

            {/* Mobile Form Body */}
            <div style={{ overflowY: "auto", padding: "16px 16px 100px", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Company Name *", companyName, setCompanyName, "text", "Metro Builders Ltd"],
                ["Primary Contact *", contactName, setContactName, "text", "Arun Kumar"],
                ["Phone Number *", phone, setPhone, "tel", "+91 98400 12345"],
                ["Email Address", email, setEmail, "email", "contact@company.com"],
                ["GSTIN / Tax ID", gstin, setGstin, "text", "33ABCDE1234F1Z5"],
                ["Address Line 1 *", address1, setAddress1, "text", "No. 45 Industrial Estate"],
                ["City *", city, setCity, "text", "Chennai"],
              ].map(([label, val, setter, type, placeholder]) => (
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
                <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>Customer Type</div>
                <select value={custType} onChange={e => { setCustType(e.target.value); dirty(); }} style={{ ...selectStyle, height: 48, fontSize: 14 }}>
                  {["Company", "Contractor", "Supplier / Customer", "Individual"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>Customer Status</div>
                <select value={status} onChange={e => { setStatus(e.target.value as any); dirty(); }} style={{ ...selectStyle, height: 48, fontSize: 14 }}>
                  {["ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>Internal Notes</div>
                <textarea value={notes} rows={3} onChange={e => { setNotes(e.target.value); dirty(); }}
                  style={{ width: "100%", borderRadius: 8, padding: "10px 14px", background: inputBg, color: primaryText, border: `1.5px solid ${border}`, fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                  onFocus={e => e.target.style.borderColor = primaryOrange}
                  onBlur={e => e.target.style.borderColor = border} />
              </div>
            </div>

            {/* Sticky Mobile Action Bar */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: surface, borderTop: `1px solid ${border}`, padding: "12px 16px", display: "flex", gap: 10 }}>
              <button onClick={handleCancel} style={{ height: 48, flex: "0 0 90px", borderRadius: 10, background: elevated, color: primaryText, border: `1px solid ${border}`, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={isSaving} style={{ height: 48, flex: 1, borderRadius: 10, background: primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                {isSaving ? "Saving..." : mode === "add" ? "SAVE CUSTOMER" : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
