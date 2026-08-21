import React, { useState, useMemo } from "react";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export type WeighbridgeStatus =
  | "ONLINE"
  | "AVAILABLE"
  | "WEIGHING"
  | "OFFLINE"
  | "MAINTENANCE";

export interface WeighbridgeItem {
  id: string;
  code: string;
  name: string;
  fullName: string;
  location: string;
  gateArea: string;
  status: WeighbridgeStatus;
  currentVehicle: string;
  currentWeight: string;
  weightState: "STABLE" | "STABILIZING" | "OFFLINE" | "READY";
  operator: string;
  lastActivity: string;
  capacity: string;
  ipAddress: string;
  port: number;
  latency: string;
  installedDate: string;
  lastMaintenance: string;
  indicator: string;
  printer: string;
  camera: string;
  anpr: string;
  todayCount: number;
  description: string;
}

const INITIAL_WEIGHBRIDGES: WeighbridgeItem[] = [
  {
    id: "WB-01",
    code: "WB-01",
    name: "Main Gate",
    fullName: "WB-01 — Main Gate",
    location: "Main Gate",
    gateArea: "North Gate Entrance",
    status: "ONLINE",
    currentVehicle: "TN20AB1234",
    currentWeight: "38,500 KG",
    weightState: "STABLE",
    operator: "Ravi Kumar",
    lastActivity: "Just now",
    capacity: "80,000 KG",
    ipAddress: "192.168.1.101",
    port: 5000,
    latency: "12 ms",
    installedDate: "15 Jan 2025",
    lastMaintenance: "02 Aug 2026",
    indicator: "Avery Weigh-Tronix E1205",
    printer: "Epson TM-T88VI Thermal",
    camera: "Hikvision ANPR 4K",
    anpr: "ANPR Gate 1 Cam",
    todayCount: 58,
    description:
      "Primary inbound heavy haul weighbridge at main factory entry gate.",
  },
  {
    id: "WB-02",
    code: "WB-02",
    name: "North Gate",
    fullName: "WB-02 — North Gate",
    location: "North Gate",
    gateArea: "North Logistics Hub",
    status: "AVAILABLE",
    currentVehicle: "No vehicle",
    currentWeight: "-- KG",
    weightState: "READY",
    operator: "Suresh Kumar",
    lastActivity: "2 min ago",
    capacity: "80,000 KG",
    ipAddress: "192.168.1.102",
    port: 5001,
    latency: "15 ms",
    installedDate: "20 Feb 2025",
    lastMaintenance: "28 Jul 2026",
    indicator: "Mettler Toledo IND570",
    printer: "Epson TM-T88VI Thermal",
    camera: "Dahua ANPR Pro",
    anpr: "ANPR North Cam",
    todayCount: 46,
    description:
      "Secondary raw material intake weighbridge for bulk aggregates.",
  },
  {
    id: "WB-03",
    code: "WB-03",
    name: "Loading Yard",
    fullName: "WB-03 — Loading Yard",
    location: "Loading Yard",
    gateArea: "Dispatch Bay 3",
    status: "WEIGHING",
    currentVehicle: "TN18CD5678",
    currentWeight: "32,100 KG",
    weightState: "STABILIZING",
    operator: "Rithick Nathan",
    lastActivity: "Just now",
    capacity: "100,000 KG",
    ipAddress: "192.168.1.103",
    port: 5002,
    latency: "18 ms",
    installedDate: "10 Mar 2025",
    lastMaintenance: "12 Aug 2026",
    indicator: "Rice Lake 920i Heavy Duty",
    printer: "Zebra ZT411 Industrial",
    camera: "Hikvision ANPR 4K",
    anpr: "ANPR Yard Cam",
    todayCount: 51,
    description:
      "Heavy capacity outbound dispatch weighbridge with auto-barrier controls.",
  },
  {
    id: "WB-04",
    code: "WB-04",
    name: "East Gate",
    fullName: "WB-04 — East Gate",
    location: "East Gate",
    gateArea: "East Rail Siding",
    status: "OFFLINE",
    currentVehicle: "--",
    currentWeight: "-- KG",
    weightState: "OFFLINE",
    operator: "-",
    lastActivity: "18 min ago",
    capacity: "80,000 KG",
    ipAddress: "192.168.1.104",
    port: 5003,
    latency: "Disconnected",
    installedDate: "05 Apr 2025",
    lastMaintenance: "15 Jun 2026",
    indicator: "Avery Weigh-Tronix E1205 (Offline)",
    printer: "Epson TM-T88VI Thermal",
    camera: "Hikvision ANPR 4K",
    anpr: "ANPR East Cam",
    todayCount: 0,
    description:
      "East perimeter weighbridge. Currently disconnected for network maintenance.",
  },
  {
    id: "WB-05",
    code: "WB-05",
    name: "West Gate",
    fullName: "WB-05 — West Gate",
    location: "West Gate",
    gateArea: "West Scrap Yard",
    status: "AVAILABLE",
    currentVehicle: "No vehicle",
    currentWeight: "-- KG",
    weightState: "READY",
    operator: "-",
    lastActivity: "5 min ago",
    capacity: "60,000 KG",
    ipAddress: "192.168.1.105",
    port: 5004,
    latency: "14 ms",
    installedDate: "01 Jun 2025",
    lastMaintenance: "05 Aug 2026",
    indicator: "Mettler Toledo IND570",
    printer: "Epson TM-T88VI Thermal",
    camera: "Dahua ANPR Pro",
    anpr: "ANPR West Cam",
    todayCount: 48,
    description:
      "West gate auxiliary weighbridge for internal site transfers and scrap metal.",
  },
];

export default function WeighbridgeManagementScreen({ darkMode: dm }: Props) {
  // Master Design Tokens
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

  // Semantic Status Colors
  const statusOnline = "#16A34A";
  const statusAvailable = "#2563EB";
  const statusWeighing = "#8B5CF6";
  const statusOffline = "#DC2626";
  const statusMaintenance = "#F59E0B";

  // State Management
  const [weighbridges, setWeighbridges] =
    useState<WeighbridgeItem[]>(INITIAL_WEIGHBRIDGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [operatorFilter, setOperatorFilter] = useState<string>("All");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Modals & Drawers
  const [selectedStation, setSelectedStation] =
    useState<WeighbridgeItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<WeighbridgeItem>>({
    code: "WB-06",
    name: "",
    location: "Main Gate",
    gateArea: "",
    status: "ONLINE",
    capacity: "80,000 KG",
    ipAddress: "192.168.1.106",
    port: 5005,
    indicator: "Avery Weigh-Tronix E1205",
    printer: "Epson TM-T88VI Thermal",
    camera: "Hikvision ANPR 4K",
    operator: "Ravi Kumar",
    description: "",
  });

  // KPI Calculations
  const totalCount = weighbridges.length;
  const onlineCount = weighbridges.filter((w) => w.status === "ONLINE").length;
  const weighingCount = weighbridges.filter(
    (w) => w.status === "WEIGHING",
  ).length;
  const availableCount = weighbridges.filter(
    (w) => w.status === "AVAILABLE",
  ).length;
  const offlineCount = weighbridges.filter(
    (w) => w.status === "OFFLINE" || w.status === "MAINTENANCE",
  ).length;

  // Filtered List
  const filteredWeighbridges = useMemo(() => {
    return weighbridges.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.currentVehicle.toLowerCase().includes(q) ||
        item.operator.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchesLocation =
        locationFilter === "All" || item.location === locationFilter;
      const matchesOperator =
        operatorFilter === "All" || item.operator === operatorFilter;

      return (
        matchesSearch && matchesStatus && matchesLocation && matchesOperator
      );
    });
  }, [weighbridges, searchQuery, statusFilter, locationFilter, operatorFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const nextNum = weighbridges.length + 1;
    const nextCode = `WB-0${nextNum}`;
    setFormData({
      code: nextCode,
      name: "",
      location: "Main Gate",
      gateArea: `Gate ${nextNum}`,
      status: "ONLINE",
      capacity: "80,000 KG",
      ipAddress: `192.168.1.10${nextNum}`,
      port: 5000 + nextNum - 1,
      indicator: "Avery Weigh-Tronix E1205",
      printer: "Epson TM-T88VI Thermal",
      camera: "Hikvision ANPR 4K",
      operator: "Ravi Kumar",
      description: "",
    });
    setEditMode("add");
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: WeighbridgeItem) => {
    setFormData({ ...item });
    setEditMode("edit");
    setShowAddEditModal(true);
    setActiveMenuId(null);
  };

  // Save Add/Edit
  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editMode === "add") {
      const newStation: WeighbridgeItem = {
        id: formData.code || `WB-0${weighbridges.length + 1}`,
        code: formData.code || `WB-0${weighbridges.length + 1}`,
        name: formData.name || "New Station",
        fullName: `${formData.code} — ${formData.name}`,
        location: formData.location || "Main Gate",
        gateArea: formData.gateArea || "Site Gate",
        status: (formData.status as WeighbridgeStatus) || "ONLINE",
        currentVehicle: "No vehicle",
        currentWeight: "-- KG",
        weightState: "READY",
        operator: formData.operator || "-",
        lastActivity: "Just now",
        capacity: formData.capacity || "80,000 KG",
        ipAddress: formData.ipAddress || "192.168.1.100",
        port: Number(formData.port) || 5000,
        latency: "12 ms",
        installedDate: "20 Aug 2026",
        lastMaintenance: "20 Aug 2026",
        indicator: formData.indicator || "Avery Weigh-Tronix E1205",
        printer: formData.printer || "Epson TM-T88VI Thermal",
        camera: formData.camera || "Hikvision ANPR 4K",
        anpr: "ANPR Sensor",
        todayCount: 0,
        description:
          formData.description || "Newly added physical weighbridge station.",
      };
      setWeighbridges((prev) => [...prev, newStation]);
      showToast(`✓ Created new weighbridge station ${newStation.code}`);
    } else {
      setWeighbridges((prev) =>
        prev.map((w) =>
          w.id === formData.id
            ? ({
              ...w,
              ...formData,
              fullName: `${formData.code} — ${formData.name}`,
            } as WeighbridgeItem)
            : w,
        ),
      );
      showToast(`✓ Updated weighbridge station ${formData.code}`);
    }
    setShowAddEditModal(false);
  };

  // Delete Station
  const handleDeleteStation = (id: string) => {
    setWeighbridges((prev) => prev.filter((w) => w.id !== id));
    setDeleteConfirmId(null);
    setActiveMenuId(null);
    showToast(`✓ Weighbridge station ${id} removed`);
  };

  // Helper for Status Badge styling
  const getStatusPill = (status: WeighbridgeStatus) => {
    let color = statusOnline;
    let text = "ONLINE";
    let bgTint = dm ? "rgba(22,163,74,0.15)" : "#F0FDF4";

    if (status === "AVAILABLE") {
      color = statusAvailable;
      text = "AVAILABLE";
      bgTint = dm ? "rgba(37,99,235,0.15)" : "#EFF6FF";
    } else if (status === "WEIGHING") {
      color = statusWeighing;
      text = "WEIGHING";
      bgTint = dm ? "rgba(139,92,246,0.15)" : "#F5F3FF";
    } else if (status === "OFFLINE") {
      color = statusOffline;
      text = "OFFLINE";
      bgTint = dm ? "rgba(220,38,38,0.15)" : "#FEF2F2";
    } else if (status === "MAINTENANCE") {
      color = statusMaintenance;
      text = "MAINTENANCE";
      bgTint = dm ? "rgba(245,158,11,0.15)" : "#FFFBEB";
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
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
          }}
        />
        {text}
      </span>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "24px 32px 48px",
        background: bg,
        color: primaryText,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 84,
            right: 32,
            zIndex: 1200,
            background: primaryOrange,
            color: "#FFF",
            padding: "12px 20px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            boxShadow: "0 10px 25px rgba(249,115,22,0.4)",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* ── 1. PAGE HEADER ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              margin: 0,
              color: primaryText,
              letterSpacing: "-0.02em",
            }}
          >
            Weighbridge Management
          </h1>
          <p
            style={{ fontSize: 13, color: secondaryText, margin: "4px 0 0 0" }}
          >
            Manage physical weighbridge stations, connectivity, operational
            status and station configuration.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={() => showToast("✓ Station configuration report exported")}
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
            <span>↓</span> Export
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
            <span>+</span> ADD WEIGHBRIDGE
          </button>
        </div>
      </div>

      {/* ── 2. SUMMARY KPI ROW (5 CARDS) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Total Weighbridges */}
        <div
          style={{
            background: surface,
            borderRadius: 12,
            border: `1px solid ${border}`,
            padding: "20px 22px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: mutedText,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            TOTAL WEIGHBRIDGES
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: primaryText,
              margin: "6px 0 2px",
              fontFamily: "monospace",
            }}
          >
            {totalCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>
            All registered stations
          </div>
        </div>

        {/* Online */}
        <div
          style={{
            background: surface,
            borderRadius: 12,
            border: `1px solid ${border}`,
            padding: "20px 22px",
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
                fontSize: 11,
                fontWeight: 800,
                color: statusOnline,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ONLINE
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: statusOnline,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: statusOnline,
              margin: "6px 0 2px",
              fontFamily: "monospace",
            }}
          >
            {onlineCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>
            Currently connected
          </div>
        </div>

        {/* Weighing */}
        <div
          style={{
            background: surface,
            borderRadius: 12,
            border: `1px solid ${border}`,
            padding: "20px 22px",
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
                fontSize: 11,
                fontWeight: 800,
                color: statusWeighing,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              WEIGHING
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: statusWeighing,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: statusWeighing,
              margin: "6px 0 2px",
              fontFamily: "monospace",
            }}
          >
            {weighingCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>
            Currently processing vehicle
          </div>
        </div>

        {/* Available */}
        <div
          style={{
            background: surface,
            borderRadius: 12,
            border: `1px solid ${border}`,
            padding: "20px 22px",
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
                fontSize: 11,
                fontWeight: 800,
                color: statusAvailable,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              AVAILABLE
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: statusAvailable,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: statusAvailable,
              margin: "6px 0 2px",
              fontFamily: "monospace",
            }}
          >
            {availableCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>
            Ready for next vehicle
          </div>
        </div>

        {/* Offline */}
        <div
          style={{
            background: surface,
            borderRadius: 12,
            border: `1px solid ${border}`,
            padding: "20px 22px",
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
                fontSize: 11,
                fontWeight: 800,
                color: statusOffline,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              OFFLINE
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: statusOffline,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: statusOffline,
              margin: "6px 0 2px",
              fontFamily: "monospace",
            }}
          >
            {offlineCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>
            Requires attention
          </div>
        </div>
      </div>

      {/* ── 3. SEARCH & FILTER BAR ── */}
      <div
        style={{
          background: surface,
          borderRadius: 12,
          border: `1px solid ${border}`,
          padding: "16px 20px",
          marginBottom: 28,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          {/* Search Input */}
          <div style={{ position: "relative", minWidth: 260, flex: 1 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search weighbridge name, code, location..."
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
            <option value="AVAILABLE">● AVAILABLE</option>
            <option value="WEIGHING">● WEIGHING</option>
            <option value="OFFLINE">● OFFLINE</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
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
            <option value="All">All Locations ▼</option>
            <option value="Main Gate">Main Gate</option>
            <option value="North Gate">North Gate</option>
            <option value="Loading Yard">Loading Yard</option>
            <option value="Dispatch Gate">Dispatch Gate</option>
            <option value="West Gate">West Gate</option>
          </select>

          {/* Operator Filter */}
          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
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
            <option value="All">All Operators ▼</option>
            <option value="Ravi Kumar">Ravi Kumar</option>
            <option value="Suresh Kumar">Suresh Kumar</option>
            <option value="Rithick Nathan">Rithick Nathan</option>
          </select>
        </div>

        {/* Auto Refresh Badge */}
        <button
          type="button"
          onClick={() => setAutoRefresh(!autoRefresh)}
          style={{
            height: 38,
            padding: "0 14px",
            borderRadius: 999,
            background: autoRefresh
              ? dm
                ? "rgba(22,163,74,0.15)"
                : "#F0FDF4"
              : elevated,
            border: `1px solid ${autoRefresh ? statusOnline : border}`,
            color: autoRefresh ? statusOnline : mutedText,
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: autoRefresh ? statusOnline : mutedText,
            }}
          />
          Auto Refresh {autoRefresh ? "ON" : "OFF"}
        </button>
      </div>

      {/* ── 4. MAIN DATA TABLE CONTAINER ── */}
      <div
        style={{
          background: surface,
          borderRadius: 12,
          border: `1px solid ${border}`,
          overflow: "hidden",
        }}
      >
        {/* Table Header Controls */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${border}`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 800,
                margin: 0,
                color: primaryText,
              }}
            >
              WEIGHBRIDGES
            </h2>
            <p
              style={{
                fontSize: 12,
                color: secondaryText,
                margin: "2px 0 0 0",
              }}
            >
              {filteredWeighbridges.length} registered weighbridge stations
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => showToast("✓ Exported CSV data")}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                background: elevated,
                border: `1px solid ${border}`,
                color: primaryText,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => showToast("✓ Exported Excel data")}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                background: elevated,
                border: `1px solid ${border}`,
                color: primaryText,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  background: dm ? "#1A2332" : "#F8FAFC",
                  borderBottom: `1px solid ${border}`,
                  color: mutedText,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <th style={{ padding: "14px 20px" }}>WEIGHBRIDGE</th>
                <th style={{ padding: "14px 16px" }}>CODE</th>
                <th style={{ padding: "14px 16px" }}>LOCATION</th>
                <th style={{ padding: "14px 16px" }}>STATUS</th>
                <th style={{ padding: "14px 16px" }}>CURRENT VEHICLE</th>
                <th style={{ padding: "14px 16px" }}>CURRENT WEIGHT</th>
                <th style={{ padding: "14px 16px" }}>OPERATOR</th>
                <th style={{ padding: "14px 16px" }}>LAST ACTIVITY</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWeighbridges.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "48px 20px",
                      textAlign: "center",
                      color: mutedText,
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      No weighbridges found
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      Try adjusting your search query or filter selection.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWeighbridges.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: `1px solid ${divider}`,
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.background = dm
                      ? "rgba(255,255,255,0.03)"
                      : "#F8FAFC")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Weighbridge Name */}
                    <td
                      style={{
                        padding: "16px 20px",
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      <div>{item.fullName}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: mutedText,
                          fontWeight: 500,
                        }}
                      >
                        Cap: {item.capacity}
                      </div>
                    </td>

                    {/* Code */}
                    <td
                      style={{
                        padding: "16px 16px",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color: primaryOrange,
                      }}
                    >
                      {item.code}
                    </td>

                    {/* Location */}
                    <td
                      style={{
                        padding: "16px 16px",
                        color: secondaryText,
                        fontWeight: 600,
                      }}
                    >
                      {item.location}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 16px" }}>
                      {getStatusPill(item.status)}
                    </td>

                    {/* Current Vehicle */}
                    <td
                      style={{
                        padding: "16px 16px",
                        fontWeight: item.currentVehicle.startsWith("TN")
                          ? 800
                          : 500,
                        color: item.currentVehicle.startsWith("TN")
                          ? primaryText
                          : mutedText,
                      }}
                    >
                      {item.currentVehicle}
                    </td>

                    {/* Current Weight */}
                    <td
                      style={{
                        padding: "16px 16px",
                        fontFamily: "monospace",
                        fontWeight: 800,
                        color:
                          item.currentWeight !== "-- KG"
                            ? primaryOrange
                            : mutedText,
                      }}
                    >
                      {item.currentWeight}
                    </td>

                    {/* Operator */}
                    <td
                      style={{
                        padding: "16px 16px",
                        color: secondaryText,
                        fontWeight: 600,
                      }}
                    >
                      {item.operator}
                    </td>

                    {/* Last Activity */}
                    <td
                      style={{
                        padding: "16px 16px",
                        color: mutedText,
                        fontSize: 12,
                      }}
                    >
                      {item.lastActivity}
                    </td>

                    {/* Row Actions */}
                    <td
                      style={{
                        padding: "16px 20px",
                        textAlign: "right",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStation(item);
                            setShowDetailModal(true);
                          }}
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
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 6,
                            background: elevated,
                            border: `1px solid ${border}`,
                            color: primaryText,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === item.id ? null : item.id,
                            )
                          }
                          style={{
                            padding: "6px 8px",
                            borderRadius: 6,
                            background: elevated,
                            border: `1px solid ${border}`,
                            color: secondaryText,
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          ▾
                        </button>
                      </div>

                      {/* Row Context Menu */}
                      {activeMenuId === item.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: 50,
                            right: 20,
                            width: 170,
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
                              showToast(`✓ Duplicated ${item.code}`);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📋 Duplicate Station
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setWeighbridges((prev) =>
                                prev.map((w) =>
                                  w.id === item.id
                                    ? {
                                      ...w,
                                      status:
                                        w.status === "OFFLINE"
                                          ? "ONLINE"
                                          : "OFFLINE",
                                    }
                                    : w,
                                ),
                              );
                              showToast(
                                `✓ Station ${item.code} status toggled`,
                              );
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            ⚡ Toggle Disable / Offline
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStation(item);
                              setShowDetailModal(true);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📊 View Activity Logs
                          </button>

                          <div
                            style={{
                              borderTop: `1px solid ${divider}`,
                              margin: "4px 0",
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirmId(item.id);
                              setActiveMenuId(null);
                            }}
                            style={{
                              ...contextMenuItemStyle,
                              color: statusOffline,
                            }}
                          >
                            🗑 Delete Station
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

      {/* ── 5. STATION DETAIL PREVIEW MODAL / DRAWER ── */}
      {showDetailModal && selectedStation && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 760,
              maxHeight: "90vh",
              background: surface,
              borderRadius: 16,
              border: `1px solid ${border}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      margin: 0,
                      color: primaryText,
                    }}
                  >
                    {selectedStation.fullName}
                  </h2>
                  {getStatusPill(selectedStation.status)}
                </div>
                <div
                  style={{ fontSize: 12.5, color: secondaryText, marginTop: 4 }}
                >
                  Code:{" "}
                  <strong style={{ color: primaryOrange }}>
                    {selectedStation.code}
                  </strong>{" "}
                  · IP: {selectedStation.ipAddress}:{selectedStation.port}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: "none",
                  border: 0,
                  color: mutedText,
                  fontSize: 20,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* Current Live Operation Banner */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: dm ? "#1A2332" : "#FFF7ED",
                  border: `1px solid ${primaryOrange}40`,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: primaryOrange,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    CURRENT OPERATION
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: primaryText,
                      marginTop: 2,
                    }}
                  >
                    Vehicle: {selectedStation.currentVehicle}
                  </div>
                  <div
                    style={{ fontSize: 12, color: secondaryText, marginTop: 2 }}
                  >
                    Operator: {selectedStation.operator} · Last Updated:{" "}
                    {selectedStation.lastActivity}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      color: primaryOrange,
                    }}
                  >
                    {selectedStation.currentWeight}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: statusOnline,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 4,
                    }}
                  >
                    <span>●</span> {selectedStation.weightState}
                  </div>
                </div>
              </div>

              {/* Station Information & Connectivity Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {/* Station Information */}
                <div
                  style={{
                    padding: 18,
                    borderRadius: 10,
                    background: elevated,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: primaryOrange,
                      marginBottom: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    STATION INFORMATION
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      fontSize: 12.5,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Name</span>
                      <span style={{ fontWeight: 700 }}>
                        {selectedStation.name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Code</span>
                      <span style={{ fontWeight: 700 }}>
                        {selectedStation.code}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Location</span>
                      <span style={{ fontWeight: 700 }}>
                        {selectedStation.location}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Capacity</span>
                      <span style={{ fontWeight: 700 }}>
                        {selectedStation.capacity}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Installed Date</span>
                      <span>{selectedStation.installedDate}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Last Maintenance</span>
                      <span>{selectedStation.lastMaintenance}</span>
                    </div>
                  </div>
                </div>

                {/* Connectivity */}
                <div
                  style={{
                    padding: 18,
                    borderRadius: 10,
                    background: elevated,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: primaryOrange,
                      marginBottom: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    CONNECTIVITY & HEALTH
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      fontSize: 12.5,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Network</span>
                      <span
                        style={{
                          color:
                            selectedStation.status === "OFFLINE"
                              ? statusOffline
                              : statusOnline,
                          fontWeight: 700,
                        }}
                      >
                        ●{" "}
                        {selectedStation.status === "OFFLINE"
                          ? "Disconnected"
                          : "Connected"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>IP Address</span>
                      <span style={{ fontFamily: "monospace" }}>
                        {selectedStation.ipAddress}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Port</span>
                      <span>{selectedStation.port}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Latency</span>
                      <span>{selectedStation.latency}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Heartbeat</span>
                      <span>Just now</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Today Count</span>
                      <span style={{ fontWeight: 800, color: secondaryGold }}>
                        {selectedStation.todayCount} vehicles
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Devices */}
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: primaryText,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  CONNECTED HARDWARE DEVICES
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      background: elevated,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: mutedText,
                        fontWeight: 600,
                      }}
                    >
                      Weight Indicator
                    </div>
                    <div
                      style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}
                    >
                      {selectedStation.indicator}
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color:
                          selectedStation.status === "OFFLINE"
                            ? statusOffline
                            : statusOnline,
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                    >
                      ●{" "}
                      {selectedStation.status === "OFFLINE"
                        ? "Disconnected"
                        : "Online"}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      background: elevated,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: mutedText,
                        fontWeight: 600,
                      }}
                    >
                      Printer
                    </div>
                    <div
                      style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}
                    >
                      {selectedStation.printer}
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: statusOnline,
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                    >
                      ● Connected
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      background: elevated,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: mutedText,
                        fontWeight: 600,
                      }}
                    >
                      Camera / ANPR
                    </div>
                    <div
                      style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}
                    >
                      {selectedStation.camera}
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: statusOnline,
                        fontWeight: 700,
                        marginTop: 4,
                      }}
                    >
                      ● Connected
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: primaryText,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  RECENT STATION ACTIVITY
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    fontSize: 12,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: elevated,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      08:42 AM — Vehicle weighing started (TN20AB1234)
                    </span>
                    <span style={{ color: mutedText }}>
                      Operator: {selectedStation.operator}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: elevated,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>08:39 AM — Ticket WB-2026-00461 completed</span>
                    <span style={{ color: statusOnline, fontWeight: 700 }}>
                      ✓ Printed
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: elevated,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      08:35 AM — Operator logged in ({selectedStation.operator})
                    </span>
                    <span style={{ color: mutedText }}>Session active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: `1px solid ${border}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowDetailModal(false);
                  handleOpenEdit(selectedStation);
                }}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  background: elevated,
                  border: `1px solid ${border}`,
                  color: primaryText,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Edit Station
              </button>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: primaryOrange,
                  color: "#FFF",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. ADD / EDIT WEIGHBRIDGE MODAL ── */}
      {showAddEditModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 640,
              maxHeight: "90vh",
              background: surface,
              borderRadius: 16,
              border: `1px solid ${border}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              overflowY: "auto",
            }}
          >
            <form onSubmit={handleSaveStation}>
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    margin: 0,
                    color: primaryText,
                  }}
                >
                  {editMode === "add"
                    ? "+ Add New Weighbridge"
                    : `Edit Station ${formData.code}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  style={{
                    background: "none",
                    border: 0,
                    color: mutedText,
                    fontSize: 20,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  padding: 24,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label style={formLabelStyle}>Weighbridge Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g. WB-06"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Weighbridge Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. South Entry Gate"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Location *</label>
                  <select
                    value={formData.location || "Main Gate"}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="Main Gate">Main Gate</option>
                    <option value="North Gate">North Gate</option>
                    <option value="Loading Yard">Loading Yard</option>
                    <option value="Dispatch Gate">Dispatch Gate</option>
                    <option value="West Gate">West Gate</option>
                    <option value="South Yard">South Yard</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Weight Capacity *</label>
                  <input
                    type="text"
                    value={formData.capacity || "80,000 KG"}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    placeholder="e.g. 80,000 KG"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>IP Address</label>
                  <input
                    type="text"
                    value={formData.ipAddress || "192.168.1.100"}
                    onChange={(e) =>
                      setFormData({ ...formData, ipAddress: e.target.value })
                    }
                    placeholder="192.168.1.100"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Port</label>
                  <input
                    type="number"
                    value={formData.port || 5000}
                    onChange={(e) => {
                      const value = e.target.value;
                      const parsed = value === "" ? undefined : Number(value);

                      setFormData({
                        ...formData,
                        port:
                          parsed !== undefined && Number.isFinite(parsed)
                            ? parsed
                            : undefined,
                      });
                    }}
                    placeholder="5000"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Weight Indicator</label>
                  <input
                    type="text"
                    value={formData.indicator || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, indicator: e.target.value })
                    }
                    placeholder="Avery Weigh-Tronix E1205"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Status</label>
                  <select
                    value={formData.status || "ONLINE"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as WeighbridgeStatus,
                      })
                    }
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="WEIGHING">WEIGHING</option>
                    <option value="OFFLINE">OFFLINE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={formLabelStyle}>Assigned Operator</label>
                  <select
                    value={formData.operator || "Ravi Kumar"}
                    onChange={(e) =>
                      setFormData({ ...formData, operator: e.target.value })
                    }
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="Ravi Kumar">Ravi Kumar</option>
                    <option value="Suresh Kumar">Suresh Kumar</option>
                    <option value="Rithick Nathan">Rithick Nathan</option>
                    <option value="-">Unassigned (-)</option>
                  </select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={formLabelStyle}>Description / Notes</label>
                  <textarea
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Additional operational details or hardware notes..."
                    style={{
                      ...formInputStyle(inputBg, border, primaryText),
                      height: "auto",
                      padding: 10,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  padding: "16px 24px",
                  borderTop: `1px solid ${border}`,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    background: elevated,
                    border: `1px solid ${border}`,
                    color: primaryText,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 22px",
                    borderRadius: 8,
                    background: primaryOrange,
                    color: "#FFF",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Save Weighbridge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Modal */}
      {deleteConfirmId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: 400,
              background: surface,
              borderRadius: 16,
              border: `1px solid ${border}`,
              padding: 24,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                margin: "0 0 8px",
                color: primaryText,
              }}
            >
              Delete Station {deleteConfirmId}?
            </h3>
            <p
              style={{ fontSize: 13, color: secondaryText, margin: "0 0 20px" }}
            >
              Are you sure you want to remove weighbridge station{" "}
              <strong>{deleteConfirmId}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  background: elevated,
                  border: `1px solid ${border}`,
                  color: primaryText,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteStation(deleteConfirmId)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: statusOffline,
                  color: "#FFF",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Yes, Delete Station
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

const formInputStyle = (
  bg: string,
  border: string,
  text: string,
): React.CSSProperties => ({
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
