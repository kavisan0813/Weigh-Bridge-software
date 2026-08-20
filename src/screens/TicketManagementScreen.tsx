import React, { useState, useMemo } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator" | "maintenance";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export interface TicketRow {
  id: string;
  code: string;
  title: string;
  category: "Weighbridge" | "Camera" | "Printer" | "Indicator" | "Network" | "Software" | "Hardware" | "Maintenance" | "Other";
  weighbridge: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "PENDING" | "RESOLVED" | "CLOSED" | "OVERDUE";
  assignedTo: string;
  created: string;
  sla: string;
  isOverdue: boolean;
  lastUpdated: string;
  creator: string;
}

const INITIAL_TICKETS: TicketRow[] = [
  { id: "1", code: "TKT-10248", title: "WB-02 Indicator Not Reading", category: "Indicator", weighbridge: "WB-02", priority: "HIGH", status: "OPEN", assignedTo: "Raj Kumar", created: "20 Aug 2026", sla: "02h 18m", isOverdue: false, lastUpdated: "20 Aug 2026 · 10:30 AM", creator: "Arun Kumar" },
  { id: "2", code: "TKT-10247", title: "Printer Not Printing Ticket", category: "Printer", weighbridge: "WB-01", priority: "MEDIUM", status: "IN_PROGRESS", assignedTo: "Arun Kumar", created: "20 Aug 2026", sla: "05h 42m", isOverdue: false, lastUpdated: "20 Aug 2026 · 09:15 AM", creator: "Suresh Kumar" },
  { id: "3", code: "TKT-10246", title: "Camera Connection Lost", category: "Camera", weighbridge: "WB-04", priority: "CRITICAL", status: "OPEN", assignedTo: "Maintenance Team", created: "19 Aug 2026", sla: "OVERDUE", isOverdue: true, lastUpdated: "20 Aug 2026 · 08:00 AM", creator: "Karthik P." },
  { id: "4", code: "TKT-10245", title: "Network Intermittent Dropouts", category: "Network", weighbridge: "WB-03", priority: "HIGH", status: "RESOLVED", assignedTo: "IT Support", created: "19 Aug 2026", sla: "Completed", isOverdue: false, lastUpdated: "19 Aug 2026 · 04:45 PM", creator: "Ravi Raj" },
  { id: "5", code: "TKT-10244", title: "ANPR Plate Recognition Failure", category: "Camera", weighbridge: "WB-05", priority: "MEDIUM", status: "IN_PROGRESS", assignedTo: "IT Support", created: "19 Aug 2026", sla: "08h 10m", isOverdue: false, lastUpdated: "19 Aug 2026 · 02:20 PM", creator: "Arun Kumar" },
  { id: "6", code: "TKT-10243", title: "Load Cell Zero Calibration Drift", category: "Weighbridge", weighbridge: "WB-01", priority: "CRITICAL", status: "OPEN", assignedTo: "Maintenance Team", created: "18 Aug 2026", sla: "OVERDUE", isOverdue: true, lastUpdated: "19 Aug 2026 · 11:10 AM", creator: "Arun Kumar" },
  { id: "7", code: "TKT-10242", title: "Barrier Gate Sensor Unresponsive", category: "Hardware", weighbridge: "WB-02", priority: "LOW", status: "CLOSED", assignedTo: "Field Tech", created: "17 Aug 2026", sla: "Completed", isOverdue: false, lastUpdated: "18 Aug 2026 · 05:00 PM", creator: "Suresh Kumar" },
];

export default function TicketManagementScreen({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Props) {
  // Palettes & System tokens
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
  const statusWarning = "#F59E0B";
  const statusError = "#DC2626";
  const statusInfo = "#2563EB";
  const statusPurple = "#8B5CF6";

  // State
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [search, setSearch] = useState("");
  const [quickStatus, setQuickStatus] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [wbFilter, setWbFilter] = useState("ALL");
  const [assignedFilter, setAssignedFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");
  const [sortField, setSortField] = useState<keyof TicketRow>("code");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [createTicketModalOpen, setCreateTicketModalOpen] = useState(false);

  // Filtering
  const filteredList = useMemo(() => {
    return INITIAL_MATERIALS_TICKETS(role).filter((item) => {
      const matchSearch =
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.weighbridge.toLowerCase().includes(search.toLowerCase()) ||
        item.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const activeSt = quickStatus !== "ALL" ? quickStatus : statusFilter;
      const matchStatus = activeSt === "ALL" || item.status === activeSt || (activeSt === "OVERDUE" && item.isOverdue);
      const matchPriority = priorityFilter === "ALL" || item.priority === priorityFilter;
      const matchCat = categoryFilter === "ALL" || item.category === categoryFilter;
      const matchWb = wbFilter === "ALL" || item.weighbridge === wbFilter;
      const matchAssigned = assignedFilter === "ALL" || item.assignedTo === assignedFilter;

      return matchSearch && matchStatus && matchPriority && matchCat && matchWb && matchAssigned;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        const comp = (valA as string).localeCompare(valB as string);
        return sortOrder === "asc" ? comp : -comp;
      }
      return 0;
    });
  }, [role, search, quickStatus, statusFilter, priorityFilter, categoryFilter, wbFilter, assignedFilter, sortField, sortOrder]);

  function INITIAL_MATERIALS_TICKETS(currentRole: UserRole) {
    if (currentRole === "operator") {
      // Operators view permitted / own tickets
      return INITIAL_TICKETS.filter(t => t.creator === "Arun Kumar" || t.assignedTo === "Arun Kumar" || t.weighbridge === "WB-01");
    }
    return INITIAL_TICKETS;
  }

  const handleSort = (field: keyof TicketRow) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount = (statusFilter !== "ALL" ? 1 : 0) + (priorityFilter !== "ALL" ? 1 : 0) + (categoryFilter !== "ALL" ? 1 : 0) + (wbFilter !== "ALL" ? 1 : 0) + (assignedFilter !== "ALL" ? 1 : 0);

  const clearFilters = () => {
    setQuickStatus("ALL");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCategoryFilter("ALL");
    setWbFilter("ALL");
    setAssignedFilter("ALL");
    setDateRange("ALL");
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
      <div style={{ display: "flex", minHeight: "100vh", background: bg, color: primaryText, fontFamily: "'Inter', -apple-system, sans-serif" }}>

        {/* Create Ticket Modal Mock */}
        {createTicketModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 520, background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: 28, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: primaryText }}>+ CREATE SUPPORT TICKET</h3>
                <button onClick={() => setCreateTicketModalOpen(false)} style={{ background: "none", border: 0, color: mutedText, fontSize: 16, cursor: "pointer" }}>✕</button>
              </div>
              <p style={{ margin: "0 0 20px 0", fontSize: 13, color: secondaryText }}>
                Report an operational issue with a weighbridge, indicator, camera, printer or software component.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: mutedText, textTransform: "uppercase" }}>TICKET TITLE *</label>
                  <input type="text" placeholder="e.g. WB-03 Loadcell Zero Offset Error" style={{ width: "100%", height: 42, padding: "0 12px", borderRadius: 8, background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13, outline: "none" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: mutedText, textTransform: "uppercase" }}>CATEGORY *</label>
                    <select style={{ width: "100%", height: 42, padding: "0 12px", borderRadius: 8, background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13 }}>
                      <option>Weighbridge</option>
                      <option>Camera</option>
                      <option>Printer</option>
                      <option>Indicator</option>
                      <option>Network</option>
                      <option>Software</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: mutedText, textTransform: "uppercase" }}>WEIGHBRIDGE *</label>
                    <select style={{ width: "100%", height: 42, padding: "0 12px", borderRadius: 8, background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13 }}>
                      <option>WB-01</option>
                      <option>WB-02</option>
                      <option>WB-03</option>
                      <option>WB-04</option>
                      <option>WB-05</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
                  <button onClick={() => setCreateTicketModalOpen(false)} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                  <button onClick={() => { setCreateTicketModalOpen(false); alert("Support Ticket Created Successfully!"); }} style={{ height: 40, padding: "0 20px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Create Ticket</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SIDEBAR ── */}
        <aside style={{ width: 248, minWidth: 248, height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", background: dm ? "#1F2937" : "#0F2438", borderRight: `1px solid ${border}`, flexShrink: 0, zIndex: 40 }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: primaryOrange, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#FFF", fontSize: 16 }}>⚖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF" }}>WEIGHBRIDGE</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>ABC Industries</div>
            </div>
          </div>

          <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { key: "dashboard", label: "Dashboard", icon: "📊" },
              { key: "monitoring", label: "Weighbridges", icon: "⚖" },
              { key: "pending", label: "Pending Weighments", icon: "⏳" },
              { key: "transactions", label: "Transactions", icon: "📜" },
              { key: "vehicles", label: "Vehicles", icon: "🚛" },
              { key: "drivers", label: "Drivers", icon: "👤" },
              { key: "customers", label: "Customers", icon: "🏢" },
              { key: "suppliers", label: "Suppliers", icon: "🏭" },
              { key: "materials", label: "Materials", icon: "📦" },
              { key: "tickets", label: "Tickets", icon: "🎟", active: true },
              { key: "employees", label: "Employees", icon: "👷" },
              { key: "reports", label: "Reports", icon: "📈" },
              { key: "auditlogs", label: "Audit Logs", icon: "🛡" },
              { key: "settings", label: "Settings", icon: "⚙" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, border: "none",
                  background: item.active ? (dm ? "#FB923C" : "#F97316") : "transparent",
                  color: item.active ? "#FFFFFF" : "#94A3B8",
                  fontSize: 13, fontWeight: item.active ? 700 : 500, cursor: "pointer", textAlign: "left"
                }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* TESTING & DEMO TOOLBAR */}
          <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, zIndex: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: secondaryGold, letterSpacing: "0.08em" }}>SCREEN 45</span>
              <span style={{ color: "#475569" }}>|</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB" }}>TICKET LIST / ISSUE MANAGEMENT</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6, gap: 2 }}>
                {(["desktop", "mobile"] as ViewDevice[]).map(d => (
                  <button key={d} onClick={() => setViewDevice(d)} style={{ padding: "3px 9px", borderRadius: 4, border: "none", background: viewDevice === d ? primaryOrange : "transparent", color: viewDevice === d ? "#FFF" : "#94A3B8", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{d === "desktop" ? "💻 Desktop" : "📲 Mobile"}</button>
                ))}
              </div>
              <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6, gap: 2 }}>
                {(["admin", "operator", "maintenance"] as UserRole[]).map(r => (
                  <button key={r} onClick={() => setRole(r)} style={{ padding: "3px 9px", borderRadius: 4, border: "none", background: role === r ? secondaryGold : "transparent", color: role === r ? "#FFF" : "#94A3B8", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{r}</button>
                ))}
              </div>
              <button onClick={onToggleDark} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#F9FAFB", fontSize: 11, cursor: "pointer" }}>{dm ? "☀️ Light" : "🌙 Dark"}</button>
            </div>
          </header>

          {/* ── MAIN CANVAS SHELL ── */}
          <div style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", background: surface, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 49px)" }}>

            {/* PAGE HEADER */}
            <header style={{ height: 68, padding: "0 32px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 11, color: mutedText, fontWeight: 600, marginBottom: 2, display: "flex", gap: 6 }}>
                  <span>Support</span>
                  <span>/</span>
                  <span style={{ color: primaryOrange }}>Tickets</span>
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>TICKETS</h1>
                <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>Track, assign and manage operational support and maintenance issues.</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {role === "admin" && (
                  <button
                    onClick={() => alert("Exporting Ticket Data...")}
                    style={{ height: 44, padding: "0 16px", borderRadius: 8, background: elevated, color: primaryText, border: `1px solid ${border}`, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    📥 Export
                  </button>
                )}
                <button
                  onClick={() => setCreateTicketModalOpen(true)}
                  style={{
                    height: 52, padding: "0 22px", borderRadius: 12, background: primaryOrange, color: "#FFFFFF",
                    fontSize: 13, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                    display: "flex", alignItems: "center", gap: 8
                  }}
                >
                  <span style={{ fontSize: 16 }}>+</span>
                  <span>CREATE TICKET</span>
                </button>
              </div>
            </header>

            {/* PAGE CONTENT CONTAINER */}
            <div style={{ flex: 1, padding: "24px 32px 48px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>

              {/* OVERDUE TICKETS ALERT BANNER */}
              <div style={{ background: dm ? "rgba(220,38,38,0.12)" : "#FEF2F2", border: `1px solid ${statusError}`, borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: statusError, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>⚠</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: statusError }}>14 Tickets Past SLA (Overdue)</div>
                    <div style={{ fontSize: 12, color: dm ? "#FCA5A5" : "#991B1B" }}>Critical weighbridge and hardware tickets require immediate technician dispatch.</div>
                  </div>
                </div>
                <button
                  onClick={() => setQuickStatus("OVERDUE")}
                  style={{ padding: "6px 14px", borderRadius: 6, background: statusError, color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                >
                  View Overdue Tickets
                </button>
              </div>

              {/* ── 1. KPI SUMMARY ROW ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
                {[
                  { label: "TOTAL TICKETS", val: "248", support: "All accessible tickets", color: primaryText, icon: "🎟" },
                  { label: "OPEN", val: "42", support: "Needs attention", color: statusWarning, icon: "●" },
                  { label: "IN PROGRESS", val: "28", support: "Currently handled", color: statusInfo, icon: "⏳" },
                  { label: "RESOLVED", val: "164", support: "Successfully resolved", color: statusSuccess, icon: "✓" },
                  { label: "OVERDUE", val: "14", support: "Past SLA limits", color: statusError, icon: "⚠" },
                ].map((kpi, idx) => (
                  <div key={idx} style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 2px rgba(15,23,42,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: mutedText, letterSpacing: "0.05em" }}>{kpi.label}</span>
                      <span style={{ fontSize: 12, color: kpi.color }}>{kpi.icon}</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: kpi.color, letterSpacing: "-0.02em" }}>{kpi.val}</div>
                    <div style={{ fontSize: 11.5, color: mutedText, marginTop: 4 }}>{kpi.support}</div>
                  </div>
                ))}
              </div>

              {/* ── 2. QUICK STATUS SEGMENTED FILTER ── */}
              <div style={{ display: "flex", gap: 6, background: elevated, padding: 4, borderRadius: 10, border: `1px solid ${border}`, overflowX: "auto" }}>
                {[
                  { key: "ALL", label: "All Tickets (248)" },
                  { key: "OPEN", label: "Open (42)" },
                  { key: "IN_PROGRESS", label: "In Progress (28)" },
                  { key: "PENDING", label: "Pending (14)" },
                  { key: "RESOLVED", label: "Resolved (164)" },
                  { key: "CLOSED", label: "Closed (110)" },
                  { key: "OVERDUE", label: "Overdue (14)" },
                ].map((st) => {
                  const active = quickStatus === st.key;
                  return (
                    <button
                      key={st.key}
                      onClick={() => setQuickStatus(st.key)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none",
                        background: active ? primaryOrange : "transparent",
                        color: active ? "#FFFFFF" : secondaryText,
                        fontSize: 12.5, fontWeight: active ? 800 : 600, cursor: "pointer", whiteSpace: "nowrap"
                      }}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* ── 3. FILTER SECTION ── */}
              <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: mutedText, letterSpacing: "0.05em" }}>FILTER TICKETS</div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  {/* Search */}
                  <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: mutedText, fontSize: 13 }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search ticket ID, title, weighbridge, assignee..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: "100%", height: 42, paddingLeft: 36, paddingRight: 12, borderRadius: 8,
                        background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13, outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Priority */}
                  <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={selectStyle(dm, border, inputBg, primaryText)}>
                    <option value="ALL">All Priorities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>

                  {/* Category */}
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={selectStyle(dm, border, inputBg, primaryText)}>
                    <option value="ALL">All Categories</option>
                    <option value="Weighbridge">Weighbridge</option>
                    <option value="Camera">Camera</option>
                    <option value="Printer">Printer</option>
                    <option value="Indicator">Indicator</option>
                    <option value="Network">Network</option>
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                  </select>

                  {/* Weighbridge */}
                  <select value={wbFilter} onChange={(e) => setWbFilter(e.target.value)} style={selectStyle(dm, border, inputBg, primaryText)}>
                    <option value="ALL">All Weighbridges</option>
                    <option value="WB-01">WB-01</option>
                    <option value="WB-02">WB-02</option>
                    <option value="WB-03">WB-03</option>
                    <option value="WB-04">WB-04</option>
                    <option value="WB-05">WB-05</option>
                  </select>

                  {/* Assigned To */}
                  <select value={assignedFilter} onChange={(e) => setAssignedFilter(e.target.value)} style={selectStyle(dm, border, inputBg, primaryText)}>
                    <option value="ALL">All Assignees</option>
                    <option value="Raj Kumar">Raj Kumar</option>
                    <option value="Arun Kumar">Arun Kumar</option>
                    <option value="Maintenance Team">Maintenance Team</option>
                    <option value="IT Support">IT Support</option>
                  </select>
                </div>

                {/* Filter Chips Bar */}
                {activeFilterCount > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 8, borderTop: `1px solid ${divider}`, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>Active Filters:</span>
                    {priorityFilter !== "ALL" && <span style={chipStyle(primaryOrangeSoft, primaryOrange)}>Priority: {priorityFilter}</span>}
                    {categoryFilter !== "ALL" && <span style={chipStyle(secondaryGoldSoft, secondaryGold)}>Category: {categoryFilter}</span>}
                    {wbFilter !== "ALL" && <span style={chipStyle(primaryOrangeSoft, primaryOrange)}>WB: {wbFilter}</span>}
                    <button onClick={clearFilters} style={{ background: "none", border: 0, color: statusError, fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Clear All</button>
                  </div>
                )}
              </div>

              {/* ── 4. PRIMARY TICKET TABLE CARD ── */}
              <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>

                {/* CARD HEADER */}
                <div style={{ padding: "18px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: primaryText }}>ALL TICKETS</h2>
                    <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>{filteredList.length} tickets accessible</p>
                  </div>

                  {role === "admin" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => alert("Bulk Assign Tickets")} style={{ padding: "6px 12px", borderRadius: 6, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Bulk Assign</button>
                      <button onClick={() => alert("Exporting Tickets...")} style={{ padding: "6px 12px", borderRadius: 6, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Export CSV</button>
                    </div>
                  )}
                </div>

                {/* TABLE */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: elevated, borderBottom: `1px solid ${border}` }}>
                        <th style={thStyle} onClick={() => handleSort("code")}>TICKET ID {sortField === "code" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                        <th style={thStyle} onClick={() => handleSort("title")}>TITLE {sortField === "title" && (sortOrder === "asc" ? "▲" : "▼")}</th>
                        <th style={thStyle}>CATEGORY</th>
                        <th style={thStyle}>WEIGHBRIDGE</th>
                        <th style={thStyle} onClick={() => handleSort("priority")}>PRIORITY</th>
                        <th style={{ ...thStyle, textAlign: "center" }}>STATUS</th>
                        <th style={thStyle}>ASSIGNED TO</th>
                        <th style={thStyle}>CREATED</th>
                        <th style={thStyle}>SLA</th>
                        <th style={{ ...thStyle, textAlign: "right" }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList.length === 0 ? (
                        <tr>
                          <td colSpan={10} style={{ padding: 48, textAlign: "center", color: mutedText }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: primaryText }}>No tickets found</div>
                            <div style={{ fontSize: 13, marginTop: 4 }}>Try clearing active search terms or filters.</div>
                            <button onClick={clearFilters} style={{ marginTop: 16, height: 36, padding: "0 16px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Clear Filters</button>
                          </td>
                        </tr>
                      ) : (
                        filteredList.map((row) => {
                          const isMenuOpen = activeMenuId === row.id;

                          // Priority styling
                          const prioColor = row.priority === "CRITICAL" ? statusError : row.priority === "HIGH" ? primaryOrange : row.priority === "MEDIUM" ? secondaryGold : statusInfo;
                          const prioBg = row.priority === "CRITICAL" ? (dm ? "rgba(220,38,38,0.15)" : "#FEF2F2") : row.priority === "HIGH" ? primaryOrangeSoft : secondaryGoldSoft;

                          // Status styling
                          const stColor = row.status === "RESOLVED" || row.status === "CLOSED" ? statusSuccess : row.status === "IN_PROGRESS" ? statusInfo : row.status === "OPEN" ? statusWarning : mutedText;
                          const stBg = row.status === "RESOLVED" || row.status === "CLOSED" ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : row.status === "IN_PROGRESS" ? (dm ? "rgba(37,99,235,0.15)" : "#EFF6FF") : (dm ? "rgba(245,158,11,0.15)" : "#FFFBEB");

                          return (
                            <tr
                              key={row.id}
                              style={{ borderBottom: `1px solid ${divider}`, cursor: "pointer", transition: "background 0.15s ease" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = elevated)}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              onClick={() => onNavigate("ticket-detail")}
                            >
                              {/* Ticket ID */}
                              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12.5, fontWeight: 800, color: primaryOrange }}>
                                {row.code}
                              </td>

                              {/* Title */}
                              <td style={tdStyle}>
                                <div style={{ fontSize: 13.5, fontWeight: 700, color: primaryText }}>{row.title}</div>
                                <div style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>By: {row.creator}</div>
                              </td>

                              {/* Category */}
                              <td style={{ ...tdStyle, fontSize: 12.5, color: secondaryText }}>
                                {row.category}
                              </td>

                              {/* Weighbridge */}
                              <td style={tdStyle}>
                                <span style={{ padding: "2px 8px", borderRadius: 6, background: elevated, border: `1px solid ${border}`, fontSize: 11, fontWeight: 700, color: primaryText }}>
                                  {row.weighbridge}
                                </span>
                              </td>

                              {/* Priority */}
                              <td style={tdStyle}>
                                <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: prioBg, color: prioColor }}>
                                  ● {row.priority}
                                </span>
                              </td>

                              {/* Status */}
                              <td style={{ ...tdStyle, textAlign: "center" }}>
                                <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: stBg, color: stColor }}>
                                  ● {row.status.replace("_", " ")}
                                </span>
                              </td>

                              {/* Assigned To */}
                              <td style={{ ...tdStyle, fontSize: 13, fontWeight: 700, color: secondaryGold }}>
                                {row.assignedTo}
                              </td>

                              {/* Created */}
                              <td style={{ ...tdStyle, fontSize: 12, color: secondaryText }}>
                                {row.created}
                              </td>

                              {/* SLA */}
                              <td style={tdStyle}>
                                {row.isOverdue ? (
                                  <span style={{ fontSize: 11, fontWeight: 800, color: statusError, padding: "2px 6px", background: dm ? "rgba(220,38,38,0.15)" : "#FEF2F2", borderRadius: 4 }}>
                                    OVERDUE
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 12, fontWeight: 600, color: primaryText }}>{row.sla}</span>
                                )}
                              </td>

                              {/* Actions */}
                              <td style={{ ...tdStyle, textAlign: "right" }}>
                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", position: "relative" }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onNavigate("ticket-detail");
                                    }}
                                    style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                  >
                                    View
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(isMenuOpen ? null : row.id);
                                    }}
                                    style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                                  >
                                    •••
                                  </button>

                                  {/* Dropdown Menu */}
                                  {isMenuOpen && (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        position: "absolute", right: 0, top: 32, width: 170, background: surface,
                                        borderRadius: 8, border: `1px solid ${border}`, boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                        zIndex: 50, padding: "6px 0", display: "flex", flexDirection: "column"
                                      }}
                                    >
                                      <button onClick={() => onNavigate("ticket-detail")} style={menuBtnStyle(false)}>View Ticket</button>
                                      {role === "admin" && (
                                        <>
                                          <button onClick={() => alert(`Reassign ${row.code}`)} style={menuBtnStyle(false)}>Reassign Ticket</button>
                                          <button onClick={() => alert(`Change Priority ${row.code}`)} style={menuBtnStyle(false)}>Change Priority</button>
                                        </>
                                      )}
                                      {(role === "admin" || role === "maintenance") && (
                                        <button onClick={() => alert(`Mark Resolved ${row.code}`)} style={menuBtnStyle(false)}>Mark Resolved</button>
                                      )}
                                      <button onClick={() => alert(`Add Comment ${row.code}`)} style={menuBtnStyle(false)}>Add Comment</button>
                                      {role === "admin" && (
                                        <button onClick={() => alert(`Delete ${row.code}`)} style={menuBtnStyle(true)}>Delete Ticket</button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12.5, color: mutedText }}>
                    Showing <strong>1–{filteredList.length}</strong> of <strong>248</strong> tickets
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button disabled style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${border}`, background: elevated, color: mutedText, fontSize: 12, cursor: "not-allowed" }}>Previous</button>
                    <button style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: primaryOrange, color: "#FFF", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>1</button>
                    <button style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryText, fontSize: 12, cursor: "pointer" }}>2</button>
                    <button style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryText, fontSize: 12, cursor: "pointer" }}>3</button>
                    <button style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${border}`, background: surface, color: primaryText, fontSize: 12, cursor: "pointer" }}>Next</button>
                  </div>
                </div>

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
      <div style={{ width: "100%", minHeight: "100vh", background: bg, color: primaryText, fontFamily: "'Inter', -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>

        {/* TOP MOBILE BAR */}
        <header style={{ background: dm ? "#1F2937" : "#0F172A", borderBottom: `1px solid ${border}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F9FAFB" }}>SCREEN 45 — TICKETS</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setViewDevice("desktop")} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>💻</button>
            <button onClick={onToggleDark} style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>{dm ? "☀️" : "🌙"}</button>
          </div>
        </header>

        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 40px" }}>
          <div style={{ width: 390, minHeight: 844, background: surface, borderRadius: 24, border: `1px solid ${border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>

            {/* Mobile Header */}
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: primaryText }}>Tickets</h1>
                <div style={{ fontSize: 11, color: mutedText }}>248 total tickets</div>
              </div>
              <button
                onClick={() => setCreateTicketModalOpen(true)}
                style={{ height: 38, padding: "0 14px", borderRadius: 8, background: primaryOrange, color: "#FFF", fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer" }}
              >
                + CREATE
              </button>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 80px", display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Mobile KPI Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={{ padding: 10, borderRadius: 8, background: elevated, border: `1px solid ${border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: mutedText, fontWeight: 700 }}>OPEN</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: statusWarning, marginTop: 2 }}>42</div>
                </div>
                <div style={{ padding: 10, borderRadius: 8, background: elevated, border: `1px solid ${border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: mutedText, fontWeight: 700 }}>IN PROGRESS</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: statusInfo, marginTop: 2 }}>28</div>
                </div>
                <div style={{ padding: 10, borderRadius: 8, background: elevated, border: `1px solid ${border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: mutedText, fontWeight: 700 }}>OVERDUE</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: statusError, marginTop: 2 }}>14</div>
                </div>
              </div>

              {/* Mobile Search */}
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, background: inputBg, color: primaryText, border: `1px solid ${border}`, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />

              {/* Stacked Mobile Ticket Cards */}
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => alert(`Opening Ticket Detail for ${item.code}`)}
                  style={{
                    padding: 14, borderRadius: 12, background: elevated,
                    border: item.isOverdue ? `1.5px solid ${statusError}` : `1px solid ${border}`,
                    display: "flex", flexDirection: "column", gap: 8, cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", color: primaryOrange, fontWeight: 800 }}>{item.code}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: primaryText, marginTop: 2 }}>{item.title}</div>
                    </div>
                    <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, background: item.priority === "CRITICAL" ? (dm ? "rgba(220,38,38,0.15)" : "#FEF2F2") : primaryOrangeSoft, color: item.priority === "CRITICAL" ? statusError : primaryOrange }}>
                      ● {item.priority}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: secondaryText, background: surface, padding: 8, borderRadius: 8 }}>
                    <div>Category: <strong style={{ color: primaryText }}>{item.category}</strong></div>
                    <div>WB: <strong style={{ color: primaryText }}>{item.weighbridge}</strong></div>
                    <div>Assigned: <strong style={{ color: secondaryGold }}>{item.assignedTo}</strong></div>
                    <div>SLA: <strong style={{ color: item.isOverdue ? statusError : primaryText }}>{item.sla}</strong></div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
                    <div style={{ fontSize: 11, color: mutedText }}>{item.created}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Opening Ticket Detail for ${item.code}`);
                      }}
                      style={{ height: 34, padding: "0 14px", borderRadius: 6, background: primaryOrange, color: "#FFF", border: "none", fontSize: 11, fontWeight: 800, cursor: "pointer" }}
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Bottom Navigation */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: surface, borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              {[
                { icon: "🏠", label: "Home" },
                { icon: "⚖", label: "Weigh" },
                { icon: "📜", label: "Transactions" },
                { icon: "🎟", label: "Tickets" },
                { icon: "•••", label: "More" },
              ].map((nav, i) => (
                <button key={i} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: i === 3 ? primaryOrange : mutedText, cursor: "pointer" }}>
                  <span style={{ fontSize: 16 }}>{nav.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: i === 3 ? 700 : 500 }}>{nav.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Helper Styles
const selectStyle = (dm: boolean, border: string, bg: string, text: string): React.CSSProperties => ({
  height: 42,
  padding: "0 12px",
  borderRadius: 8,
  background: bg,
  color: text,
  border: `1px solid ${border}`,
  fontSize: 13,
  outline: "none",
  cursor: "pointer",
  minWidth: 140,
});

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 11,
  fontWeight: 800,
  color: "#9CA3AF",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  cursor: "pointer",
  userSelect: "none",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  verticalAlign: "middle",
};

function chipStyle(bg: string, color: string): React.CSSProperties {
  return {
    padding: "4px 10px",
    borderRadius: 999,
    background: bg,
    color: color,
    fontSize: 11,
    fontWeight: 700,
    border: `1px solid ${color}`,
  };
}

function menuBtnStyle(destructive?: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "8px 14px",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    color: destructive ? "#DC2626" : "inherit",
    cursor: "pointer",
  };
}
