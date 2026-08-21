import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function SupplierDetailScreen({
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
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const primaryOrangeSoft = dm ? "#273449" : "#FFF7ED";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";
  const statusSuccess = "#16A34A";

  // State
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [activeTab, setActiveTab] = useState<
    "overview" | "materials" | "vehicles" | "transactions"
  >("overview");

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
            <div
              style={{
                fontSize: 11,
                color: mutedText,
                fontWeight: 600,
                marginBottom: 2,
                display: "flex",
                gap: 6,
              }}
            >
              <button
                onClick={() => onNavigate("suppliers")}
                style={{
                  background: "none",
                  border: 0,
                  color: mutedText,
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 11,
                }}
              >
                Suppliers
              </button>
              <span>/</span>
              <span
                style={{
                  color: primaryOrange,
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                SUP-00124
              </span>
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                color: primaryText,
                letterSpacing: "-0.01em",
              }}
            >
              SUPPLIER DETAIL
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => onNavigate("suppliers")}
              style={{
                height: 44,
                padding: "0 16px",
                borderRadius: 8,
                background: elevated,
                color: primaryText,
                border: `1px solid ${border}`,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Back to Suppliers
            </button>
            {role === "admin" && (
              <button
                onClick={() => onNavigate("supplier-edit")}
                style={{
                  height: 44,
                  padding: "0 20px",
                  borderRadius: 8,
                  background: primaryOrange,
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✎ Edit Supplier
              </button>
            )}
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div
          style={{
            flex: 1,
            padding: "24px 32px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            overflowY: "auto",
          }}
        >
          {/* SUPPLIER PROFILE HEADER CARD */}
          <div
            style={{
              background: surface,
              borderRadius: 12,
              border: `1px solid ${border}`,
              padding: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  background: primaryOrangeSoft,
                  border: `1px solid ${primaryOrange}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 900,
                  color: primaryOrange,
                }}
              >
                SR
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      margin: 0,
                      color: primaryText,
                    }}
                  >
                    Southern Rocks Co
                  </h2>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 800,
                      background: dm ? "rgba(22,163,74,0.15)" : "#F0FDF4",
                      color: statusSuccess,
                    }}
                  >
                    ● ACTIVE
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    fontSize: 13,
                    color: mutedText,
                    marginTop: 4,
                  }}
                >
                  <span>
                    Supplier ID:{" "}
                    <strong
                      style={{ color: primaryOrange, fontFamily: "monospace" }}
                    >
                      SUP-00124
                    </strong>
                  </span>
                  <span>
                    Type:{" "}
                    <strong style={{ color: primaryText }}>Company</strong>
                  </span>
                  <span>
                    GST / Tax ID:{" "}
                    <strong style={{ color: primaryText }}>
                      33AAACS1234F1Z9
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 24, textAlign: "right" }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: mutedText,
                    textTransform: "uppercase",
                  }}
                >
                  TOTAL WEIGHMENTS
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: secondaryGold,
                    fontFamily: "monospace",
                    marginTop: 2,
                  }}
                >
                  218
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: mutedText,
                    textTransform: "uppercase",
                  }}
                >
                  NET WEIGHT DELIVERED
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: primaryOrange,
                    fontFamily: "monospace",
                    marginTop: 2,
                  }}
                >
                  6,420 TON
                </div>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div
            style={{
              display: "flex",
              gap: 8,
              borderBottom: `1px solid ${border}`,
              paddingBottom: 2,
            }}
          >
            {[
              { key: "overview", label: "Overview & Info" },
              { key: "materials", label: "Supplied Materials (6)" },
              { key: "vehicles", label: "Associated Vehicles (17)" },
              { key: "transactions", label: "Recent Weighment Activity" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px 8px 0 0",
                  border: "none",
                  background:
                    activeTab === tab.key ? primaryOrange : "transparent",
                  color: activeTab === tab.key ? "#FFFFFF" : secondaryText,
                  fontSize: 13,
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW CONTENT SECTIONS */}
          {activeTab === "overview" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {/* Supplier Information Card */}
              <div
                style={{
                  background: surface,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: 18,
                    fontWeight: 700,
                    color: primaryText,
                  }}
                >
                  Supplier Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    fontSize: 13,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      COMPANY NAME
                    </span>
                    <strong style={{ color: primaryText }}>
                      Southern Rocks Co
                    </strong>
                  </div>
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      SUPPLIER ID
                    </span>
                    <strong
                      style={{ color: primaryOrange, fontFamily: "monospace" }}
                    >
                      SUP-00124
                    </strong>
                  </div>
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      BUSINESS TYPE
                    </span>
                    <strong style={{ color: primaryText }}>Company</strong>
                  </div>
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      TAX ID / GST
                    </span>
                    <strong style={{ color: primaryText }}>
                      33AAACS1234F1Z9
                    </strong>
                  </div>
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      REGISTRATION DATE
                    </span>
                    <strong style={{ color: primaryText }}>14 Jan 2025</strong>
                  </div>
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      STATUS
                    </span>
                    <strong style={{ color: statusSuccess }}>Active</strong>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div
                style={{
                  background: surface,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: 18,
                    fontWeight: 700,
                    color: primaryText,
                  }}
                >
                  Contact Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    fontSize: 13,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      PRIMARY CONTACT
                    </span>
                    <strong style={{ color: primaryText }}>Ravi Kumar</strong>
                  </div>
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      PHONE
                    </span>
                    <strong
                      style={{ color: primaryText, fontFamily: "monospace" }}
                    >
                      +91 98400 12345
                    </strong>
                  </div>
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      EMAIL
                    </span>
                    <strong style={{ color: primaryOrange }}>
                      contact@southernrocks.com
                    </strong>
                  </div>
                  <div>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      ALT PHONE
                    </span>
                    <strong style={{ color: secondaryText }}>
                      +91 44 2345 6789
                    </strong>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <span
                      style={{
                        color: mutedText,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                      }}
                    >
                      ADDRESS
                    </span>
                    <strong style={{ color: primaryText }}>
                      12 Quarry Industrial Belt, Guindy, Chennai, TN 600032
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MATERIALS TAB */}
          {activeTab === "materials" && (
            <div
              style={{
                background: surface,
                borderRadius: 12,
                border: `1px solid ${border}`,
                padding: 24,
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: 18,
                  fontWeight: 700,
                  color: primaryText,
                }}
              >
                Supplied Materials
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {[
                  "Blue Metal 20mm",
                  "Blue Metal 12mm",
                  "Granite Jelly",
                  "Crushed Stone",
                  "M-Sand",
                  "Quarry Dust",
                ].map((mat, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      background: elevated,
                      border: `1px solid ${border}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        {mat}
                      </div>
                      <div
                        style={{ fontSize: 11, color: mutedText, marginTop: 2 }}
                      >
                        Category: Aggregates
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: secondaryGold,
                        fontFamily: "monospace",
                      }}
                    >
                      TON
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────── */
  /*  MOBILE VIEW (390 × 844)                                           */
  /* ─────────────────────────────────────────────────────────────────── */
  function renderMobileView() {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: bg,
          color: primaryText,
          fontFamily: "'Inter', -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            background: dm ? "#1F2937" : "#0F172A",
            borderBottom: `1px solid ${border}`,
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F9FAFB" }}>
            SCREEN 36 — SUPPLIER DETAIL
          </span>
          <button
            onClick={() => setViewDevice("desktop")}
            style={{
              padding: "3px 8px",
              borderRadius: 4,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#94A3B8",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            💻 Desktop
          </button>
        </header>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 0 40px",
          }}
        >
          <div
            style={{
              width: 390,
              minHeight: 844,
              background: surface,
              borderRadius: 24,
              border: `1px solid ${border}`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => onNavigate("suppliers")}
                style={{
                  background: "none",
                  border: 0,
                  color: primaryOrange,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                ← Suppliers
              </button>
              <span
                style={{ fontSize: 15, fontWeight: 800, color: primaryText }}
              >
                Supplier Detail
              </span>
            </div>

            <div
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: elevated,
                  border: `1px solid ${border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: primaryOrange,
                    fontWeight: 800,
                  }}
                >
                  SUP-00124
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: primaryText,
                    marginTop: 2,
                  }}
                >
                  Southern Rocks Co
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: statusSuccess,
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  ● ACTIVE
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: elevated,
                  border: `1px solid ${border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: mutedText }}>Contact:</span>
                  <strong>Ravi Kumar</strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: mutedText }}>Phone:</span>
                  <strong>+91 98400 12345</strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: mutedText }}>Weighments:</span>
                  <strong style={{ color: secondaryGold }}>218</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
