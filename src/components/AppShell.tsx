import React, { useState, useEffect } from "react";

export type Role = "admin" | "operator" | "maintenance" | "manager";

export interface AppShellProps {
  children: React.ReactNode;
  activeView: string;
  userRole?: Role;
  userName?: string;
  stationName?: string;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

// ── SVG Icon Helper Components (Consistent SVG Line Family) ──────────────────
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function FactoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2v16z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <polyline points="3 3 3 8 8 8" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function AppShell({
  children,
  activeView,
  userRole = "admin",
  userName = userRole === "admin" ? "Arun Kumar" : userRole === "operator" ? "Ravi Kumar" : userRole === "maintenance" ? "Suresh Tech" : "Rajesh Supervisor",
  stationName = "WB-01 • ONLINE",
  darkMode: dm,
  onToggleDark,
  onLogout,
  onNavigate,
}: AppShellProps) {
  // Master Design System Color Tokens
  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const topbarBg = dm ? "#1F2937" : "#FFFFFF";
  const sidebarBg = dm ? "#0F172A" : "#0F2438";
  const elevated = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E2E8F0";
  const divider = dm ? "#374151" : "#F1F5F9";

  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";
  const statusSuccess = "#16A34A";

  // Sidebar Collapse & Mobile Menu State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Popover States
  const [stationPopoverOpen, setStationPopoverOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // User Initials
  const userInitials = userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  // Role label text
  const roleLabel = userRole === "admin" ? "Administrator" : userRole === "operator" ? "Operator" : userRole === "maintenance" ? "Maintenance" : "Manager";

  // Breadcrumb Section Context based on activeView
  const getBreadcrumbContext = () => {
    switch (activeView) {
      case "dashboard": return "Overview / Dashboard";
      case "monitoring": case "live-weighment": return "Operations / Live Weighbridge";
      case "vehicle-entry": return "Operations / Vehicle Visits";
      case "transactions": case "transaction-detail": return "Operations / Weighments";
      case "pending": case "pending-weighments": return "Operations / Pending Weighments";
      case "tickets": case "ticket-detail": return "Support / Tickets";
      case "alerts": return "Support / Alerts Center";
      case "customers": case "customer-detail": case "customer-add": case "customer-edit": return "Management / Customers";
      case "suppliers": case "supplier-detail": case "supplier-add": case "supplier-edit": return "Management / Suppliers";
      case "vehicles": case "vehicle-detail": case "vehicle-add": case "vehicle-edit": return "Management / Vehicles";
      case "drivers": case "driver-detail": case "driver-add": case "driver-edit": return "Management / Drivers";
      case "materials": case "material-detail": case "material-add": case "material-edit": return "Management / Materials";
      case "billing": return "Finance / Billing & Invoices";
      case "employees": return "Administration / Employees";
      case "reports": return "Reports / Report Center";
      case "auditlogs": return "Administration / Audit Logs";
      case "settings": return "Administration / System Settings";
      default: return "ABC Weighbridge / Management System";
    }
  };

  // Role-Based Sidebar Navigation Configuration
  const getNavSections = () => {
    if (userRole === "operator") {
      return [
        { title: null, items: [{ key: "dashboard", label: "Dashboard", icon: <HomeIcon /> }] },
        {
          title: "OPERATIONS",
          items: [
            { key: "monitoring", label: "Live Weighbridge", icon: <ScaleIcon /> },
            { key: "vehicle-entry", label: "Vehicle Visits", icon: <TruckIcon /> },
            { key: "transactions", label: "Weighments", icon: <ClipboardIcon /> },
            { key: "pending", label: "Pending Weighments", icon: <ClockIcon /> },
            { key: "tickets", label: "Tickets", icon: <TicketIcon /> },
          ],
        },
        {
          title: "MANAGEMENT",
          items: [
            { key: "vehicles", label: "Vehicles", icon: <TruckIcon /> },
            { key: "drivers", label: "Drivers", icon: <UserIcon /> },
            { key: "customers", label: "Customers", icon: <BuildingIcon /> },
            { key: "materials", label: "Materials", icon: <BoxIcon /> },
          ],
        },
        {
          title: "WEIGHBRIDGE",
          items: [
            { key: "monitoring", label: "My Weighbridge", icon: <ScaleIcon /> },
            { key: "monitoring", label: "Device Status", icon: <MonitorIcon /> },
          ],
        },
        {
          title: "REPORTS",
          items: [{ key: "reports", label: "My Reports", icon: <BarChartIcon /> }],
        },
        {
          title: "ALERTS",
          items: [{ key: "alerts", label: "Alerts Center", icon: <BellIcon /> }],
        },
      ];
    }

    if (userRole === "maintenance") {
      return [
        { title: null, items: [{ key: "dashboard", label: "Dashboard", icon: <HomeIcon /> }] },
        {
          title: "WEIGHBRIDGE",
          items: [
            { key: "monitoring", label: "Weighbridges", icon: <ScaleIcon /> },
            { key: "monitoring", label: "Device Monitoring", icon: <MonitorIcon /> },
            { key: "monitoring", label: "Device Status", icon: <MonitorIcon /> },
          ],
        },
        {
          title: "MAINTENANCE",
          items: [
            { key: "tickets", label: "Maintenance Issues", icon: <TicketIcon /> },
            { key: "tickets", label: "Tickets", icon: <TicketIcon /> },
          ],
        },
        {
          title: "ALERTS",
          items: [{ key: "alerts", label: "Alerts Center", icon: <BellIcon /> }],
        },
        {
          title: "REPORTS",
          items: [{ key: "reports", label: "Performance Reports", icon: <BarChartIcon /> }],
        },
      ];
    }

    if (userRole === "manager") {
      return [
        { title: null, items: [{ key: "dashboard", label: "Dashboard", icon: <HomeIcon /> }] },
        {
          title: "OPERATIONS",
          items: [
            { key: "monitoring", label: "Live Weighbridge", icon: <ScaleIcon /> },
            { key: "vehicle-entry", label: "Vehicle Visits", icon: <TruckIcon /> },
            { key: "transactions", label: "Weighments", icon: <ClipboardIcon /> },
            { key: "pending", label: "Pending Weighments", icon: <ClockIcon /> },
            { key: "tickets", label: "Tickets", icon: <TicketIcon /> },
          ],
        },
        {
          title: "MANAGEMENT",
          items: [
            { key: "customers", label: "Customers", icon: <BuildingIcon /> },
            { key: "suppliers", label: "Suppliers", icon: <FactoryIcon /> },
            { key: "vehicles", label: "Vehicles", icon: <TruckIcon /> },
            { key: "drivers", label: "Drivers", icon: <UserIcon /> },
            { key: "materials", label: "Materials", icon: <BoxIcon /> },
          ],
        },
        {
          title: "WEIGHBRIDGE",
          items: [
            { key: "monitoring", label: "Weighbridges", icon: <ScaleIcon /> },
            { key: "monitoring", label: "Device Monitoring", icon: <MonitorIcon /> },
          ],
        },
        {
          title: "REPORTS",
          items: [{ key: "reports", label: "Report Center", icon: <BarChartIcon /> }],
        },
        {
          title: "ALERTS",
          items: [{ key: "alerts", label: "Alerts Center", icon: <BellIcon /> }],
        },
      ];
    }

    // Default Admin Navigation
    return [
      { title: null, items: [{ key: "dashboard", label: "Dashboard", icon: <HomeIcon /> }] },
      {
        title: "OPERATIONS",
        items: [
          { key: "monitoring", label: "Live Weighbridge", icon: <ScaleIcon /> },
          { key: "vehicle-entry", label: "Vehicle Visits", icon: <TruckIcon /> },
          { key: "transactions", label: "Weighments", icon: <ClipboardIcon /> },
          { key: "pending", label: "Pending Weighments", icon: <ClockIcon /> },
          { key: "tickets", label: "Tickets", icon: <TicketIcon /> },
        ],
      },
      {
        title: "MANAGEMENT",
        items: [
          { key: "customers", label: "Customers", icon: <BuildingIcon /> },
          { key: "suppliers", label: "Suppliers", icon: <FactoryIcon /> },
          { key: "vehicles", label: "Vehicles", icon: <TruckIcon /> },
          { key: "drivers", label: "Drivers", icon: <UserIcon /> },
          { key: "materials", label: "Materials", icon: <BoxIcon /> },
        ],
      },
      {
        title: "WEIGHBRIDGE",
        items: [
          { key: "monitoring", label: "Weighbridges", icon: <ScaleIcon /> },
          { key: "monitoring", label: "Device Monitoring", icon: <MonitorIcon /> },
        ],
      },
      {
        title: "REPORTS",
        items: [{ key: "reports", label: "Report Center", icon: <BarChartIcon /> }],
      },
      {
        title: "ALERTS",
        items: [{ key: "alerts", label: "Alerts Center", icon: <BellIcon /> }],
      },
      {
        title: "ADMINISTRATION",
        items: [
          { key: "employees", label: "Employees", icon: <UsersIcon /> },
          { key: "employees", label: "Roles & Permissions", icon: <ShieldIcon /> },
          { key: "auditlogs", label: "Audit Logs", icon: <HistoryIcon /> },
          { key: "settings", label: "System Settings", icon: <GearIcon /> },
        ],
      },
    ];
  };

  const navSections = getNavSections();
  const sidebarWidth = sidebarCollapsed ? 72 : 280;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: bg, color: primaryText, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── 64px STANDARDIZED GLOBAL TOPBAR ── */}
      <header
        style={{
          height: 64, minHeight: 64, padding: "0 24px", background: topbarBg, borderBottom: `1px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, zIndex: 50, position: "sticky", top: 0
        }}
      >
        {/* TOPBAR LEFT: BRAND LOGO & ORG */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: primaryOrange, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#FFF", fontSize: 16, flexShrink: 0 }}>
              ⚖
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: primaryText, letterSpacing: "-0.01em", lineHeight: 1.2 }}>ABC WEIGHBRIDGE</div>
              <div style={{ fontSize: 10.5, color: mutedText, fontWeight: 500 }}>ABC Industries</div>
            </div>
          </div>
        </div>

        {/* TOPBAR CENTER: BREADCRUMB / SECTION CONTEXT */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: secondaryText }}>
          <span style={{ color: mutedText }}>📍</span>
          <span>{getBreadcrumbContext()}</span>
        </div>

        {/* TOPBAR RIGHT: STATION STATUS, NOTIFICATIONS & USER PROFILE */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>

          {/* Station Status Badge + Compact Popover */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setStationPopoverOpen(!stationPopoverOpen)}
              style={{
                height: 38, padding: "0 12px", borderRadius: 8, background: elevated, border: `1px solid ${border}`,
                display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, color: primaryText
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusSuccess }} />
              <span>WB-01 • ONLINE</span>
            </button>

            {/* Station Status Popover */}
            {stationPopoverOpen && (
              <div style={{ position: "absolute", top: 46, right: 0, width: 260, background: surface, borderRadius: 12, border: `1px solid ${border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.2)", zIndex: 100, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", marginBottom: 8 }}>CURRENT STATION</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: primaryText, marginBottom: 2 }}>WB-01 — Main Gate</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: statusSuccess, marginBottom: 12 }}>● Online & Operational</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, borderTop: `1px solid ${divider}`, paddingTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Indicator</span><span style={{ color: statusSuccess, fontWeight: 700 }}>✓ Online</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Camera</span><span style={{ color: statusSuccess, fontWeight: 700 }}>✓ Online</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Printer</span><span style={{ color: statusSuccess, fontWeight: 700 }}>✓ Online</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Network</span><span style={{ color: statusSuccess, fontWeight: 700 }}>✓ Online</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
              style={{ width: 38, height: 38, borderRadius: 8, background: elevated, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: primaryText, cursor: "pointer", position: "relative" }}
              title="Alerts & Notifications"
            >
              <BellIcon />
              <span style={{ position: "absolute", top: -3, right: -3, background: primaryOrange, color: "#FFF", fontSize: 10, fontWeight: 900, borderRadius: 999, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                3
              </span>
            </button>

            {/* Notifications Popover */}
            {notifPopoverOpen && (
              <div style={{ position: "absolute", top: 46, right: 0, width: 300, background: surface, borderRadius: 12, border: `1px solid ${border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.2)", zIndex: 100, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: `1px solid ${divider}` }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: primaryText }}>Recent Alerts</span>
                  <span style={{ fontSize: 11, color: primaryOrange, fontWeight: 700 }}>3 Unread</span>
                </div>
                <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                  <div style={{ padding: 8, borderRadius: 6, background: elevated }}><strong>WB-04 Status</strong>: Degraded response speed</div>
                  <div style={{ padding: 8, borderRadius: 6, background: elevated }}><strong>Ticket TKT-10248</strong>: High Priority SLA update</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setNotifPopoverOpen(false); onNavigate("alerts"); }}
                  style={{ width: "100%", padding: "8px 0", marginTop: 4, borderRadius: 6, background: primaryOrange, color: "#FFF", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  View All Alerts
                </button>
              </div>
            )}
          </div>

          {/* User Profile Component (Informational Role, No Role Switcher!) */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{ padding: "4px 10px 4px 6px", borderRadius: 10, background: elevated, border: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: primaryOrange, color: "#FFF", fontWeight: 900, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {userInitials}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: primaryText, lineHeight: 1.2 }}>{userName}</div>
                <div style={{ fontSize: 11, color: secondaryGold, fontWeight: 700 }}>{roleLabel}</div>
              </div>
              <span style={{ fontSize: 10, color: mutedText }}>▼</span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div style={{ position: "absolute", top: 48, right: 0, width: 220, background: surface, borderRadius: 12, border: `1px solid ${border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.2)", zIndex: 100, padding: "6px 0" }}>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${divider}` }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: primaryText }}>{userName}</div>
                  <div style={{ fontSize: 11, color: mutedText }}>{roleLabel} · ABC Industries</div>
                </div>
                <button type="button" onClick={() => { setProfileDropdownOpen(false); onNavigate("settings"); }} style={menuBtnStyle}>👤 My Profile</button>
                <button type="button" onClick={() => { setProfileDropdownOpen(false); onNavigate("settings"); }} style={menuBtnStyle}>⚙ Account Settings</button>
                <button type="button" onClick={() => { setProfileDropdownOpen(false); onToggleDark(); }} style={menuBtnStyle}>
                  {dm ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
                </button>
                <button type="button" onClick={() => { setProfileDropdownOpen(false); onNavigate("auditlogs"); }} style={menuBtnStyle}>🛡 Activity</button>
                <div style={{ borderTop: `1px solid ${divider}`, margin: "4px 0" }} />
                <button type="button" onClick={onLogout} style={{ ...menuBtnStyle, color: "#DC2626" }}>🚪 Sign Out</button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── MAIN BODY LAYOUT (DESKTOP SIDEBAR + PAGE CONTENT) ── */}
      <div style={{ flex: 1, display: "flex", minWidth: 0 }}>

        {/* ── ROLE-BASED DESKTOP SIDEBAR (280px Expanded / 72px Collapsed) ── */}
        <aside
          style={{
            width: sidebarWidth, minWidth: sidebarWidth, height: "calc(100vh - 64px)", position: "sticky", top: 64,
            display: "flex", flexDirection: "column", background: sidebarBg, borderRight: `1px solid ${border}`,
            flexShrink: 0, zIndex: 40, transition: "width 0.2s ease, min-width 0.2s ease"
          }}
        >
          {/* COLLAPSE / EXPAND TOGGLE */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ background: "none", border: 0, color: "#94A3B8", fontSize: 13, cursor: "pointer", padding: 4 }}
              title={sidebarCollapsed ? "Expand Sidebar (280px)" : "Collapse Sidebar (72px)"}
            >
              {sidebarCollapsed ? "➔" : "⬅"}
            </button>
          </div>

          {/* NAVIGATION SCROLL AREA */}
          <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
            {navSections.map((sec, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {sec.title && !sidebarCollapsed && (
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B", letterSpacing: "0.08em", padding: "6px 10px 2px", textTransform: "uppercase" }}>
                    {sec.title}
                  </div>
                )}
                {sec.items.map((item) => {
                  const isActive = activeView === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onNavigate(item.key)}
                      title={sidebarCollapsed ? item.label : undefined}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, width: "100%", height: 42, padding: sidebarCollapsed ? "0 14px" : "0 12px",
                        borderRadius: 10, border: "none",
                        background: isActive ? primaryOrange : "transparent",
                        color: isActive ? "#FFFFFF" : "#94A3B8",
                        fontSize: 14, fontWeight: isActive ? 700 : 500, cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
                        justifyContent: sidebarCollapsed ? "center" : "flex-start"
                      }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0, display: "flex", color: isActive ? "#FFFFFF" : "#94A3B8" }}>
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── PAGE CONTENT CANVAS ── */}
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          {children}
        </main>

      </div>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <div style={{ display: "none" }} className="mobile-bottom-nav">
        {/* Placeholder for responsive bottom bar on small viewports */}
      </div>

    </div>
  );
}

const menuBtnStyle: React.CSSProperties = {
  width: "100%", padding: "10px 16px", border: "none", background: "transparent",
  fontSize: 13, fontWeight: 600, color: "inherit", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 10
};
