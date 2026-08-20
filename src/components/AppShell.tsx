import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

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

// ── SVG Icon Helpers ────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function AppShell({
  children,
  activeView,
  userRole = "admin",
  userName = userRole === "admin" ? "Arun Kumar" : userRole === "operator" ? "Ravi Kumar" : userRole === "maintenance" ? "Suresh Tech" : "Rajesh Supervisor",
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
  const secondaryText = dm ? "#CBD5E1" : "#334155";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const divider = dm ? "#374151" : "#F1F5F9";

  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";

  // Sidebar Collapse State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Popover States
  const [stationPopoverOpen, setStationPopoverOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Weighbridge Selector Logic (Role-Aware)
  const isAdmin = userRole === "admin" || userRole === "manager";

  const allWeighbridgesList = [
    { id: "all", name: "All Weighbridges", statusColor: "#16A34A", statusText: "ONLINE" },
    { id: "WB-01", name: "WB-01 — Main Gate", statusColor: "#16A34A", statusText: "ONLINE" },
    { id: "WB-02", name: "WB-02 — North Yard", statusColor: "#2563EB", statusText: "AVAILABLE" },
    { id: "WB-03", name: "WB-03 — Loading Bay", statusColor: "#8B5CF6", statusText: "WEIGHING" },
    { id: "WB-04", name: "WB-04 — Dispatch Gate", statusColor: "#DC2626", statusText: "OFFLINE" },
    { id: "WB-05", name: "WB-05 — Raw Material Yard", statusColor: "#2563EB", statusText: "AVAILABLE" },
  ];

  // Operator only gets assigned weighbridges (e.g., WB-01)
  const availableStations = isAdmin
    ? allWeighbridgesList
    : allWeighbridgesList.filter((w) => w.id === "WB-01");

  const [selectedStationId, setSelectedStationId] = useState<string>(isAdmin ? "all" : "WB-01");
  const currentStation = availableStations.find((s) => s.id === selectedStationId) || availableStations[0];

  // User Initials
  const userInitials = userName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  const roleLabel = isAdmin ? "Administrator" : userRole === "operator" ? "Operator" : userRole === "maintenance" ? "Maintenance" : "Manager";

  // Live Clock State (Updates every 1 second)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateStr = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTimeStr = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours.toString().padStart(2, "0");
    return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
  };

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: bg, color: primaryText, fontFamily: "'Inter', -apple-system, sans-serif" }}>

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
      <div style={{ marginLeft: sidebarWidth, display: "flex", flexDirection: "column", minHeight: "100vh", transition: "margin-left 0.2s ease" }}>

        {/* ── 72px STANDARDIZED GLOBAL TOPBAR ── */}
        <header
          style={{
            height: 72,
            minHeight: 72,
            padding: "0 28px",
            background: topbarBg,
            borderBottom: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            zIndex: 300,
            position: "sticky",
            top: 0,
          }}
        >
          {/* TOPBAR LEFT: LIVE DATE & TIME CLOCK (SHARED FOR ADMIN & OPERATOR) */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600, color: primaryText }}
            aria-label="Current date and time"
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: primaryOrange, display: "inline-block" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: primaryText, fontWeight: 1400, fontSize: 24, fontFamily: "monospace", letterSpacing: "0.02em" }}>
                {formatTimeStr(currentTime)}
              </span>
              <span style={{ color: mutedText, fontSize: 12 }}>|</span>
              <span style={{ color: secondaryText, fontWeight: 1000, fontSize: 20 }}>
                {formatDateStr(currentTime)}
              </span>
            </div>
          </div>

          {/* TOPBAR RIGHT: WEIGHBRIDGE SELECTOR, NOTIFICATIONS & USER PROFILE */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>

            {/* Role-Aware Weighbridge Selector */}
            <div style={{ position: "relative" }}>
              {isAdmin ? (
                <>
                  <button
                    type="button"
                    onClick={() => setStationPopoverOpen(!stationPopoverOpen)}
                    style={{
                      height: 40,
                      padding: "0 14px",
                      borderRadius: 8,
                      background: elevated,
                      border: `1px solid ${border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: primaryText,
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: currentStation.statusColor }} />
                    <span>{currentStation.name}</span>
                    <ChevronDownIcon />
                  </button>

                  {/* Station Selection Popover (Admin Only) */}
                  {stationPopoverOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: 48,
                        right: 0,
                        width: 270,
                        background: surface,
                        borderRadius: 12,
                        border: `1px solid ${border}`,
                        boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                        zIndex: 100,
                        padding: "8px 0",
                      }}
                    >
                      <div style={{ padding: "8px 16px 6px", fontSize: 10.5, fontWeight: 800, color: mutedText, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Select Global Station Context
                      </div>

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {availableStations.map((station) => {
                          const selected = station.id === selectedStationId;
                          return (
                            <button
                              key={station.id}
                              type="button"
                              onClick={() => {
                                setSelectedStationId(station.id);
                                setStationPopoverOpen(false);
                              }}
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                border: "none",
                                background: selected ? (dm ? "rgba(249,115,22,0.15)" : "#FFFBEB") : "transparent",
                                color: selected ? primaryOrange : primaryText,
                                fontSize: 12.5,
                                fontWeight: selected ? 700 : 500,
                                textAlign: "left",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: station.statusColor }} />
                                <span>{station.name}</span>
                              </div>
                              <span style={{ fontSize: 10, fontWeight: 700, color: station.statusColor }}>
                                {station.statusText}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Operator Assigned Station Pill (Static, Non-Interactive) */
                <div
                  style={{
                    height: 40,
                    padding: "0 14px",
                    borderRadius: 8,
                    background: elevated,
                    border: `1px solid ${border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: primaryText,
                  }}
                  title="Assigned Weighbridge Workstation"
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
                  <span>WB-01 — Main Gate</span>
                  <span style={{ color: "#16A34A", fontSize: 11, fontWeight: 800 }}>• ONLINE</span>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
                style={{
                  width: 40,
                  height: 40,
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
                    top: 48,
                    right: 0,
                    width: 300,
                    background: surface,
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    zIndex: 100,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: `1px solid ${divider}` }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: primaryText }}>Notifications</span>
                    <span style={{ fontSize: 11, color: primaryOrange, fontWeight: 700 }}>3 Unread</span>
                  </div>
                  <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                    <div style={{ padding: 8, borderRadius: 6, background: elevated }}>
                      <strong>WB-04 Status</strong>: Hardware indicator connection issue
                    </div>
                    <div style={{ padding: 8, borderRadius: 6, background: elevated }}>
                      <strong>Ticket TKT-10248</strong>: High Priority SLA update
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
                  padding: "4px 12px 4px 6px",
                  height: 40,
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
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: primaryOrange,
                    color: "#FFF",
                    fontWeight: 900,
                    fontSize: 12.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {userInitials}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: primaryText, lineHeight: 1.2 }}>{userName}</div>
                  <div style={{ fontSize: 10.5, color: secondaryGold, fontWeight: 700 }}>{roleLabel}</div>
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
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    zIndex: 100,
                    padding: "6px 0",
                  }}
                >
                  <div style={{ padding: "10px 14px", borderBottom: `1px solid ${divider}` }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: primaryText }}>{userName}</div>
                    <div style={{ fontSize: 11, color: mutedText }}>{roleLabel} · ABC Industries</div>
                  </div>
                  <button type="button" onClick={() => { setProfileDropdownOpen(false); onNavigate("settings"); }} style={menuBtnStyle}>
                    👤 My Profile
                  </button>
                  <button type="button" onClick={() => { setProfileDropdownOpen(false); onNavigate("settings"); }} style={menuBtnStyle}>
                    ⚙ Preferences
                  </button>
                  <button type="button" onClick={() => { setProfileDropdownOpen(false); onToggleDark(); }} style={menuBtnStyle}>
                    {dm ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>
                  <div style={{ borderTop: `1px solid ${divider}`, margin: "4px 0" }} />
                  <button type="button" onClick={onLogout} style={{ ...menuBtnStyle, color: "#DC2626" }}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ── PAGE CONTENT CANVAS ── */}
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
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
  fontSize: 12.5,
  fontWeight: 600,
  color: "inherit",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 10,
};
