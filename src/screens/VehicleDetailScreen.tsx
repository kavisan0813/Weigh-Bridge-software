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
  {
    date: "19 Aug 2026",
    ticket: "WB-2026-00461",
    wb: "WB-01",
    gross: "38,500",
    tare: "13,450",
    net: "25,050",
    driver: "Arun Kumar",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
  {
    date: "18 Aug 2026",
    ticket: "WB-2026-00455",
    wb: "WB-01",
    gross: "37,800",
    tare: "13,450",
    net: "24,350",
    driver: "Arun Kumar",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
  {
    date: "18 Aug 2026",
    ticket: "WB-2026-00448",
    wb: "WB-02",
    gross: "39,200",
    tare: "13,500",
    net: "25,700",
    driver: "Arun Kumar",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
  {
    date: "17 Aug 2026",
    ticket: "WB-2026-00441",
    wb: "WB-01",
    gross: "36,900",
    tare: "13,400",
    net: "23,500",
    driver: "Arun Kumar",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
  {
    date: "17 Aug 2026",
    ticket: "WB-2026-00438",
    wb: "WB-03",
    gross: "38,100",
    tare: "13,450",
    net: "24,650",
    driver: "Arun Kumar",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
];

export default function VehicleDetailScreen({
  darkMode,
  onToggleDark,
  onNavigate,
}: Props) {
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
  const statusSuccess = "#16A34A";
  const statusWarning = "#F59E0B";
  const statusError = "#DC2626";

  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [activeTab, setActiveTab] = useState("overview");

  const thStyle: React.CSSProperties = {
    padding: "10px 20px",
    fontSize: 11,
    fontWeight: 700,
    color: mutedText,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    textAlign: "left",
    background: elevated,
    borderBottom: `1px solid ${border}`,
    whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    padding: "14px 20px",
    fontSize: 13,
    color: primaryText,
    borderBottom: `1px solid ${divider}`,
    verticalAlign: "middle",
  };

  if (viewDevice === "mobile") return renderMobile();
  return renderDesktop();

  function renderDesktop() {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: bg,
          fontFamily: "'Inter', -apple-system, sans-serif",
          color: primaryText,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Testing Bar */}
        <header
          style={{
            background: dm ? "#1F2937" : "#0F172A",
            borderBottom: `1px solid ${border}`,
            padding: "8px 20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            zIndex: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => onNavigate("vehicles")}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#FFF",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Vehicles
            </button>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>
              VEHICLE DETAIL
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.08)",
                padding: 3,
                borderRadius: 6,
                gap: 2,
              }}
            >
              {(["desktop", "mobile"] as ViewDevice[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setViewDevice(d)}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 4,
                    border: "none",
                    background:
                      viewDevice === d ? primaryOrange : "transparent",
                    color: viewDevice === d ? "#FFF" : "#94A3B8",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {d === "desktop" ? "💻" : "📲"} {d}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.08)",
                padding: 3,
                borderRadius: 6,
                gap: 2,
              }}
            >
              {(["admin", "operator"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 4,
                    border: "none",
                    background: role === r ? secondaryGold : "transparent",
                    color: role === r ? "#FFF" : "#94A3B8",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={onToggleDark}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#F9FAFB",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {dm ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Main Shell */}
        <div
          style={{
            flex: 1,
            maxWidth: 1440,
            width: "100%",
            margin: "0 auto",
            background: surface,
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 49px)",
          }}
        >
          {/* Page Header */}
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
                  onClick={() => onNavigate("vehicles")}
                  style={{
                    background: "none",
                    border: 0,
                    color: mutedText,
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 11,
                  }}
                >
                  Vehicles
                </button>
                <span>/</span>
                <span style={{ color: primaryOrange }}>TN22GH3456</span>
              </div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  margin: 0,
                  color: primaryText,
                  letterSpacing: "-0.01em",
                }}
              >
                Vehicle Detail
              </h1>
              <p
                style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}
              >
                Complete vehicle profile, weighment history and assigned driver.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {role === "admin" && (
                <>
                  <button
                    onClick={() => onNavigate("vehicle-edit")}
                    style={{
                      height: 42,
                      padding: "0 18px",
                      borderRadius: 8,
                      background: primaryOrange,
                      color: "#FFFFFF",
                      fontSize: 13,
                      fontWeight: 800,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                    }}
                  >
                    ✎ Edit Vehicle
                  </button>
                  <button
                    style={{
                      height: 42,
                      padding: "0 14px",
                      borderRadius: 8,
                      background: surface,
                      color: secondaryText,
                      fontSize: 13,
                      fontWeight: 700,
                      border: `1px solid ${border}`,
                      cursor: "pointer",
                    }}
                  >
                    ••• More
                  </button>
                </>
              )}
            </div>
          </header>

          {/* Body */}
          <div
            style={{
              flex: 1,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              overflowY: "auto",
            }}
          >
            {/* KPI Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
            >
              {[
                {
                  label: "STATUS",
                  value: "● ACTIVE",
                  valueColor: statusSuccess,
                  sub: "Available for operations",
                },
                {
                  label: "TOTAL WEIGHMENTS",
                  value: "248",
                  valueColor: primaryOrange,
                  sub: "Since registration",
                },
                {
                  label: "THIS MONTH",
                  value: "32",
                  valueColor: secondaryGold,
                  sub: "August 2026",
                },
                {
                  label: "TARE WEIGHT",
                  value: "13,450 KG",
                  valueColor: primaryText,
                  sub: "Registered tare",
                },
              ].map((k) => (
                <div
                  key={k.label}
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    background: elevated,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: mutedText,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {k.label}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      fontVariantNumeric: "tabular-nums",
                      color: k.valueColor,
                      marginTop: 4,
                    }}
                  >
                    {k.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: secondaryText,
                      marginTop: 2,
                    }}
                  >
                    {k.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 0,
                borderBottom: `1px solid ${border}`,
              }}
            >
              {[
                ["overview", "Overview"],
                ["history", "Weighment History"],
                ["documents", "Documents"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: "10px 20px",
                    fontSize: 13,
                    fontWeight: activeTab === key ? 800 : 500,
                    color: activeTab === key ? primaryOrange : mutedText,
                    background: "none",
                    border: "none",
                    borderBottom:
                      activeTab === key
                        ? `2.5px solid ${primaryOrange}`
                        : "2.5px solid transparent",
                    cursor: "pointer",
                    marginBottom: -1,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 340px",
                  gap: 20,
                }}
              >
                {/* Left */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {/* Vehicle Information */}
                  <div
                    style={{
                      background: surface,
                      borderRadius: 14,
                      border: `1px solid ${border}`,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px 20px",
                        borderBottom: `1px solid ${border}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 16,
                            fontWeight: 800,
                            color: primaryText,
                          }}
                        >
                          Vehicle Information
                        </h3>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: mutedText,
                            marginTop: 2,
                          }}
                        >
                          Basic registration and identification details.
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 0,
                      }}
                    >
                      {[
                        ["Vehicle Number", "TN22GH3456"],
                        ["Registration Number", "TN22GH3456"],
                        ["Vehicle Type", "Heavy Truck"],
                        ["Category", "Commercial"],
                        ["Make", "Tata"],
                        ["Model", "Prima 2830.K"],
                        ["Manufacture Year", "2023"],
                        ["Fuel Type", "Diesel"],
                        ["Max Capacity", "25,000 KG"],
                        ["Tare Tolerance", "± 100 KG"],
                      ].map(([label, value], i) => (
                        <div
                          key={label}
                          style={{
                            padding: "14px 20px",
                            borderBottom:
                              i < 8 ? `1px solid ${divider}` : "none",
                            borderRight:
                              i % 2 === 0 ? `1px solid ${divider}` : "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: mutedText,
                              marginBottom: 4,
                            }}
                          >
                            {label.toUpperCase()}
                          </div>
                          <div
                            style={{
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: primaryText,
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tare Information */}
                  <div
                    style={{
                      background: surface,
                      borderRadius: 14,
                      border: `1px solid ${border}`,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px 20px",
                        borderBottom: `1px solid ${border}`,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        Tare Weight Information
                      </h3>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 0,
                      }}
                    >
                      {[
                        ["REGISTERED TARE", "13,450 KG", primaryOrange],
                        ["LAST MEASURED TARE", "13,462 KG", secondaryGold],
                        ["VARIANCE", "+12 KG", statusSuccess],
                      ].map(([label, value, color]) => (
                        <div
                          key={label}
                          style={{
                            padding: "18px 20px",
                            borderRight:
                              label !== "VARIANCE"
                                ? `1px solid ${divider}`
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: mutedText,
                            }}
                          >
                            {label}
                          </div>
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 800,
                              fontVariantNumeric: "tabular-nums",
                              color,
                              marginTop: 6,
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {/* Status Card */}
                  <div
                    style={{
                      background: surface,
                      borderRadius: 14,
                      border: `1px solid ${border}`,
                      padding: 20,
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: 14,
                        fontWeight: 800,
                        color: mutedText,
                        letterSpacing: "0.06em",
                      }}
                    >
                      VEHICLE STATUS
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 14,
                        background: dm ? "rgba(22,163,74,0.12)" : "#F0FDF4",
                        borderRadius: 10,
                        border: `1px solid ${statusSuccess}`,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: statusSuccess,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: statusSuccess,
                          }}
                        >
                          ACTIVE
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: mutedText,
                            marginTop: 1,
                          }}
                        >
                          Available for weighbridge operations.
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: 14,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {[
                        ["Registered", "15 Jan 2024"],
                        ["Last Used", "19 Aug 2026"],
                        ["Last Updated", "19 Aug 2026"],
                      ].map(([label, val]) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12.5,
                          }}
                        >
                          <span style={{ color: mutedText }}>{label}</span>
                          <span style={{ color: primaryText, fontWeight: 600 }}>
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Driver */}
                  <div
                    style={{
                      background: surface,
                      borderRadius: 14,
                      border: `1px solid ${border}`,
                      padding: 20,
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 14px 0",
                        fontSize: 14,
                        fontWeight: 800,
                        color: mutedText,
                        letterSpacing: "0.06em",
                      }}
                    >
                      ASSIGNED DRIVER
                    </h3>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 999,
                          background: primaryOrange,
                          color: "#FFF",
                          fontWeight: 800,
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        AK
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: primaryText,
                          }}
                        >
                          Arun Kumar
                        </div>
                        <div style={{ fontSize: 11.5, color: mutedText }}>
                          DRV-00124
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: statusSuccess,
                            marginTop: 2,
                          }}
                        >
                          ● ACTIVE
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate("driver-detail")}
                      style={{
                        marginTop: 14,
                        width: "100%",
                        height: 38,
                        borderRadius: 8,
                        background: "none",
                        border: `1px solid ${border}`,
                        color: primaryOrange,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View Driver Profile →
                    </button>
                  </div>

                  {/* Customer */}
                  <div
                    style={{
                      background: surface,
                      borderRadius: 14,
                      border: `1px solid ${border}`,
                      padding: 20,
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 14px 0",
                        fontSize: 14,
                        fontWeight: 800,
                        color: mutedText,
                        letterSpacing: "0.06em",
                      }}
                    >
                      CUSTOMER
                    </h3>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      Metro Builders Ltd
                    </div>
                    <div
                      style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}
                    >
                      Business • +91 98400 12345
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      {["WB-01", "WB-02"].map((wb) => (
                        <span
                          key={wb}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 6,
                            background: primaryOrangeSoft,
                            color: primaryOrange,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {wb}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      Weighment History
                    </h3>
                    <div
                      style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}
                    >
                      248 total weighments for this vehicle.
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      placeholder="Search tickets..."
                      style={{
                        height: 38,
                        padding: "0 12px",
                        borderRadius: 8,
                        border: `1px solid ${border}`,
                        background: inputBg,
                        color: primaryText,
                        fontSize: 12.5,
                        outline: "none",
                      }}
                    />
                    <select
                      style={{
                        height: 38,
                        padding: "0 10px",
                        borderRadius: 8,
                        border: `1px solid ${border}`,
                        background: inputBg,
                        color: primaryText,
                        fontSize: 12.5,
                      }}
                    >
                      <option>All Weighbridges</option>
                      <option>WB-01</option>
                      <option>WB-02</option>
                      <option>WB-03</option>
                    </select>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr>
                        {[
                          "Date",
                          "Ticket #",
                          "Weighbridge",
                          "Gross (KG)",
                          "Tare (KG)",
                          "Net (KG)",
                          "Driver",
                          "Status",
                        ].map((h) => (
                          <th key={h} style={thStyle}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HISTORY.map((row) => (
                        <tr
                          key={row.ticket}
                          style={{ cursor: "pointer" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = dm
                              ? "#273449"
                              : "#F8FAFC")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <td style={tdStyle}>{row.date}</td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                color: primaryOrange,
                                fontWeight: 700,
                                fontFamily: "monospace",
                              }}
                            >
                              {row.ticket}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                padding: "3px 8px",
                                borderRadius: 6,
                                background: primaryOrangeSoft,
                                color: primaryOrange,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {row.wb}
                            </span>
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              fontVariantNumeric: "tabular-nums",
                              fontWeight: 600,
                            }}
                          >
                            {row.gross}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {row.tare}
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              fontVariantNumeric: "tabular-nums",
                              fontWeight: 700,
                              color: secondaryGold,
                            }}
                          >
                            {row.net}
                          </td>
                          <td style={tdStyle}>{row.driver}</td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 700,
                                background: dm
                                  ? "rgba(22,163,74,0.15)"
                                  : "#F0FDF4",
                                color: statusSuccess,
                              }}
                            >
                              ● {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div
                  style={{
                    padding: "14px 20px",
                    borderTop: `1px solid ${border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 12.5,
                    color: mutedText,
                  }}
                >
                  <span>Showing 5 of 248 weighments</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["← Prev", "1", "2", "3", "Next →"].map((p) => (
                      <button
                        key={p}
                        style={{
                          height: 32,
                          padding: "0 10px",
                          borderRadius: 6,
                          border: `1px solid ${border}`,
                          background: p === "1" ? primaryOrange : surface,
                          color: p === "1" ? "#FFF" : primaryText,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      Vehicle Documents
                    </h3>
                    <div
                      style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}
                    >
                      Registration, insurance and compliance documents.
                    </div>
                  </div>
                  {role === "admin" && (
                    <button
                      style={{
                        height: 38,
                        padding: "0 16px",
                        borderRadius: 8,
                        background: primaryOrangeSoft,
                        border: `1px solid ${primaryOrange}`,
                        color: primaryOrange,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      + Upload Document
                    </button>
                  )}
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr>
                      {["Document", "Status", "Expiry Date", "Actions"].map(
                        (h) => (
                          <th key={h} style={thStyle}>
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["RC Book", "VALID", "Permanent"],
                      ["Insurance", "VALID", "31 Dec 2026"],
                      ["Pollution Certificate", "EXPIRING SOON", "30 Sep 2026"],
                      ["Road Tax", "VALID", "31 Mar 2027"],
                    ].map(([name, status, expiry]) => {
                      const color =
                        status === "VALID"
                          ? statusSuccess
                          : status === "EXPIRING SOON"
                            ? statusWarning
                            : statusError;
                      const bg2 =
                        status === "VALID"
                          ? dm
                            ? "rgba(22,163,74,0.12)"
                            : "#F0FDF4"
                          : dm
                            ? "rgba(245,158,11,0.12)"
                            : "#FFFBEB";
                      return (
                        <tr key={name}>
                          <td style={tdStyle}>
                            <span style={{ fontWeight: 700 }}>{name}</span>
                          </td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 700,
                                background: bg2,
                                color,
                              }}
                            >
                              {status}
                            </span>
                          </td>
                          <td
                            style={{
                              ...tdStyle,
                              color:
                                status === "EXPIRING SOON"
                                  ? statusWarning
                                  : primaryText,
                              fontWeight:
                                status === "EXPIRING SOON" ? 700 : 400,
                            }}
                          >
                            {expiry}
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  border: `1px solid ${border}`,
                                  background: surface,
                                  color: secondaryText,
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                View
                              </button>
                              {role === "admin" && (
                                <button
                                  style={{
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    border: `1px solid ${border}`,
                                    background: surface,
                                    color: primaryOrange,
                                    fontSize: 11.5,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Replace
                                </button>
                              )}
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
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: bg,
          fontFamily: "'Inter', -apple-system, sans-serif",
          color: primaryText,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Testing Bar */}
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
            VEHICLE DETAIL
          </span>
          <div style={{ display: "flex", gap: 6 }}>
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
              💻
            </button>
            <button
              onClick={onToggleDark}
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
              {dm ? "☀️" : "🌙"}
            </button>
          </div>
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
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Mobile Header */}
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
                onClick={() => onNavigate("vehicles")}
                style={{
                  background: "none",
                  border: 0,
                  color: primaryOrange,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                ← Vehicles
              </button>
              <span
                style={{ fontSize: 15, fontWeight: 800, color: primaryText }}
              >
                Vehicle Detail
              </span>
              {role === "admin" ? (
                <button
                  onClick={() => onNavigate("vehicle-edit")}
                  style={{
                    background: "none",
                    border: 0,
                    color: primaryOrange,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              ) : (
                <span style={{ width: 40 }} />
              )}
            </div>
            <div
              style={{
                overflowY: "auto",
                padding: "16px 16px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Identity Card */}
              <div
                style={{
                  background: elevated,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: primaryOrange,
                        fontFamily: "monospace",
                      }}
                    >
                      TN22GH3456
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: secondaryText,
                        marginTop: 4,
                      }}
                    >
                      Heavy Truck • Tata Prima 2830.K
                    </div>
                    <div
                      style={{ fontSize: 12, color: mutedText, marginTop: 2 }}
                    >
                      Arun Kumar • Metro Builders Ltd
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "4px 10px",
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
              </div>
              {/* KPI Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  ["TOTAL WEIGHMENTS", "248", primaryOrange],
                  ["THIS MONTH", "32", secondaryGold],
                  ["MAX CAPACITY", "25,000 KG", primaryText],
                  ["TARE WEIGHT", "13,450 KG", primaryText],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      background: elevated,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: mutedText,
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: c as string,
                        marginTop: 4,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              {/* Info */}
              {[
                ["VEHICLE TYPE", "Heavy Truck"],
                ["MAKE / MODEL", "Tata Prima 2830.K"],
                ["FUEL TYPE", "Diesel"],
                ["YEAR", "2023"],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: `1px solid ${divider}`,
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: mutedText }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: primaryText,
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
              {/* Recent */}
              <div
                style={{
                  background: elevated,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: mutedText,
                    marginBottom: 12,
                    letterSpacing: "0.06em",
                  }}
                >
                  RECENT WEIGHMENTS
                </div>
                {HISTORY.slice(0, 3).map((row, i) => (
                  <div
                    key={row.ticket}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: i < 2 ? `1px solid ${divider}` : "none",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: primaryOrange,
                          fontFamily: "monospace",
                        }}
                      >
                        {row.ticket}
                      </div>
                      <div style={{ fontSize: 11, color: mutedText }}>
                        {row.date} • {row.wb}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: secondaryGold,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {row.net} KG
                      </div>
                      <div style={{ fontSize: 11, color: statusSuccess }}>
                        ● {row.status}
                      </div>
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
