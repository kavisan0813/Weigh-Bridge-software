import React, { useState, useEffect } from "react";

export interface SidebarProps {
  activeView: string;
  userRole?: "admin" | "operator" | "maintenance" | "manager";
  darkMode?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate: (view: string) => void;
}

// ── SVG Icon Helper Components (20px Line Icons) ─────────────────────────────
function DashboardIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ScaleIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function TruckIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ClipboardIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  );
}

function ClockIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TicketIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    </svg>
  );
}

function UserRoundIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function BuildingIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function FactoryIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2v16z" />
    </svg>
  );
}

function BoxIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function MonitorIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function GaugeIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14l3-3" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function CameraIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function PrinterIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function SlidersIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function CreditCardIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function BarChartIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function UsersIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HistoryIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <polyline points="3 3 3 8 8 8" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function GearIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ChevronDownIcon({ color = "currentColor", expanded = false }: { color?: string; expanded?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PanelLeftCloseIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <path d="M15 10l-3 3 3 3" />
    </svg>
  );
}

function PanelLeftIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <path d="M13 10l3 3-3 3" />
    </svg>
  );
}

// ── Structure Definition ──────────────────────────────────────────────────────
interface NavItem {
  key: string;
  label: string;
  icon: (color: string) => React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar({
  activeView,
  userRole = "admin",
  darkMode: dm = false,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: SidebarProps) {
  // Theme Color Tokens
  const sidebarBg = dm ? "#111827" : "#FFFFFF";
  const border = dm ? "#374151" : "#E5E7EB";
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#CBD5E1" : "#334155";
  const mutedText = dm ? "#9CA3AF" : "#94A3B8";
  const activeSoftBg = dm ? "rgba(249, 115, 22, 0.15)" : "#FFFBEB";

  const isAdmin = userRole === "admin" || userRole === "manager";

  // Section Groups Definition
  const sections: NavSection[] = [
    {
      title: "OPERATIONS",
      items: [
        { key: "monitoring", label: "Live Weighbridge", icon: (c) => <ScaleIcon color={c} /> },
        { key: "vehicle-entry", label: "Vehicle Visits", icon: (c) => <TruckIcon color={c} /> },
        { key: "transactions", label: "Weighments", icon: (c) => <ClipboardIcon color={c} /> },
        { key: "pending", label: "Pending Weighments", icon: (c) => <ClockIcon color={c} /> },
        { key: "tickets", label: "Weighment Tickets", icon: (c) => <TicketIcon color={c} /> },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { key: "vehicles", label: "Vehicles", icon: (c) => <TruckIcon color={c} /> },
        { key: "drivers", label: "Drivers", icon: (c) => <UserRoundIcon color={c} /> },
        { key: "customers", label: "Customers", icon: (c) => <BuildingIcon color={c} /> },
        ...(isAdmin
          ? [{ key: "suppliers", label: "Suppliers", icon: (c: string) => <FactoryIcon color={c} /> }]
          : []),
        { key: "materials", label: "Materials", icon: (c) => <BoxIcon color={c} /> },
      ],
    },
    {
      title: "WEIGHBRIDGE",
      items: [
        { key: "weighbridges", label: "Weighbridges", icon: (c) => <ScaleIcon color={c} /> },
        { key: "device-monitoring", label: "Device Monitoring", icon: (c) => <MonitorIcon color={c} /> },
        ...(isAdmin
          ? [
              { key: "indicators", label: "Weight Indicators", icon: (c: string) => <GaugeIcon color={c} /> },
              { key: "cameras", label: "Cameras", icon: (c: string) => <CameraIcon color={c} /> },
              { key: "printers", label: "Printers", icon: (c: string) => <PrinterIcon color={c} /> },
              { key: "calibration", label: "Calibration", icon: (c: string) => <SlidersIcon color={c} /> },
            ]
          : []),
      ],
    },
    {
      title: "FINANCE",
      items: [
        { key: "billing", label: "Billing", icon: (c) => <CreditCardIcon color={c} /> },
      ],
    },
    {
      title: "REPORTS",
      items: [
        { key: "reports", label: "Report Center", icon: (c) => <BarChartIcon color={c} /> },
      ],
    },
  ];

  // Admin / Manager Role Section Additions
  if (isAdmin) {
    sections.push({
      title: "ADMINISTRATION",
      items: [
        { key: "employees", label: "Employees / Users", icon: (c) => <UsersIcon color={c} /> },
        { key: "auditlogs", label: "Audit Logs", icon: (c) => <HistoryIcon color={c} /> },
        { key: "settings", label: "Settings", icon: (c) => <GearIcon color={c} /> },
      ],
    });
  }

  // Helper to determine exact active item state
  const isItemActive = (itemKey: string): boolean => {
    switch (itemKey) {
      case "dashboard":
        return activeView === "dashboard" || activeView === "operator-dashboard";
      case "monitoring":
        return activeView === "monitoring" || activeView === "live-weighment" || activeView === "detail";
      case "vehicle-entry":
        return activeView === "vehicle-entry";
      case "transactions":
        return activeView === "transactions" || activeView === "transaction-detail" || activeView === "second-weighment";
      case "pending":
        return activeView === "pending" || activeView === "pending-weighments";
      case "tickets":
        return activeView === "tickets" || activeView === "ticket-detail" || activeView === "ticket-preview";
      case "vehicles":
        return activeView === "vehicles" || activeView === "vehicle-detail" || activeView === "vehicle-add" || activeView === "vehicle-edit";
      case "drivers":
        return activeView === "drivers" || activeView === "driver-detail" || activeView === "driver-add" || activeView === "driver-edit";
      case "customers":
        return activeView === "customers" || activeView === "customer-detail" || activeView === "customer-add" || activeView === "customer-edit";
      case "suppliers":
        return activeView === "suppliers" || activeView === "supplier-detail" || activeView === "supplier-add" || activeView === "supplier-edit";
      case "materials":
        return activeView === "materials" || activeView === "material-detail" || activeView === "material-add" || activeView === "material-edit";
      case "weighbridges":
        return activeView === "weighbridges";
      case "device-monitoring":
        return activeView === "device-monitoring";
      case "indicators":
        return activeView === "indicators";
      case "cameras":
        return activeView === "cameras";
      case "printers":
        return activeView === "printers";
      case "calibration":
        return activeView === "calibration";
      case "billing":
        return activeView === "billing";
      case "reports":
        return activeView === "reports" || activeView === "weighment-report" || activeView === "performance-report" || activeView === "customer-report";
      case "employees":
        return activeView === "employees";
      case "auditlogs":
        return activeView === "auditlogs";
      case "settings":
        return activeView === "settings";
      default:
        return activeView === itemKey;
    }
  };

  // Find section containing current active item
  const findActiveSectionTitle = (): string => {
    for (const sec of sections) {
      if (sec.items.some((item) => isItemActive(item.key))) {
        return sec.title;
      }
    }
    return "OPERATIONS";
  };

  // Collapsible sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => ({
    OPERATIONS: true,
    MANAGEMENT: false,
    WEIGHBRIDGE: false,
    FINANCE: false,
    REPORTS: false,
    ADMINISTRATION: false,
  }));

  // Auto-expand section containing active route when activeView changes
  useEffect(() => {
    const activeSecTitle = findActiveSectionTitle();
    setOpenSections((prev) => ({
      ...prev,
      [activeSecTitle]: true,
    }));
  }, [activeView]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isDashboardActive = isItemActive("dashboard");
  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        background: sidebarBg,
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        boxSizing: "border-box",
        transition: "width 0.2s ease, min-width 0.2s ease",
      }}
    >
      {/* ── 1. BRAND HEADER (Fixed Height: 80px) ── */}
      <div
        style={{
          height: 80,
          minHeight: 80,
          padding: collapsed ? "0 12px" : "0 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {/* Logo Container (48px x 48px, #F97316, 10px radius) */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: primaryOrange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(249, 115, 22, 0.25)",
          }}
        >
          <ScaleIcon color="#FFFFFF" />
        </div>

        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: primaryText,
                letterSpacing: "0.02em",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              ABC WEIGHBRIDGE
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: dm ? mutedText : "#64748B",
                whiteSpace: "nowrap",
                marginTop: 2,
              }}
            >
              ABC Industries
            </span>
          </div>
        )}
      </div>

      {/* ── 2. MIDDLE SCROLLABLE NAVIGATION AREA ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "14px 8px" : "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* STANDALONE DASHBOARD ITEM */}
        <button
          type="button"
          onClick={() => onNavigate(userRole === "operator" ? "operator-dashboard" : "dashboard")}
          title={collapsed ? "Dashboard" : undefined}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 8,
            border: "none",
            background: isDashboardActive ? activeSoftBg : "transparent",
            color: isDashboardActive ? primaryOrange : secondaryText,
            display: "flex",
            alignItems: "center",
            padding: collapsed ? "0" : "0 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 12,
            cursor: "pointer",
            position: "relative",
            transition: "background 0.15s ease, color 0.15s ease",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            if (!isDashboardActive) {
              e.currentTarget.style.background = activeSoftBg;
              e.currentTarget.style.color = primaryText;
            }
          }}
          onMouseLeave={(e) => {
            if (!isDashboardActive) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = secondaryText;
            }
          }}
        >
          {/* Active Left Indicator */}
          {isDashboardActive && (
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 6,
                bottom: 6,
                width: 3,
                borderRadius: "0 4px 4px 0",
                background: primaryOrange,
              }}
            />
          )}
          <span style={{ display: "flex", flexShrink: 0 }}>
            <DashboardIcon color={isDashboardActive ? primaryOrange : secondaryGold} />
          </span>
          {!collapsed && (
            <span style={{ fontSize: 13.5, fontWeight: isDashboardActive ? 700 : 600 }}>
              Dashboard
            </span>
          )}
        </button>

        {/* SECTION GROUPS */}
        {sections.map((section) => {
          const isOpen = !!openSections[section.title];
          const hasActiveChild = section.items.some((item) => isItemActive(item.key));

          return (
            <div key={section.title} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Section Header (Non-clickable link, Collapsible toggle) */}
              {!collapsed ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  style={{
                    width: "100%",
                    height: 36,
                    padding: "0 10px",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: hasActiveChild ? primaryOrange : mutedText,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {section.title}
                  </span>
                  <ChevronDownIcon color={mutedText} expanded={isOpen} />
                </button>
              ) : (
                <div
                  style={{
                    height: 1,
                    background: border,
                    margin: "6px 8px",
                  }}
                />
              )}

              {/* Group Child Items */}
              {(isOpen || collapsed) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {section.items.map((item) => {
                    const active = isItemActive(item.key);
                    const iconColor = active ? primaryOrange : secondaryGold;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          if (userRole === "operator") {
                            if (item.key === "monitoring") onNavigate("live-weighment");
                            else if (item.key === "transactions") onNavigate("second-weighment");
                            else if (item.key === "pending") onNavigate("pending-weighments");
                            else if (item.key === "tickets") onNavigate("ticket-preview");
                            else onNavigate(item.key);
                          } else {
                            onNavigate(item.key);
                          }
                        }}
                        title={collapsed ? item.label : undefined}
                        style={{
                          width: "100%",
                          height: 42,
                          borderRadius: 8,
                          border: "none",
                          background: active ? activeSoftBg : "transparent",
                          color: active ? primaryOrange : secondaryText,
                          display: "flex",
                          alignItems: "center",
                          padding: collapsed ? "0" : "0 12px 0 28px",
                          justifyContent: collapsed ? "center" : "flex-start",
                          gap: 12,
                          cursor: "pointer",
                          position: "relative",
                          transition: "background 0.15s ease, color 0.15s ease",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = activeSoftBg;
                            e.currentTarget.style.color = primaryText;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = secondaryText;
                          }
                        }}
                      >
                        {/* 3px Active Indicator */}
                        {active && (
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 6,
                              bottom: 6,
                              width: 3,
                              borderRadius: "0 4px 4px 0",
                              background: primaryOrange,
                            }}
                          />
                        )}

                        <span style={{ display: "flex", flexShrink: 0 }}>
                          {item.icon(iconColor)}
                        </span>

                        {!collapsed && (
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: active ? 700 : 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 3. BOTTOM FIXED COLLAPSE CONTROL ── */}
      <div
        style={{
          height: 64,
          minHeight: 64,
          padding: "10px 12px",
          borderTop: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: mutedText,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 12,
            padding: collapsed ? "0" : "0 12px",
            cursor: "pointer",
            transition: "background 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = activeSoftBg;
            e.currentTarget.style.color = primaryOrange;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = mutedText;
          }}
        >
          <span style={{ display: "flex", flexShrink: 0 }}>
            {collapsed ? <PanelLeftIcon color={primaryOrange} /> : <PanelLeftCloseIcon color={primaryOrange} />}
          </span>
          {!collapsed && (
            <span style={{ fontSize: 13, fontWeight: 700, color: dm ? secondaryText : "#475569" }}>
              Collapse Sidebar
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
