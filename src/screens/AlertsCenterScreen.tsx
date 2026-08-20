import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator" | "maintenance";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

interface AlertItem {
  id: string;
  code: string;
  title: string;
  type: string;
  weighbridge: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "UNREAD" | "READ" | "ACKNOWLEDGED" | "RESOLVED";
  time: string;
  source: string;
  description: string;
  relatedTicketId?: string;
  relatedVehicle?: string;
}

export default function AlertsCenterScreen({
  darkMode: dm,
  onToggleDark,
  onNavigate,
}: Props) {
  // Theme Color System
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

  // Testing State
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");

  // Filter & Search State
  const [selectedPriorityTab, setSelectedPriorityTab] = useState<string>("All");
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedWeighbridge, setSelectedWeighbridge] = useState<string>("All");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("Today");

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Detail Modal State
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  // Acknowledge & Resolve Modal States
  const [ackModalAlert, setAckModalAlert] = useState<AlertItem | null>(null);
  const [resolveModalAlert, setResolveModalAlert] = useState<AlertItem | null>(
    null,
  );
  const [resolutionNote, setResolutionNote] = useState<string>("");

  // Sample Operational Alerts Data
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "ALT-001",
      code: "ALT-98201",
      title: "WB-02 Weighbridge Offline",
      type: "Weighbridge Offline",
      weighbridge: "WB-02",
      priority: "CRITICAL",
      status: "UNREAD",
      time: "2 min ago",
      source: "System",
      description:
        "Scale controller lost heartbeat network ping. Automatic fallback activated.",
      relatedTicketId: "TKT-10248",
      relatedVehicle: "TN 20 AB 1234",
    },
    {
      id: "ALT-002",
      code: "ALT-98200",
      title: "Indicator Controller Disconnected",
      type: "Indicator Error",
      weighbridge: "WB-04",
      priority: "HIGH",
      status: "ACKNOWLEDGED",
      time: "8 min ago",
      source: "Indicator",
      description: "RS-485 serial communication timed out after 3 retries.",
      relatedTicketId: "TKT-10245",
    },
    {
      id: "ALT-003",
      code: "ALT-98199",
      title: "ANPR Camera Stream Lost",
      type: "Camera Offline",
      weighbridge: "WB-01",
      priority: "HIGH",
      status: "UNREAD",
      time: "14 min ago",
      source: "Camera",
      description: "IP camera RTSP stream dropped connection on Gate entrance.",
    },
    {
      id: "ALT-004",
      code: "ALT-98198",
      title: "Vehicle Overweight Alert (+4.2 TON)",
      type: "Overweight",
      weighbridge: "WB-03",
      priority: "HIGH",
      status: "UNREAD",
      time: "18 min ago",
      source: "Scale Sensor",
      description:
        "Gross weight 44,200 KG exceeds legal axle limit of 40,000 KG.",
      relatedVehicle: "KA 04 MP 9988",
    },
    {
      id: "ALT-005",
      code: "ALT-98197",
      title: "Thermal Ticket Printer Low Paper",
      type: "Printer Error",
      weighbridge: "WB-03",
      priority: "MEDIUM",
      status: "READ",
      time: "24 min ago",
      source: "Printer",
      description:
        "Paper roll capacity estimated below 10%. Replacement recommended.",
    },
    {
      id: "ALT-006",
      code: "ALT-98196",
      title: "Scheduled Load Cell Maintenance Due",
      type: "Maintenance",
      weighbridge: "WB-05",
      priority: "LOW",
      status: "RESOLVED",
      time: "1 hr ago",
      source: "System",
      description: "Monthly calibration check scheduled for WB-05.",
    },
    {
      id: "ALT-007",
      code: "ALT-98195",
      title: "Barrier Gate Sensor Blocked",
      type: "Security",
      weighbridge: "WB-01",
      priority: "MEDIUM",
      status: "RESOLVED",
      time: "2 hrs ago",
      source: "Barrier",
      description: "IR safety beam obstructed for over 120 seconds.",
    },
    {
      id: "ALT-008",
      code: "ALT-98194",
      title: "Duplicate Weighment Attempt Detected",
      type: "Transaction Error",
      weighbridge: "WB-02",
      priority: "MEDIUM",
      status: "READ",
      time: "3 hrs ago",
      source: "System",
      description:
        "Vehicle TN 38 AB 4821 attempted second initial weighment without exiting.",
    },
  ]);

  // Filtering Logic
  const filteredAlerts = alerts.filter((a) => {
    // Role permissions check
    if (
      role === "operator" &&
      a.priority === "CRITICAL" &&
      a.source === "System"
    ) {
      // Operators don't see system-level core errors if restricted
    }

    if (
      selectedPriorityTab !== "All" &&
      a.priority !== selectedPriorityTab.toUpperCase()
    )
      return false;
    if (
      selectedStatusTab !== "All" &&
      a.status !== selectedStatusTab.toUpperCase()
    )
      return false;
    if (selectedType !== "All" && a.type !== selectedType) return false;
    if (selectedWeighbridge !== "All" && a.weighbridge !== selectedWeighbridge)
      return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        a.code.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.weighbridge.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        (a.relatedVehicle && a.relatedVehicle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // KPI Calculations
  const totalCount = alerts.length;
  const criticalCount = alerts.filter((a) => a.priority === "CRITICAL").length;
  const unreadCount = alerts.filter((a) => a.status === "UNREAD").length;
  const ackCount = alerts.filter((a) => a.status === "ACKNOWLEDGED").length;
  const resolvedCount = alerts.filter((a) => a.status === "RESOLVED").length;

  // Handlers
  const handleMarkAllAsRead = () => {
    setAlerts(
      alerts.map((a) => (a.status === "UNREAD" ? { ...a, status: "READ" } : a)),
    );
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" } : a)),
    );
    setAckModalAlert(null);
  };

  const handleResolveAlert = () => {
    if (!resolveModalAlert) return;
    setAlerts(
      alerts.map((a) =>
        a.id === resolveModalAlert.id ? { ...a, status: "RESOLVED" } : a,
      ),
    );
    setResolveModalAlert(null);
    setResolutionNote("");
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAlerts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAlerts.map((a) => a.id));
    }
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
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: bg,
          color: primaryText,
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* ACKNOWLEDGE MODAL */}
        {ackModalAlert && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 440,
                background: surface,
                borderRadius: 14,
                border: `1px solid ${border}`,
                padding: 24,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 18,
                  fontWeight: 800,
                  color: primaryText,
                }}
              >
                ACKNOWLEDGE ALERT
              </h3>
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: 13,
                  color: secondaryText,
                }}
              >
                Acknowledge <strong>{ackModalAlert.code}</strong> (
                {ackModalAlert.title}) to record that this alert is currently
                being investigated?
              </p>
              <div
                style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
              >
                <button
                  onClick={() => setAckModalAlert(null)}
                  style={{
                    height: 38,
                    padding: "0 14px",
                    borderRadius: 8,
                    background: elevated,
                    border: `1px solid ${border}`,
                    color: primaryText,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAcknowledge(ackModalAlert.id)}
                  style={{
                    height: 38,
                    padding: "0 18px",
                    borderRadius: 8,
                    background: primaryOrange,
                    color: "#FFF",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Acknowledge Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESOLVE MODAL */}
        {resolveModalAlert && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 480,
                background: surface,
                borderRadius: 14,
                border: `1px solid ${border}`,
                padding: 24,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 18,
                  fontWeight: 800,
                  color: primaryText,
                }}
              >
                RESOLVE ALERT
              </h3>
              <p
                style={{
                  margin: "0 0 14px 0",
                  fontSize: 13,
                  color: secondaryText,
                }}
              >
                Provide operational resolution notes before closing{" "}
                <strong>{resolveModalAlert.code}</strong>.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <label
                  style={{ fontSize: 11, fontWeight: 700, color: mutedText }}
                >
                  RESOLUTION DETAILS *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe corrective action taken..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    background: inputBg,
                    color: primaryText,
                    border: `1px solid ${border}`,
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div
                style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
              >
                <button
                  onClick={() => setResolveModalAlert(null)}
                  style={{
                    height: 38,
                    padding: "0 14px",
                    borderRadius: 8,
                    background: elevated,
                    border: `1px solid ${border}`,
                    color: primaryText,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveAlert}
                  disabled={!resolutionNote.trim()}
                  style={{
                    height: 38,
                    padding: "0 18px",
                    borderRadius: 8,
                    background: statusSuccess,
                    color: "#FFF",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: resolutionNote.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Mark Alert Resolved
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALERT DETAIL DRAWER */}
        {selectedAlert && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 900,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                width: 500,
                height: "100%",
                background: surface,
                borderLeft: `1px solid ${border}`,
                padding: 28,
                boxShadow: "-10px 0 30px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: primaryOrange,
                      fontWeight: 800,
                    }}
                  >
                    {selectedAlert.code}
                  </span>
                  <h3
                    style={{
                      margin: "2px 0 0 0",
                      fontSize: 18,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    {selectedAlert.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  style={{
                    background: "none",
                    border: 0,
                    color: mutedText,
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 800,
                    background:
                      selectedAlert.priority === "CRITICAL"
                        ? dm
                          ? "rgba(220,38,38,0.15)"
                          : "#FEF2F2"
                        : primaryOrangeSoft,
                    color:
                      selectedAlert.priority === "CRITICAL"
                        ? statusError
                        : primaryOrange,
                  }}
                >
                  ● {selectedAlert.priority}
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 800,
                    background:
                      selectedAlert.status === "RESOLVED"
                        ? dm
                          ? "rgba(22,163,74,0.15)"
                          : "#F0FDF4"
                        : dm
                          ? "rgba(245,158,11,0.15)"
                          : "#FFFBEB",
                    color:
                      selectedAlert.status === "RESOLVED"
                        ? statusSuccess
                        : statusWarning,
                  }}
                >
                  ● {selectedAlert.status}
                </span>
              </div>

              <div
                style={{
                  background: elevated,
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  padding: 16,
                  fontSize: 13,
                  color: primaryText,
                  lineHeight: 1.5,
                }}
              >
                {selectedAlert.description}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  fontSize: 12.5,
                }}
              >
                <div>
                  <span
                    style={{
                      color: mutedText,
                      fontSize: 11,
                      fontWeight: 700,
                      display: "block",
                    }}
                  >
                    WEIGHBRIDGE
                  </span>
                  <strong>{selectedAlert.weighbridge}</strong>
                </div>
                <div>
                  <span
                    style={{
                      color: mutedText,
                      fontSize: 11,
                      fontWeight: 700,
                      display: "block",
                    }}
                  >
                    ALERT TYPE
                  </span>
                  <strong>{selectedAlert.type}</strong>
                </div>
                <div>
                  <span
                    style={{
                      color: mutedText,
                      fontSize: 11,
                      fontWeight: 700,
                      display: "block",
                    }}
                  >
                    DETECTED SOURCE
                  </span>
                  <strong>{selectedAlert.source}</strong>
                </div>
                <div>
                  <span
                    style={{
                      color: mutedText,
                      fontSize: 11,
                      fontWeight: 700,
                      display: "block",
                    }}
                  >
                    TRIGGERED TIME
                  </span>
                  <strong>{selectedAlert.time}</strong>
                </div>
              </div>

              {selectedAlert.relatedTicketId && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: primaryOrangeSoft,
                    border: `1px solid ${primaryOrange}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: mutedText,
                        fontWeight: 700,
                      }}
                    >
                      LINKED TICKET
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: primaryOrange,
                        fontFamily: "monospace",
                      }}
                    >
                      {selectedAlert.relatedTicketId}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate("ticket-detail")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: primaryOrange,
                      color: "#FFF",
                      border: "none",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    View Ticket
                  </button>
                </div>
              )}

              <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16 }}>
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: 13,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  ALERT EVENT LOG
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    paddingLeft: 8,
                    borderLeft: `2px solid ${divider}`,
                  }}
                >
                  <div style={{ fontSize: 11, color: mutedText }}>
                    {selectedAlert.time} · Alert triggered by system monitor
                  </div>
                  <div style={{ fontSize: 11, color: mutedText }}>
                    1 min ago · Status updated to {selectedAlert.status}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  gap: 10,
                  borderTop: `1px solid ${border}`,
                  paddingTop: 16,
                }}
              >
                {selectedAlert.status !== "ACKNOWLEDGED" &&
                  selectedAlert.status !== "RESOLVED" && (
                    <button
                      onClick={() => {
                        setSelectedAlert(null);
                        setAckModalAlert(selectedAlert);
                      }}
                      style={{
                        flex: 1,
                        height: 40,
                        borderRadius: 8,
                        background: secondaryGold,
                        color: "#FFF",
                        border: "none",
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Acknowledge Alert
                    </button>
                  )}
                {selectedAlert.status !== "RESOLVED" && (
                  <button
                    onClick={() => {
                      setSelectedAlert(null);
                      setResolveModalAlert(selectedAlert);
                    }}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 8,
                      background: statusSuccess,
                      color: "#FFF",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Resolve Alert
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            flex: 1,
            maxWidth: 1440,
            width: "100%",
            margin: "0 auto",
            background: surface,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* PAGE HEADER */}
          <header
            style={{
              height: 68,
              padding: "0 32px",
              background: surface,
              borderBottom: `1px solid ${border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: mutedText,
                  fontWeight: 600,
                  marginBottom: 2,
                  display: "flex",
                  gap: 6,
                }}
              >
                <span>Alerts</span>
                <span>/</span>
                <span style={{ color: primaryOrange }}>Alerts Center</span>
              </div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  margin: 0,
                  color: primaryText,
                  letterSpacing: "-0.01em",
                }}
              >
                ALERTS CENTER
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  height: 42,
                  padding: "0 18px",
                  borderRadius: 8,
                  background: secondaryGoldSoft,
                  color: secondaryGold,
                  border: `1px solid ${secondaryGold}`,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✓ Mark All as Read
              </button>
              {role === "admin" && (
                <button
                  onClick={() => alert("Exporting alerts report...")}
                  style={{
                    height: 42,
                    padding: "0 16px",
                    borderRadius: 8,
                    background: elevated,
                    color: primaryText,
                    border: `1px solid ${border}`,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Export CSV
                </button>
              )}
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <div
            style={{
              flex: 1,
              padding: "24px 32px 48px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              overflowY: "auto",
            }}
          >
            {/* 5-CARD KPI SUMMARY ROW */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 16,
              }}
            >
              {[
                {
                  label: "TOTAL ALERTS",
                  val: totalCount,
                  sub: "All accessible alerts",
                  color: primaryText,
                  accent: primaryOrange,
                },
                {
                  label: "CRITICAL",
                  val: criticalCount,
                  sub: "Immediate attention",
                  color: statusError,
                  accent: statusError,
                },
                {
                  label: "UNREAD",
                  val: unreadCount,
                  sub: "Requires review",
                  color: statusWarning,
                  accent: statusWarning,
                },
                {
                  label: "ACKNOWLEDGED",
                  val: ackCount,
                  sub: "Being handled",
                  color: statusInfo,
                  accent: statusInfo,
                },
                {
                  label: "RESOLVED",
                  val: resolvedCount,
                  sub: "Completed alerts",
                  color: statusSuccess,
                  accent: statusSuccess,
                },
              ].map((kpi, i) => (
                <div
                  key={i}
                  style={{
                    background: surface,
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    padding: 18,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 4,
                      height: "100%",
                      background: kpi.accent,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: mutedText,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {kpi.label}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      color: kpi.color,
                      marginTop: 4,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {kpi.val}
                  </div>
                  <div style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>
                    {kpi.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* CRITICAL ALERTS BANNER (If Critical > 0) */}
            {criticalCount > 0 && (
              <div
                style={{
                  background: dm ? "rgba(220,38,38,0.12)" : "#FEF2F2",
                  border: `1px solid ${statusError}`,
                  borderRadius: 12,
                  padding: "14px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18, color: statusError }}>⚠️</span>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: statusError,
                      }}
                    >
                      CRITICAL ALERTS REQUIRING IMMEDIATE ATTENTION (
                      {criticalCount})
                    </div>
                    <div style={{ fontSize: 12, color: secondaryText }}>
                      WB-02 Weighbridge Offline and 5 other critical system
                      events need operator intervention.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPriorityTab("Critical")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    background: statusError,
                    color: "#FFF",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  View Critical Alerts
                </button>
              </div>
            )}

            {/* PRIORITY & STATUS SEGMENTED TABS ROW */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              {/* Priority Tabs */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: elevated,
                  padding: 4,
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: mutedText,
                    padding: "0 8px",
                  }}
                >
                  PRIORITY:
                </span>
                {["All", "Critical", "High", "Medium", "Low"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriorityTab(p)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "none",
                      background:
                        selectedPriorityTab === p
                          ? primaryOrange
                          : "transparent",
                      color:
                        selectedPriorityTab === p ? "#FFFFFF" : secondaryText,
                      fontSize: 12,
                      fontWeight: selectedPriorityTab === p ? 800 : 600,
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Status Tabs */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: elevated,
                  padding: 4,
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: mutedText,
                    padding: "0 8px",
                  }}
                >
                  STATUS:
                </span>
                {["All", "Unread", "Read", "Acknowledged", "Resolved"].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStatusTab(s)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        background:
                          selectedStatusTab === s
                            ? secondaryGold
                            : "transparent",
                        color:
                          selectedStatusTab === s ? "#FFFFFF" : secondaryText,
                        fontSize: 12,
                        fontWeight: selectedStatusTab === s ? 800 : 600,
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* FILTER & SEARCH CONTAINER CARD */}
            <div
              style={{
                background: surface,
                borderRadius: 14,
                border: `1px solid ${border}`,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                {/* Search Field */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 42,
                    background: inputBg,
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    padding: "0 12px",
                  }}
                >
                  <span style={{ color: mutedText, marginRight: 8 }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search alert ID, title, weighbridge, vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: primaryText,
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>

                {/* Alert Type Dropdown */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    height: 42,
                    background: inputBg,
                    color: primaryText,
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    padding: "0 10px",
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="All">All Alert Types</option>
                  <option value="Weighbridge Offline">
                    Weighbridge Offline
                  </option>
                  <option value="Indicator Error">Indicator Error</option>
                  <option value="Camera Offline">Camera Offline</option>
                  <option value="Overweight">Overweight</option>
                  <option value="Printer Error">Printer Error</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Security">Security</option>
                  <option value="Transaction Error">Transaction Error</option>
                </select>

                {/* Weighbridge Dropdown */}
                <select
                  value={selectedWeighbridge}
                  onChange={(e) => setSelectedWeighbridge(e.target.value)}
                  style={{
                    height: 42,
                    background: inputBg,
                    color: primaryText,
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    padding: "0 10px",
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="All">All Weighbridges</option>
                  <option value="WB-01">WB-01</option>
                  <option value="WB-02">WB-02</option>
                  <option value="WB-03">WB-03</option>
                  <option value="WB-04">WB-04</option>
                  <option value="WB-05">WB-05</option>
                </select>

                {/* Date Range Dropdown */}
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  style={{
                    height: 42,
                    background: inputBg,
                    color: primaryText,
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    padding: "0 10px",
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>

              {/* ACTIVE FILTER CHIPS */}
              {(selectedPriorityTab !== "All" ||
                selectedStatusTab !== "All" ||
                selectedType !== "All" ||
                selectedWeighbridge !== "All" ||
                searchTerm) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    paddingTop: 8,
                    borderTop: `1px solid ${divider}`,
                  }}
                >
                  <span
                    style={{ fontSize: 11, fontWeight: 700, color: mutedText }}
                  >
                    ACTIVE FILTERS:
                  </span>
                  {selectedPriorityTab !== "All" && (
                    <span
                      style={chipStyle}
                    >{`Priority: ${selectedPriorityTab}`}</span>
                  )}
                  {selectedStatusTab !== "All" && (
                    <span
                      style={chipStyle}
                    >{`Status: ${selectedStatusTab}`}</span>
                  )}
                  {selectedType !== "All" && (
                    <span style={chipStyle}>{`Type: ${selectedType}`}</span>
                  )}
                  {selectedWeighbridge !== "All" && (
                    <span
                      style={chipStyle}
                    >{`Scale: ${selectedWeighbridge}`}</span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPriorityTab("All");
                      setSelectedStatusTab("All");
                      setSelectedType("All");
                      setSelectedWeighbridge("All");
                      setSearchTerm("");
                    }}
                    style={{
                      background: "none",
                      border: 0,
                      color: primaryOrange,
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                      marginLeft: 4,
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* MAIN ALERTS TABLE CARD */}
            <div
              style={{
                background: surface,
                borderRadius: 14,
                border: `1px solid ${border}`,
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: elevated,
                      borderBottom: `1px solid ${border}`,
                    }}
                  >
                    <th style={{ padding: "14px 16px", width: 36 }}>
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === filteredAlerts.length &&
                          filteredAlerts.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th style={thStyle}>PRIORITY</th>
                    <th style={thStyle}>ALERT TITLE</th>
                    <th style={thStyle}>WEIGHBRIDGE</th>
                    <th style={thStyle}>TYPE</th>
                    <th style={thStyle}>STATUS</th>
                    <th style={thStyle}>TIME</th>
                    <th style={thStyle}>SOURCE</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAlerts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          padding: 48,
                          textAlign: "center",
                          color: mutedText,
                        }}
                      >
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: primaryText,
                          }}
                        >
                          No Operational Alerts Found
                        </div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                          There are no alerts matching the selected filters.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAlerts.map((row) => {
                      const isMenuOpen = activeMenuId === row.id;

                      // Priority badges
                      const prColor =
                        row.priority === "CRITICAL"
                          ? statusError
                          : row.priority === "HIGH"
                            ? primaryOrange
                            : row.priority === "MEDIUM"
                              ? statusWarning
                              : mutedText;
                      const prBg =
                        row.priority === "CRITICAL"
                          ? dm
                            ? "rgba(220,38,38,0.15)"
                            : "#FEF2F2"
                          : row.priority === "HIGH"
                            ? primaryOrangeSoft
                            : dm
                              ? "rgba(245,158,11,0.15)"
                              : "#FFFBEB";

                      // Status styling
                      const stColor =
                        row.status === "RESOLVED"
                          ? statusSuccess
                          : row.status === "ACKNOWLEDGED"
                            ? statusInfo
                            : row.status === "UNREAD"
                              ? statusError
                              : secondaryText;
                      const stBg =
                        row.status === "RESOLVED"
                          ? dm
                            ? "rgba(22,163,74,0.15)"
                            : "#F0FDF4"
                          : row.status === "ACKNOWLEDGED"
                            ? dm
                              ? "rgba(37,99,235,0.15)"
                              : "#EFF6FF"
                            : row.status === "UNREAD"
                              ? dm
                                ? "rgba(220,38,38,0.12)"
                                : "#FEF2F2"
                              : elevated;

                      return (
                        <tr
                          key={row.id}
                          style={{
                            borderBottom: `1px solid ${divider}`,
                            cursor: "pointer",
                            transition: "background 0.15s ease",
                            background:
                              row.status === "UNREAD"
                                ? dm
                                  ? "rgba(251,146,60,0.04)"
                                  : "#FFFBF5"
                                : "transparent",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = elevated)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              row.status === "UNREAD"
                                ? dm
                                  ? "rgba(251,146,60,0.04)"
                                  : "#FFFBF5"
                                : "transparent")
                          }
                          onClick={() => setSelectedAlert(row)}
                        >
                          <td
                            style={{ padding: "14px 16px" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(row.id)}
                              onChange={() => handleToggleSelect(row.id)}
                            />
                          </td>

                          {/* Priority */}
                          <td style={tdStyle}>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 800,
                                background: prBg,
                                color: prColor,
                              }}
                            >
                              ● {row.priority}
                            </span>
                          </td>

                          {/* Title */}
                          <td style={tdStyle}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              {row.status === "UNREAD" && (
                                <span
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 999,
                                    background: primaryOrange,
                                  }}
                                />
                              )}
                              <div>
                                <div
                                  style={{
                                    fontSize: 13.5,
                                    fontWeight: 800,
                                    color: primaryText,
                                  }}
                                >
                                  {row.title}
                                </div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: mutedText,
                                    marginTop: 1,
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {row.code}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Weighbridge */}
                          <td style={tdStyle}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: elevated,
                                border: `1px solid ${border}`,
                                fontSize: 11,
                                fontWeight: 700,
                                color: primaryText,
                              }}
                            >
                              {row.weighbridge}
                            </span>
                          </td>

                          {/* Type */}
                          <td
                            style={{
                              ...tdStyle,
                              fontSize: 12.5,
                              color: secondaryText,
                            }}
                          >
                            {row.type}
                          </td>

                          {/* Status */}
                          <td style={tdStyle}>
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 800,
                                background: stBg,
                                color: stColor,
                              }}
                            >
                              ● {row.status}
                            </span>
                          </td>

                          {/* Time */}
                          <td
                            style={{
                              ...tdStyle,
                              fontSize: 12,
                              color: mutedText,
                            }}
                          >
                            {row.time}
                          </td>

                          {/* Source */}
                          <td
                            style={{
                              ...tdStyle,
                              fontSize: 12,
                              color: secondaryText,
                            }}
                          >
                            {row.source}
                          </td>

                          {/* Actions */}
                          <td
                            style={{ ...tdStyle, textAlign: "right" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: 6,
                                justifyContent: "flex-end",
                                position: "relative",
                              }}
                            >
                              <button
                                onClick={() => setSelectedAlert(row)}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  border: `1px solid ${border}`,
                                  background: surface,
                                  color: primaryOrange,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  setActiveMenuId(isMenuOpen ? null : row.id)
                                }
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  border: `1px solid ${border}`,
                                  background: surface,
                                  color: secondaryText,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                •••
                              </button>

                              {/* Dropdown Menu */}
                              {isMenuOpen && (
                                <div
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: 32,
                                    width: 180,
                                    background: surface,
                                    borderRadius: 8,
                                    border: `1px solid ${border}`,
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                                    zIndex: 50,
                                    padding: "6px 0",
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setSelectedAlert(row);
                                    }}
                                    style={menuBtnStyle(false)}
                                  >
                                    View Details
                                  </button>
                                  {row.status !== "ACKNOWLEDGED" &&
                                    row.status !== "RESOLVED" && (
                                      <button
                                        onClick={() => {
                                          setActiveMenuId(null);
                                          setAckModalAlert(row);
                                        }}
                                        style={menuBtnStyle(false)}
                                      >
                                        Acknowledge
                                      </button>
                                    )}
                                  {row.status !== "RESOLVED" && (
                                    <button
                                      onClick={() => {
                                        setActiveMenuId(null);
                                        setResolveModalAlert(row);
                                      }}
                                      style={menuBtnStyle(false)}
                                    >
                                      Resolve Alert
                                    </button>
                                  )}
                                  {row.relatedTicketId && (
                                    <button
                                      onClick={() => {
                                        setActiveMenuId(null);
                                        onNavigate("ticket-detail");
                                      }}
                                      style={menuBtnStyle(false)}
                                    >
                                      Open Linked Ticket
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onNavigate("monitoring");
                                    }}
                                    style={menuBtnStyle(false)}
                                  >
                                    View Weighbridge
                                  </button>
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

              {/* PAGINATION */}
              <div
                style={{
                  padding: "14px 24px",
                  borderTop: `1px solid ${border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12,
                  color: secondaryText,
                }}
              >
                <div>
                  Showing 1–{filteredAlerts.length} of {totalCount} alerts
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    disabled
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background: elevated,
                      color: mutedText,
                      fontSize: 12,
                    }}
                  >
                    Previous
                  </button>
                  <button
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: `1px solid ${primaryOrange}`,
                      background: primaryOrange,
                      color: "#FFF",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    1
                  </button>
                  <button
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background: surface,
                      color: primaryText,
                      fontSize: 12,
                    }}
                  >
                    2
                  </button>
                  <button
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background: surface,
                      color: primaryText,
                      fontSize: 12,
                    }}
                  >
                    Next
                  </button>
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
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: bg,
          color: primaryText,
          fontFamily: "'Inter', -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP MOBILE BAR */}
        <header
          style={{
            background: dm ? "#1F2937" : "#0F172A",
            borderBottom: `1px solid ${border}`,
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F9FAFB" }}>
            SCREEN 47 — ALERTS CENTER
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setViewDevice("desktop")}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#94A3B8",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              💻
            </button>
            <button
              onClick={onToggleDark}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#94A3B8",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {dm ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 0 40px",
          }}
        >
          <div
            style={{
              width: 390,
              minHeight: 844,
              background: surface,
              borderRadius: 24,
              border: `1px solid ${border}`,
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Mobile Header */}
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => onNavigate("dashboard")}
                style={{
                  background: "none",
                  border: 0,
                  color: primaryOrange,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <span
                style={{ fontSize: 15, fontWeight: 800, color: primaryText }}
              >
                Alerts Center
              </span>
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  background: "none",
                  border: 0,
                  color: secondaryGold,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Read All
              </button>
            </div>

            {/* Content Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 16px 80px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Mobile Summary Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: elevated,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{ fontSize: 10, fontWeight: 800, color: mutedText }}
                  >
                    CRITICAL ALERTS
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: statusError,
                      marginTop: 2,
                    }}
                  >
                    {criticalCount}
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: elevated,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{ fontSize: 10, fontWeight: 800, color: mutedText }}
                  >
                    UNREAD ALERTS
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: statusWarning,
                      marginTop: 2,
                    }}
                  >
                    {unreadCount}
                  </div>
                </div>
              </div>

              {/* Mobile Search */}
              <div
                style={{
                  height: 42,
                  background: inputBg,
                  border: `1px solid ${border}`,
                  borderRadius: 8,
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: mutedText, marginRight: 8 }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: primaryText,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* Mobile Alert Cards */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {filteredAlerts.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedAlert(card)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      background: elevated,
                      border: `1px solid ${border}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      cursor: "pointer",
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
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 800,
                          background:
                            card.priority === "CRITICAL"
                              ? dm
                                ? "rgba(220,38,38,0.15)"
                                : "#FEF2F2"
                              : primaryOrangeSoft,
                          color:
                            card.priority === "CRITICAL"
                              ? statusError
                              : primaryOrange,
                        }}
                      >
                        ● {card.priority}
                      </span>
                      <span style={{ fontSize: 11, color: mutedText }}>
                        {card.time}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      {card.title}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        color: secondaryText,
                      }}
                    >
                      <span>
                        Scale: <strong>{card.weighbridge}</strong>
                      </span>
                      <span>
                        Type: <strong>{card.type}</strong>
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 6,
                        borderTop: `1px solid ${divider}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color:
                            card.status === "RESOLVED"
                              ? statusSuccess
                              : statusWarning,
                        }}
                      >
                        ● {card.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlert(card);
                        }}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: primaryOrange,
                          color: "#FFF",
                          border: "none",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        View Alert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: surface,
                borderTop: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              {[
                { icon: "🏠", label: "Home" },
                { icon: "秤", label: "Weigh" },
                { icon: "📜", label: "Transactions" },
                { icon: "🔔", label: "Alerts" },
                { icon: "•••", label: "More" },
              ].map((nav, i) => (
                <button
                  key={i}
                  style={{
                    background: "none",
                    border: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    color: i === 3 ? primaryOrange : mutedText,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{nav.icon}</span>
                  <span
                    style={{ fontSize: 10, fontWeight: i === 3 ? 700 : 500 }}
                  >
                    {nav.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Helpers
const thStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 11,
  fontWeight: 800,
  color: "#6B7280",
  letterSpacing: "0.05em",
};
const tdStyle: React.CSSProperties = {
  padding: "14px",
  fontSize: 13,
  borderBottom: "1px solid #E2E8F0",
};
const chipStyle: React.CSSProperties = {
  padding: "3px 8px",
  borderRadius: 6,
  background: "#FFF7ED",
  color: "#F97316",
  fontSize: 11,
  fontWeight: 700,
  border: "1px solid #F97316",
};
const menuBtnStyle = (danger: boolean): React.CSSProperties => ({
  padding: "8px 12px",
  border: "none",
  background: "transparent",
  color: danger ? "#DC2626" : "#111827",
  fontSize: 12,
  fontWeight: 600,
  textAlign: "left",
  cursor: "pointer",
});
