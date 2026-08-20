import React, { useState, useMemo } from "react";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export type DeviceStatus = "ONLINE" | "WARNING" | "OFFLINE";
export type DeviceType = "Weight Indicator" | "Camera" | "Printer" | "Controller" | "Sensor" | "Display";

export interface DeviceItem {
  id: string;
  name: string;
  type: DeviceType;
  weighbridgeId: string;
  weighbridgeName: string;
  connection: "Ethernet" | "Serial" | "USB" | "Network";
  status: DeviceStatus;
  lastHeartbeat: string;
  health: string;
  ipAddress: string;
  port: number;
  manufacturer: string;
  model: string;
  firmware: string;
  installedDate: string;
  uptime: string;
  lastError: string;
  lastMaintenance: string;
  nextMaintenance: string;
  // Adaptive State Fields
  weightReading?: string;
  signalState?: string;
  fps?: number;
  streamStatus?: string;
  paperLevel?: string;
  printQueue?: number;
  relayState?: string;
  beamState?: string;
}

const INITIAL_DEVICES: DeviceItem[] = [
  {
    id: "IND-WB01-001",
    name: "Weight Indicator",
    type: "Weight Indicator",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    connection: "Ethernet",
    status: "ONLINE",
    lastHeartbeat: "12 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.110",
    port: 5000,
    manufacturer: "Avery Weigh-Tronix",
    model: "E1205 Indicator",
    firmware: "v4.8.2",
    installedDate: "15 Jan 2025",
    uptime: "99.82%",
    lastError: "None",
    lastMaintenance: "02 Aug 2026",
    nextMaintenance: "02 Nov 2026",
    weightReading: "38,500 KG",
    signalState: "Stable",
  },
  {
    id: "CAM-WB01-001",
    name: "Camera — Entry",
    type: "Camera",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    connection: "Network",
    status: "ONLINE",
    lastHeartbeat: "8 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.111",
    port: 554,
    manufacturer: "Hikvision",
    model: "ANPR Ultra 4K",
    firmware: "v5.2.1",
    installedDate: "15 Jan 2025",
    uptime: "99.95%",
    lastError: "None",
    lastMaintenance: "02 Aug 2026",
    nextMaintenance: "02 Nov 2026",
    fps: 25,
    streamStatus: "Active 4K Stream",
  },
  {
    id: "CAM-WB01-002",
    name: "Camera — Exit",
    type: "Camera",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    connection: "Network",
    status: "ONLINE",
    lastHeartbeat: "6 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.112",
    port: 554,
    manufacturer: "Hikvision",
    model: "ANPR Ultra 4K",
    firmware: "v5.2.1",
    installedDate: "15 Jan 2025",
    uptime: "99.91%",
    lastError: "None",
    lastMaintenance: "02 Aug 2026",
    nextMaintenance: "02 Nov 2026",
    fps: 25,
    streamStatus: "Active 4K Stream",
  },
  {
    id: "PRN-WB01-001",
    name: "Ticket Printer",
    type: "Printer",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    connection: "USB",
    status: "ONLINE",
    lastHeartbeat: "14 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.113",
    port: 9100,
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    firmware: "v1.40",
    installedDate: "15 Jan 2025",
    uptime: "99.50%",
    lastError: "None",
    lastMaintenance: "02 Aug 2026",
    nextMaintenance: "02 Nov 2026",
    paperLevel: "88%",
    printQueue: 0,
  },
  {
    id: "CTL-WB01-001",
    name: "Gate Barrier Controller",
    type: "Controller",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    connection: "Serial",
    status: "ONLINE",
    lastHeartbeat: "10 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.114",
    port: 232,
    manufacturer: "FAAC",
    model: "B680H Barrier Controller",
    firmware: "v2.1.0",
    installedDate: "15 Jan 2025",
    uptime: "99.98%",
    lastError: "None",
    lastMaintenance: "02 Aug 2026",
    nextMaintenance: "02 Nov 2026",
    relayState: "Barrier Closed / Auto-Arm",
  },
  {
    id: "IND-WB02-001",
    name: "Weight Indicator",
    type: "Weight Indicator",
    weighbridgeId: "WB-02",
    weighbridgeName: "WB-02 — North Gate",
    connection: "Ethernet",
    status: "ONLINE",
    lastHeartbeat: "15 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.120",
    port: 5000,
    manufacturer: "Mettler Toledo",
    model: "IND570 Industrial",
    firmware: "v3.12",
    installedDate: "20 Feb 2025",
    uptime: "99.88%",
    lastError: "None",
    lastMaintenance: "28 Jul 2026",
    nextMaintenance: "28 Oct 2026",
    weightReading: "0 KG",
    signalState: "Ready",
  },
  {
    id: "PRN-WB02-001",
    name: "Ticket Printer",
    type: "Printer",
    weighbridgeId: "WB-02",
    weighbridgeName: "WB-02 — North Gate",
    connection: "USB",
    status: "WARNING",
    lastHeartbeat: "42 sec ago",
    health: "Paper Low",
    ipAddress: "192.168.1.121",
    port: 9100,
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    firmware: "v1.40",
    installedDate: "20 Feb 2025",
    uptime: "98.10%",
    lastError: "Low paper roll sensor warning",
    lastMaintenance: "28 Jul 2026",
    nextMaintenance: "28 Oct 2026",
    paperLevel: "12% (Roll Replace Required)",
    printQueue: 0,
  },
  {
    id: "CAM-WB02-001",
    name: "Camera — ANPR North",
    type: "Camera",
    weighbridgeId: "WB-02",
    weighbridgeName: "WB-02 — North Gate",
    connection: "Network",
    status: "ONLINE",
    lastHeartbeat: "10 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.122",
    port: 554,
    manufacturer: "Dahua",
    model: "ANPR Pro Bullet",
    firmware: "v3.90",
    installedDate: "20 Feb 2025",
    uptime: "99.90%",
    lastError: "None",
    lastMaintenance: "28 Jul 2026",
    nextMaintenance: "28 Oct 2026",
    fps: 25,
    streamStatus: "Active HD Stream",
  },
  {
    id: "SEN-WB02-001",
    name: "Infrared Positioning Sensor",
    type: "Sensor",
    weighbridgeId: "WB-02",
    weighbridgeName: "WB-02 — North Gate",
    connection: "Serial",
    status: "ONLINE",
    lastHeartbeat: "20 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.123",
    port: 485,
    manufacturer: "Banner Engineering",
    model: "QS30 Photoelectric",
    firmware: "v1.0.4",
    installedDate: "20 Feb 2025",
    uptime: "99.99%",
    lastError: "None",
    lastMaintenance: "28 Jul 2026",
    nextMaintenance: "28 Oct 2026",
    beamState: "Unbroken / Vehicle Clear",
  },
  {
    id: "IND-WB03-001",
    name: "Weight Indicator",
    type: "Weight Indicator",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    connection: "Ethernet",
    status: "ONLINE",
    lastHeartbeat: "18 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.130",
    port: 5000,
    manufacturer: "Rice Lake",
    model: "920i Programmable",
    firmware: "v6.1.1",
    installedDate: "10 Mar 2025",
    uptime: "99.75%",
    lastError: "None",
    lastMaintenance: "12 Aug 2026",
    nextMaintenance: "12 Nov 2026",
    weightReading: "32,100 KG",
    signalState: "Stabilizing",
  },
  {
    id: "CAM-WB03-001",
    name: "Camera — Yard Top",
    type: "Camera",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    connection: "Network",
    status: "WARNING",
    lastHeartbeat: "55 sec ago",
    health: "High Latency",
    ipAddress: "192.168.1.131",
    port: 554,
    manufacturer: "Hikvision",
    model: "ANPR Ultra 4K",
    firmware: "v5.2.1",
    installedDate: "10 Mar 2025",
    uptime: "97.40%",
    lastError: "Network jitter / packet latency > 320ms",
    lastMaintenance: "12 Aug 2026",
    nextMaintenance: "12 Nov 2026",
    fps: 14,
    streamStatus: "Degraded Stream",
  },
  {
    id: "PRN-WB03-001",
    name: "Heavy Duty Printer",
    type: "Printer",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    connection: "Network",
    status: "ONLINE",
    lastHeartbeat: "12 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.132",
    port: 9100,
    manufacturer: "Zebra",
    model: "ZT411 Industrial",
    firmware: "v8.19",
    installedDate: "10 Mar 2025",
    uptime: "99.95%",
    lastError: "None",
    lastMaintenance: "12 Aug 2026",
    nextMaintenance: "12 Nov 2026",
    paperLevel: "94%",
    printQueue: 0,
  },
  {
    id: "CTL-WB03-001",
    name: "Barrier Controller",
    type: "Controller",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    connection: "Serial",
    status: "ONLINE",
    lastHeartbeat: "9 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.133",
    port: 232,
    manufacturer: "FAAC",
    model: "B680H Barrier",
    firmware: "v2.1.0",
    installedDate: "10 Mar 2025",
    uptime: "99.90%",
    lastError: "None",
    lastMaintenance: "12 Aug 2026",
    nextMaintenance: "12 Nov 2026",
    relayState: "Barrier Arm Raised",
  },
  {
    id: "DIS-WB03-001",
    name: "Traffic Signal Light",
    type: "Display",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    connection: "Serial",
    status: "ONLINE",
    lastHeartbeat: "14 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.134",
    port: 485,
    manufacturer: "SignalTech",
    model: "LED Dual Aspect Signal",
    firmware: "v1.2",
    installedDate: "10 Mar 2025",
    uptime: "99.99%",
    lastError: "None",
    lastMaintenance: "12 Aug 2026",
    nextMaintenance: "12 Nov 2026",
    relayState: "Green Light Active",
  },
  {
    id: "IND-WB04-001",
    name: "Weight Indicator",
    type: "Weight Indicator",
    weighbridgeId: "WB-04",
    weighbridgeName: "WB-04 — East Gate",
    connection: "Ethernet",
    status: "OFFLINE",
    lastHeartbeat: "18 min ago",
    health: "No Heartbeat",
    ipAddress: "192.168.1.140",
    port: 5000,
    manufacturer: "Avery Weigh-Tronix",
    model: "E1205 Indicator",
    firmware: "v4.8.2",
    installedDate: "05 Apr 2025",
    uptime: "92.10%",
    lastError: "Hardware TCP socket connection timed out",
    lastMaintenance: "15 Jun 2026",
    nextMaintenance: "15 Sep 2026",
    weightReading: "-- KG",
    signalState: "Offline",
  },
  {
    id: "CAM-WB04-001",
    name: "Camera — East Gate",
    type: "Camera",
    weighbridgeId: "WB-04",
    weighbridgeName: "WB-04 — East Gate",
    connection: "Network",
    status: "OFFLINE",
    lastHeartbeat: "22 min ago",
    health: "Connection Lost",
    ipAddress: "192.168.1.141",
    port: 554,
    manufacturer: "Hikvision",
    model: "ANPR Ultra 4K",
    firmware: "v5.2.1",
    installedDate: "05 Apr 2025",
    uptime: "91.80%",
    lastError: "PoE Switch port link down",
    lastMaintenance: "15 Jun 2026",
    nextMaintenance: "15 Sep 2026",
    fps: 0,
    streamStatus: "No Signal",
  },
  {
    id: "PRN-WB04-001",
    name: "Ticket Printer",
    type: "Printer",
    weighbridgeId: "WB-04",
    weighbridgeName: "WB-04 — East Gate",
    connection: "USB",
    status: "ONLINE",
    lastHeartbeat: "25 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.142",
    port: 9100,
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    firmware: "v1.40",
    installedDate: "05 Apr 2025",
    uptime: "99.20%",
    lastError: "None",
    lastMaintenance: "15 Jun 2026",
    nextMaintenance: "15 Sep 2026",
    paperLevel: "76%",
    printQueue: 0,
  },
  {
    id: "CTL-WB04-001",
    name: "Gate Barrier Controller",
    type: "Controller",
    weighbridgeId: "WB-04",
    weighbridgeName: "WB-04 — East Gate",
    connection: "Serial",
    status: "ONLINE",
    lastHeartbeat: "30 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.143",
    port: 232,
    manufacturer: "FAAC",
    model: "B680H Barrier",
    firmware: "v2.1.0",
    installedDate: "05 Apr 2025",
    uptime: "99.70%",
    lastError: "None",
    lastMaintenance: "15 Jun 2026",
    nextMaintenance: "15 Sep 2026",
    relayState: "Barrier Arm Closed",
  },
  {
    id: "IND-WB05-001",
    name: "Weight Indicator",
    type: "Weight Indicator",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    connection: "Ethernet",
    status: "ONLINE",
    lastHeartbeat: "14 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.150",
    port: 5000,
    manufacturer: "Mettler Toledo",
    model: "IND570 Industrial",
    firmware: "v3.12",
    installedDate: "01 Jun 2025",
    uptime: "99.92%",
    lastError: "None",
    lastMaintenance: "05 Aug 2026",
    nextMaintenance: "05 Nov 2026",
    weightReading: "0 KG",
    signalState: "Ready",
  },
  {
    id: "CAM-WB05-001",
    name: "Camera — West Gate",
    type: "Camera",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    connection: "Network",
    status: "ONLINE",
    lastHeartbeat: "11 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.151",
    port: 554,
    manufacturer: "Dahua",
    model: "ANPR Pro Bullet",
    firmware: "v3.90",
    installedDate: "01 Jun 2025",
    uptime: "99.95%",
    lastError: "None",
    lastMaintenance: "05 Aug 2026",
    nextMaintenance: "05 Nov 2026",
    fps: 25,
    streamStatus: "Active HD Stream",
  },
  {
    id: "PRN-WB05-001",
    name: "Ticket Printer",
    type: "Printer",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    connection: "USB",
    status: "ONLINE",
    lastHeartbeat: "16 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.152",
    port: 9100,
    manufacturer: "Epson",
    model: "TM-T88VI Thermal",
    firmware: "v1.40",
    installedDate: "01 Jun 2025",
    uptime: "99.80%",
    lastError: "None",
    lastMaintenance: "05 Aug 2026",
    nextMaintenance: "05 Nov 2026",
    paperLevel: "82%",
    printQueue: 0,
  },
  {
    id: "SEN-WB05-001",
    name: "Position Sensor A",
    type: "Sensor",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    connection: "Serial",
    status: "ONLINE",
    lastHeartbeat: "15 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.153",
    port: 485,
    manufacturer: "Banner Engineering",
    model: "QS30 Photoelectric",
    firmware: "v1.0.4",
    installedDate: "01 Jun 2025",
    uptime: "99.99%",
    lastError: "None",
    lastMaintenance: "05 Aug 2026",
    nextMaintenance: "05 Nov 2026",
    beamState: "Unbroken / Clear",
  },
  {
    id: "SEN-WB05-002",
    name: "Position Sensor B",
    type: "Sensor",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    connection: "Serial",
    status: "ONLINE",
    lastHeartbeat: "15 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.154",
    port: 485,
    manufacturer: "Banner Engineering",
    model: "QS30 Photoelectric",
    firmware: "v1.0.4",
    installedDate: "01 Jun 2025",
    uptime: "99.99%",
    lastError: "None",
    lastMaintenance: "05 Aug 2026",
    nextMaintenance: "05 Nov 2026",
    beamState: "Unbroken / Clear",
  },
  {
    id: "DIS-WB01-001",
    name: "Driver Display Screen",
    type: "Display",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    connection: "Serial",
    status: "ONLINE",
    lastHeartbeat: "7 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.115",
    port: 485,
    manufacturer: "Redlion",
    model: "LD4 Large LED Display",
    firmware: "v2.0",
    installedDate: "15 Jan 2025",
    uptime: "99.95%",
    lastError: "None",
    lastMaintenance: "02 Aug 2026",
    nextMaintenance: "02 Nov 2026",
    relayState: "Displaying 38,500 KG",
  },
  {
    id: "IND-WB01-002",
    name: "Secondary Indicator",
    type: "Weight Indicator",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    connection: "Ethernet",
    status: "ONLINE",
    lastHeartbeat: "10 sec ago",
    health: "Healthy",
    ipAddress: "192.168.1.116",
    port: 5000,
    manufacturer: "Avery Weigh-Tronix",
    model: "E1205 Indicator",
    firmware: "v4.8.2",
    installedDate: "15 Jan 2025",
    uptime: "99.85%",
    lastError: "None",
    lastMaintenance: "02 Aug 2026",
    nextMaintenance: "02 Nov 2026",
    weightReading: "38,500 KG",
    signalState: "Synced",
  },
];

export default function DeviceMonitoringScreen({ darkMode: dm, onNavigate }: Props) {
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
  const statusWarning = "#D97706";
  const statusOffline = "#DC2626";

  // State Management
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [wbFilter, setWbFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [connectionFilter, setConnectionFilter] = useState<string>("All");

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("15 sec");
  const [lastUpdatedTime, setLastUpdatedTime] = useState("10:42:18 AM");

  // Modals & Context Menus
  const [selectedDevice, setSelectedDevice] = useState<DeviceItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleManualRefresh = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    setLastUpdatedTime(timeStr);
    showToast("✓ Refreshed device status across all stations");
  };

  // KPI Calculations
  const totalCount = devices.length;
  const onlineCount = devices.filter((d) => d.status === "ONLINE").length;
  const warningCount = devices.filter((d) => d.status === "WARNING").length;
  const offlineCount = devices.filter((d) => d.status === "OFFLINE").length;

  // Filtered List
  const filteredDevices = useMemo(() => {
    return devices.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.ipAddress.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.weighbridgeName.toLowerCase().includes(q);

      const matchWb = wbFilter === "All" || item.weighbridgeId === wbFilter;
      const matchType = typeFilter === "All" || item.type === typeFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchConnection = connectionFilter === "All" || item.connection === connectionFilter;

      return matchQ && matchWb && matchType && matchStatus && matchConnection;
    });
  }, [devices, searchQuery, wbFilter, typeFilter, statusFilter, connectionFilter]);

  // Helper for Status Badge styling
  const getStatusPill = (status: DeviceStatus) => {
    let color = statusOnline;
    let text = "ONLINE";
    let bgTint = dm ? "rgba(22,163,74,0.15)" : "#F0FDF4";

    if (status === "WARNING") {
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
            Device Monitoring
          </h1>
          <p style={{ fontSize: 13, color: secondaryText, margin: "4px 0 0 0" }}>
            Monitor connectivity, health and operational status of devices connected to all weighbridge stations.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={() => showToast("✓ Device monitoring report exported")}
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
            onClick={handleManualRefresh}
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
            <span>↻</span> Refresh Status
          </button>
        </div>
      </div>

      {/* ── 2. SUMMARY KPI ROW (4 CARDS) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        {/* Total Devices */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            TOTAL DEVICES
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: primaryText, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {totalCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Across all weighbridges</div>
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
          <div style={{ fontSize: 12, color: secondaryText }}>Connected and operational</div>
        </div>

        {/* Warning */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusWarning, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              WARNING
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusWarning }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusWarning, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {warningCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Requires attention</div>
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

      {/* ── 3. DEVICE HEALTH DISTRIBUTION & QUICK DEVICE TYPE FILTERS ── */}
      <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              DEVICE HEALTH DISTRIBUTION
            </span>
            <div style={{ fontSize: 13, fontWeight: 700, color: primaryText, marginTop: 2 }}>
              84% Healthy ({onlineCount}/{totalCount}) · {warningCount} Warning · {offlineCount} Offline
            </div>
          </div>

          {/* Quick Clickable Device Type Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { type: "All", label: "ALL", count: totalCount },
              { type: "Weight Indicator", label: "INDICATORS", count: 8 },
              { type: "Camera", label: "CAMERAS", count: 7 },
              { type: "Printer", label: "PRINTERS", count: 5 },
              { type: "Controller", label: "CONTROLLERS", count: 3 },
              { type: "Sensor", label: "SENSORS", count: 2 },
            ].map((t) => {
              const active = typeFilter === t.type;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setTypeFilter(t.type)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: `1px solid ${active ? primaryOrange : border}`,
                    background: active ? (dm ? "rgba(249,115,22,0.15)" : "#FFF7ED") : elevated,
                    color: active ? primaryOrange : secondaryText,
                    fontSize: 11.5,
                    fontWeight: active ? 800 : 600,
                    cursor: "pointer",
                  }}
                >
                  {t.label} ({t.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Progress Distribution Bar */}
        <div style={{ height: 8, width: "100%", background: elevated, borderRadius: 999, overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${(onlineCount / totalCount) * 100}%`, background: statusOnline }} title={`Online: ${onlineCount}`} />
          <div style={{ width: `${(warningCount / totalCount) * 100}%`, background: statusWarning }} title={`Warning: ${warningCount}`} />
          <div style={{ width: `${(offlineCount / totalCount) * 100}%`, background: statusOffline }} title={`Offline: ${offlineCount}`} />
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
              placeholder="Search device name, device ID, IP address..."
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

          {/* Device Type Filter */}
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
            <option value="All">All Device Types ▼</option>
            <option value="Weight Indicator">Weight Indicator</option>
            <option value="Camera">Camera</option>
            <option value="Printer">Printer</option>
            <option value="Controller">Controller</option>
            <option value="Sensor">Sensor</option>
            <option value="Display">Display</option>
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
            <option value="WARNING">● WARNING</option>
            <option value="OFFLINE">● OFFLINE</option>
          </select>

          {/* Connection Type Filter */}
          <select
            value={connectionFilter}
            onChange={(e) => setConnectionFilter(e.target.value)}
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
            <option value="All">All Connections ▼</option>
            <option value="Ethernet">Ethernet</option>
            <option value="Serial">Serial</option>
            <option value="USB">USB</option>
            <option value="Network">Network</option>
          </select>
        </div>

        {/* Auto Refresh & Live Timestamp */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: statusOnline, fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusOnline }} />
            LIVE STATUS ({lastUpdatedTime})
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
            Auto Refresh {autoRefresh ? refreshInterval : "OFF"}
          </button>
        </div>
      </div>

      {/* ── 5. MAIN DEVICE DATA TABLE ── */}
      <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, overflow: "hidden" }}>
        {/* Table Header Controls */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${border}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: primaryText }}>DEVICES</h2>
            <p style={{ fontSize: 12, color: secondaryText, margin: "2px 0 0 0" }}>
              {filteredDevices.length} connected hardware devices
            </p>
          </div>

          <div style={{ fontSize: 12, color: mutedText, fontWeight: 600 }}>
            Showing {filteredDevices.length} of {devices.length} devices
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: dm ? "#1A2332" : "#F8FAFC", borderBottom: `1px solid ${border}`, color: mutedText, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "14px 20px" }}>DEVICE</th>
                <th style={{ padding: "14px 16px" }}>DEVICE ID</th>
                <th style={{ padding: "14px 16px" }}>TYPE</th>
                <th style={{ padding: "14px 16px" }}>WEIGHBRIDGE</th>
                <th style={{ padding: "14px 16px" }}>CONNECTION</th>
                <th style={{ padding: "14px 16px" }}>STATUS</th>
                <th style={{ padding: "14px 16px" }}>LAST HEARTBEAT</th>
                <th style={{ padding: "14px 16px" }}>HEALTH</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "48px 20px", textAlign: "center", color: mutedText }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🔌</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>No devices configured</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>No monitoring devices match your active filters.</div>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: `1px solid ${divider}`, transition: "background 0.15s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = dm ? "rgba(255,255,255,0.03)" : "#F8FAFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Device Name & IP */}
                    <td style={{ padding: "16px 20px", fontWeight: 800, color: primaryText }}>
                      <div>{item.name}</div>
                      <div style={{ fontSize: 11, color: mutedText, fontFamily: "monospace", fontWeight: 500 }}>{item.ipAddress}:{item.port}</div>
                    </td>

                    {/* Device ID */}
                    <td style={{ padding: "16px 16px", fontWeight: 700, fontFamily: "monospace", color: primaryOrange }}>
                      {item.id}
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
                      {item.connection}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 16px" }}>
                      {getStatusPill(item.status)}
                    </td>

                    {/* Last Heartbeat */}
                    <td style={{ padding: "16px 16px", color: mutedText, fontSize: 12 }}>
                      {item.lastHeartbeat}
                    </td>

                    {/* Health */}
                    <td style={{ padding: "16px 16px", fontWeight: 700, color: item.status === "OFFLINE" ? statusOffline : item.status === "WARNING" ? statusWarning : statusOnline }}>
                      {item.health}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 20px", textAlign: "right", position: "relative" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDevice(item);
                            setShowDetailModal(true);
                          }}
                          style={{ padding: "6px 14px", borderRadius: 6, background: primaryOrange, color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          style={{ padding: "6px 10px", borderRadius: 6, background: elevated, border: `1px solid ${border}`, color: secondaryText, fontSize: 12, cursor: "pointer" }}
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
                            width: 180,
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
                              showToast(`✓ Restarting connection for ${item.id}...`);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            🔄 Restart Connection
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDevice(item);
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
                              showToast(`✓ Signal test ping sent to ${item.ipAddress}`);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📡 Test Device Signal
                          </button>

                          <div style={{ borderTop: `1px solid ${divider}`, margin: "4px 0" }} />

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`✓ Maintenance ticket logged for ${item.id}`);
                              setActiveMenuId(null);
                            }}
                            style={{ ...contextMenuItemStyle, color: secondaryGold }}
                          >
                            ⚙ Open Maintenance Ticket
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

      {/* ── 6. DEVICE DETAIL MODAL / PREVIEW ── */}
      {showDetailModal && selectedDevice && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 760, maxHeight: "90vh", background: surface, borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Modal Header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText }}>{selectedDevice.name}</h2>
                  {getStatusPill(selectedDevice.status)}
                </div>
                <div style={{ fontSize: 12.5, color: secondaryText, marginTop: 4 }}>
                  Device ID: <strong style={{ color: primaryOrange, fontFamily: "monospace" }}>{selectedDevice.id}</strong> · Station: {selectedDevice.weighbridgeName}
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

              {/* Adaptive Current State Section */}
              <div style={{ padding: "16px 20px", borderRadius: 12, background: dm ? "#1A2332" : "#FFF7ED", border: `1px solid ${primaryOrange}40`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, textTransform: "uppercase", letterSpacing: "0.05em" }}>LIVE DEVICE STATE</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: primaryText, marginTop: 2 }}>{selectedDevice.name} ({selectedDevice.type})</div>
                  <div style={{ fontSize: 12, color: secondaryText, marginTop: 2 }}>Last Heartbeat: {selectedDevice.lastHeartbeat} · Health: {selectedDevice.health}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  {selectedDevice.type === "Weight Indicator" && (
                    <>
                      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "monospace", color: primaryOrange }}>{selectedDevice.weightReading}</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: statusOnline }}>● Signal: {selectedDevice.signalState}</div>
                    </>
                  )}
                  {selectedDevice.type === "Camera" && (
                    <>
                      <div style={{ fontSize: 22, fontWeight: 800, color: primaryText }}>{selectedDevice.fps} FPS</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: statusOnline }}>● {selectedDevice.streamStatus}</div>
                    </>
                  )}
                  {selectedDevice.type === "Printer" && (
                    <>
                      <div style={{ fontSize: 22, fontWeight: 800, color: primaryText }}>Paper: {selectedDevice.paperLevel}</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: statusOnline }}>Queue: {selectedDevice.printQueue} pending</div>
                    </>
                  )}
                  {(selectedDevice.type === "Controller" || selectedDevice.type === "Display" || selectedDevice.type === "Sensor") && (
                    <>
                      <div style={{ fontSize: 18, fontWeight: 800, color: primaryText }}>{selectedDevice.relayState || selectedDevice.beamState}</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: statusOnline }}>● Normal Operation</div>
                    </>
                  )}
                </div>
              </div>

              {/* Information & Connectivity Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Device Information */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>DEVICE SPECIFICATIONS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Device ID</span><span style={{ fontWeight: 700, fontFamily: "monospace" }}>{selectedDevice.id}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Device Type</span><span style={{ fontWeight: 700 }}>{selectedDevice.type}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Manufacturer</span><span style={{ fontWeight: 700 }}>{selectedDevice.manufacturer}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Model</span><span style={{ fontWeight: 700 }}>{selectedDevice.model}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Firmware</span><span>{selectedDevice.firmware}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Installed Date</span><span>{selectedDevice.installedDate}</span></div>
                  </div>
                </div>

                {/* Connection Details */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>CONNECTION & HEALTH</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Interface</span><span style={{ fontWeight: 700 }}>{selectedDevice.connection}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>IP Address</span><span style={{ fontFamily: "monospace" }}>{selectedDevice.ipAddress}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Port</span><span>{selectedDevice.port}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Uptime</span><span style={{ fontWeight: 800, color: statusOnline }}>{selectedDevice.uptime}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Last Error</span><span>{selectedDevice.lastError}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Last Maintenance</span><span>{selectedDevice.lastMaintenance}</span></div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: primaryText, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>RECENT DEVICE ACTIVITY TIMELINE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>08:42 AM — Heartbeat ping acknowledged</span>
                    <span style={{ color: statusOnline, fontWeight: 700 }}>✓ Ack (12ms)</span>
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>08:35 AM — Device telemetry configuration synchronized</span>
                    <span style={{ color: mutedText }}>Sync OK</span>
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: elevated, display: "flex", justifyContent: "space-between" }}>
                    <span>08:31 AM — Workstation connection established</span>
                    <span style={{ color: mutedText }}>Station: {selectedDevice.weighbridgeName}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  showToast(`✓ Testing ping sent to ${selectedDevice.ipAddress}`);
                }}
                style={{ padding: "10px 18px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                📡 Test Signal
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

    </div>
  );
}

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
