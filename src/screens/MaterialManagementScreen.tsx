import React, { useState, useMemo } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export interface MaterialRow {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  suppliersCount: number;
  weighmentsCount: number;
  totalWeight: string;
  lastUsed: string;
  status: "ACTIVE" | "INACTIVE";
}

const INITIAL_MATERIALS: MaterialRow[] = [
  { id: "1", name: "Blue Metal 20mm", code: "MAT-00041", category: "Aggregates", unit: "TON", suppliersCount: 18, weighmentsCount: 286, totalWeight: "8,420 TON", lastUsed: "19 Aug 2026 · 10:45 AM", status: "ACTIVE" },
  { id: "2", name: "Blue Metal 12mm", code: "MAT-00042", category: "Aggregates", unit: "TON", suppliersCount: 14, weighmentsCount: 212, totalWeight: "6,180 TON", lastUsed: "19 Aug 2026 · 09:30 AM", status: "ACTIVE" },
  { id: "3", name: "Crushed Stone Powder", code: "MAT-00043", category: "Fines", unit: "TON", suppliersCount: 9, weighmentsCount: 145, totalWeight: "3,890 TON", lastUsed: "18 Aug 2026 · 04:12 PM", status: "ACTIVE" },
  { id: "4", name: "River Sand Grade A", code: "MAT-00044", category: "Sand", unit: "TON", suppliersCount: 4, weighmentsCount: 68, totalWeight: "1,940 TON", lastUsed: "15 Aug 2026 · 01:30 PM", status: "INACTIVE" },
  { id: "5", name: "M-Sand (Manufactured)", code: "MAT-00045", category: "Sand", unit: "TON", suppliersCount: 22, weighmentsCount: 410, totalWeight: "12,450 TON", lastUsed: "19 Aug 2026 · 11:20 AM", status: "ACTIVE" },
  { id: "6", name: "Granite Jelly 40mm", code: "MAT-00046", category: "Aggregates", unit: "TON", suppliersCount: 11, weighmentsCount: 184, totalWeight: "5,120 TON", lastUsed: "17 Aug 2026 · 02:45 PM", status: "ACTIVE" },
];

export default function MaterialManagementScreen({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Props) {
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
  const primaryOrangeSoft = dm ? "#273449" : "#FFF7ED";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";
  const secondaryGoldSoft = dm ? "#422F0A" : "#FFFBEB";

  const statusSuccess = "#16A34A";

  // State
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [wbFilter, setWbFilter] = useState("ALL");
  const [sortField, setSortField] = useState<keyof MaterialRow>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtering
  const filteredList = useMemo(() => {
    return INITIAL_MATERIALS.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchCategory = categoryFilter === "ALL" || item.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        const comp = (valA as string).localeCompare(valB as string);
        return sortOrder === "asc" ? comp : -comp;
      }
      if (typeof valA === "number") {
        return sortOrder === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
      return 0;
    });
  }, [search, statusFilter, categoryFilter, sortField, sortOrder]);

  const handleSort = (field: keyof MaterialRow) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const hasActiveFilters = search !== "" || statusFilter !== "ALL" || categoryFilter !== "ALL" || wbFilter !== "ALL";

  const clearFilters = () => {
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
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
      <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* PAGE HEADER */}
            <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>
                  MATERIALS
                </h1>
                <p style={{ fontSize: 14, color: mutedText, margin: "2px 0 0 0" }}>
                  Manage materials, categories, pricing and weighment activity.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {role === "admin" && (
                  <button
                    onClick={() => onNavigate("material-add")}
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
                    <span>ADD MATERIAL</span>
                  </button>
                )}
              </div>
            </header>

            {/* PAGE CONTENT CONTAINER */}
            <div style={{ flex: 1, padding: "24px 32px 48px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>

              {/* ── 1. KPI SUMMARY ROW (4 CARDS) ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {[
                  { label: "TOTAL MATERIALS", val: "42", support: "Configured materials", color: primaryOrange },
                  { label: "ACTIVE", val: "38", support: "Currently active", color: statusSuccess },
                  { label: "USED IN WEIGHMENTS", val: "35", support: "Materials with transactions", color: secondaryGold },
                  { label: "INACTIVE", val: "4", support: "Requires attention", color: mutedText },
                ].map((kpi, idx) => (
                  <div key={idx} style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase" }}>{kpi.label}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: kpi.color, marginTop: 4, fontFamily: "Inter, sans-serif" }}>
                      {kpi.val}
                    </div>
                    <div style={{ fontSize: 12, color: mutedText, marginTop: 2 }}>
                      {kpi.support}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── 2. SEARCH & FILTER CONTAINER ── */}
              <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                  {/* Search Field */}
                  <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: mutedText, fontSize: 14 }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search material name, material ID, category or description..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: "100%", height: 44, paddingLeft: 40, paddingRight: 14, borderRadius: 8,
                        background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13, outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ height: 44, padding: "0 14px", borderRadius: 8, background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13, outline: "none", cursor: "pointer", minWidth: 140 }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ height: 44, padding: "0 14px", borderRadius: 8, background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13, outline: "none", cursor: "pointer", minWidth: 140 }}
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Aggregates">Aggregates</option>
                    <option value="Sand">Sand</option>
                    <option value="Fines">Fines</option>
                  </select>

                  {/* Weighbridge Filter */}
                  <select
                    value={wbFilter}
                    onChange={(e) => setWbFilter(e.target.value)}
                    style={{ height: 44, padding: "0 14px", borderRadius: 8, background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13, outline: "none", cursor: "pointer", minWidth: 140 }}
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
                  <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8, borderTop: `1px solid ${divider}` }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>ACTIVE FILTERS:</span>
                    {search && <span style={chipStyle}>{`Search: "${search}"`}</span>}
                    {statusFilter !== "ALL" && <span style={chipStyle}>{`Status: ${statusFilter}`}</span>}
                    {categoryFilter !== "ALL" && <span style={chipStyle}>{`Category: ${categoryFilter}`}</span>}
                    <button onClick={clearFilters} style={{ background: "none", border: 0, color: primaryOrange, fontSize: 11, fontWeight: 800, cursor: "pointer", marginLeft: 4 }}>Clear All</button>
                  </div>
                )}
              </div>

              {/* ── 3. MAIN MATERIAL TABLE CARD ── */}
              <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: elevated, borderBottom: `1px solid ${border}` }}>
                      <th style={thStyle} onClick={() => handleSort("code")}>MATERIAL ID {sortField === "code" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
                      <th style={thStyle} onClick={() => handleSort("name")}>MATERIAL NAME {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
                      <th style={thStyle}>CATEGORY</th>
                      <th style={thStyle}>UNIT</th>
                      <th style={thStyle}>SUPPLIERS</th>
                      <th style={thStyle}>WEIGHMENTS</th>
                      <th style={thStyle}>TOTAL WEIGHT</th>
                      <th style={thStyle}>LAST USED</th>
                      <th style={thStyle}>STATUS</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ padding: 48, textAlign: "center", color: mutedText }}>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>No Materials Found</div>
                          <div style={{ fontSize: 12, marginTop: 4 }}>No materials match your search query or filter selection.</div>
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((row) => {
                        return (
                          <tr
                            key={row.id}
                            style={{ borderBottom: `1px solid ${divider}`, cursor: "pointer", transition: "background 0.15s ease" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = elevated)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            onClick={() => onNavigate("material-detail")}
                          >
                            {/* Material ID */}
                            <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12.5, fontWeight: 800, color: primaryOrange }}>
                              {row.code}
                            </td>

                            {/* Material Name */}
                            <td style={tdStyle}>
                              <div style={{ fontSize: 13.5, fontWeight: 700, color: primaryText }}>{row.name}</div>
                            </td>

                            {/* Category */}
                            <td style={{ ...tdStyle, fontSize: 12.5, color: secondaryText }}>
                              {row.category}
                            </td>

                            {/* Unit */}
                            <td style={{ ...tdStyle, fontSize: 12.5, color: primaryText, fontWeight: 700, fontFamily: "monospace" }}>
                              {row.unit}
                            </td>

                            {/* Suppliers Count */}
                            <td style={{ ...tdStyle, fontSize: 13, fontWeight: 700, color: secondaryGold }}>
                              {row.suppliersCount}
                            </td>

                            {/* Weighments Count */}
                            <td style={{ ...tdStyle, fontSize: 13, fontWeight: 700, color: primaryText }}>
                              {row.weighmentsCount}
                            </td>

                            {/* Total Weight */}
                            <td style={{ ...tdStyle, fontSize: 13, fontWeight: 800, color: secondaryGold, fontFamily: "monospace" }}>
                              {row.totalWeight}
                            </td>

                            {/* Last Used */}
                            <td style={{ ...tdStyle, fontSize: 12, color: mutedText }}>
                              {row.lastUsed}
                            </td>

                            {/* Status */}
                            <td style={tdStyle}>
                              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: row.status === "ACTIVE" ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : elevated, color: row.status === "ACTIVE" ? statusSuccess : mutedText }}>
                                ● {row.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td style={{ ...tdStyle, textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => onNavigate("material-detail")}
                                  style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                >
                                  Details
                                </button>
                                {role === "admin" && (
                                  <button
                                    onClick={() => onNavigate("material-edit")}
                                    style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
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
                <div style={{ padding: "14px 24px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: secondaryText }}>
                  <div>Showing 1–{filteredList.length} of 42 materials</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button disabled style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: elevated, color: mutedText, fontSize: 12 }}>Previous</button>
                    <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${primaryOrange}`, background: primaryOrange, color: "#FFF", fontSize: 12, fontWeight: 700 }}>1</button>
                    <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryText, fontSize: 12 }}>2</button>
                    <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryText, fontSize: 12 }}>Next</button>
                  </div>
                </div>
              </div>

          </div>
      </div>
    );
  }

  function renderMobileView() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, color: primaryText, padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>Materials</h2>
        <button onClick={() => onNavigate("dashboard")} style={{ padding: "8px 16px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", marginTop: 12 }}>Back to Dashboard</button>
      </div>
    );
  }
}

// Helpers
const thStyle: React.CSSProperties = { padding: "12px 14px", fontSize: 11, fontWeight: 800, color: "#6B7280", letterSpacing: "0.05em" };
const tdStyle: React.CSSProperties = { padding: "14px", fontSize: 13, borderBottom: "1px solid #E2E8F0" };
const chipStyle: React.CSSProperties = { padding: "3px 8px", borderRadius: 6, background: "#FFF7ED", color: "#F97316", fontSize: 11, fontWeight: 700, border: "1px solid #F97316" };
