import React, { useState, useMemo } from "react";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export type CameraStatus = "ONLINE" | "OFFLINE" | "WARNING";
export type RecordingStatus = "RECORDING" | "NOT RECORDING" | "STORAGE WARNING";
export type CameraType =
  | "IP Camera"
  | "ANPR Camera"
  | "Gate Camera"
  | "Platform Camera"
  | "Overview Camera";

export interface CameraItem {
  id: string;
  name: string;
  code: string;
  type: CameraType;
  weighbridgeId: string;
  weighbridgeName: string;
  location: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  ipAddress: string;
  port: number;
  protocol: string;
  rtspUrl: string;
  username: string;
  resolution: string;
  fps: number;
  status: CameraStatus;
  recordingStatus: RecordingStatus;
  lastFrameTime: string;
  storageUsedPercent: number;
  retentionDays: number;
  installationDate: string;
  nightVision: boolean;
  motionDetection: boolean;
}

const INITIAL_CAMERAS: CameraItem[] = [
  {
    id: "CAM-WB01-001",
    name: "Main Gate — Entry",
    code: "CAM-WB01-001",
    type: "IP Camera",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    location: "Entry Lane",
    manufacturer: "Hikvision",
    model: "DS-2CD2T 4K Ultra",
    serialNumber: "HK-CAM-99201",
    ipAddress: "192.168.1.111",
    port: 554,
    protocol: "RTSP / H.265",
    rtspUrl: "rtsp://192.168.1.111:554/live/ch0",
    username: "admin_wb01",
    resolution: "3840 × 2160 (4K)",
    fps: 25,
    status: "ONLINE",
    recordingStatus: "RECORDING",
    lastFrameTime: "2 sec ago",
    storageUsedPercent: 78,
    retentionDays: 30,
    installationDate: "15 Jan 2025",
    nightVision: true,
    motionDetection: true,
  },
  {
    id: "CAM-WB01-002",
    name: "Main Gate — Exit",
    code: "CAM-WB01-002",
    type: "IP Camera",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    location: "Exit Lane",
    manufacturer: "Hikvision",
    model: "DS-2CD2T 4K Ultra",
    serialNumber: "HK-CAM-99202",
    ipAddress: "192.168.1.112",
    port: 554,
    protocol: "RTSP / H.265",
    rtspUrl: "rtsp://192.168.1.112:554/live/ch0",
    username: "admin_wb01",
    resolution: "3840 × 2160 (4K)",
    fps: 25,
    status: "ONLINE",
    recordingStatus: "RECORDING",
    lastFrameTime: "3 sec ago",
    storageUsedPercent: 78,
    retentionDays: 30,
    installationDate: "15 Jan 2025",
    nightVision: true,
    motionDetection: true,
  },
  {
    id: "CAM-WB02-001",
    name: "North Gate — ANPR",
    code: "CAM-WB02-001",
    type: "ANPR Camera",
    weighbridgeId: "WB-02",
    weighbridgeName: "WB-02 — North Gate",
    location: "Inbound Scale",
    manufacturer: "Dahua",
    model: "ANPR Pro Bullet",
    serialNumber: "DH-ANPR-44120",
    ipAddress: "192.168.1.122",
    port: 554,
    protocol: "RTSP / H.264",
    rtspUrl: "rtsp://192.168.1.122:554/live/ch0",
    username: "admin_wb02",
    resolution: "1920 × 1080 (HD)",
    fps: 25,
    status: "ONLINE",
    recordingStatus: "RECORDING",
    lastFrameTime: "2 sec ago",
    storageUsedPercent: 64,
    retentionDays: 30,
    installationDate: "20 Feb 2025",
    nightVision: true,
    motionDetection: true,
  },
  {
    id: "CAM-WB03-001",
    name: "Loading Yard — Platform",
    code: "CAM-WB03-001",
    type: "Platform Camera",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    location: "Loading Bay",
    manufacturer: "Hikvision",
    model: "ANPR Ultra 4K",
    serialNumber: "HK-CAM-88301",
    ipAddress: "192.168.1.131",
    port: 554,
    protocol: "RTSP / H.265",
    rtspUrl: "rtsp://192.168.1.131:554/live/ch0",
    username: "admin_wb03",
    resolution: "3840 × 2160 (4K)",
    fps: 25,
    status: "ONLINE",
    recordingStatus: "RECORDING",
    lastFrameTime: "4 sec ago",
    storageUsedPercent: 82,
    retentionDays: 30,
    installationDate: "10 Mar 2025",
    nightVision: true,
    motionDetection: true,
  },
  {
    id: "CAM-WB03-002",
    name: "Loading Yard — Overhead",
    code: "CAM-WB03-002",
    type: "Overview Camera",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    location: "Yard Roof",
    manufacturer: "Bosch",
    model: "FLEXIDOME IP 8000i",
    serialNumber: "BS-CAM-33019",
    ipAddress: "192.168.1.135",
    port: 554,
    protocol: "RTSP / H.265",
    rtspUrl: "rtsp://192.168.1.135:554/live/ch0",
    username: "admin_wb03",
    resolution: "3840 × 2160 (4K)",
    fps: 25,
    status: "ONLINE",
    recordingStatus: "STORAGE WARNING",
    lastFrameTime: "5 sec ago",
    storageUsedPercent: 93,
    retentionDays: 30,
    installationDate: "10 Mar 2025",
    nightVision: true,
    motionDetection: true,
  },
  {
    id: "CAM-WB04-001",
    name: "East Gate — Entry",
    code: "CAM-WB04-001",
    type: "Gate Camera",
    weighbridgeId: "WB-04",
    weighbridgeName: "WB-04 — East Gate",
    location: "Gate Barrier",
    manufacturer: "Hikvision",
    model: "DS-2CD2T 4K Ultra",
    serialNumber: "HK-CAM-77104",
    ipAddress: "192.168.1.141",
    port: 554,
    protocol: "RTSP / H.265",
    rtspUrl: "rtsp://192.168.1.141:554/live/ch0",
    username: "admin_wb04",
    resolution: "3840 × 2160 (4K)",
    fps: 0,
    status: "OFFLINE",
    recordingStatus: "NOT RECORDING",
    lastFrameTime: "18 min ago",
    storageUsedPercent: 45,
    retentionDays: 30,
    installationDate: "05 Apr 2025",
    nightVision: true,
    motionDetection: false,
  },
  {
    id: "CAM-WB05-001",
    name: "West Gate — Inbound",
    code: "CAM-WB05-001",
    type: "ANPR Camera",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    location: "Entry Scale",
    manufacturer: "Dahua",
    model: "ANPR Pro Bullet",
    serialNumber: "DH-ANPR-55201",
    ipAddress: "192.168.1.151",
    port: 554,
    protocol: "RTSP / H.264",
    rtspUrl: "rtsp://192.168.1.151:554/live/ch0",
    username: "admin_wb05",
    resolution: "1920 × 1080 (HD)",
    fps: 25,
    status: "ONLINE",
    recordingStatus: "RECORDING",
    lastFrameTime: "2 sec ago",
    storageUsedPercent: 70,
    retentionDays: 30,
    installationDate: "01 Jun 2025",
    nightVision: true,
    motionDetection: true,
  },
  {
    id: "CAM-WB05-002",
    name: "West Gate — Outbound",
    code: "CAM-WB05-002",
    type: "Gate Camera",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    location: "Exit Scale",
    manufacturer: "Dahua",
    model: "Pro Dome 4MP",
    serialNumber: "DH-CAM-55202",
    ipAddress: "192.168.1.155",
    port: 554,
    protocol: "RTSP / H.264",
    rtspUrl: "rtsp://192.168.1.155:554/live/ch0",
    username: "admin_wb05",
    resolution: "2560 × 1440 (2K)",
    fps: 25,
    status: "ONLINE",
    recordingStatus: "RECORDING",
    lastFrameTime: "3 sec ago",
    storageUsedPercent: 70,
    retentionDays: 30,
    installationDate: "01 Jun 2025",
    nightVision: true,
    motionDetection: true,
  },
];

export default function CamerasScreen({ darkMode: dm }: Props) {
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

  // Semantic Status Colors
  const statusOnline = "#16A34A";
  const statusWarning = "#D97706";
  const statusOffline = "#DC2626";

  // State Management
  const [cameras, setCameras] = useState<CameraItem[]>(INITIAL_CAMERAS);
  const [searchQuery, setSearchQuery] = useState("");
  const [wbFilter, setWbFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [recordingFilter, setRecordingFilter] = useState<string>("All");

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("10:42:18 AM");

  // Modals & Context Menus
  const [selectedCamera, setSelectedCamera] = useState<CameraItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
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
    showToast("✓ Refreshed live camera feeds and recording status");
  };

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<CameraItem>>({
    code: "CAM-WB06-001",
    name: "",
    type: "IP Camera",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    location: "Main Entry",
    manufacturer: "Hikvision",
    model: "DS-2CD2T 4K Ultra",
    ipAddress: "192.168.1.160",
    port: 554,
    username: "admin_wb06",
    resolution: "3840 × 2160 (4K)",
    fps: 25,
    status: "ONLINE",
    recordingStatus: "RECORDING",
  });

  // KPI Calculations
  const totalCount = cameras.length;
  const onlineCount = cameras.filter((c) => c.status === "ONLINE").length;
  const streamingCount = cameras.filter(
    (c) => c.status === "ONLINE" && c.fps > 0,
  ).length;
  const offlineCount = cameras.filter((c) => c.status === "OFFLINE").length;
  const recordingCount = cameras.filter(
    (c) => c.recordingStatus === "RECORDING",
  ).length;

  // Filtered Cameras List
  const filteredCameras = useMemo(() => {
    return cameras.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.ipAddress.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.weighbridgeName.toLowerCase().includes(q);

      const matchWb = wbFilter === "All" || item.weighbridgeId === wbFilter;
      const matchStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchType = typeFilter === "All" || item.type === typeFilter;
      const matchRecording =
        recordingFilter === "All" || item.recordingStatus === recordingFilter;

      return matchQ && matchWb && matchStatus && matchType && matchRecording;
    });
  }, [
    cameras,
    searchQuery,
    wbFilter,
    statusFilter,
    typeFilter,
    recordingFilter,
  ]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const nextNum = cameras.length + 1;
    setFormData({
      code: `CAM-WB0${nextNum}-001`,
      name: `WB-0${nextNum} Scale Camera`,
      type: "IP Camera",
      weighbridgeId: `WB-0${nextNum}`,
      weighbridgeName: `WB-0${nextNum} — Gate ${nextNum}`,
      location: "Main Lane",
      manufacturer: "Hikvision",
      model: "DS-2CD2T 4K Ultra",
      ipAddress: `192.168.1.16${nextNum}`,
      port: 554,
      username: `admin_wb0${nextNum}`,
      resolution: "3840 × 2160 (4K)",
      fps: 25,
      status: "ONLINE",
      recordingStatus: "RECORDING",
    });
    setEditMode("add");
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: CameraItem) => {
    setFormData({ ...item });
    setEditMode("edit");
    setShowAddEditModal(true);
    setActiveMenuId(null);
  };

  // Save Add / Edit
  const handleSaveCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editMode === "add") {
      const newItem: CameraItem = {
        id: formData.code || `CAM-WB0${cameras.length + 1}-001`,
        code: formData.code || `CAM-WB0${cameras.length + 1}-001`,
        name: formData.name || "Scale Camera",
        type: (formData.type as CameraType) || "IP Camera",
        weighbridgeId: formData.weighbridgeId || "WB-01",
        weighbridgeName: formData.weighbridgeName || "WB-01 — Main Gate",
        location: formData.location || "Entry Lane",
        manufacturer: formData.manufacturer || "Hikvision",
        model: formData.model || "DS-2CD2T 4K Ultra",
        serialNumber: `HK-CAM-100${cameras.length + 1}`,
        ipAddress: formData.ipAddress || "192.168.1.160",
        port: Number(formData.port) || 554,
        protocol: "RTSP / H.265",
        rtspUrl: `rtsp://${formData.ipAddress || "192.168.1.160"}:554/live/ch0`,
        username: formData.username || "admin_wb",
        resolution: formData.resolution || "3840 × 2160 (4K)",
        fps: Number(formData.fps) || 25,
        status: (formData.status as CameraStatus) || "ONLINE",
        recordingStatus:
          (formData.recordingStatus as RecordingStatus) || "RECORDING",
        lastFrameTime: "Just now",
        storageUsedPercent: 50,
        retentionDays: 30,
        installationDate: "20 Aug 2026",
        nightVision: true,
        motionDetection: true,
      };
      setCameras((prev) => [...prev, newItem]);
      showToast(`✓ Created camera ${newItem.code}`);
    } else {
      setCameras((prev) =>
        prev.map((c) =>
          c.id === formData.id ? ({ ...c, ...formData } as CameraItem) : c,
        ),
      );
      showToast(`✓ Updated camera ${formData.code}`);
    }
    setShowAddEditModal(false);
  };

  // Helper for Status Badge styling
  const getStatusPill = (status: CameraStatus) => {
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

  // Helper for Recording Badge styling
  const getRecordingPill = (rec: RecordingStatus) => {
    let color = statusOnline;
    let text = "RECORDING";
    let bgTint = dm ? "rgba(22,163,74,0.15)" : "#F0FDF4";

    if (rec === "NOT RECORDING") {
      color = mutedText;
      text = "NOT RECORDING";
      bgTint = dm ? "rgba(156,163,175,0.15)" : "#F1F5F9";
    } else if (rec === "STORAGE WARNING") {
      color = statusWarning;
      text = "STORAGE WARNING";
      bgTint = dm ? "rgba(217,119,6,0.15)" : "#FFFBEB";
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 8px",
          borderRadius: 6,
          background: bgTint,
          color: color,
          fontSize: 11,
          fontWeight: 800,
          border: `1px solid ${color}30`,
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
            Cameras
          </h1>
          <p
            style={{ fontSize: 13, color: secondaryText, margin: "4px 0 0 0" }}
          >
            Manage weighbridge cameras, live streams, recording status,
            connectivity and camera assignments.
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
            <span>+</span> ADD CAMERA
          </button>
        </div>
      </div>

      {/* ── 2. SUMMARY KPI ROW (5 CARDS) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Total Cameras */}
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
            TOTAL CAMERAS
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
            Registered cameras
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
            Connected & healthy
          </div>
        </div>

        {/* Streaming */}
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
                color: primaryOrange,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              STREAMING
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: primaryOrange,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: primaryOrange,
              margin: "6px 0 2px",
              fontFamily: "monospace",
            }}
          >
            {streamingCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>
            Live video streams active
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
            Connection unavailable
          </div>
        </div>

        {/* Recording */}
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
              RECORDING
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
            {recordingCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>
            Active 24/7 DVR storage
          </div>
        </div>
      </div>

      {/* ── 3. LIVE CAMERA PREVIEW GRID (3 COLUMNS DESKTOP) ── */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: mutedText,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            LIVE CAMERA PREVIEW
          </div>
          <span style={{ fontSize: 12, color: secondaryText }}>
            Showing live RTSP video feeds across 5 weighbridges
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {cameras.slice(0, 6).map((cam) => (
            <div
              key={cam.id}
              style={{
                background: surface,
                borderRadius: 12,
                border: `1px solid ${border}`,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* Camera Video Area Placeholder */}
              <div
                style={{
                  height: 190,
                  background: "#0F172A",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 12,
                  color: "#FFF",
                }}
              >
                {/* Overlay Top Bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: "monospace",
                    }}
                  >
                    {cam.code}
                  </span>

                  <span
                    style={{
                      background:
                        cam.status === "OFFLINE"
                          ? "rgba(220,38,38,0.8)"
                          : "rgba(22,163,74,0.8)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#FFF",
                      }}
                    />
                    {cam.status === "OFFLINE"
                      ? "OFFLINE"
                      : `LIVE (${cam.fps} FPS)`}
                  </span>
                </div>

                {/* Video Feed Placeholder graphic */}
                <div style={{ textAlign: "center", color: "#64748B" }}>
                  <div style={{ fontSize: 28 }}>📹</div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      marginTop: 4,
                      color: "#94A3B8",
                    }}
                  >
                    {cam.status === "OFFLINE"
                      ? "Stream Unavailable"
                      : "CAMERA PREVIEW FEED"}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#64748B" }}>
                    {cam.resolution} · {cam.protocol}
                  </div>
                </div>

                {/* Overlay Bottom Bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 11,
                    color: "#CBD5E1",
                  }}
                >
                  <span>{cam.location}</span>
                  <span>Frame: {cam.lastFrameTime}</span>
                </div>
              </div>

              {/* Card Meta Footer */}
              <div
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    {cam.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: secondaryText }}>
                    {cam.weighbridgeName}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {getRecordingPill(cam.recordingStatus)}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCamera(cam);
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
                    Live Preview
                  </button>
                </div>
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
              placeholder="Search camera name, camera ID, IP address..."
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

          {/* Camera Type Filter */}
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
            <option value="All">All Camera Types ▼</option>
            <option value="IP Camera">IP Camera</option>
            <option value="ANPR Camera">ANPR Camera</option>
            <option value="Gate Camera">Gate Camera</option>
            <option value="Platform Camera">Platform Camera</option>
            <option value="Overview Camera">Overview Camera</option>
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

          {/* Recording Filter */}
          <select
            value={recordingFilter}
            onChange={(e) => setRecordingFilter(e.target.value)}
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
            <option value="All">Recording Status ▼</option>
            <option value="RECORDING">● RECORDING</option>
            <option value="NOT RECORDING">● NOT RECORDING</option>
            <option value="STORAGE WARNING">● STORAGE WARNING</option>
          </select>
        </div>

        {/* Live Stream Timestamp & Auto Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11.5,
              color: statusOnline,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: statusOnline,
              }}
            />
            LIVE STREAMING ({lastUpdatedTime})
          </div>

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
              gap: 6,
            }}
          >
            Auto Refresh {autoRefresh ? "15s" : "OFF"}
          </button>
        </div>
      </div>

      {/* ── 5. MAIN CAMERA INVENTORY DATA TABLE ── */}
      <div
        style={{
          background: surface,
          borderRadius: 12,
          border: `1px solid ${border}`,
          overflow: "hidden",
        }}
      >
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
              CAMERA INVENTORY
            </h2>
            <p
              style={{
                fontSize: 12,
                color: secondaryText,
                margin: "2px 0 0 0",
              }}
            >
              {filteredCameras.length} registered CCTV & ANPR cameras
            </p>
          </div>

          <div style={{ fontSize: 12, color: mutedText, fontWeight: 600 }}>
            Showing {filteredCameras.length} of {cameras.length} cameras
          </div>
        </div>

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
                <th style={{ padding: "14px 20px" }}>CAMERA</th>
                <th style={{ padding: "14px 16px" }}>CAMERA ID</th>
                <th style={{ padding: "14px 16px" }}>TYPE</th>
                <th style={{ padding: "14px 16px" }}>WEIGHBRIDGE</th>
                <th style={{ padding: "14px 16px" }}>LOCATION</th>
                <th style={{ padding: "14px 16px" }}>STATUS</th>
                <th style={{ padding: "14px 16px" }}>RECORDING</th>
                <th style={{ padding: "14px 16px" }}>LAST FRAME</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCameras.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "48px 20px",
                      textAlign: "center",
                      color: mutedText,
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📹</div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      No cameras found
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      Try adjusting your search query or filter selection.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCameras.map((item) => (
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
                    {/* Camera Name & Model */}
                    <td
                      style={{
                        padding: "16px 20px",
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      <div>{item.name}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: mutedText,
                          fontWeight: 500,
                        }}
                      >
                        {item.manufacturer} {item.model}
                      </div>
                    </td>

                    {/* Code / ID */}
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

                    {/* Type */}
                    <td
                      style={{
                        padding: "16px 16px",
                        color: secondaryText,
                        fontWeight: 600,
                      }}
                    >
                      {item.type}
                    </td>

                    {/* Weighbridge */}
                    <td
                      style={{
                        padding: "16px 16px",
                        color: primaryText,
                        fontWeight: 700,
                      }}
                    >
                      {item.weighbridgeName}
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

                    {/* Recording */}
                    <td style={{ padding: "16px 16px" }}>
                      {getRecordingPill(item.recordingStatus)}
                    </td>

                    {/* Last Frame */}
                    <td
                      style={{
                        padding: "16px 16px",
                        color: mutedText,
                        fontSize: 12,
                      }}
                    >
                      {item.lastFrameTime}
                    </td>

                    {/* Actions */}
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
                            setSelectedCamera(item);
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
                          ⋮
                        </button>
                      </div>

                      {/* Context Menu */}
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
                              setSelectedCamera(item);
                              setShowDetailModal(true);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📹 Open Live Stream
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(
                                `✓ Captured snapshot image for ${item.code}`,
                              );
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📷 Take Snapshot
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(
                                `✓ RTSP socket ping test to ${item.ipAddress}:554 success (18ms)`,
                              );
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📡 Test Camera Connection
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
                              showToast(
                                `✓ Restarted video stream for ${item.code}`,
                              );
                              setActiveMenuId(null);
                            }}
                            style={{
                              ...contextMenuItemStyle,
                              color: primaryOrange,
                            }}
                          >
                            🔄 Restart Stream
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
      {showDetailModal && selectedCamera && (
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
              maxWidth: 840,
              maxHeight: "92vh",
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
                    {selectedCamera.name}
                  </h2>
                  {getStatusPill(selectedCamera.status)}
                  {getRecordingPill(selectedCamera.recordingStatus)}
                </div>
                <div
                  style={{ fontSize: 12.5, color: secondaryText, marginTop: 4 }}
                >
                  Code:{" "}
                  <strong
                    style={{ color: primaryOrange, fontFamily: "monospace" }}
                  >
                    {selectedCamera.code}
                  </strong>{" "}
                  · Station: {selectedCamera.weighbridgeName}
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
              {/* Large Live View Video Container */}
              <div
                style={{
                  height: 280,
                  background: "#0F172A",
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: "#FFF",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        background: "rgba(0,0,0,0.6)",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      LIVE VIEW
                    </span>
                    <span
                      style={{
                        background:
                          selectedCamera.status === "OFFLINE"
                            ? "rgba(220,38,38,0.8)"
                            : "rgba(22,163,74,0.8)",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      ●{" "}
                      {selectedCamera.status === "OFFLINE"
                        ? "STREAM OFFLINE"
                        : `25 FPS (${selectedCamera.resolution})`}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "monospace",
                      color: "#94A3B8",
                    }}
                  >
                    {selectedCamera.rtspUrl}
                  </span>
                </div>

                <div style={{ textAlign: "center", color: "#64748B" }}>
                  <div style={{ fontSize: 44, marginBottom: 8 }}>📹</div>
                  <div
                    style={{ fontSize: 15, fontWeight: 800, color: "#E2E8F0" }}
                  >
                    {selectedCamera.status === "OFFLINE"
                      ? "Camera Stream Offline"
                      : `${selectedCamera.name} Live Feed`}
                  </div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                    {selectedCamera.protocol} RTSP stream endpoint ready for
                    native player
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#CBD5E1" }}>
                    Location: {selectedCamera.location}
                  </span>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => showToast("✓ Captured high-res snapshot")}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.15)",
                        color: "#FFF",
                        border: "1px solid rgba(255,255,255,0.2)",
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      📷 Take Snapshot
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("✓ Fullscreen expanded")}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: primaryOrange,
                        color: "#FFF",
                        border: "none",
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      ⛶ Fullscreen
                    </button>
                  </div>
                </div>
              </div>

              {/* Specifications & Connection Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {/* Specifications */}
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
                    CAMERA SPECIFICATIONS
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
                      <span style={{ color: mutedText }}>Camera Type</span>
                      <span style={{ fontWeight: 700 }}>
                        {selectedCamera.type}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Manufacturer</span>
                      <span style={{ fontWeight: 700 }}>
                        {selectedCamera.manufacturer}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Model</span>
                      <span style={{ fontWeight: 700 }}>
                        {selectedCamera.model}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Serial Number</span>
                      <span style={{ fontFamily: "monospace" }}>
                        {selectedCamera.serialNumber}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Resolution</span>
                      <span>{selectedCamera.resolution}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Frame Rate</span>
                      <span>{selectedCamera.fps} FPS</span>
                    </div>
                  </div>
                </div>

                {/* Connection & Network */}
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
                    NETWORK & CREDENTIALS
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
                      <span style={{ color: mutedText }}>IP Address</span>
                      <span style={{ fontFamily: "monospace" }}>
                        {selectedCamera.ipAddress}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Port</span>
                      <span>{selectedCamera.port}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Protocol</span>
                      <span>{selectedCamera.protocol}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Username</span>
                      <span style={{ fontFamily: "monospace" }}>
                        {selectedCamera.username}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Password</span>
                      <span style={{ fontFamily: "monospace" }}>••••••••</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: mutedText }}>Latency</span>
                      <span style={{ fontWeight: 800, color: statusOnline }}>
                        18 ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage & Recording Health */}
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
                    color: primaryText,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  STORAGE & 24/7 DVR RECORDING HEALTH
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12.5,
                    marginBottom: 8,
                  }}
                >
                  <span>
                    DVR Storage Utilization:{" "}
                    <strong>{selectedCamera.storageUsedPercent}% Used</strong>
                  </span>
                  <span style={{ color: secondaryText }}>
                    Retention Period:{" "}
                    <strong>{selectedCamera.retentionDays} Days</strong>
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    width: "100%",
                    background: inputBg,
                    borderRadius: 999,
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: `${selectedCamera.storageUsedPercent}%`,
                      height: "100%",
                      background:
                        selectedCamera.storageUsedPercent > 90
                          ? statusWarning
                          : statusOnline,
                    }}
                  />
                </div>
                <div style={{ fontSize: 11.5, color: mutedText }}>
                  Mode: Continuous 24/7 DVR Loop Recording · Next auto-purge in
                  3 days
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
                  RECENT CAMERA EVENTS
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
                      10:42:18 AM — Live RTSP video stream re-synchronized
                    </span>
                    <span style={{ color: statusOnline, fontWeight: 700 }}>
                      ● Active 25 FPS
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
                      10:40:22 AM — Auto snapshot captured on vehicle entry
                    </span>
                    <span style={{ color: mutedText }}>Plate ANPR logged</span>
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
                    <span>10:35:11 AM — DVR recording segment written</span>
                    <span style={{ color: mutedText }}>Block #4902</span>
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
                  handleOpenEdit(selectedCamera);
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
                Edit Camera Configuration
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

      {/* ── 7. ADD / EDIT CAMERA MODAL ── */}
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
              maxWidth: 660,
              maxHeight: "90vh",
              background: surface,
              borderRadius: 16,
              border: `1px solid ${border}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              overflowY: "auto",
            }}
          >
            <form onSubmit={handleSaveCamera}>
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
                    ? "+ Add Weighbridge Camera"
                    : `Edit Camera ${formData.code}`}
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
                  <label style={formLabelStyle}>Camera Code / ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g. CAM-WB06-001"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Camera Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Main Gate Entry Camera"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Camera Type *</label>
                  <select
                    value={formData.type || "IP Camera"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as CameraType,
                      })
                    }
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="IP Camera">IP Camera</option>
                    <option value="ANPR Camera">ANPR Camera</option>
                    <option value="Gate Camera">Gate Camera</option>
                    <option value="Platform Camera">Platform Camera</option>
                    <option value="Overview Camera">Overview Camera</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Weighbridge Station *</label>
                  <select
                    value={formData.weighbridgeId || "WB-01"}
                    onChange={(e) => {
                      const id = e.target.value;
                      const name =
                        id === "WB-01"
                          ? "WB-01 — Main Gate"
                          : id === "WB-02"
                            ? "WB-02 — North Gate"
                            : id === "WB-03"
                              ? "WB-03 — Loading Yard"
                              : id === "WB-04"
                                ? "WB-04 — East Gate"
                                : "WB-05 — West Gate";
                      setFormData({
                        ...formData,
                        weighbridgeId: id,
                        weighbridgeName: name,
                      });
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
                  <label style={formLabelStyle}>Location / Lane</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Entry Lane"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer || "Hikvision"}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                    placeholder="Hikvision"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>IP Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.ipAddress || "192.168.1.160"}
                    onChange={(e) =>
                      setFormData({ ...formData, ipAddress: e.target.value })
                    }
                    placeholder="192.168.1.160"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>RTSP Port</label>
                  <input
                    type="number"
                    value={formData.port || 554}
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
                    placeholder="554"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Username</label>
                  <input
                    type="text"
                    value={formData.username || "admin"}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="admin"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Password (Masked)</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    placeholder="••••••••"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Resolution</label>
                  <select
                    value={formData.resolution || "3840 × 2160 (4K)"}
                    onChange={(e) =>
                      setFormData({ ...formData, resolution: e.target.value })
                    }
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="3840 × 2160 (4K)">3840 × 2160 (4K)</option>
                    <option value="2560 × 1440 (2K)">2560 × 1440 (2K)</option>
                    <option value="1920 × 1080 (HD)">1920 × 1080 (HD)</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Status</label>
                  <select
                    value={formData.status || "ONLINE"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as CameraStatus,
                      })
                    }
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
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
                  Save Camera
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
