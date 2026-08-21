import React, { useState, useMemo } from "react";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export type PrinterStatus = "ONLINE" | "PRINTING" | "WARNING" | "OFFLINE";
export type PaperStatus = "Normal" | "Low" | "Empty" | "Unknown";
export type PrinterType = "Thermal Printer" | "Laser Printer" | "Network Printer" | "USB Printer";

export interface PrinterItem {
  id: string;
  name: string;
  code: string;
  type: PrinterType;
  weighbridgeId: string;
  weighbridgeName: string;
  location: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  connection: "USB" | "Network";
  ipAddress: string;
  port: number;
  status: PrinterStatus;
  paperPercent: number;
  paperStatus: PaperStatus;
  queueCount: number;
  isDefault: boolean;
  autoPrintEnabled: boolean;
  paperSize: string;
  lastActivity: string;
  installationDate: string;
  todayPrintCount: number;
}

const INITIAL_PRINTERS: PrinterItem[] = [
  {
    id: "PRN-WB01-001",
    name: "Main Gate Ticket Printer",
    code: "PRN-WB01-001",
    type: "Thermal Printer",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    location: "Operator Counter",
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    serialNumber: "EP-PRN-928371",
    connection: "USB",
    ipAddress: "192.168.1.113",
    port: 9100,
    status: "ONLINE",
    paperPercent: 78,
    paperStatus: "Normal",
    queueCount: 0,
    isDefault: true,
    autoPrintEnabled: true,
    paperSize: "80 mm Thermal Roll",
    lastActivity: "Just now",
    installationDate: "15 Jan 2025",
    todayPrintCount: 342,
  },
  {
    id: "PRN-WB01-002",
    name: "Main Gate Backup Laser",
    code: "PRN-WB01-002",
    type: "Laser Printer",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    location: "Admin Desk",
    manufacturer: "HP",
    model: "LaserJet Pro M404dn",
    serialNumber: "HP-LJT-88201",
    connection: "Network",
    ipAddress: "192.168.1.117",
    port: 9100,
    status: "ONLINE",
    paperPercent: 90,
    paperStatus: "Normal",
    queueCount: 0,
    isDefault: false,
    autoPrintEnabled: false,
    paperSize: "A4 Standard Sheet",
    lastActivity: "12 min ago",
    installationDate: "15 Jan 2025",
    todayPrintCount: 45,
  },
  {
    id: "PRN-WB02-001",
    name: "North Gate Ticket Printer",
    code: "PRN-WB02-001",
    type: "Thermal Printer",
    weighbridgeId: "WB-02",
    weighbridgeName: "WB-02 — North Gate",
    location: "North Scale Cabin",
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    serialNumber: "EP-PRN-448102",
    connection: "Network",
    ipAddress: "192.168.1.121",
    port: 9100,
    status: "PRINTING",
    paperPercent: 62,
    paperStatus: "Normal",
    queueCount: 2,
    isDefault: true,
    autoPrintEnabled: true,
    paperSize: "80 mm Thermal Roll",
    lastActivity: "10 sec ago",
    installationDate: "20 Feb 2025",
    todayPrintCount: 289,
  },
  {
    id: "PRN-WB03-001",
    name: "Loading Yard Heavy Printer",
    code: "PRN-WB03-001",
    type: "Thermal Printer",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    location: "Dispatch Office",
    manufacturer: "Zebra",
    model: "ZT411 Industrial",
    serialNumber: "ZB-ZT-88301",
    connection: "Network",
    ipAddress: "192.168.1.132",
    port: 9100,
    status: "WARNING",
    paperPercent: 24,
    paperStatus: "Low",
    queueCount: 0,
    isDefault: true,
    autoPrintEnabled: true,
    paperSize: "80 mm Heavy Roll",
    lastActivity: "2 min ago",
    installationDate: "10 Mar 2025",
    todayPrintCount: 312,
  },
  {
    id: "PRN-WB04-001",
    name: "East Gate Ticket Printer",
    code: "PRN-WB04-001",
    type: "Thermal Printer",
    weighbridgeId: "WB-04",
    weighbridgeName: "WB-04 — East Gate",
    location: "East Security Cabin",
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    serialNumber: "EP-PRN-928399",
    connection: "USB",
    ipAddress: "192.168.1.142",
    port: 9100,
    status: "OFFLINE",
    paperPercent: 0,
    paperStatus: "Unknown",
    queueCount: 3,
    isDefault: true,
    autoPrintEnabled: true,
    paperSize: "80 mm Thermal Roll",
    lastActivity: "18 min ago",
    installationDate: "05 Apr 2025",
    todayPrintCount: 0,
  },
  {
    id: "PRN-WB05-001",
    name: "West Gate Ticket Printer",
    code: "PRN-WB05-001",
    type: "Thermal Printer",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    location: "West Kiosk",
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    serialNumber: "EP-PRN-559201",
    connection: "USB",
    ipAddress: "192.168.1.152",
    port: 9100,
    status: "ONLINE",
    paperPercent: 82,
    paperStatus: "Normal",
    queueCount: 0,
    isDefault: true,
    autoPrintEnabled: true,
    paperSize: "80 mm Thermal Roll",
    lastActivity: "5 min ago",
    installationDate: "01 Jun 2025",
    todayPrintCount: 296,
  },
];

export default function PrintersScreen({ darkMode: dm }: Props) {
  // Theme Color Tokens
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
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";

  // Semantic Status Colors
  const statusOnline = "#16A34A";
  const statusPrinting = "#8B5CF6";
  const statusWarning = "#D97706";
  const statusOffline = "#DC2626";

  // State Management
  const [printers, setPrinters] = useState<PrinterItem[]>(INITIAL_PRINTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [wbFilter, setWbFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [paperFilter, setPaperFilter] = useState<string>("All");

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("10:42:18 AM");

  // Modals & Context Menus
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showTestPrintModal, setShowTestPrintModal] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleManualRefresh = () => {
    const timeStr = new Date().toLocaleTimeString();
    setLastUpdatedTime(timeStr);
    showToast("✓ Refreshed printer status, paper levels and queues");
  };

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<PrinterItem>>({
    code: "PRN-WB06-001",
    name: "",
    type: "Thermal Printer",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    location: "Main Cabin",
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    connection: "USB",
    ipAddress: "192.168.1.160",
    port: 9100,
    status: "ONLINE",
    paperPercent: 100,
    paperStatus: "Normal",
    isDefault: false,
    autoPrintEnabled: true,
    paperSize: "80 mm Thermal Roll",
  });

  // KPI Calculations
  const totalCount = printers.length;
  const onlineCount = printers.filter((p) => p.status === "ONLINE").length;
  const printingCount = printers.filter((p) => p.status === "PRINTING").length;
  const paperLowCount = printers.filter((p) => p.paperStatus === "Low" || p.paperPercent < 30).length;
  const offlineCount = printers.filter((p) => p.status === "OFFLINE").length;

  // Filtered Printers List
  const filteredPrinters = useMemo(() => {
    return printers.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.ipAddress.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.weighbridgeName.toLowerCase().includes(q);

      const matchWb = wbFilter === "All" || item.weighbridgeId === wbFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchType = typeFilter === "All" || item.type === typeFilter;
      const matchPaper = paperFilter === "All" || item.paperStatus === paperFilter;

      return matchQ && matchWb && matchStatus && matchType && matchPaper;
    });
  }, [printers, searchQuery, wbFilter, statusFilter, typeFilter, paperFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const nextNum = printers.length + 1;
    setFormData({
      code: `PRN-WB0${nextNum}-001`,
      name: `WB-0${nextNum} Ticket Printer`,
      type: "Thermal Printer",
      weighbridgeId: `WB-0${nextNum}`,
      weighbridgeName: `WB-0${nextNum} — Gate ${nextNum}`,
      location: "Operator Desk",
      manufacturer: "Epson",
      model: "TM-T88VI Thermal",
      connection: "USB",
      ipAddress: `192.168.1.16${nextNum}`,
      port: 9100,
      status: "ONLINE",
      paperPercent: 100,
      paperStatus: "Normal",
      isDefault: true,
      autoPrintEnabled: true,
      paperSize: "80 mm Thermal Roll",
    });
    setEditMode("add");
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: PrinterItem) => {
    setFormData({ ...item });
    setEditMode("edit");
    setShowAddEditModal(true);
    setActiveMenuId(null);
  };

  // Set Default Printer
  const handleSetDefault = (id: string, wbId: string) => {
    setPrinters((prev) =>
      prev.map((p) => {
        if (p.weighbridgeId === wbId) {
          return { ...p, isDefault: p.id === id };
        }
        return p;
      })
    );
    showToast(`✓ Set ${id} as default printer for ${wbId}`);
    setActiveMenuId(null);
  };

  // Save Add / Edit
  const handleSavePrinter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editMode === "add") {
      const newItem: PrinterItem = {
        id: formData.code || `PRN-WB0${printers.length + 1}-001`,
        code: formData.code || `PRN-WB0${printers.length + 1}-001`,
        name: formData.name || "Ticket Printer",
        type: (formData.type as PrinterType) || "Thermal Printer",
        weighbridgeId: formData.weighbridgeId || "WB-01",
        weighbridgeName: formData.weighbridgeName || "WB-01 — Main Gate",
        location: formData.location || "Operator Cabin",
        manufacturer: formData.manufacturer || "Epson",
        model: formData.model || "TM-T88VI Thermal",
        serialNumber: `EP-PRN-100${printers.length + 1}`,
        connection: (formData.connection as "USB" | "Network") || "USB",
        ipAddress: formData.ipAddress || "192.168.1.160",
        port: Number(formData.port) || 9100,
        status: (formData.status as PrinterStatus) || "ONLINE",
        paperPercent: Number(formData.paperPercent) || 100,
        paperStatus: (formData.paperStatus as PaperStatus) || "Normal",
        queueCount: 0,
        isDefault: Boolean(formData.isDefault),
        autoPrintEnabled: Boolean(formData.autoPrintEnabled),
        paperSize: formData.paperSize || "80 mm Thermal Roll",
        lastActivity: "Just now",
        installationDate: "20 Aug 2026",
        todayPrintCount: 0,
      };
      setPrinters((prev) => [...prev, newItem]);
      showToast(`✓ Registered printer ${newItem.code}`);
    } else {
      setPrinters((prev) =>
        prev.map((p) => (p.id === formData.id ? ({ ...p, ...formData } as PrinterItem) : p))
      );
      showToast(`✓ Updated printer ${formData.code}`);
    }
    setShowAddEditModal(false);
  };

  // Helper for Status Badge styling
  const getStatusPill = (status: PrinterStatus) => {
    let color = statusOnline;
    let text = "ONLINE";
    let bgTint = dm ? "rgba(22,163,74,0.15)" : "#F0FDF4";

    if (status === "PRINTING") {
      color = statusPrinting;
      text = "PRINTING";
      bgTint = dm ? "rgba(139,92,246,0.15)" : "#F5F3FF";
    } else if (status === "WARNING") {
      color = statusWarning;
      text = "WARNING";
      bgTint = dm ? "rgba(217,119,6,0.15)" : "#FFFBEB";
    } else if (status === "OFFLINE") {
      color = statusOffline;
      text = "OFFLINE";
      bgTint = dm ? "rgba(220,38,38,0.15)" : "#FEF2F2";
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: 999,
          background: bgTint,
          color: color,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.04em",
          border: `1px solid ${color}35`,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
        {text}
      </span>
    );
  };

  // Helper for Paper Status styling
  const getPaperPill = (paper: PaperStatus, percent: number) => {
    let color = statusOnline;
    let bgTint = dm ? "rgba(22,163,74,0.15)" : "#F0FDF4";

    if (paper === "Low" || percent < 30) {
      color = statusWarning;
      bgTint = dm ? "rgba(217,119,6,0.15)" : "#FFFBEB";
    } else if (paper === "Empty" || percent === 0) {
      color = statusOffline;
      bgTint = dm ? "rgba(220,38,38,0.15)" : "#FEF2F2";
    } else if (paper === "Unknown") {
      color = mutedText;
      bgTint = dm ? "rgba(156,163,175,0.15)" : "#F1F5F9";
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 8px",
          borderRadius: 6,
          background: bgTint,
          color: color,
          fontSize: 11,
          fontWeight: 800,
          border: `1px solid ${color}30`,
        }}
      >
        <span>📄</span> {percent > 0 ? `${percent}% ${paper}` : paper}
      </span>
    );
  };

  return (
    <div style={{ flex: 1, padding: "24px 32px 48px", background: bg, color: primaryText, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: "fixed", top: 84, right: 32, zIndex: 1200, background: primaryOrange, color: "#FFF", padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, boxShadow: "0 10px 25px rgba(249,115,22,0.4)" }}>
          {toastMessage}
        </div>
      )}

      {/* ── 1. PAGE HEADER ── */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.02em" }}>
            Printers
          </h1>
          <p style={{ fontSize: 13, color: secondaryText, margin: "4px 0 0 0" }}>
            Manage weighbridge ticket printers, connectivity, paper status, print queues and printing health.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={handleManualRefresh}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 8,
              background: surface,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>↻</span> Refresh
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
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
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
            }}
          >
            <span>+</span> ADD PRINTER
          </button>
        </div>
      </div>

      {/* ── 2. SUMMARY KPI ROW (5 CARDS) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* Total Printers */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            TOTAL PRINTERS
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: primaryText, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {totalCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Registered printers</div>
        </div>

        {/* Online */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusOnline, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              ONLINE
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusOnline }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusOnline, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {onlineCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Connected & ready</div>
        </div>

        {/* Printing */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusPrinting, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              PRINTING
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusPrinting }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusPrinting, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {printingCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Processing jobs now</div>
        </div>

        {/* Paper Low */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusWarning, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              PAPER LOW
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusWarning }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusWarning, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {paperLowCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Requires paper roll replace</div>
        </div>

        {/* Offline */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusOffline, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              OFFLINE
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusOffline }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusOffline, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {offlineCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Connection unavailable</div>
        </div>
      </div>

      {/* ── 3. PRINTING ACTIVITY SUMMARY CARD (TODAY) ── */}
      <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
          PRINTING ACTIVITY & HEALTH (TODAY)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, fontSize: 13 }}>
          <div style={{ padding: "12px 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 11, color: mutedText, fontWeight: 600 }}>Tickets Printed Today</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: primaryText, marginTop: 4, fontFamily: "monospace" }}>1,284</div>
            <div style={{ fontSize: 10.5, color: statusOnline, fontWeight: 700, marginTop: 2 }}>✓ High throughput</div>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 11, color: mutedText, fontWeight: 600 }}>Print Success Rate</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: statusOnline, marginTop: 4, fontFamily: "monospace" }}>99.4%</div>
            <div style={{ fontSize: 10.5, color: secondaryText, marginTop: 2 }}>1,276 Successful · 8 Failed</div>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 11, color: mutedText, fontWeight: 600 }}>Average Print Time</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: primaryOrange, marginTop: 4, fontFamily: "monospace" }}>1.8 sec</div>
            <div style={{ fontSize: 10.5, color: secondaryText, marginTop: 2 }}>Fast thermal spooling</div>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 11, color: mutedText, fontWeight: 600 }}>Active Queued Jobs</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: statusPrinting, marginTop: 4, fontFamily: "monospace" }}>2 jobs</div>
            <div style={{ fontSize: 10.5, color: statusPrinting, fontWeight: 700, marginTop: 2 }}>● Processing in Queue</div>
          </div>
        </div>
      </div>

      {/* ── 4. FILTER BAR ── */}
      <div
        style={{
          background: surface,
          borderRadius: 12,
          border: `1px solid ${border}`,
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, flex: 1 }}>
          {/* Search Input */}
          <div style={{ position: "relative", minWidth: 260, flex: 1 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search printer name, printer ID, IP address..."
              style={{
                width: "100%",
                height: 42,
                padding: "0 14px",
                borderRadius: 8,
                background: inputBg,
                border: `1px solid ${border}`,
                color: primaryText,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Weighbridge Filter */}
          <select
            value={wbFilter}
            onChange={(e) => setWbFilter(e.target.value)}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 8,
              background: inputBg,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 12.5,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Weighbridges ▼</option>
            <option value="WB-01">WB-01 — Main Gate</option>
            <option value="WB-02">WB-02 — North Gate</option>
            <option value="WB-03">WB-03 — Loading Yard</option>
            <option value="WB-04">WB-04 — East Gate</option>
            <option value="WB-05">WB-05 — West Gate</option>
          </select>

          {/* Printer Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 8,
              background: inputBg,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 12.5,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Printer Types ▼</option>
            <option value="Thermal Printer">Thermal Printer</option>
            <option value="Laser Printer">Laser Printer</option>
            <option value="Network Printer">Network Printer</option>
            <option value="USB Printer">USB Printer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 8,
              background: inputBg,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 12.5,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Statuses ▼</option>
            <option value="ONLINE">● ONLINE</option>
            <option value="PRINTING">● PRINTING</option>
            <option value="WARNING">● WARNING</option>
            <option value="OFFLINE">● OFFLINE</option>
          </select>

          {/* Paper Status Filter */}
          <select
            value={paperFilter}
            onChange={(e) => setPaperFilter(e.target.value)}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 8,
              background: inputBg,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 12.5,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Paper Status ▼</option>
            <option value="Normal">Normal (&gt; 30%)</option>
            <option value="Low">Low (&lt; 30%)</option>
            <option value="Empty">Empty (0%)</option>
          </select>
        </div>

        {/* Server Status & Auto Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: statusOnline, fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusOnline }} />
            PRINT SERVER READY ({lastUpdatedTime})
          </div>

          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 999,
              background: autoRefresh ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : elevated,
              border: `1px solid ${autoRefresh ? statusOnline : border}`,
              color: autoRefresh ? statusOnline : mutedText,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Auto Refresh {autoRefresh ? "15s" : "OFF"}
          </button>
        </div>
      </div>

      {/* ── 5. MAIN PRINTER INVENTORY DATA TABLE ── */}
      <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${border}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: primaryText }}>PRINTER INVENTORY</h2>
            <p style={{ fontSize: 12, color: secondaryText, margin: "2px 0 0 0" }}>
              {filteredPrinters.length} registered ticket & document printers
            </p>
          </div>

          <div style={{ fontSize: 12, color: mutedText, fontWeight: 600 }}>
            Showing {filteredPrinters.length} of {printers.length} printers
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: dm ? "#1A2332" : "#F8FAFC", borderBottom: `1px solid ${border}`, color: mutedText, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "14px 20px" }}>PRINTER</th>
                <th style={{ padding: "14px 16px" }}>PRINTER ID</th>
                <th style={{ padding: "14px 16px" }}>TYPE</th>
                <th style={{ padding: "14px 16px" }}>WEIGHBRIDGE</th>
                <th style={{ padding: "14px 16px" }}>CONNECTION</th>
                <th style={{ padding: "14px 16px" }}>STATUS</th>
                <th style={{ padding: "14px 16px" }}>PAPER</th>
                <th style={{ padding: "14px 16px" }}>QUEUE</th>
                <th style={{ padding: "14px 16px" }}>LAST ACTIVITY</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrinters.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: "48px 20px", textAlign: "center", color: mutedText }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🖨️</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>No printers found</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search query or filter selection.</div>
                  </td>
                </tr>
              ) : (
                filteredPrinters.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: `1px solid ${divider}`, transition: "background 0.15s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = dm ? "rgba(255,255,255,0.03)" : "#F8FAFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Printer Name & Default Badge */}
                    <td style={{ padding: "16px 20px", fontWeight: 800, color: primaryText }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{item.name}</span>
                        {item.isDefault && (
                          <span style={{ background: dm ? "rgba(249,115,22,0.15)" : "#FFF7ED", color: primaryOrange, border: `1px solid ${primaryOrange}40`, padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: mutedText, fontWeight: 500 }}>{item.manufacturer} {item.model}</div>
                    </td>

                    {/* Code / ID */}
                    <td style={{ padding: "16px 16px", fontWeight: 700, fontFamily: "monospace", color: primaryOrange }}>
                      {item.code}
                    </td>

                    {/* Type */}
                    <td style={{ padding: "16px 16px", color: secondaryText, fontWeight: 600 }}>
                      {item.type}
                    </td>

                    {/* Weighbridge */}
                    <td style={{ padding: "16px 16px", color: primaryText, fontWeight: 700 }}>
                      {item.weighbridgeName}
                    </td>

                    {/* Connection */}
                    <td style={{ padding: "16px 16px", color: secondaryText, fontWeight: 600 }}>
                      {item.connection} ({item.ipAddress})
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 16px" }}>
                      {getStatusPill(item.status)}
                    </td>

                    {/* Paper Status */}
                    <td style={{ padding: "16px 16px" }}>
                      {getPaperPill(item.paperStatus, item.paperPercent)}
                    </td>

                    {/* Queue */}
                    <td style={{ padding: "16px 16px", fontWeight: 700, color: item.queueCount > 0 ? statusPrinting : secondaryText }}>
                      {item.queueCount} jobs
                    </td>

                    {/* Last Activity */}
                    <td style={{ padding: "16px 16px", color: mutedText, fontSize: 12 }}>
                      {item.lastActivity}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 20px", textAlign: "right", position: "relative" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPrinter(item);
                            setShowDetailModal(true);
                          }}
                          style={{ padding: "6px 12px", borderRadius: 6, background: primaryOrange, color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          style={{ padding: "6px 12px", borderRadius: 6, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          style={{ padding: "6px 8px", borderRadius: 6, background: elevated, border: `1px solid ${border}`, color: secondaryText, fontSize: 12, cursor: "pointer" }}
                        >
                          ⋮
                        </button>
                      </div>

                      {/* Row Context Menu */}
                      {activeMenuId === item.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: 50,
                            right: 20,
                            width: 190,
                            background: surface,
                            borderRadius: 8,
                            border: `1px solid ${border}`,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            zIndex: 100,
                            padding: "4px 0",
                            textAlign: "left",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPrinter(item);
                              setShowTestPrintModal(true);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            🖨️ Print Test Page
                          </button>

                          {!item.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(item.id, item.weighbridgeId)}
                              style={contextMenuItemStyle}
                            >
                              ⭐ Set as Default Printer
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`✓ Cleared print queue for ${item.code}`);
                              setPrinters((prev) => prev.map((p) => (p.id === item.id ? { ...p, queueCount: 0 } : p)));
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            🧹 Clear Print Queue
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`✓ Printer socket ping test to ${item.ipAddress} success (8ms)`);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📡 Test Connection Signal
                          </button>

                          <div style={{ borderTop: `1px solid ${divider}`, margin: "4px 0" }} />

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`✓ Restarted print spooler service for ${item.code}`);
                              setActiveMenuId(null);
                            }}
                            style={{ ...contextMenuItemStyle, color: primaryOrange }}
                          >
                            🔄 Restart Print Spooler
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 6. DETAIL PREVIEW MODAL / DRAWER ── */}
      {showDetailModal && selectedPrinter && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 780, maxHeight: "90vh", background: surface, borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Modal Header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText }}>{selectedPrinter.name}</h2>
                  {getStatusPill(selectedPrinter.status)}
                  {getPaperPill(selectedPrinter.paperStatus, selectedPrinter.paperPercent)}
                  {selectedPrinter.isDefault && (
                    <span style={{ background: dm ? "rgba(249,115,22,0.15)" : "#FFF7ED", color: primaryOrange, border: `1px solid ${primaryOrange}40`, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                      DEFAULT PRINTER
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: secondaryText, marginTop: 4 }}>
                  Code: <strong style={{ color: primaryOrange, fontFamily: "monospace" }}>{selectedPrinter.code}</strong> · Station: {selectedPrinter.weighbridgeName}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                style={{ background: "none", border: 0, color: mutedText, fontSize: 20, cursor: "pointer", fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Paper & Queue Banner */}
              <div style={{ padding: "18px 22px", borderRadius: 12, background: dm ? "#1A2332" : "#FFF7ED", border: `1px solid ${primaryOrange}40`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, textTransform: "uppercase", letterSpacing: "0.05em" }}>PAPER ROLL & QUEUE STATUS</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: primaryText, margin: "4px 0" }}>
                    Paper Level: {selectedPrinter.paperPercent}% ({selectedPrinter.paperStatus})
                  </div>
                  <div style={{ fontSize: 12, color: secondaryText }}>
                    Estimated remaining: <strong>~{Math.round(selectedPrinter.paperPercent * 4.1)} tickets</strong> · Size: {selectedPrinter.paperSize}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowTestPrintModal(true);
                    }}
                    style={{ padding: "10px 18px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
                  >
                    🖨️ Print Test Page
                  </button>
                </div>
              </div>

              {/* Specifications & Connection Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Specifications */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>PRINTER HARDWARE SPECIFICATIONS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Printer Type</span><span style={{ fontWeight: 700 }}>{selectedPrinter.type}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Manufacturer</span><span style={{ fontWeight: 700 }}>{selectedPrinter.manufacturer}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Model</span><span style={{ fontWeight: 700 }}>{selectedPrinter.model}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Serial Number</span><span style={{ fontFamily: "monospace" }}>{selectedPrinter.serialNumber}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Paper Roll Size</span><span>{selectedPrinter.paperSize}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Auto Print</span><span style={{ fontWeight: 700, color: selectedPrinter.autoPrintEnabled ? statusOnline : mutedText }}>{selectedPrinter.autoPrintEnabled ? "Enabled" : "Disabled"}</span></div>
                  </div>
                </div>

                {/* Connection & Network */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>CONNECTION & PRINT HEALTH</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Interface</span><span style={{ fontWeight: 700 }}>{selectedPrinter.connection}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>IP Address</span><span style={{ fontFamily: "monospace" }}>{selectedPrinter.ipAddress}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Port</span><span>{selectedPrinter.port}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Print Success</span><span style={{ fontWeight: 800, color: statusOnline }}>99.4%</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Today Printed</span><span style={{ fontWeight: 800, color: secondaryGold }}>{selectedPrinter.todayPrintCount} tickets</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Latency</span><span style={{ fontWeight: 800, color: statusOnline }}>8 ms</span></div>
                  </div>
                </div>
              </div>

              {/* Current Print Queue */}
              <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryText, textTransform: "uppercase", letterSpacing: "0.05em" }}>ACTIVE PRINT QUEUE</div>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`✓ Queue cleared for ${selectedPrinter.code}`);
                      setPrinters((prev) => prev.map((p) => (p.id === selectedPrinter.id ? { ...p, queueCount: 0 } : p)));
                    }}
                    style={{ padding: "4px 10px", borderRadius: 6, background: surface, border: `1px solid ${border}`, color: primaryText, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                  >
                    Clear Queue
                  </button>
                </div>

                {selectedPrinter.queueCount === 0 ? (
                  <div style={{ fontSize: 12, color: mutedText, padding: "8px 0" }}>No pending print jobs in queue. Server ready.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                    <div style={{ padding: "10px 12px", borderRadius: 6, background: surface, border: `1px solid ${border}`, display: "flex", justifyContent: "space-between" }}>
                      <span>Ticket #WB-2026-00462 (Vehicle TN20AB1234)</span>
                      <span style={{ color: statusPrinting, fontWeight: 700 }}>● Printing</span>
                    </div>
                    <div style={{ padding: "10px 12px", borderRadius: 6, background: surface, border: `1px solid ${border}`, display: "flex", justifyContent: "space-between" }}>
                      <span>Ticket #WB-2026-00463 (Vehicle TN18CD5678)</span>
                      <span style={{ color: secondaryGold, fontWeight: 700 }}>Queued</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activity Timeline */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: primaryText, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>RECENT PRINT LOGS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>10:42:18 AM — Ticket WB-2026-00461 printed successfully (1.7s)</span>
                    <span style={{ color: statusOnline, fontWeight: 700 }}>✓ Printed</span>
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>10:40:12 AM — Auto-print trigger received from scale WB-01</span>
                    <span style={{ color: mutedText }}>Spooler OK</span>
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>10:35:05 AM — Paper level telemetry updated (78%)</span>
                    <span style={{ color: mutedText }}>Sensor OK</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  handleOpenEdit(selectedPrinter);
                }}
                style={{ padding: "10px 18px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Edit Printer Settings
              </button>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                style={{ padding: "10px 20px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. ADD / EDIT PRINTER MODAL ── */}
      {showAddEditModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 640, maxHeight: "90vh", background: surface, borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflowY: "auto" }}>
            <form onSubmit={handleSavePrinter}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: primaryText }}>
                  {editMode === "add" ? "+ Add Weighbridge Printer" : `Edit Printer ${formData.code}`}
                </h2>
                <button type="button" onClick={() => setShowAddEditModal(false)} style={{ background: "none", border: 0, color: mutedText, fontSize: 20, cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={formLabelStyle}>Printer ID / Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. PRN-WB06-001"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Printer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Main Gate Ticket Printer"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Printer Type *</label>
                  <select
                    value={formData.type || "Thermal Printer"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PrinterType })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="Thermal Printer">Thermal Printer</option>
                    <option value="Laser Printer">Laser Printer</option>
                    <option value="Network Printer">Network Printer</option>
                    <option value="USB Printer">USB Printer</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Weighbridge Station *</label>
                  <select
                    value={formData.weighbridgeId || "WB-01"}
                    onChange={(e) => {
                      const id = e.target.value;
                      const name = id === "WB-01" ? "WB-01 — Main Gate" : id === "WB-02" ? "WB-02 — North Gate" : id === "WB-03" ? "WB-03 — Loading Yard" : id === "WB-04" ? "WB-04 — East Gate" : "WB-05 — West Gate";
                      setFormData({ ...formData, weighbridgeId: id, weighbridgeName: name });
                    }}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="WB-01">WB-01 — Main Gate</option>
                    <option value="WB-02">WB-02 — North Gate</option>
                    <option value="WB-03">WB-03 — Loading Yard</option>
                    <option value="WB-04">WB-04 — East Gate</option>
                    <option value="WB-05">WB-05 — West Gate</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Location</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Operator Counter"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Manufacturer & Model</label>
                  <input
                    type="text"
                    value={formData.model || ""}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Epson TM-T88VI Thermal"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Connection Type</label>
                  <select
                    value={formData.connection || "USB"}
                    onChange={(e) => setFormData({ ...formData, connection: e.target.value as "USB" | "Network" })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="USB">USB Direct</option>
                    <option value="Network">Network Ethernet</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>IP Address</label>
                  <input
                    type="text"
                    value={formData.ipAddress || "192.168.1.160"}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    placeholder="192.168.1.160"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Paper Size</label>
                  <select
                    value={formData.paperSize || "80 mm Thermal Roll"}
                    onChange={(e) => setFormData({ ...formData, paperSize: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="80 mm Thermal Roll">80 mm Thermal Roll</option>
                    <option value="A4 Standard Sheet">A4 Standard Sheet</option>
                    <option value="Continuous Dot Matrix">Continuous Dot Matrix</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Status</label>
                  <select
                    value={formData.status || "ONLINE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PrinterStatus })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>

                <div style={{ gridColumn: "span 2", display: "flex", gap: 20, marginTop: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.isDefault || false}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    />
                    Set as Default Printer for this station
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.autoPrintEnabled ?? true}
                      onChange={(e) => setFormData({ ...formData, autoPrintEnabled: e.target.checked })}
                    />
                    Enable Auto-Print on weighment completion
                  </label>
                </div>
              </div>

              <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  style={{ padding: "10px 18px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 22px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
                >
                  Save Printer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 8. PRINT TEST PAGE MODAL ── */}
      {showTestPrintModal && selectedPrinter && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: 440, background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🖨️</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: primaryText }}>Print Test Page</h3>
            <p style={{ fontSize: 12.5, color: secondaryText, margin: "0 0 16px" }}>
              Send diagnostic test page to <strong>{selectedPrinter.name}</strong> ({selectedPrinter.code})
            </p>

            <div style={{ padding: 16, borderRadius: 8, background: dm ? "#1A2332" : "#FFF7ED", border: `1px solid ${primaryOrange}40`, textAlign: "left", fontSize: 12, fontFamily: "monospace", color: primaryText, marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: primaryOrange, textAlign: "center", marginBottom: 8 }}>Viyan WEIGHBRIDGE SYSTEM</div>
              <div>--- DIAGNOSTIC TEST TICKET ---</div>
              <div>Printer ID: {selectedPrinter.code}</div>
              <div>Station: {selectedPrinter.weighbridgeName}</div>
              <div>Timestamp: {lastUpdatedTime}</div>
              <div>Status: ONLINE (8ms latency)</div>
              <div>Paper: {selectedPrinter.paperPercent}% Remaining</div>
              <div>--------------------------------</div>
              <div style={{ textAlign: "center", fontSize: 10, color: mutedText, marginTop: 4 }}>End of Test Alignment Page</div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setShowTestPrintModal(false)}
                style={{ padding: "10px 18px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`✓ Test page sent to ${selectedPrinter.name}. Print time: 1.7 sec`);
                  setShowTestPrintModal(false);
                }}
                style={{ padding: "10px 22px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
              >
                Print Test Page Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const formLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const formInputStyle = (bg: string, border: string, text: string): React.CSSProperties => ({
  width: "100%",
  height: 42,
  padding: "0 12px",
  borderRadius: 8,
  background: bg,
  border: `1px solid ${border}`,
  color: text,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
});

const contextMenuItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 16px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  fontSize: 12.5,
  fontWeight: 600,
  color: "inherit",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
};
