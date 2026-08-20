import React, { useState, useMemo } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

interface DriverItem {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  license: string;
  licenseStatus: "VALID" | "EXPIRING SOON" | "EXPIRED" | "NOT VERIFIED";
  vehicle: string;
  customer: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLOCKED";
  lastWeighment: string;
  lastWeighmentTime: string;
  weighbridge: string;
  totalWeighments: number;
}

const INITIAL_DRIVERS: DriverItem[] = [
  { id: "DRV-00124", name: "Arun Kumar", avatar: "AK", phone: "+91 98765 43210", license: "TN-XX-XXXXXXXX", licenseStatus: "VALID", vehicle: "TN22GH3456", customer: "Metro Builders Ltd", status: "ACTIVE", lastWeighment: "19 Aug 2026", lastWeighmentTime: "11:14 AM", weighbridge: "WB-01", totalWeighments: 248 },
  { id: "DRV-00125", name: "Ravi Kumar", avatar: "RK", phone: "+91 98761 12345", license: "TN-XX-YYYYYYYY", licenseStatus: "VALID", vehicle: "TN09AB7821", customer: "Southern Rocks Co", status: "ACTIVE", lastWeighment: "19 Aug 2026", lastWeighmentTime: "10:45 AM", weighbridge: "WB-01", totalWeighments: 184 },
  { id: "DRV-00126", name: "Priya Kumar", avatar: "PK", phone: "+91 98654 12345", license: "TN-XX-ZZZZZZZZ", licenseStatus: "EXPIRING SOON", vehicle: "TN38CD5567", customer: "Metro Builders Ltd", status: "ACTIVE", lastWeighment: "18 Aug 2026", lastWeighmentTime: "04:12 PM", weighbridge: "WB-02", totalWeighments: 96 },
  { id: "DRV-00127", name: "Suresh Kumar", avatar: "SK", phone: "+91 99443 12098", license: "TN-XX-AAAAAAAA", licenseStatus: "EXPIRED", vehicle: "—", customer: "—", status: "BLOCKED", lastWeighment: "17 Aug 2026", lastWeighmentTime: "02:16 PM", weighbridge: "WB-03", totalWeighments: 42 },
  { id: "DRV-00128", name: "Karthik P.", avatar: "KP", phone: "+91 97890 43211", license: "TN-XX-BBBBBBBB", licenseStatus: "VALID", vehicle: "TN11EF9021", customer: "Delta Mining Corp", status: "ACTIVE", lastWeighment: "16 Aug 2026", lastWeighmentTime: "09:30 AM", weighbridge: "WB-01", totalWeighments: 112 },
  { id: "DRV-00129", name: "Selvam T.", avatar: "ST", phone: "+91 98400 99887", license: "TN-XX-CCCCCCCC", licenseStatus: "VALID", vehicle: "TN18CD4521", customer: "Apex Infrastructure", status: "INACTIVE", lastWeighment: "12 Aug 2026", lastWeighmentTime: "03:45 PM", weighbridge: "WB-02", totalWeighments: 78 },
  { id: "DRV-00130", name: "Manoj Kumar", avatar: "MK", phone: "+91 97100 55443", license: "TN-XX-DDDDDDDD", licenseStatus: "NOT VERIFIED", vehicle: "TN05XY1122", customer: "Kumar Traders", status: "SUSPENDED", lastWeighment: "05 Aug 2026", lastWeighmentTime: "11:20 AM", weighbridge: "WB-04", totalWeighments: 15 },
];

export default function DriverManagementScreen({ darkMode, onToggleDark, onLogout, onNavigate }: Props) {
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

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [licenseFilter, setLicenseFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [wbFilter, setWbFilter] = useState("All");

  // Sorting
  const [sortField, setSortField] = useState<keyof DriverItem>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modals & Drawers
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const showExportToast = (format: string) => {
    setExportToast(`✓ Exported driver report as ${format}`);
    setTimeout(() => setExportToast(null), 3000);
  };

  // Filtered & sorted drivers list
  const filteredList = useMemo(() => {
    return INITIAL_DRIVERS.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.license.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.vehicle.toLowerCase().includes(q);

      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchLicense = licenseFilter === "All" || item.licenseStatus === licenseFilter;
      const matchVehicle = vehicleFilter === "All" || (vehicleFilter === "Assigned" ? item.vehicle !== "—" : item.vehicle === "—");
      const matchWb = wbFilter === "All" || item.weighbridge === wbFilter;

      return matchQ && matchStatus && matchLicense && matchVehicle && matchWb;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [searchQuery, statusFilter, licenseFilter, vehicleFilter, wbFilter, sortField, sortOrder]);

  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, page]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "All" || licenseFilter !== "All" || vehicleFilter !== "All" || wbFilter !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setLicenseFilter("All");
    setVehicleFilter("All");
    setWbFilter("All");
    setPage(1);
  };

  const handleSort = (field: keyof DriverItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 16px", fontSize: 11, fontWeight: 700, color: mutedText,
    letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "left",
    background: elevated, borderBottom: `1px solid ${border}`, cursor: "pointer",
    userSelect: "none", whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "14px 16px", fontSize: 13, color: primaryText,
    borderBottom: `1px solid ${divider}`, verticalAlign: "middle",
  };

  if (viewDevice === "mobile") return renderMobile();
  return renderDesktop();

  /* ─────────────────────────────────────────────────────────────────── */
  /*  DESKTOP LAYOUT                                                      */
  /* ─────────────────────────────────────────────────────────────────── */
  function renderDesktop() {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: bg, fontFamily: "'Inter', -apple-system, sans-serif", color: primaryText, display: "flex", flexDirection: "column" }}>

        {/* Export Toast */}
        {exportToast && (
          <div style={{ position: "fixed", top: 20, right: 24, zIndex: 1200, background: primaryOrange, color: "#FFF", padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            {exportToast}
          </div>
        )}



        {/* ── MAIN CANVAS SHELL ── */}
        <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 49px)" }}>

          {/* PAGE HEADER */}
          <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>
                Drivers
              </h1>
              <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>
                Manage drivers, licenses, vehicle assignments and driver activity.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {role === "admin" && (
                <button
                  onClick={() => onNavigate("driver-add")}
                  style={{
                    height: 44,
                    padding: "0 20px",
                    borderRadius: 8,
                    background: primaryOrange,
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 800,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  + ADD DRIVER
                </button>
              )}
            </div>
          </header>

          {/* BODY CONTAINER */}
          <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>

            {/* ── SUMMARY KPI ROW (4 CARDS) ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {/* Card 1 */}
              <div style={{ padding: 18, borderRadius: 12, background: elevated, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, letterSpacing: "0.05em" }}>TOTAL DRIVERS</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "monospace", color: primaryOrange, marginTop: 4 }}>128</div>
                <div style={{ fontSize: 11.5, color: secondaryText, marginTop: 2 }}>Registered drivers</div>
              </div>

              {/* Card 2 */}
              <div style={{ padding: 18, borderRadius: 12, background: elevated, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, letterSpacing: "0.05em" }}>ACTIVE</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "monospace", color: statusSuccess, marginTop: 4 }}>112</div>
                <div style={{ fontSize: 11.5, color: statusSuccess, fontWeight: 700, marginTop: 2 }}>● Currently active</div>
              </div>

              {/* Card 3 */}
              <div style={{ padding: 18, borderRadius: 12, background: elevated, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, letterSpacing: "0.05em" }}>LICENSE EXPIRING</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "monospace", color: secondaryGold, marginTop: 4 }}>8</div>
                <div style={{ fontSize: 11.5, color: secondaryGold, fontWeight: 700, marginTop: 2 }}>Within next 30 days</div>
              </div>

              {/* Card 4 */}
              <div style={{ padding: 18, borderRadius: 12, background: elevated, border: `1.5px solid ${statusError}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: statusError, letterSpacing: "0.05em" }}>LICENSE EXPIRED</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "monospace", color: statusError, marginTop: 4 }}>3</div>
                <div style={{ fontSize: 11.5, color: statusError, fontWeight: 700, marginTop: 2 }}>⚠ Requires attention</div>
              </div>
            </div>

            {/* ── SEARCH & MULTI-FILTER CONTROL BAR ── */}
            <div style={{ padding: 16, borderRadius: 12, background: surface, border: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                {/* Search */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  <input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    placeholder="Search driver name, driver ID, phone or license number..."
                    style={{ width: "100%", height: 42, padding: "0 14px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13, outline: "none" }}
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  style={{ height: 42, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  <option value="All">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="BLOCKED">Blocked</option>
                </select>

                {/* License Filter */}
                <select
                  value={licenseFilter}
                  onChange={(e) => { setLicenseFilter(e.target.value); setPage(1); }}
                  style={{ height: 42, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  <option value="All">All Licenses</option>
                  <option value="VALID">Valid</option>
                  <option value="EXPIRING SOON">Expiring Soon</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="NOT VERIFIED">Not Verified</option>
                </select>

                {/* Vehicle Filter */}
                <select
                  value={vehicleFilter}
                  onChange={(e) => { setVehicleFilter(e.target.value); setPage(1); }}
                  style={{ height: 42, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  <option value="All">All Vehicles</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Unassigned">Unassigned</option>
                </select>

                {/* Weighbridge Filter */}
                <select
                  value={wbFilter}
                  onChange={(e) => { setWbFilter(e.target.value); setPage(1); }}
                  style={{ height: 42, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                >
                  <option value="All">All Weighbridges</option>
                  <option value="WB-01">WB-01</option>
                  <option value="WB-02">WB-02</option>
                  <option value="WB-03">WB-03</option>
                  <option value="WB-04">WB-04</option>
                  <option value="WB-05">WB-05</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${border}`, background: "transparent", color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", paddingTop: 4, borderTop: `1px solid ${divider}` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>ACTIVE FILTERS:</span>
                  {searchQuery && (
                    <span style={{ padding: "3px 10px", borderRadius: 999, background: primaryOrangeSoft, color: primaryOrange, fontSize: 11, fontWeight: 700 }}>
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {statusFilter !== "All" && (
                    <span style={{ padding: "3px 10px", borderRadius: 999, background: primaryOrangeSoft, color: primaryOrange, fontSize: 11, fontWeight: 700 }}>
                      Status: {statusFilter}
                    </span>
                  )}
                  {licenseFilter !== "All" && (
                    <span style={{ padding: "3px 10px", borderRadius: 999, background: secondaryGoldSoft, color: secondaryGold, fontSize: 11, fontWeight: 700 }}>
                      License: {licenseFilter}
                    </span>
                  )}
                  {wbFilter !== "All" && (
                    <span style={{ padding: "3px 10px", borderRadius: 999, background: primaryOrangeSoft, color: primaryOrange, fontSize: 11, fontWeight: 700 }}>
                      Weighbridge: {wbFilter}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ── MAIN DRIVER CONTENT CARD ── */}
            <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>

              {/* Card Header */}
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>
                    DRIVER LIST
                  </h3>
                  <div style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}>
                    {filteredList.length} registered drivers found
                  </div>
                </div>

                {role === "admin" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => showExportToast("CSV")}
                      style={{ height: 36, padding: "0 14px", borderRadius: 8, background: surface, border: `1px solid ${border}`, color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >
                      ↓ Export CSV
                    </button>
                    <button
                      onClick={() => showExportToast("Excel")}
                      style={{ height: 36, padding: "0 14px", borderRadius: 8, background: surface, border: `1px solid ${border}`, color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >
                      ↓ Export Excel
                    </button>
                  </div>
                )}
              </div>

              {/* TABLE OR EMPTY STATE */}
              {filteredList.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: dm ? "rgba(234,179,8,0.12)" : "#FEF3C7", color: secondaryGold, fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto" }}>
                    🔍
                  </div>
                  <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: primaryText }}>No Drivers Found</h4>
                  <p style={{ fontSize: 13, color: mutedText, margin: "6px 0 20px 0" }}>
                    Try changing your search keywords or filter criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    style={{ padding: "10px 20px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                    <thead>
                      <tr>
                        <th style={thStyle} onClick={() => handleSort("name")}>DRIVER {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                        <th style={thStyle} onClick={() => handleSort("id")}>DRIVER ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                        <th style={thStyle}>PHONE</th>
                        <th style={thStyle}>LICENSE</th>
                        <th style={thStyle} onClick={() => handleSort("licenseStatus")}>LICENSE STATUS {sortField === "licenseStatus" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                        <th style={thStyle}>ASSIGNED VEHICLE</th>
                        <th style={thStyle}>CUSTOMER</th>
                        <th style={thStyle} onClick={() => handleSort("status")}>STATUS {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                        <th style={thStyle}>LAST WEIGHMENT</th>
                        <th style={{ ...thStyle, textAlign: "right" }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedList.map((row) => {
                        const licColor = row.licenseStatus === "VALID" ? statusSuccess : row.licenseStatus === "EXPIRING SOON" ? statusWarning : row.licenseStatus === "EXPIRED" ? statusError : mutedText;
                        const licBg = row.licenseStatus === "VALID" ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : row.licenseStatus === "EXPIRING SOON" ? (dm ? "rgba(245,158,11,0.15)" : "#FFFBEB") : row.licenseStatus === "EXPIRED" ? (dm ? "rgba(220,38,38,0.15)" : "#FEF2F2") : elevated;

                        const stColor = row.status === "ACTIVE" ? statusSuccess : row.status === "INACTIVE" ? mutedText : row.status === "SUSPENDED" ? statusWarning : statusError;
                        const stBg = row.status === "ACTIVE" ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : dm ? "rgba(255,255,255,0.06)" : "#F1F5F9";

                        return (
                          <tr
                            key={row.id}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = dm ? "#273449" : "#F8FAFC")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            onClick={() => onNavigate("driver-detail")}
                          >
                            {/* Driver Name & Avatar */}
                            <td style={tdStyle}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 999, background: primaryOrange, color: "#FFF", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  {row.avatar}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: primaryText }}>{row.name}</div>
                                  <div style={{ fontSize: 11, color: mutedText }}>{row.totalWeighments} weighments</div>
                                </div>
                              </div>
                            </td>

                            {/* Driver ID */}
                            <td style={tdStyle}>
                              <span style={{ color: primaryOrange, fontWeight: 700, fontFamily: "monospace" }}>
                                {row.id}
                              </span>
                            </td>

                            {/* Phone */}
                            <td style={{ ...tdStyle, color: secondaryText }}>{row.phone}</td>

                            {/* License */}
                            <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>{row.license}</td>

                            {/* License Status */}
                            <td style={tdStyle}>
                              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: licBg, color: licColor }}>
                                ● {row.licenseStatus}
                              </span>
                            </td>

                            {/* Vehicle */}
                            <td style={tdStyle}>
                              {row.vehicle !== "—" ? (
                                <span style={{ color: primaryText, fontWeight: 700, fontFamily: "monospace" }}>
                                  {row.vehicle}
                                </span>
                              ) : (
                                <span style={{ color: mutedText }}>—</span>
                              )}
                            </td>

                            {/* Customer */}
                            <td style={{ ...tdStyle, color: secondaryText }}>{row.customer}</td>

                            {/* Driver Status */}
                            <td style={tdStyle}>
                              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: stBg, color: stColor }}>
                                ● {row.status}
                              </span>
                            </td>

                            {/* Last Weighment */}
                            <td style={tdStyle}>
                              <div>
                                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{row.lastWeighment}</div>
                                <div style={{ fontSize: 11, color: mutedText }}>{row.lastWeighmentTime} • {row.weighbridge}</div>
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", position: "relative" }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate("driver-detail");
                                  }}
                                  style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                >
                                  Details
                                </button>
                                {role === "admin" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onNavigate("driver-edit");
                                    }}
                                    style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                                  >
                                    Edit
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

              {/* PAGINATION */}
              {filteredList.length > 0 && (
                <div style={{ padding: "14px 20px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: mutedText }}>
                  <span>
                    Showing {Math.min((page - 1) * pageSize + 1, filteredList.length)}–{Math.min(page * pageSize, filteredList.length)} of {filteredList.length} drivers
                  </span>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      style={{ height: 32, padding: "0 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: page === 1 ? mutedText : primaryText, fontSize: 12, fontWeight: 600, cursor: page === 1 ? "not-allowed" : "pointer" }}
                    >
                      ← Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{ height: 32, width: 32, borderRadius: 6, border: `1px solid ${p === page ? primaryOrange : border}`, background: p === page ? primaryOrange : surface, color: p === page ? "#FFF" : primaryText, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      style={{ height: 32, padding: "0 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: page === totalPages ? mutedText : primaryText, fontSize: 12, fontWeight: 600, cursor: page === totalPages ? "not-allowed" : "pointer" }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
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



        {/* Mobile Frame Container */}
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 40px" }}>
          <div
            style={{
              width: 390,
              minHeight: 844,
              maxHeight: 900,
              background: surface,
              borderRadius: 36,
              border: `10px solid ${dm ? "#1F2937" : "#0F172A"}`,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Notch */}
            <div style={{ width: 140, height: 24, background: dm ? "#1F2937" : "#0F172A", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, margin: "0 auto", zIndex: 50 }} />

            {/* Mobile Header */}
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: primaryText }}>Drivers</div>
                <div style={{ fontSize: 11, color: secondaryGold, fontWeight: 700 }}>128 Drivers Registered</div>
              </div>
              {role === "admin" && (
                <button
                  onClick={() => onNavigate("driver-add")}
                  style={{ minWidth: 44, minHeight: 44, padding: "0 14px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
                >
                  + Add
                </button>
              )}
            </div>

            {/* Mobile Body Content */}
            <div style={{ padding: "16px 16px 90px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Mobile Search */}
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drivers..."
                style={{ width: "100%", height: 44, padding: "0 14px", borderRadius: 10, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13 }}
              />

              {/* Mobile KPI Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ padding: 10, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: mutedText }}>TOTAL DRIVERS</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: primaryOrange, marginTop: 2 }}>128</div>
                </div>
                <div style={{ padding: 10, borderRadius: 10, background: elevated, border: `1.5px solid ${statusError}` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: statusError }}>LICENSE EXPIRED</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: statusError, marginTop: 2 }}>3</div>
                </div>
              </div>

              {/* Mobile Driver Cards List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate("driver-detail")}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      background: elevated,
                      border: `1px solid ${border}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      cursor: "pointer",
                    }}
                  >
                    {/* Top Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 999, background: primaryOrange, color: "#FFF", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {item.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: primaryText }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: primaryOrange, fontFamily: "monospace", fontWeight: 700 }}>{item.id}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: item.status === "ACTIVE" ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : (dm ? "rgba(220,38,38,0.15)" : "#FEF2F2"), color: item.status === "ACTIVE" ? statusSuccess : statusError }}>
                        ● {item.status}
                      </span>
                    </div>

                    {/* Middle Info */}
                    <div style={{ fontSize: 12, color: secondaryText, display: "flex", flexDirection: "column", gap: 3 }}>
                      <div>Phone: <strong>{item.phone}</strong></div>
                      <div>License: <span style={{ fontFamily: "monospace" }}>{item.license}</span> (<span style={{ color: item.licenseStatus === "VALID" ? statusSuccess : statusError, fontWeight: 700 }}>{item.licenseStatus}</span>)</div>
                      <div>Vehicle: <strong style={{ color: primaryText, fontFamily: "monospace" }}>{item.vehicle}</strong></div>
                    </div>

                    {/* Bottom Action */}
                    <div style={{ paddingTop: 6, borderTop: `1px solid ${divider}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: mutedText }}>Last: {item.lastWeighment}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigate("driver-detail"); }}
                        style={{ minHeight: 44, padding: "0 16px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: surface, borderTop: `1px solid ${border}`, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", alignItems: "center", textTransform: "uppercase" }}>
              <button onClick={() => onNavigate("operator-dashboard")} style={{ background: "none", border: "none", color: mutedText, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Home</button>
              <button onClick={() => onNavigate("vehicle-entry")} style={{ background: "none", border: "none", color: primaryOrange, fontSize: 10, fontWeight: 800, cursor: "pointer" }}>Weigh</button>
              <button onClick={() => onNavigate("pending-weighments")} style={{ background: "none", border: "none", color: mutedText, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Pending</button>
              <button onClick={() => onNavigate("drivers")} style={{ background: "none", border: "none", color: primaryOrange, fontSize: 10, fontWeight: 800, cursor: "pointer" }}>Drivers</button>
              <button onClick={() => onNavigate("operator-dashboard")} style={{ background: "none", border: "none", color: mutedText, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>More</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
