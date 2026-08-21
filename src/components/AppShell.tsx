import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { GlobalDateTime } from "./ui/GlobalDateTime";


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

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function AppShell({
  children,
  activeView,
  userRole = "admin",
  userName = userRole === "admin"
    ? "Rithick Nathan"
    : userRole === "operator"
      ? "Ravi Kumar"
      : userRole === "maintenance"
        ? "Suresh Tech"
        : "Rajesh Supervisor",
  stationName = userRole === "operator" ? "WB-01 — Main Gate • ONLINE" : "All Weighbridges",
  darkMode: dm,
  onToggleDark,
  onLogout,
  onNavigate,
}: AppShellProps) {
  // Theme Color Tokens
  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const topbarBg = dm ? "#1F2937" : "#FFFFFF";
  const elevated = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const divider = dm ? "#374151" : "#F1F5F9";
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";
  const statusSuccess = dm ? "#22C55E" : "#16A34A";

  // Sidebar Collapse State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Popover States
  const [stationPopoverOpen, setStationPopoverOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<string>("all");

  const weighbridgesData = [
    {
      id: "all",
      code: "ALL",
      name: "All Weighbridges",
      location: "All Locations (5 Stations)",
      status: "ONLINE",
      statusText: "4 Online / 1 Offline",
      statusColor: "#16A34A",
      hardware: [
        { name: "WB-01 Main Gate", status: "Online", ok: true },
        { name: "WB-02 North Gate", status: "Available", ok: true },
        { name: "WB-03 Loading Yard", status: "Weighing", ok: true },
        { name: "WB-04 South Gate", status: "Offline", ok: false },
        { name: "WB-05 West Gate", status: "Available", ok: true },
      ],
    },
    {
      id: "wb-01",
      code: "WB-01",
      name: "WB-01 — Main Gate",
      location: "Main Entrance",
      status: "ONLINE",
      statusText: "Online & Operational",
      statusColor: "#16A34A",
      hardware: [
        { name: "Indicator", status: "Online", ok: true },
        { name: "Camera", status: "Online", ok: true },
        { name: "Printer", status: "Online", ok: true },
        { name: "Network", status: "Online", ok: true },
      ],
    },
    {
      id: "wb-02",
      code: "WB-02",
      name: "WB-02 — North Gate",
      location: "North Gate Entrance",
      status: "AVAILABLE",
      statusText: "Available & Ready",
      statusColor: "#2563EB",
      hardware: [
        { name: "Indicator", status: "Online", ok: true },
        { name: "Camera", status: "Online", ok: true },
        { name: "Printer", status: "Online", ok: true },
        { name: "Network", status: "Online", ok: true },
      ],
    },
    {
      id: "wb-03",
      code: "WB-03",
      name: "WB-03 — Loading Yard",
      location: "Loading Bay East",
      status: "WEIGHING",
      statusText: "Weighing Active",
      statusColor: "#8B5CF6",
      hardware: [
        { name: "Indicator", status: "Online", ok: true },
        { name: "Camera", status: "Online", ok: true },
        { name: "Printer", status: "Online", ok: true },
        { name: "Network", status: "Online", ok: true },
      ],
    },
    {
      id: "wb-04",
      code: "WB-04",
      name: "WB-04 — South Gate",
      location: "South Dispatch",
      status: "OFFLINE",
      statusText: "Offline — Maintenance",
      statusColor: "#DC2626",
      hardware: [
        { name: "Indicator", status: "Offline", ok: false },
        { name: "Camera", status: "Online", ok: true },
        { name: "Printer", status: "Warning", ok: false },
        { name: "Network", status: "Offline", ok: false },
      ],
    },
    {
      id: "wb-05",
      code: "WB-05",
      name: "WB-05 — West Gate",
      location: "West Auxiliary Gate",
      status: "AVAILABLE",
      statusText: "Available & Ready",
      statusColor: "#2563EB",
      hardware: [
        { name: "Indicator", status: "Online", ok: true },
        { name: "Camera", status: "Online", ok: true },
        { name: "Printer", status: "Online", ok: true },
        { name: "Network", status: "Online", ok: true },
      ],
    },
  ];

  const activeStation =
    weighbridgesData.find((s) => s.id === selectedStationId) || weighbridgesData[0];

  // User Initials
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Role label text
  const roleLabel =
    userRole === "admin"
      ? "Administrator"
      : userRole === "operator"
        ? "Operator"
        : userRole === "maintenance"
          ? "Maintenance"
          : "Manager";

  // Breadcrumb Section Context based on activeView
  const getBreadcrumbContext = () => {
    switch (activeView) {
      case "dashboard":
      case "operator-dashboard":
        return "Overview / Dashboard";
      case "monitoring":
      case "live-weighment":
      case "detail":
        return "Operations / Live Weighbridge";
      case "vehicle-entry":
        return "Operations / Vehicle Visits";
      case "transactions":
      case "transaction-detail":
      case "second-weighment":
        return "Operations / Weighments";
      case "pending":
      case "pending-weighments":
        return "Operations / Pending Weighments";
      case "tickets":
      case "ticket-detail":
      case "ticket-preview":
        return "Support / Tickets";
      case "alerts":
        return "Support / Alerts Center";
      case "customers":
      case "customer-detail":
      case "customer-add":
      case "customer-edit":
        return "Management / Customers";
      case "suppliers":
      case "supplier-detail":
      case "supplier-add":
      case "supplier-edit":
        return "Management / Suppliers";
      case "vehicles":
      case "vehicle-detail":
      case "vehicle-add":
      case "vehicle-edit":
        return "Management / Vehicles";
      case "drivers":
      case "driver-detail":
      case "driver-add":
      case "driver-edit":
        return "Management / Drivers";
      case "materials":
      case "material-detail":
      case "material-add":
      case "material-edit":
        return "Management / Materials";
      case "weighbridges":
        return "Weighbridge / Weighbridges";
      case "device-monitoring":
        return "Weighbridge / Device Monitoring";
      case "indicators":
        return "Weighbridge / Weight Indicators";
      case "cameras":
        return "Weighbridge / Cameras";
      case "printers":
        return "Weighbridge / Printers";
      case "calibration":
        return "Weighbridge / Calibration";
      case "billing":
        return "Finance / Billing & Invoices";
      case "employees":
        return "Administration / Employees";
      case "reports":
      case "weighment-report":
      case "performance-report":
      case "customer-report":
        return "Reports / Report Center";
      case "auditlogs":
        return "Administration / Audit Logs";
      case "settings":
        return "Administration / System Settings";
      default:
        return "Viyan Weighbridge / Management System";
    }
  };

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: bg,
        color: primaryText,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* ── 1. GLOBAL FIXED SIDEBAR (260px Expanded / 72px Collapsed) ── */}
      <Sidebar
        activeView={activeView}
        userRole={userRole}
        darkMode={dm}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigate={onNavigate}
      />

      {/* ── 2. MAIN APPLICATION CONTENT AREA (Offset by sidebarWidth) ── */}
      <div
        style={{
          marginLeft: sidebarWidth,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: "margin-left 0.2s ease",
        }}
      >
        {/* ── 64px STANDARDIZED GLOBAL TOPBAR ── */}
        <header
          style={{
            height: 64,
            minHeight: 64,
            padding: "0 24px",
            background: topbarBg,
            borderBottom: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            zIndex: 50,
            position: "sticky",
            top: 0,
          }}
        >
          {/* TOPBAR LEFT: BRANDING & LIVE DATE + TIME */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Branding (Viyan WEIGHBRIDGE / Viyan Industries) */}

            {/* Vertical Divider */}
            <div
              className="hidden sm:block"
              style={{
                width: 1,
                height: 24,
                background: border,
              }}
            />

            {/* LIVE DATE + TIME COMPONENT */}
            <GlobalDateTime darkMode={dm} />
          </div>


          {/* TOPBAR RIGHT: STATION STATUS, NOTIFICATIONS & USER PROFILE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              position: "relative",
            }}
          >
            {/* Station Status Badge + Compact Popover */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setStationPopoverOpen(!stationPopoverOpen)}
                style={{
                  height: 38,
                  padding: "0 12px",
                  borderRadius: 8,
                  background: elevated,
                  border: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  color: primaryText,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: activeStation.statusColor,
                  }}
                />
                <span>{activeStation.name}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{
                    transform: stationPopoverOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    color: mutedText,
                    marginLeft: 2,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Station Status Popover */}
              {stationPopoverOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 46,
                    right: 0,
                    width: 320,
                    background: surface,
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                    zIndex: 100,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      paddingBottom: 6,
                      borderBottom: `1px solid ${divider}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: mutedText,
                        letterSpacing: "0.05em",
                      }}
                    >
                      SELECT WEIGHBRIDGE
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: primaryOrange,
                        background: dm ? "rgba(249,115,22,0.15)" : "#FFF7ED",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      5 Total Stations
                    </span>
                  </div>

                  {/* Dropdown list of all weighbridges */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      maxHeight: 220,
                      overflowY: "auto",
                      marginBottom: 12,
                    }}
                  >
                    {weighbridgesData.map((wb) => {
                      const isSelected = wb.id === selectedStationId;
                      return (
                        <button
                          key={wb.id}
                          type="button"
                          onClick={() => {
                            setSelectedStationId(wb.id);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 10px",
                            borderRadius: 8,
                            border: isSelected
                              ? `1px solid ${primaryOrange}`
                              : `1px solid ${divider}`,
                            background: isSelected
                              ? dm
                                ? "rgba(249,115,22,0.12)"
                                : "#EFF6FF"
                              : "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: wb.statusColor,
                                flexShrink: 0,
                              }}
                            />
                            <div>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: isSelected ? 800 : 600,
                                  color: isSelected ? primaryOrange : primaryText,
                                }}
                              >
                                {wb.name}
                              </div>
                              <div style={{ fontSize: 10, color: mutedText }}>
                                {wb.location}
                              </div>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: wb.statusColor,
                              background: `${wb.statusColor}15`,
                              padding: "2px 6px",
                              borderRadius: 4,
                            }}
                          >
                            {wb.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Station Hardware Details */}
                  <div
                    style={{
                      borderTop: `1px solid ${divider}`,
                      paddingTop: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 800, color: primaryText }}>
                        {activeStation.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: activeStation.statusColor,
                        }}
                      >
                        ● {activeStation.statusText}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                        fontSize: 11.5,
                      }}
                    >
                      {activeStation.hardware.map((hw, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: mutedText,
                          }}
                        >
                          <span>{hw.name}</span>
                          <span
                            style={{
                              color: hw.ok ? statusSuccess : "#DC2626",
                              fontWeight: 700,
                            }}
                          >
                            {hw.ok ? `✓ ${hw.status}` : `✕ ${hw.status}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: elevated,
                  border: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  color: primaryText,
                  cursor: "pointer",
                  position: "relative",
                }}
                title="Alerts & Notifications"
              >
                <BellIcon />
                <span
                  style={{
                    position: "absolute",
                    top: -3,
                    right: -3,
                    background: primaryOrange,
                    color: "#FFF",
                    fontSize: 10,
                    fontWeight: 900,
                    borderRadius: 999,
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  3
                </span>
              </button>

              {/* Notifications Popover */}
              {notifPopoverOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 46,
                    right: 0,
                    width: 300,
                    background: surface,
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                    zIndex: 100,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: 10,
                      borderBottom: `1px solid ${divider}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      Recent Alerts
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: primaryOrange,
                        fontWeight: 700,
                      }}
                    >
                      3 Unread
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "10px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      fontSize: 12,
                    }}
                  >
                    <div
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        background: elevated,
                      }}
                    >
                      <strong>WB-04 Status</strong>: Degraded response speed
                    </div>
                    <div
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        background: elevated,
                      }}
                    >
                      <strong>Ticket TKT-10248</strong>: High Priority SLA
                      update
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifPopoverOpen(false);
                      onNavigate("alerts");
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      marginTop: 4,
                      borderRadius: 6,
                      background: primaryOrange,
                      color: "#FFF",
                      fontSize: 12,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    View All Alerts
                  </button>
                </div>
              )}
            </div>

            {/* User Profile Component */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  padding: "4px 10px 4px 6px",
                  borderRadius: 10,
                  background: elevated,
                  border: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: primaryOrange,
                    color: "#FFF",
                    fontWeight: 900,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {userInitials}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: primaryText,
                      lineHeight: 1.2,
                    }}
                  >
                    {userName}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: secondaryGold,
                      fontWeight: 700,
                    }}
                  >
                    {roleLabel}
                  </div>
                </div>
                <ChevronDownIcon />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 48,
                    right: 0,
                    width: 220,
                    background: surface,
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                    zIndex: 100,
                    padding: "6px 0",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderBottom: `1px solid ${divider}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      {userName}
                    </div>
                    <div style={{ fontSize: 11, color: mutedText }}>
                      {roleLabel} · Viyan Industries
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate("settings");
                    }}
                    style={menuBtnStyle}
                  >
                    👤 My Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate("settings");
                    }}
                    style={menuBtnStyle}
                  >
                    ⚙ Account Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onToggleDark();
                    }}
                    style={menuBtnStyle}
                  >
                    {dm ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate("auditlogs");
                    }}
                    style={menuBtnStyle}
                  >
                    🛡 Activity
                  </button>
                  <div
                    style={{
                      borderTop: `1px solid ${divider}`,
                      margin: "4px 0",
                    }}
                  />
                  <button
                    type="button"
                    onClick={onLogout}
                    style={{ ...menuBtnStyle, color: "#DC2626" }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT CANVAS ── */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

const menuBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 16px",
  border: "none",
  background: "transparent",
  fontSize: 13,
  fontWeight: 600,
  color: "inherit",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 10,
};
