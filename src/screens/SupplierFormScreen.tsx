import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";

interface Props {
  mode: "add" | "edit";
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function SupplierFormScreen({
  mode,
  darkMode: dm,
  onNavigate,
}: Props) {
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

  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");

  // Form Fields State
  const [supplierName, setSupplierName] = useState(
    mode === "edit" ? "Southern Rocks Co" : "",
  );
  const [supplierCode, setSupplierCode] = useState(
    mode === "edit" ? "SUP-00124" : "SUP-00131",
  );
  const [supplierType, setSupplierType] = useState(
    mode === "edit" ? "Company" : "Company",
  );
  const [contactPerson, setContactPerson] = useState(
    mode === "edit" ? "Ravi Kumar" : "",
  );
  const [phone, setPhone] = useState(mode === "edit" ? "+91 98400 12345" : "");
  const [email, setEmail] = useState(
    mode === "edit" ? "contact@southernrocks.com" : "",
  );
  const [taxId, setTaxId] = useState(mode === "edit" ? "33AAACS1234F1Z9" : "");
  const [address, setAddress] = useState(
    mode === "edit" ? "12 Quarry Industrial Belt, Guindy, Chennai" : "",
  );
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [notes, setNotes] = useState(
    mode === "edit" ? "Primary supplier for 20mm aggregates." : "",
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate("suppliers");
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
      <div
        style={{
          flex: 1,
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
          background: surface,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* PAGE HEADER */}
        <header
          style={{
            height: 68,
            padding: "0 32px",
            background: surface,
            borderBottom: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                color: primaryText,
                letterSpacing: "-0.01em",
              }}
            >
              {mode === "add" ? "ADD SUPPLIER" : "EDIT SUPPLIER"}
            </h1>
            <p style={{ fontSize: 14, color: mutedText, margin: "2px 0 0 0" }}>
              Enter and manage supplier information, contact details and
              operational configuration.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() => onNavigate("suppliers")}
              style={{
                height: 44,
                padding: "0 20px",
                borderRadius: 8,
                background: elevated,
                color: primaryText,
                border: `1px solid ${border}`,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="supplier-form"
              style={{
                height: 44,
                padding: "0 24px",
                borderRadius: 8,
                background: primaryOrange,
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Save Supplier
            </button>
          </div>
        </header>

        {/* FORM CONTAINER */}
        <form
          id="supplier-form"
          onSubmit={handleSave}
          style={{
            flex: 1,
            padding: "24px 32px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            overflowY: "auto",
          }}
        >
          {/* SECTION 1: BASIC INFORMATION */}
          <div
            style={{
              background: surface,
              borderRadius: 12,
              border: `1px solid ${border}`,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: primaryText,
                borderBottom: `1px solid ${divider}`,
                paddingBottom: 12,
              }}
            >
              BASIC INFORMATION
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  SUPPLIER NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Southern Rocks Co"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  style={inputStyle(
                    border,
                    inputBg,
                    primaryText,
                    primaryOrange,
                  )}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  SUPPLIER ID / CODE *
                </label>
                <input
                  type="text"
                  required
                  readOnly={mode === "add"}
                  value={supplierCode}
                  onChange={(e) => setSupplierCode(e.target.value)}
                  style={{
                    ...inputStyle(border, inputBg, primaryText, primaryOrange),
                    fontFamily: "monospace",
                    color: primaryOrange,
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  BUSINESS TYPE *
                </label>
                <select
                  value={supplierType}
                  onChange={(e) => setSupplierType(e.target.value)}
                  style={inputStyle(
                    border,
                    inputBg,
                    primaryText,
                    primaryOrange,
                  )}
                >
                  <option value="Company">Company</option>
                  <option value="Contractor">Contractor</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  style={inputStyle(
                    border,
                    inputBg,
                    primaryText,
                    primaryOrange,
                  )}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT INFORMATION */}
          <div
            style={{
              background: surface,
              borderRadius: 12,
              border: `1px solid ${border}`,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: primaryText,
                borderBottom: `1px solid ${divider}`,
                paddingBottom: 12,
              }}
            >
              CONTACT INFORMATION
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  PRIMARY CONTACT PERSON *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ravi Kumar"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  style={inputStyle(
                    border,
                    inputBg,
                    primaryText,
                    primaryOrange,
                  )}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  PHONE NUMBER *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98400 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle(
                    border,
                    inputBg,
                    primaryText,
                    primaryOrange,
                  )}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle(
                    border,
                    inputBg,
                    primaryText,
                    primaryOrange,
                  )}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  TAX ID / GST NUMBER
                </label>
                <input
                  type="text"
                  placeholder="33AAACS1234F1Z9"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  style={inputStyle(
                    border,
                    inputBg,
                    primaryText,
                    primaryOrange,
                  )}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: secondaryText,
                    marginBottom: 6,
                  }}
                >
                  BUSINESS ADDRESS
                </label>
                <textarea
                  rows={2}
                  placeholder="Full street address, city, state and PIN..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    ...inputStyle(border, inputBg, primaryText, primaryOrange),
                    height: "auto",
                    padding: 12,
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ADDITIONAL INFORMATION */}
          <div
            style={{
              background: surface,
              borderRadius: 12,
              border: `1px solid ${border}`,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: primaryText,
                borderBottom: `1px solid ${divider}`,
                paddingBottom: 12,
              }}
            >
              ADDITIONAL INFORMATION
            </h3>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: secondaryText,
                  marginBottom: 6,
                }}
              >
                NOTES & COMMENTS
              </label>
              <textarea
                rows={3}
                placeholder="Enter additional supplier operational notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  ...inputStyle(border, inputBg, primaryText, primaryOrange),
                  height: "auto",
                  padding: 12,
                }}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }

  function renderMobileView() {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: bg,
          color: primaryText,
          padding: 16,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>
          {mode === "add" ? "Add Supplier" : "Edit Supplier"}
        </h2>
        <button
          onClick={() => onNavigate("suppliers")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: primaryOrange,
            color: "#FFF",
            border: "none",
            marginTop: 12,
          }}
        >
          Back to Suppliers
        </button>
      </div>
    );
  }
}

// Input Focus Style Helper
const inputStyle = (
  border: string,
  inputBg: string,
  primaryText: string,
  primaryOrange: string,
): React.CSSProperties => ({
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
