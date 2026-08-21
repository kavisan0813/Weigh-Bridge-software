import React, { useState, useMemo } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export interface SupplierRow {
  id: string;
  name: string;
  code: string;
  type: string;
  contact: string;
  phone: string;
  materialsCount: number;
  vehiclesCount: number;
  lastWeighment: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLOCKED";
}

const INITIAL_SUPPLIERS: SupplierRow[] = [
  {
    id: "1",
    name: "Southern Rocks Co",
    code: "SUP-00124",
    type: "Company",
    contact: "Ravi Kumar",
    phone: "+91 98400 12345",
    materialsCount: 6,
    vehiclesCount: 17,
    lastWeighment: "19 Aug 2026 · 10:45 AM",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Green Valley Materials",
    code: "SUP-00125",
    type: "Contractor",
    contact: "Suresh Kumar",
    phone: "+91 98400 23456",
    materialsCount: 4,
    vehiclesCount: 12,
    lastWeighment: "19 Aug 2026 · 09:30 AM",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Chennai Aggregates Pvt Ltd",
    code: "SUP-00126",
    type: "Manufacturer",
    contact: "Priya Kumar",
    phone: "+91 98400 34567",
    materialsCount: 8,
    vehiclesCount: 21,
    lastWeighment: "18 Aug 2026 · 04:12 PM",
    status: "ACTIVE",
  },
  {
    id: "4",
    name: "Metro Stone Suppliers",
    code: "SUP-00127",
    type: "Distributor",
    contact: "Rithick Nathan",
    phone: "+91 98400 45678",
    materialsCount: 2,
    vehiclesCount: 5,
    lastWeighment: "15 Aug 2026 · 01:30 PM",
    status: "INACTIVE",
  },
  {
    id: "5",
    name: "Deccan Quarry Works",
    code: "SUP-00128",
    type: "Company",
    contact: "Rajesh Sharma",
    phone: "+91 98400 56789",
    materialsCount: 5,
    vehiclesCount: 14,
    lastWeighment: "19 Aug 2026 · 11:20 AM",
    status: "ACTIVE",
  },
  {
    id: "6",
    name: "Kaveri Mining Corp",
    code: "SUP-00129",
    type: "Manufacturer",
    contact: "Venkatesh Rao",
    phone: "+91 98400 67890",
    materialsCount: 7,
    vehiclesCount: 19,
    lastWeighment: "17 Aug 2026 · 02:45 PM",
    status: "SUSPENDED",
  },
  {
    id: "7",
    name: "Apex Sand & Gravel",
    code: "SUP-00130",
    type: "Distributor",
    contact: "Karthik Subramanian",
    phone: "+91 98400 78901",
    materialsCount: 3,
    vehiclesCount: 9,
    lastWeighment: "14 Aug 2026 · 10:15 AM",
    status: "BLOCKED",
  },
];

export default function SupplierManagementScreen({
  darkMode: dm,
  onToggleDark,
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
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";

  const statusSuccess = "#16A34A";
  const statusWarning = "#F59E0B";
  const statusError = "#DC2626";

  // State
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [wbFilter, setWbFilter] = useState("ALL");
  const [sortField, setSortField] = useState<keyof SupplierRow>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtering
  const filteredList = useMemo(() => {
    return INITIAL_SUPPLIERS.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.contact.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search);
      const matchStatus =
        statusFilter === "ALL" || item.status === statusFilter;
      const matchType = typeFilter === "ALL" || item.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "string") {
        const comp = (valA as string).localeCompare(valB as string);
        return sortOrder === "asc" ? comp : -comp;
      }
      if (typeof valA === "number") {
        return sortOrder === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
      return 0;
    });
  }, [search, statusFilter, typeFilter, sortField, sortOrder]);

  const handleSort = (field: keyof SupplierRow) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    wbFilter !== "ALL";

  const clearFilters = () => {
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setWbFilter("ALL");
    setSearch("");
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
              SUPPLIERS
            </h1>
            <p style={{ fontSize: 14, color: mutedText, margin: "2px 0 0 0" }}>
              Manage suppliers, company information, materials and weighment
              activity.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {role === "admin" && (
              <button
                onClick={() => onNavigate("supplier-add")}
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
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>+</span>
                <span>ADD SUPPLIER</span>
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
          {/* ── 1. KPI SUMMARY ROW (4 CARDS) ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {[
              {
                label: "TOTAL SUPPLIERS",
                val: "64",
                support: "Registered suppliers",
                color: primaryOrange,
              },
              {
                label: "ACTIVE",
                val: "57",
                support: "Currently active",
                color: statusSuccess,
              },
              {
                label: "WITH WEIGHMENTS",
                val: "49",
                support: "Suppliers with transactions",
                color: secondaryGold,
              },
              {
                label: "INACTIVE",
                val: "7",
                support: "Requires attention",
                color: mutedText,
              },
            ].map((kpi, idx) => (
              <div
                key={idx}
                style={{
                  background: surface,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: mutedText,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {kpi.label}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: kpi.color,
                    marginTop: 4,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {kpi.val}
                </div>
                <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>
                  {kpi.support}
                </div>
              </div>
            ))}
          </div>

          {/* ── 2. SEARCH & FILTER CONTAINER ── */}
          <div
            style={{
              background: surface,
              borderRadius: 12,
              border: `1px solid ${border}`,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Search Field */}
              <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: mutedText,
                    fontSize: 14,
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search supplier name, supplier ID, phone or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    height: 44,
                    paddingLeft: 40,
                    paddingRight: 14,
                    borderRadius: 8,
                    background: inputBg,
                    color: primaryText,
                    border: `1px solid ${border}`,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 8,
                  background: inputBg,
                  color: primaryText,
                  border: `1px solid ${border}`,
                  fontSize: 13,
                  outline: "none",
                  cursor: "pointer",
                  minWidth: 140,
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="BLOCKED">Blocked</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 8,
                  background: inputBg,
                  color: primaryText,
                  border: `1px solid ${border}`,
                  fontSize: 13,
                  outline: "none",
                  cursor: "pointer",
                  minWidth: 140,
                }}
              >
                <option value="ALL">All Types</option>
                <option value="Company">Company</option>
                <option value="Contractor">Contractor</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Distributor">Distributor</option>
              </select>

              {/* Weighbridge Filter */}
              <select
                value={wbFilter}
                onChange={(e) => setWbFilter(e.target.value)}
                style={{
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 8,
                  background: inputBg,
                  color: primaryText,
                  border: `1px solid ${border}`,
                  fontSize: 13,
                  outline: "none",
                  cursor: "pointer",
                  minWidth: 140,
                }}
              >
                <option value="ALL">All Weighbridges</option>
                <option value="WB-01">WB-01</option>
                <option value="WB-02">WB-02</option>
                <option value="WB-03">WB-03</option>
                <option value="WB-04">WB-04</option>
                <option value="WB-05">WB-05</option>
              </select>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  paddingTop: 8,
                  borderTop: `1px solid ${divider}`,
                }}
              >
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: mutedText }}
                >
                  ACTIVE FILTERS:
                </span>
                {search && (
                  <span style={chipStyle}>{`Search: "${search}"`}</span>
                )}
                {statusFilter !== "ALL" && (
                  <span style={chipStyle}>{`Status: ${statusFilter}`}</span>
                )}
                {typeFilter !== "ALL" && (
                  <span style={chipStyle}>{`Type: ${typeFilter}`}</span>
                )}
                <button
                  onClick={clearFilters}
                  style={{
                    background: "none",
                    border: 0,
                    color: primaryOrange,
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: "pointer",
                    marginLeft: 4,
                  }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* ── 3. MAIN SUPPLIER TABLE CARD ── */}
          <div
            style={{
              background: surface,
              borderRadius: 12,
              border: `1px solid ${border}`,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: elevated,
                    borderBottom: `1px solid ${border}`,
                  }}
                >
                  <th style={thStyle} onClick={() => handleSort("code")}>
                    SUPPLIER ID{" "}
                    {sortField === "code"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                  <th style={thStyle} onClick={() => handleSort("name")}>
                    SUPPLIER NAME{" "}
                    {sortField === "name"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                  <th style={thStyle}>TYPE</th>
                  <th style={thStyle}>CONTACT PERSON</th>
                  <th style={thStyle}>PHONE</th>
                  <th style={thStyle}>MATERIALS</th>
                  <th style={thStyle}>VEHICLES</th>
                  <th style={thStyle}>LAST WEIGHMENT</th>
                  <th style={thStyle}>STATUS</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: 48,
                        textAlign: "center",
                        color: mutedText,
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🏭</div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        No Suppliers Found
                      </div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        No suppliers match your search query or filter
                        selection.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredList.map((row) => {
                    const isMenuOpen = activeMenuId === row.id;
                    const stColor =
                      row.status === "ACTIVE"
                        ? statusSuccess
                        : row.status === "SUSPENDED"
                          ? statusWarning
                          : row.status === "BLOCKED"
                            ? statusError
                            : mutedText;
                    const stBg =
                      row.status === "ACTIVE"
                        ? dm
                          ? "rgba(22,163,74,0.15)"
                          : "#F0FDF4"
                        : row.status === "SUSPENDED"
                          ? dm
                            ? "rgba(245,158,11,0.15)"
                            : "#FFFBEB"
                          : dm
                            ? "rgba(220,38,38,0.15)"
                            : "#FEF2F2";

                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: `1px solid ${divider}`,
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = elevated)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                        onClick={() => onNavigate("supplier-detail")}
                      >
                        {/* Supplier ID */}
                        <td
                          style={{
                            ...tdStyle,
                            fontFamily: "monospace",
                            fontSize: 12.5,
                            fontWeight: 800,
                            color: primaryOrange,
                          }}
                        >
                          {row.code}
                        </td>

                        {/* Supplier Name */}
                        <td style={tdStyle}>
                          <div
                            style={{
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: primaryText,
                            }}
                          >
                            {row.name}
                          </div>
                        </td>

                        {/* Type */}
                        <td
                          style={{
                            ...tdStyle,
                            fontSize: 12.5,
                            color: secondaryText,
                          }}
                        >
                          {row.type}
                        </td>

                        {/* Contact Person */}
                        <td
                          style={{
                            ...tdStyle,
                            fontSize: 12.5,
                            color: primaryText,
                            fontWeight: 600,
                          }}
                        >
                          {row.contact}
                        </td>

                        {/* Phone */}
                        <td
                          style={{
                            ...tdStyle,
                            fontSize: 12,
                            color: secondaryText,
                            fontFamily: "monospace",
                          }}
                        >
                          {row.phone}
                        </td>

                        {/* Materials */}
                        <td
                          style={{
                            ...tdStyle,
                            fontSize: 13,
                            fontWeight: 700,
                            color: secondaryGold,
                          }}
                        >
                          {row.materialsCount}
                        </td>

                        {/* Vehicles */}
                        <td
                          style={{
                            ...tdStyle,
                            fontSize: 13,
                            fontWeight: 700,
                            color: primaryText,
                          }}
                        >
                          {row.vehiclesCount}
                        </td>

                        {/* Last Weighment */}
                        <td
                          style={{ ...tdStyle, fontSize: 12, color: mutedText }}
                        >
                          {row.lastWeighment}
                        </td>

                        {/* Status */}
                        <td style={tdStyle}>
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 800,
                              background: stBg,
                              color: stColor,
                            }}
                          >
                            ● {row.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          style={{ ...tdStyle, textAlign: "right" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              justifyContent: "flex-end",
                              position: "relative",
                            }}
                          >
                            <button
                              onClick={() => onNavigate("supplier-detail")}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 6,
                                border: `1px solid ${border}`,
                                background: surface,
                                color: primaryOrange,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Details
                            </button>
                            {role === "admin" && (
                              <button
                                onClick={() => onNavigate("supplier-edit")}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  border: `1px solid ${border}`,
                                  background: surface,
                                  color: secondaryText,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: `1px solid ${border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: secondaryText,
              }}
            >
              <div>Showing 1–{filteredList.length} of 64 suppliers</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  disabled
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: `1px solid ${border}`,
                    background: elevated,
                    color: mutedText,
                    fontSize: 12,
                  }}
                >
                  Previous
                </button>
                <button
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: `1px solid ${primaryOrange}`,
                    background: primaryOrange,
                    color: "#FFF",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  1
                </button>
                <button
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: `1px solid ${border}`,
                    background: surface,
                    color: primaryText,
                    fontSize: 12,
                  }}
                >
                  2
                </button>
                <button
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: `1px solid ${border}`,
                    background: surface,
                    color: primaryText,
                    fontSize: 12,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
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
            SCREEN 35 — SUPPLIERS
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
              position: "relative",
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
              <span
                style={{ fontSize: 16, fontWeight: 800, color: primaryText }}
              >
                Suppliers
              </span>
              {role === "admin" && (
                <button
                  onClick={() => onNavigate("supplier-add")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: primaryOrange,
                    color: "#FFF",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  + Add
                </button>
              )}
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 16px 80px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <input
                type="text"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: 42,
                  padding: "0 12px",
                  borderRadius: 8,
                  background: inputBg,
                  color: primaryText,
                  border: `1px solid ${border}`,
                  fontSize: 13,
                  outline: "none",
                }}
              />

              {filteredList.map((row) => (
                <div
                  key={row.id}
                  onClick={() => onNavigate("supplier-detail")}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: elevated,
                    border: `1px solid ${border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: "monospace",
                        color: primaryOrange,
                        fontWeight: 800,
                      }}
                    >
                      {row.code}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 800,
                        background:
                          row.status === "ACTIVE"
                            ? dm
                              ? "rgba(22,163,74,0.15)"
                              : "#F0FDF4"
                            : elevated,
                        color:
                          row.status === "ACTIVE" ? statusSuccess : mutedText,
                      }}
                    >
                      ● {row.status}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    {row.name}
                  </div>
                  <div style={{ fontSize: 12, color: secondaryText }}>
                    Contact: {row.contact} · {row.phone}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: mutedText,
                      paddingTop: 4,
                      borderTop: `1px solid ${divider}`,
                    }}
                  >
                    <span>
                      Materials:{" "}
                      <strong style={{ color: secondaryGold }}>
                        {row.materialsCount}
                      </strong>
                    </span>
                    <span>
                      Vehicles:{" "}
                      <strong style={{ color: primaryText }}>
                        {row.vehiclesCount}
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Bottom Navigation */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: surface,
                borderTop: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              {[
                { icon: "🏠", label: "Home" },
                { icon: "秤", label: "Weigh" },
                { icon: "📜", label: "Transactions" },
                { icon: "🏭", label: "Suppliers" },
                { icon: "•••", label: "More" },
              ].map((nav, i) => (
                <button
                  key={i}
                  style={{
                    background: "none",
                    border: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    color: i === 3 ? primaryOrange : mutedText,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{nav.icon}</span>
                  <span
                    style={{ fontSize: 10, fontWeight: i === 3 ? 700 : 500 }}
                  >
                    {nav.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Helpers
const thStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 11,
  fontWeight: 800,
  color: "#6B7280",
  letterSpacing: "0.05em",
};
const tdStyle: React.CSSProperties = {
  padding: "14px",
  fontSize: 13,
  borderBottom: "1px solid #E2E8F0",
};
const chipStyle: React.CSSProperties = {
  padding: "3px 8px",
  borderRadius: 6,
  background: "#FFF7ED",
  color: "#F97316",
  fontSize: 11,
  fontWeight: 700,
  border: "1px solid #F97316",
};
