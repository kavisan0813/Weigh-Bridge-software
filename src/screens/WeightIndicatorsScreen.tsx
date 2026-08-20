import React, { useState, useMemo } from "react";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export type IndicatorStatus = "ONLINE" | "OFFLINE" | "WARNING";
export type WeightState = "STABLE" | "ZERO" | "UNSTABLE" | "MOTION" | "OVERLOAD" | "READY" | "OFFLINE";
export type CalibrationStatus = "VALID" | "DUE SOON" | "OVERDUE";

export interface WeightIndicatorItem {
  id: string;
  name: string;
  code: string;
  weighbridgeId: string;
  weighbridgeName: string;
  location: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  connection: "Ethernet" | "Serial" | "USB";
  ipAddress: string;
  port: number;
  status: IndicatorStatus;
  currentWeight: string;
  grossWeight: string;
  tareWeight: string;
  netWeight: string;
  weightState: WeightState;
  calibrationStatus: CalibrationStatus;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  calibratedBy: string;
  certificateId: string;
  capacity: string;
  division: string;
  unit: string;
  firmware: string;
  installationDate: string;
  lastUpdate: string;
  zeroTracking: string;
  motionDetection: string;
  overloadLimit: string;
}

const INITIAL_INDICATORS: WeightIndicatorItem[] = [
  {
    id: "IND-WB01-001",
    name: "WB-01 Primary Weight Indicator",
    code: "IND-WB01-001",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    location: "Main Gate",
    manufacturer: "Avery Weigh-Tronix",
    model: "E1205 Indicator",
    serialNumber: "AV-IND-928371",
    connection: "Ethernet",
    ipAddress: "192.168.1.101",
    port: 5000,
    status: "ONLINE",
    currentWeight: "38,500 KG",
    grossWeight: "38,500 KG",
    tareWeight: "12,000 KG",
    netWeight: "26,500 KG",
    weightState: "STABLE",
    calibrationStatus: "VALID",
    lastCalibrationDate: "02 Aug 2026",
    nextCalibrationDate: "02 Nov 2026",
    calibratedBy: "ABC Weighbridge Service Ltd",
    certificateId: "WB-CAL-2026-082",
    capacity: "80,000 KG",
    division: "20 KG",
    unit: "KG",
    firmware: "v4.8.2",
    installationDate: "15 Jan 2025",
    lastUpdate: "1 sec ago",
    zeroTracking: "Enabled (± 0.5 d)",
    motionDetection: "Enabled (± 1.0 d)",
    overloadLimit: "80,000 KG (+9d)",
  },
  {
    id: "IND-WB02-001",
    name: "WB-02 Digital Indicator",
    code: "IND-WB02-001",
    weighbridgeId: "WB-02",
    weighbridgeName: "WB-02 — North Gate",
    location: "North Gate",
    manufacturer: "Mettler Toledo",
    model: "IND570 Industrial",
    serialNumber: "MT-IND-448102",
    connection: "Ethernet",
    ipAddress: "192.168.1.102",
    port: 5001,
    status: "ONLINE",
    currentWeight: "0 KG",
    grossWeight: "0 KG",
    tareWeight: "0 KG",
    netWeight: "0 KG",
    weightState: "ZERO",
    calibrationStatus: "VALID",
    lastCalibrationDate: "28 Jul 2026",
    nextCalibrationDate: "28 Oct 2026",
    calibratedBy: "MetroTech Calibration Corp",
    certificateId: "WB-CAL-2026-074",
    capacity: "80,000 KG",
    division: "20 KG",
    unit: "KG",
    firmware: "v3.12",
    installationDate: "20 Feb 2025",
    lastUpdate: "3 sec ago",
    zeroTracking: "Enabled (± 0.5 d)",
    motionDetection: "Enabled (± 1.0 d)",
    overloadLimit: "80,000 KG (+9d)",
  },
  {
    id: "IND-WB03-001",
    name: "WB-03 Heavy Weight Terminal",
    code: "IND-WB03-001",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    location: "Loading Yard",
    manufacturer: "Rice Lake",
    model: "920i Programmable",
    serialNumber: "RL-920-88301",
    connection: "Ethernet",
    ipAddress: "192.168.1.103",
    port: 5002,
    status: "ONLINE",
    currentWeight: "32,100 KG",
    grossWeight: "32,100 KG",
    tareWeight: "10,500 KG",
    netWeight: "21,600 KG",
    weightState: "STABLE",
    calibrationStatus: "DUE SOON",
    lastCalibrationDate: "12 Aug 2025",
    nextCalibrationDate: "30 Aug 2026",
    calibratedBy: "ABC Weighbridge Service Ltd",
    certificateId: "WB-CAL-2025-119",
    capacity: "100,000 KG",
    division: "20 KG",
    unit: "KG",
    firmware: "v6.1.1",
    installationDate: "10 Mar 2025",
    lastUpdate: "2 sec ago",
    zeroTracking: "Enabled (± 0.5 d)",
    motionDetection: "Enabled (± 1.0 d)",
    overloadLimit: "100,000 KG (+9d)",
  },
  {
    id: "IND-WB04-001",
    name: "WB-04 Digital Terminal",
    code: "IND-WB04-001",
    weighbridgeId: "WB-04",
    weighbridgeName: "WB-04 — East Gate",
    location: "East Gate",
    manufacturer: "Avery Weigh-Tronix",
    model: "E1205 Indicator",
    serialNumber: "AV-IND-928399",
    connection: "Ethernet",
    ipAddress: "192.168.1.104",
    port: 5003,
    status: "OFFLINE",
    currentWeight: "-- KG",
    grossWeight: "-- KG",
    tareWeight: "-- KG",
    netWeight: "-- KG",
    weightState: "OFFLINE",
    calibrationStatus: "OVERDUE",
    lastCalibrationDate: "15 Jun 2025",
    nextCalibrationDate: "15 Jun 2026",
    calibratedBy: "ABC Weighbridge Service Ltd",
    certificateId: "WB-CAL-2025-061",
    capacity: "80,000 KG",
    division: "20 KG",
    unit: "KG",
    firmware: "v4.8.2",
    installationDate: "05 Apr 2025",
    lastUpdate: "18 min ago",
    zeroTracking: "Disabled",
    motionDetection: "Enabled (± 1.0 d)",
    overloadLimit: "80,000 KG (+9d)",
  },
  {
    id: "IND-WB05-001",
    name: "WB-05 Auxiliary Indicator",
    code: "IND-WB05-001",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    location: "West Gate",
    manufacturer: "Mettler Toledo",
    model: "IND570 Industrial",
    serialNumber: "MT-IND-559201",
    connection: "Ethernet",
    ipAddress: "192.168.1.105",
    port: 5004,
    status: "ONLINE",
    currentWeight: "0 KG",
    grossWeight: "0 KG",
    tareWeight: "0 KG",
    netWeight: "0 KG",
    weightState: "READY",
    calibrationStatus: "VALID",
    lastCalibrationDate: "05 Aug 2026",
    nextCalibrationDate: "05 Nov 2026",
    calibratedBy: "MetroTech Calibration Corp",
    certificateId: "WB-CAL-2026-091",
    capacity: "60,000 KG",
    division: "10 KG",
    unit: "KG",
    firmware: "v3.12",
    installationDate: "01 Jun 2025",
    lastUpdate: "5 sec ago",
    zeroTracking: "Enabled (± 0.5 d)",
    motionDetection: "Enabled (± 1.0 d)",
    overloadLimit: "60,000 KG (+9d)",
  },
];

export default function WeightIndicatorsScreen({ darkMode: dm }: Props) {
  // Theme Tokens
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
  const statusWarning = "#F59E0B";
  const statusOffline = "#DC2626";

  // State Management
  const [indicators, setIndicators] = useState<WeightIndicatorItem[]>(INITIAL_INDICATORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [wbFilter, setWbFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("All");
  const [calibrationFilter, setCalibrationFilter] = useState<string>("All");

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("10:42:18 AM");

  // Modals & Context Menus
  const [selectedIndicator, setSelectedIndicator] = useState<WeightIndicatorItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleManualRefresh = () => {
    const timeStr = new Date().toLocaleTimeString();
    setLastUpdatedTime(timeStr);
    showToast("✓ Weight indicator readings refreshed");
  };

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<WeightIndicatorItem>>({
    code: "IND-WB06-001",
    name: "",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    manufacturer: "Avery Weigh-Tronix",
    model: "E1205 Indicator",
    serialNumber: "AV-IND-100200",
    connection: "Ethernet",
    ipAddress: "192.168.1.106",
    port: 5005,
    capacity: "80,000 KG",
    division: "20 KG",
    unit: "KG",
    firmware: "v4.8.2",
    status: "ONLINE",
    calibrationStatus: "VALID",
    lastCalibrationDate: "20 Aug 2026",
    nextCalibrationDate: "20 Nov 2026",
  });

  // KPI Calculations
  const totalCount = indicators.length;
  const onlineCount = indicators.filter((i) => i.status === "ONLINE").length;
  const liveWeighingCount = indicators.filter((i) => i.currentWeight.includes("38,") || i.currentWeight.includes("32,")).length;
  const offlineCount = indicators.filter((i) => i.status === "OFFLINE").length;
  const calDueCount = indicators.filter((i) => i.calibrationStatus === "DUE SOON" || i.calibrationStatus === "OVERDUE").length;

  // Filtered Indicators List
  const filteredIndicators = useMemo(() => {
    return indicators.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.ipAddress.toLowerCase().includes(q) ||
        item.weighbridgeName.toLowerCase().includes(q);

      const matchWb = wbFilter === "All" || item.weighbridgeId === wbFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchManufacturer = manufacturerFilter === "All" || item.manufacturer === manufacturerFilter;
      const matchCalibration = calibrationFilter === "All" || item.calibrationStatus === calibrationFilter;

      return matchQ && matchWb && matchStatus && matchManufacturer && matchCalibration;
    });
  }, [indicators, searchQuery, wbFilter, statusFilter, manufacturerFilter, calibrationFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const nextNum = indicators.length + 1;
    setFormData({
      code: `IND-WB0${nextNum}-001`,
      name: `WB-0${nextNum} Digital Indicator`,
      weighbridgeId: `WB-0${nextNum}`,
      weighbridgeName: `WB-0${nextNum} — Gate ${nextNum}`,
      manufacturer: "Avery Weigh-Tronix",
      model: "E1205 Indicator",
      serialNumber: `AV-IND-900${nextNum}`,
      connection: "Ethernet",
      ipAddress: `192.168.1.10${nextNum}`,
      port: 5000 + nextNum,
      capacity: "80,000 KG",
      division: "20 KG",
      unit: "KG",
      firmware: "v4.8.2",
      status: "ONLINE",
      calibrationStatus: "VALID",
      lastCalibrationDate: "20 Aug 2026",
      nextCalibrationDate: "20 Nov 2026",
    });
    setEditMode("add");
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: WeightIndicatorItem) => {
    setFormData({ ...item });
    setEditMode("edit");
    setShowAddEditModal(true);
    setActiveMenuId(null);
  };

  // Save Add / Edit
  const handleSaveIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editMode === "add") {
      const newItem: WeightIndicatorItem = {
        id: formData.code || `IND-WB0${indicators.length + 1}-001`,
        code: formData.code || `IND-WB0${indicators.length + 1}-001`,
        name: formData.name || "Digital Indicator",
        weighbridgeId: formData.weighbridgeId || "WB-01",
        weighbridgeName: formData.weighbridgeName || "WB-01 — Main Gate",
        location: "Main Gate",
        manufacturer: formData.manufacturer || "Avery Weigh-Tronix",
        model: formData.model || "E1205 Indicator",
        serialNumber: formData.serialNumber || "AV-IND-100200",
        connection: (formData.connection as "Ethernet" | "Serial" | "USB") || "Ethernet",
        ipAddress: formData.ipAddress || "192.168.1.100",
        port: Number(formData.port) || 5000,
        status: (formData.status as IndicatorStatus) || "ONLINE",
        currentWeight: "0 KG",
        grossWeight: "0 KG",
        tareWeight: "0 KG",
        netWeight: "0 KG",
        weightState: "ZERO",
        calibrationStatus: (formData.calibrationStatus as CalibrationStatus) || "VALID",
        lastCalibrationDate: formData.lastCalibrationDate || "20 Aug 2026",
        nextCalibrationDate: formData.nextCalibrationDate || "20 Nov 2026",
        calibratedBy: "ABC Weighbridge Service Ltd",
        certificateId: "WB-CAL-2026-101",
        capacity: formData.capacity || "80,000 KG",
        division: formData.division || "20 KG",
        unit: formData.unit || "KG",
        firmware: formData.firmware || "v4.8.2",
        installationDate: "20 Aug 2026",
        lastUpdate: "Just now",
        zeroTracking: "Enabled (± 0.5 d)",
        motionDetection: "Enabled (± 1.0 d)",
        overloadLimit: `${formData.capacity || "80,000 KG"} (+9d)`,
      };
      setIndicators((prev) => [...prev, newItem]);
      showToast(`✓ Registered weight indicator ${newItem.code}`);
    } else {
      setIndicators((prev) =>
        prev.map((i) => (i.id === formData.id ? ({ ...i, ...formData } as WeightIndicatorItem) : i))
      );
      showToast(`✓ Updated indicator ${formData.code}`);
    }
    setShowAddEditModal(false);
  };

  // Helper for Status Badge styling
  const getStatusPill = (status: IndicatorStatus) => {
    let color = statusOnline;
    let text = "ONLINE";
    let bgTint = dm ? "rgba(22,163,74,0.15)" : "#F0FDF4";

    if (status === "WARNING") {
      color = statusWarning;
      text = "WARNING";
      bgTint = dm ? "rgba(245,158,11,0.15)" : "#FFFBEB";
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

  // Helper for Calibration Badge styling
  const getCalibrationPill = (cal: CalibrationStatus) => {
    let color = statusOnline;
    let bgTint = dm ? "rgba(22,163,74,0.15)" : "#F0FDF4";

    if (cal === "DUE SOON") {
      color = statusWarning;
      bgTint = dm ? "rgba(245,158,11,0.15)" : "#FFFBEB";
    } else if (cal === "OVERDUE") {
      color = statusOffline;
      bgTint = dm ? "rgba(220,38,38,0.15)" : "#FEF2F2";
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "3px 8px",
          borderRadius: 6,
          background: bgTint,
          color: color,
          fontSize: 11,
          fontWeight: 800,
          border: `1px solid ${color}30`,
        }}
      >
        {cal}
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
            Weight Indicators
          </h1>
          <p style={{ fontSize: 13, color: secondaryText, margin: "4px 0 0 0" }}>
            Manage digital weight indicators, live readings, connectivity, configuration and calibration status across weighbridge stations.
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
            <span>+</span> ADD INDICATOR
          </button>
        </div>
      </div>

      {/* ── 2. SUMMARY KPI ROW (5 CARDS) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* Total Indicators */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            TOTAL INDICATORS
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: primaryText, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {totalCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Registered indicators</div>
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
          <div style={{ fontSize: 12, color: secondaryText }}>Connected & active</div>
        </div>

        {/* Live Weighing */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              LIVE WEIGHING
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: primaryOrange }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: primaryOrange, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {liveWeighingCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Receiving live load</div>
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

        {/* Calibration Due */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusWarning, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              CALIBRATION DUE
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusWarning }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusWarning, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {calDueCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Requires calibration</div>
        </div>
      </div>

      {/* ── 3. LIVE WEIGHT OVERVIEW (INDICATOR PREVIEW CARDS) ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
          LIVE WEIGHT INDICATORS
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {indicators.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedIndicator(item);
                setShowDetailModal(true);
              }}
              style={{
                background: surface,
                borderRadius: 12,
                border: `1px solid ${item.currentWeight.includes("38,") || item.currentWeight.includes("32,") ? primaryOrange : border}`,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: primaryText }}>{item.weighbridgeName}</span>
                {getStatusPill(item.status)}
              </div>

              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", color: item.status === "OFFLINE" ? mutedText : primaryOrange, margin: "8px 0 4px" }}>
                {item.currentWeight}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: secondaryText }}>
                <span style={{ fontWeight: 800, color: item.weightState === "STABLE" ? statusOnline : item.weightState === "ZERO" ? secondaryGold : mutedText }}>
                  ● {item.weightState}
                </span>
                <span>Last update: {item.lastUpdate}</span>
              </div>
            </div>
          ))}
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
              placeholder="Search indicator name, ID, model, IP, serial..."
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
            <option value="OFFLINE">● OFFLINE</option>
          </select>

          {/* Manufacturer Filter */}
          <select
            value={manufacturerFilter}
            onChange={(e) => setManufacturerFilter(e.target.value)}
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
            <option value="All">All Manufacturers ▼</option>
            <option value="Avery Weigh-Tronix">Avery Weigh-Tronix</option>
            <option value="Mettler Toledo">Mettler Toledo</option>
            <option value="Rice Lake">Rice Lake</option>
          </select>

          {/* Calibration Status Filter */}
          <select
            value={calibrationFilter}
            onChange={(e) => setCalibrationFilter(e.target.value)}
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
            <option value="All">All Calibration Status ▼</option>
            <option value="VALID">VALID</option>
            <option value="DUE SOON">DUE SOON</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
        </div>

        {/* Live Indicator Badge & Auto Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: statusOnline, fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusOnline }} />
            LIVE ({lastUpdatedTime})
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

      {/* ── 5. MAIN WEIGHT INDICATOR TABLE ── */}
      <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${border}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: primaryText }}>WEIGHT INDICATORS</h2>
            <p style={{ fontSize: 12, color: secondaryText, margin: "2px 0 0 0" }}>
              {filteredIndicators.length} registered digital weight indicators
            </p>
          </div>

          <div style={{ fontSize: 12, color: mutedText, fontWeight: 600 }}>
            Showing {filteredIndicators.length} of {indicators.length} indicators
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: dm ? "#1A2332" : "#F8FAFC", borderBottom: `1px solid ${border}`, color: mutedText, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "14px 20px" }}>INDICATOR</th>
                <th style={{ padding: "14px 16px" }}>INDICATOR ID</th>
                <th style={{ padding: "14px 16px" }}>WEIGHBRIDGE</th>
                <th style={{ padding: "14px 16px" }}>MODEL</th>
                <th style={{ padding: "14px 16px" }}>CONNECTION</th>
                <th style={{ padding: "14px 16px" }}>CURRENT WEIGHT</th>
                <th style={{ padding: "14px 16px" }}>STATUS</th>
                <th style={{ padding: "14px 16px" }}>CALIBRATION</th>
                <th style={{ padding: "14px 16px" }}>LAST UPDATE</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndicators.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: "48px 20px", textAlign: "center", color: mutedText }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>No weight indicators found</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search query or filter selection.</div>
                  </td>
                </tr>
              ) : (
                filteredIndicators.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: `1px solid ${divider}`, transition: "background 0.15s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = dm ? "rgba(255,255,255,0.03)" : "#F8FAFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Indicator Name */}
                    <td style={{ padding: "16px 20px", fontWeight: 800, color: primaryText }}>
                      <div>{item.name}</div>
                      <div style={{ fontSize: 11, color: mutedText, fontWeight: 500 }}>SN: {item.serialNumber}</div>
                    </td>

                    {/* Code / ID */}
                    <td style={{ padding: "16px 16px", fontWeight: 700, fontFamily: "monospace", color: primaryOrange }}>
                      {item.code}
                    </td>

                    {/* Weighbridge */}
                    <td style={{ padding: "16px 16px", color: primaryText, fontWeight: 700 }}>
                      {item.weighbridgeName}
                    </td>

                    {/* Model */}
                    <td style={{ padding: "16px 16px", color: secondaryText, fontWeight: 600 }}>
                      {item.manufacturer} {item.model}
                    </td>

                    {/* Connection */}
                    <td style={{ padding: "16px 16px", color: secondaryText, fontWeight: 600 }}>
                      {item.connection} ({item.ipAddress})
                    </td>

                    {/* Current Weight */}
                    <td style={{ padding: "16px 16px" }}>
                      <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 14, color: item.status === "OFFLINE" ? mutedText : primaryOrange }}>
                        {item.currentWeight}
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: item.weightState === "STABLE" ? statusOnline : item.weightState === "ZERO" ? secondaryGold : mutedText }}>
                        ● {item.weightState}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 16px" }}>
                      {getStatusPill(item.status)}
                    </td>

                    {/* Calibration */}
                    <td style={{ padding: "16px 16px" }}>
                      {getCalibrationPill(item.calibrationStatus)}
                    </td>

                    {/* Last Update */}
                    <td style={{ padding: "16px 16px", color: mutedText, fontSize: 12 }}>
                      {item.lastUpdate}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 20px", textAlign: "right", position: "relative" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIndicator(item);
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
                              showToast(`✓ Connection test ping sent to ${item.ipAddress}... Latency: 12ms`);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📡 Test Connection Signal
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIndicator(item);
                              setShowDetailModal(true);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📊 View Activity Logs
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`✓ Calibration request logged for ${item.code}`);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            ⚖ Open Calibration Request
                          </button>

                          <div style={{ borderTop: `1px solid ${divider}`, margin: "4px 0" }} />

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`✓ Restarting indicator stream for ${item.code}`);
                              setActiveMenuId(null);
                            }}
                            style={{ ...contextMenuItemStyle, color: primaryOrange }}
                          >
                            🔄 Restart Indicator Stream
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
      {showDetailModal && selectedIndicator && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 780, maxHeight: "90vh", background: surface, borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Modal Header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText }}>{selectedIndicator.name}</h2>
                  {getStatusPill(selectedIndicator.status)}
                  {getCalibrationPill(selectedIndicator.calibrationStatus)}
                </div>
                <div style={{ fontSize: 12.5, color: secondaryText, marginTop: 4 }}>
                  Code: <strong style={{ color: primaryOrange, fontFamily: "monospace" }}>{selectedIndicator.code}</strong> · Station: {selectedIndicator.weighbridgeName}
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

              {/* Live Weight Reading Banner */}
              <div style={{ padding: "18px 22px", borderRadius: 12, background: dm ? "#1A2332" : "#FFF7ED", border: `1px solid ${primaryOrange}40`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, textTransform: "uppercase", letterSpacing: "0.05em" }}>LIVE WEIGHT READING</div>
                  <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "monospace", color: primaryOrange, margin: "4px 0" }}>{selectedIndicator.currentWeight}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: statusOnline }}>● WEIGHT {selectedIndicator.weightState}</div>
                </div>

                <div style={{ padding: "12px 16px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, display: "flex", gap: 16, fontSize: 12 }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: mutedText, fontWeight: 600 }}>GROSS</div>
                    <div style={{ fontWeight: 800, fontFamily: "monospace" }}>{selectedIndicator.grossWeight}</div>
                  </div>
                  <div style={{ borderLeft: `1px solid ${border}`, paddingLeft: 16 }}>
                    <div style={{ fontSize: 10.5, color: mutedText, fontWeight: 600 }}>TARE</div>
                    <div style={{ fontWeight: 800, fontFamily: "monospace" }}>{selectedIndicator.tareWeight}</div>
                  </div>
                  <div style={{ borderLeft: `1px solid ${border}`, paddingLeft: 16 }}>
                    <div style={{ fontSize: 10.5, color: mutedText, fontWeight: 600 }}>NET</div>
                    <div style={{ fontWeight: 800, fontFamily: "monospace", color: primaryOrange }}>{selectedIndicator.netWeight}</div>
                  </div>
                </div>
              </div>

              {/* Specifications & Calibration Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Specifications */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>INDICATOR SPECIFICATIONS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Manufacturer</span><span style={{ fontWeight: 700 }}>{selectedIndicator.manufacturer}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Model</span><span style={{ fontWeight: 700 }}>{selectedIndicator.model}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Serial Number</span><span style={{ fontFamily: "monospace" }}>{selectedIndicator.serialNumber}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Firmware</span><span>{selectedIndicator.firmware}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Capacity</span><span style={{ fontWeight: 700 }}>{selectedIndicator.capacity}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Division</span><span>{selectedIndicator.division}</span></div>
                  </div>
                </div>

                {/* Calibration Details */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>CALIBRATION STATUS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Status</span>{getCalibrationPill(selectedIndicator.calibrationStatus)}</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Last Calibration</span><span>{selectedIndicator.lastCalibrationDate}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Next Calibration</span><span style={{ fontWeight: 700 }}>{selectedIndicator.nextCalibrationDate}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Calibrated By</span><span>{selectedIndicator.calibratedBy}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Certificate ID</span><span style={{ fontFamily: "monospace" }}>{selectedIndicator.certificateId}</span></div>
                  </div>
                </div>
              </div>

              {/* Technical Configuration */}
              <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: primaryText, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>TECHNICAL CONFIGURATION</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 12 }}>
                  <div><span style={{ color: mutedText }}>Zero Tracking:</span> <strong style={{ color: primaryText }}>{selectedIndicator.zeroTracking}</strong></div>
                  <div><span style={{ color: mutedText }}>Motion Detection:</span> <strong style={{ color: primaryText }}>{selectedIndicator.motionDetection}</strong></div>
                  <div><span style={{ color: mutedText }}>Overload Limit:</span> <strong style={{ color: primaryText }}>{selectedIndicator.overloadLimit}</strong></div>
                  <div><span style={{ color: mutedText }}>IP Address:</span> <strong style={{ fontFamily: "monospace" }}>{selectedIndicator.ipAddress}</strong></div>
                  <div><span style={{ color: mutedText }}>Port:</span> <strong>{selectedIndicator.port}</strong></div>
                  <div><span style={{ color: mutedText }}>Interface:</span> <strong>{selectedIndicator.connection}</strong></div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: primaryText, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>RECENT INDICATOR ACTIVITY</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>08:42:18 AM — Weight reading updated ({selectedIndicator.currentWeight})</span>
                    <span style={{ color: statusOnline, fontWeight: 700 }}>● {selectedIndicator.weightState}</span>
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>08:40:21 AM — Weight state transition: MOTION → STABLE</span>
                    <span style={{ color: mutedText }}>100ms sample</span>
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>08:35:10 AM — Telemetry heartbeat acknowledged</span>
                    <span style={{ color: mutedText }}>IP {selectedIndicator.ipAddress}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  showToast(`✓ Opened Certificate ${selectedIndicator.certificateId}`);
                }}
                style={{ padding: "10px 18px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                📜 View Certificate
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

      {/* ── 7. ADD / EDIT INDICATOR MODAL ── */}
      {showAddEditModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 640, maxHeight: "90vh", background: surface, borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflowY: "auto" }}>
            <form onSubmit={handleSaveIndicator}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: primaryText }}>
                  {editMode === "add" ? "+ Add Weight Indicator" : `Edit Indicator ${formData.code}`}
                </h2>
                <button type="button" onClick={() => setShowAddEditModal(false)} style={{ background: "none", border: 0, color: mutedText, fontSize: 20, cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={formLabelStyle}>Indicator ID / Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. IND-WB06-001"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Indicator Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. WB-06 Digital Indicator"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
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
                  <label style={formLabelStyle}>Manufacturer</label>
                  <select
                    value={formData.manufacturer || "Avery Weigh-Tronix"}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="Avery Weigh-Tronix">Avery Weigh-Tronix</option>
                    <option value="Mettler Toledo">Mettler Toledo</option>
                    <option value="Rice Lake">Rice Lake</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Model Name</label>
                  <input
                    type="text"
                    value={formData.model || ""}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. E1205 Indicator"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber || ""}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="AV-IND-928371"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>IP Address</label>
                  <input
                    type="text"
                    value={formData.ipAddress || "192.168.1.100"}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    placeholder="192.168.1.100"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Port</label>
                  <input
                    type="number"
                    value={formData.port || 5000}
                    onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
                    placeholder="5000"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Capacity</label>
                  <input
                    type="text"
                    value={formData.capacity || "80,000 KG"}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="80,000 KG"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Division Precision</label>
                  <input
                    type="text"
                    value={formData.division || "20 KG"}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    placeholder="20 KG"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Status</label>
                  <select
                    value={formData.status || "ONLINE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as IndicatorStatus })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Calibration Status</label>
                  <select
                    value={formData.calibrationStatus || "VALID"}
                    onChange={(e) => setFormData({ ...formData, calibrationStatus: e.target.value as CalibrationStatus })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="VALID">VALID</option>
                    <option value="DUE SOON">DUE SOON</option>
                    <option value="OVERDUE">OVERDUE</option>
                  </select>
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
                  Save Indicator
                </button>
              </div>
            </form>
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
