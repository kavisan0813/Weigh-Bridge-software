import React, { useState } from "react";

type ViewDevice = "desktop" | "mobile";
type UserRole = "admin" | "operator" | "maintenance";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function TicketDetailScreen({
  darkMode: dm,
  onToggleDark,
  onNavigate,
}: Props) {
  // Palettes & System tokens
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
  const statusSuccess = "#16A34A";
  const statusWarning = "#F59E0B";
  const statusError = "#DC2626";

  // State
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [activeView, setActiveView] = useState<"detail" | "printable">(
    "detail",
  );

  const [ticketStatus, setTicketStatus] = useState<
    "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  >("OPEN");
  const [ticketPriority, setTicketPriority] = useState<
    "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  >("HIGH");
  const [assignee, setAssignee] = useState("Raj Kumar");

  // Comments
  const [comments, setComments] = useState([
    {
      author: "Raj Kumar",
      role: "Maintenance Tech",
      time: "20 Aug 2026 · 11:24 AM",
      text: "Checked the communication cable connection. Connection appears unstable near the terminal block.",
    },
    {
      author: "Rithick Nathan",
      role: "Weighbridge Operator",
      time: "20 Aug 2026 · 10:12 AM",
      text: "Restarted the indicator controller twice. The display stays at zero even when vehicle is positioned on scale.",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  // Modals
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        author:
          role === "admin"
            ? "Admin User"
            : role === "operator"
              ? "Rithick Nathan"
              : "Raj Kumar",
        role: role.toUpperCase(),
        time: "Just now",
        text: newComment.trim(),
      },
    ]);
    setNewComment("");
  };

  const handleResolve = () => {
    setTicketStatus("RESOLVED");
    setResolveModalOpen(false);
    setComments([
      ...comments,
      {
        author: "Raj Kumar",
        role: "Maintenance Tech",
        time: "Just now",
        text: `[TICKET RESOLVED] ${resolutionSummary}: ${resolutionNotes}`,
      },
    ]);
  };

  if (activeView === "printable") {
    return renderPrintableView();
  }

  if (viewDevice === "mobile") {
    return renderMobileView();
  }

  return renderDesktopView();

  /* ─────────────────────────────────────────────────────────────────── */
  /*  PRINTABLE TICKET VIEW (A4 PORTRAIT)                               */
  /* ─────────────────────────────────────────────────────────────────── */
  function renderPrintableView() {
    return (
      <div
        style={{
          background: "#525659",
          minHeight: "100vh",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* PRINT ACTION BAR */}
        <div
          style={{
            width: 800,
            background: "#1E293B",
            borderRadius: "12px 12px 0 0",
            padding: "14px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#FFF",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: "#FB923C" }}>
              PRINTABLE TICKET PREVIEW
            </span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>
              A4 Standard Format
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: "#F97316",
                color: "#FFF",
                border: "none",
                fontWeight: 800,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              🖨 Print Now
            </button>
            <button
              onClick={() => alert("Downloading PDF...")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: "#C99A2E",
                color: "#FFF",
                border: "none",
                fontWeight: 800,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              📥 Download PDF
            </button>
            <button
              onClick={() => setActiveView("detail")}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                background: "#334155",
                color: "#FFF",
                border: "none",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ✕ Close Preview
            </button>
          </div>
        </div>

        {/* A4 PAPER CANVAS */}
        <div
          style={{
            width: 800,
            background: "#FFFFFF",
            color: "#111827",
            padding: "48px 56px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            boxSizing: "border-box",
          }}
        >
          {/* Printable Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "2px solid #0F2438",
              paddingBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#0F2438",
                  letterSpacing: "-0.01em",
                }}
              >
                Viyan INDUSTRIES WEIGHBRIDGE SYSTEM
              </div>
              <div style={{ fontSize: 12, color: "#4B5563", marginTop: 2 }}>
                OPERATIONAL SUPPORT & MAINTENANCE TICKET REPORT
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#F97316",
                  fontFamily: "monospace",
                }}
              >
                TKT-10248
              </div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>
                Generated: 20 Aug 2026 · 11:30 AM
              </div>
            </div>
          </div>

          {/* Ticket Title & Status Banner */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              padding: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                WB-02 Indicator Not Reading
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                Weighbridge: <strong>WB-02</strong> · Category:{" "}
                <strong>Indicator</strong>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "#FFFBEB",
                  color: "#F59E0B",
                  fontWeight: 800,
                  fontSize: 11,
                  border: "1px solid #F59E0B",
                }}
              >
                ● {ticketStatus}
              </span>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "#FFF7ED",
                  color: "#F97316",
                  fontWeight: 800,
                  fontSize: 11,
                  border: "1px solid #F97316",
                }}
              >
                ● {ticketPriority}
              </span>
            </div>
          </div>

          {/* Key Information Grid */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #E2E8F0",
              fontSize: 12,
            }}
          >
            <tbody>
              <tr style={{ background: "#F8FAFC" }}>
                <td style={printTdKey}>Reported By:</td>
                <td style={printTdVal}>Rithick Nathan (Operator)</td>
                <td style={printTdKey}>Assigned To:</td>
                <td style={printTdVal}>{assignee} (Maintenance)</td>
              </tr>
              <tr>
                <td style={printTdKey}>Created Date:</td>
                <td style={printTdVal}>20 Aug 2026 · 09:42 AM</td>
                <td style={printTdKey}>Target SLA:</td>
                <td style={printTdVal}>02h 18m remaining (Within SLA)</td>
              </tr>
              <tr style={{ background: "#F8FAFC" }}>
                <td style={printTdKey}>Subcategory:</td>
                <td style={printTdVal}>Weight Display Indicator</td>
                <td style={printTdKey}>Last Updated:</td>
                <td style={printTdVal}>20 Aug 2026 · 11:24 AM</td>
              </tr>
            </tbody>
          </table>

          {/* Description */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#4B5563",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Issue Description
            </div>
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                padding: 14,
                fontSize: 13,
                color: "#111827",
                lineHeight: 1.5,
              }}
            >
              The WB-02 weight indicator is not displaying current vehicle
              weight. Operator reports that the indicator remains at zero after
              vehicle positioning. Power supply is connected and active.
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#4B5563",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Troubleshooting Checklist
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#F1F5F9" }}>
                  <th style={printTh}>Step</th>
                  <th style={printTh}>Description</th>
                  <th style={printTh}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={printTd}>1</td>
                  <td style={printTd}>
                    Check indicator power connection and supply voltage
                  </td>
                  <td style={{ ...printTd, fontWeight: 700, color: "#16A34A" }}>
                    ✓ Completed
                  </td>
                </tr>
                <tr>
                  <td style={printTd}>2</td>
                  <td style={printTd}>
                    Restart indicator controller motherboard
                  </td>
                  <td style={{ ...printTd, fontWeight: 700, color: "#16A34A" }}>
                    ✓ Completed
                  </td>
                </tr>
                <tr>
                  <td style={printTd}>3</td>
                  <td style={printTd}>
                    Inspect RS-485 serial communication cable & terminal block
                  </td>
                  <td style={{ ...printTd, fontWeight: 700, color: "#F59E0B" }}>
                    ⌛ In Progress
                  </td>
                </tr>
                <tr>
                  <td style={printTd}>4</td>
                  <td style={printTd}>
                    Perform test vehicle weight capture verification
                  </td>
                  <td style={{ ...printTd, fontWeight: 700, color: "#6B7280" }}>
                    ○ Pending
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Comments & Activity */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#4B5563",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Comments & Operational Updates
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {comments.map((c) => (
                <div
                  key={c.time + c.author}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 12,
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#111827" }}>
                    {c.author}{" "}
                    <span style={{ fontWeight: 400, color: "#6B7280" }}>
                      ({c.role} · {c.time})
                    </span>
                  </div>
                  <div style={{ color: "#374151", marginTop: 4 }}>{c.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid #E2E8F0",
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#6B7280",
            }}
          >
            <span>
              Weighbridge Management Software · Enterprise Operational Support
            </span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────── */
  /*  DESKTOP VIEW                                                      */
  /* ─────────────────────────────────────────────────────────────────── */
  function renderDesktopView() {
    return (
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
        {/* Resolve Modal */}
        {resolveModalOpen && (
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
                borderRadius: 16,
                border: `1px solid ${border}`,
                padding: 24,
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  ✓ RESOLVE SUPPORT TICKET
                </h3>
                <button
                  onClick={() => setResolveModalOpen(false)}
                  style={{
                    background: "none",
                    border: 0,
                    color: mutedText,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: 12.5,
                  color: secondaryText,
                }}
              >
                Record resolution notes and mark ticket{" "}
                <strong style={{ color: primaryOrange }}>TCK-2026-0892</strong>{" "}
                as RESOLVED.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label
                    style={{ fontSize: 11, fontWeight: 700, color: mutedText }}
                  >
                    RESOLUTION SUMMARY *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Replaced RS485 communication cable & recalibrated loadcell zero offset"
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                    style={{
                      width: "100%",
                      height: 40,
                      padding: "0 12px",
                      borderRadius: 8,
                      background: inputBg,
                      color: primaryText,
                      border: `1px solid ${border}`,
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: 11, fontWeight: 700, color: mutedText }}
                  >
                    RESOLUTION DETAILS *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detailed troubleshooting steps taken..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
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
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => setResolveModalOpen(false)}
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
                    onClick={handleResolve}
                    disabled={!resolutionSummary.trim()}
                    style={{
                      height: 38,
                      padding: "0 18px",
                      borderRadius: 8,
                      background: primaryOrange,
                      color: "#FFF",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: resolutionSummary.trim()
                        ? "pointer"
                        : "not-allowed",
                    }}
                  >
                    Mark Ticket Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
              <button
                onClick={() => onNavigate("tickets")}
                style={{
                  background: "none",
                  border: 0,
                  color: mutedText,
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 11,
                }}
              >
                Support
              </button>
              <span>/</span>
              <button
                onClick={() => onNavigate("tickets")}
                style={{
                  background: "none",
                  border: 0,
                  color: mutedText,
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 11,
                }}
              >
                Tickets
              </button>
              <span>/</span>
              <span
                style={{
                  color: primaryOrange,
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                TKT-10248
              </span>
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
              WB-02 Indicator Not Reading
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setActiveView("printable")}
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
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>🖨</span>
              <span>Print Ticket</span>
            </button>

            {(role === "admin" || role === "maintenance") && (
              <button
                onClick={() => setResolveModalOpen(true)}
                style={{
                  height: 42,
                  padding: "0 20px",
                  borderRadius: 8,
                  background: primaryOrange,
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 800,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                }}
              >
                Update / Resolve
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
          {/* TICKET STATUS HEADER CARD */}
          <div
            style={{
              background: surface,
              borderRadius: 14,
              border: `1px solid ${border}`,
              padding: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: primaryOrange,
                  fontFamily: "monospace",
                }}
              >
                TKT-10248
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  background:
                    ticketStatus === "RESOLVED"
                      ? dm
                        ? "rgba(22,163,74,0.15)"
                        : "#F0FDF4"
                      : dm
                        ? "rgba(245,158,11,0.15)"
                        : "#FFFBEB",
                  color:
                    ticketStatus === "RESOLVED" ? statusSuccess : statusWarning,
                }}
              >
                ● {ticketStatus}
              </span>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  background: primaryOrangeSoft,
                  color: primaryOrange,
                }}
              >
                ● PRIORITY: {ticketPriority}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: 20,
                fontSize: 12,
                color: secondaryText,
              }}
            >
              <div>
                Created:{" "}
                <strong style={{ color: primaryText }}>
                  20 Aug 2026, 09:42 AM
                </strong>
              </div>
              <div>
                Assigned:{" "}
                <strong style={{ color: secondaryGold }}>{assignee}</strong>
              </div>
              <div>
                Weighbridge:{" "}
                <strong style={{ color: primaryText }}>WB-02</strong>
              </div>
              <div>
                SLA:{" "}
                <strong style={{ color: statusSuccess }}>
                  02h 18m remaining
                </strong>
              </div>
            </div>
          </div>

          {/* 70 / 30 TWO-COLUMN GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 24,
            }}
          >
            {/* ── LEFT COLUMN (70%) ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Issue Description */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: 16,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  ISSUE DESCRIPTION
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: secondaryText,
                    lineHeight: 1.6,
                  }}
                >
                  The WB-02 weight indicator is not displaying the current
                  vehicle weight. Operator reports that the indicator display
                  remains stuck at zero after vehicle positioning on scale.
                  Power supply indicator light is active.
                </p>
              </div>

              {/* Issue Information Grid */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: 16,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  ISSUE INFORMATION
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 16,
                    fontSize: 13,
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
                      CATEGORY
                    </span>
                    <strong>Indicator</strong>
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
                      SUBCATEGORY
                    </span>
                    <strong>Weight Display</strong>
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
                      WEIGHBRIDGE
                    </span>
                    <strong>WB-02</strong>
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
                      REPORTED BY
                    </span>
                    <strong>Rithick Nathan</strong>
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
                      REPORTED DATE
                    </span>
                    <strong>20 Aug 2026 · 09:42 AM</strong>
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
                      SLA TARGET
                    </span>
                    <strong>20 Aug 2026 · 01:42 PM</strong>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Checklist */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: 16,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  TROUBLESHOOTING NOTES
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    {
                      step: "1. Check indicator power connection and supply voltage",
                      status: "Completed",
                      color: statusSuccess,
                    },
                    {
                      step: "2. Restart indicator controller motherboard",
                      status: "Completed",
                      color: statusSuccess,
                    },
                    {
                      step: "3. Inspect RS-485 serial communication cable & terminal block",
                      status: "In Progress",
                      color: statusWarning,
                    },
                    {
                      step: "4. Perform test vehicle weight capture verification",
                      status: "Pending",
                      color: mutedText,
                    },
                  ].map((t) => (
                    <div
                      key={t.step}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 8,
                        background: elevated,
                        border: `1px solid ${border}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: primaryText,
                        }}
                      >
                        {t.step}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: t.color,
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments & Discussion */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: 16,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  COMMENTS & OPERATIONAL UPDATES
                </h3>

                {/* Add Comment Input */}
                <div style={{ marginBottom: 20 }}>
                  <textarea
                    rows={3}
                    placeholder="Add a comment or troubleshooting update..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: 0,
                        color: secondaryGold,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      📎 Attach File / Photo
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        background: primaryOrange,
                        color: "#FFF",
                        border: "none",
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: newComment.trim() ? "pointer" : "not-allowed",
                      }}
                    >
                      Add Comment
                    </button>
                  </div>
                </div>

                {/* Comments Thread */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {comments.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        background: elevated,
                        border: `1px solid ${border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: primaryText,
                          }}
                        >
                          {c.author}{" "}
                          <span
                            style={{
                              fontSize: 11,
                              color: mutedText,
                              fontWeight: 400,
                            }}
                          >
                            ({c.role})
                          </span>
                        </span>
                        <span style={{ fontSize: 11, color: mutedText }}>
                          {c.time}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: secondaryText,
                          lineHeight: 1.5,
                        }}
                      >
                        {c.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity History Timeline */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 24,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: 16,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  ACTIVITY HISTORY
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    paddingLeft: 8,
                    borderLeft: `2px solid ${divider}`,
                  }}
                >
                  {[
                    {
                      time: "20 Aug 2026 · 11:24 AM",
                      text: "Raj Kumar added a troubleshooting comment.",
                    },
                    {
                      time: "20 Aug 2026 · 10:52 AM",
                      text: "Ticket assigned to Raj Kumar (Maintenance).",
                    },
                    {
                      time: "20 Aug 2026 · 10:18 AM",
                      text: "Priority changed from Medium to High by Admin User.",
                    },
                    {
                      time: "20 Aug 2026 · 09:42 AM",
                      text: "Ticket TKT-10248 created by Rithick Nathan.",
                    },
                  ].map((act, i) => (
                    <div
                      key={i}
                      style={{ position: "relative", paddingLeft: 16 }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: mutedText,
                          fontWeight: 700,
                        }}
                      >
                        {act.time}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: primaryText,
                          marginTop: 2,
                        }}
                      >
                        {act.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (30%) ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* TICKET INFORMATION CARD */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 20,
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: 14,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  TICKET METADATA
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    fontSize: 12.5,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: mutedText }}>Ticket ID:</span>
                    <strong
                      style={{ fontFamily: "monospace", color: primaryOrange }}
                    >
                      TKT-10248
                    </strong>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: mutedText }}>Category:</span>
                    <strong style={{ color: primaryText }}>Indicator</strong>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: mutedText }}>Weighbridge:</span>
                    <strong style={{ color: primaryText }}>WB-02</strong>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: mutedText }}>Assigned:</span>
                    <strong style={{ color: secondaryGold }}>{assignee}</strong>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: mutedText }}>SLA Status:</span>
                    <strong style={{ color: statusSuccess }}>Within SLA</strong>
                  </div>
                </div>
              </div>

              {/* RELATED ASSET CARD */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 20,
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: 14,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  RELATED WEIGHBRIDGE
                </h4>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: elevated,
                    border: `1px solid ${border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      WB-02
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: statusSuccess,
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      ● ONLINE
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate("monitoring")}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background: surface,
                      color: primaryOrange,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    View Scale
                  </button>
                </div>
              </div>

              {/* QUICK ACTIONS CARD */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  padding: 20,
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: 14,
                    fontWeight: 800,
                    color: primaryText,
                  }}
                >
                  QUICK ACTIONS
                </h4>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <button
                    onClick={() => setActiveView("printable")}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: elevated,
                      border: `1px solid ${border}`,
                      color: primaryText,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    🖨 Print Ticket Report
                  </button>
                  {(role === "admin" || role === "maintenance") && (
                    <>
                      <button
                        onClick={() => setResolveModalOpen(true)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: primaryOrange,
                          color: "#FFF",
                          border: "none",
                          fontWeight: 800,
                          fontSize: 12,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        ✓ Mark Ticket Resolved
                      </button>
                      <button
                        onClick={() => setTicketPriority("CRITICAL")}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: elevated,
                          border: `1px solid ${border}`,
                          color: statusError,
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        ⚠ Escalate to Critical
                      </button>
                    </>
                  )}
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
            SCREEN 46 — TICKET DETAIL
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
                onClick={() => onNavigate("tickets")}
                style={{
                  background: "none",
                  border: 0,
                  color: primaryOrange,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                ← Tickets
              </button>
              <span
                style={{ fontSize: 15, fontWeight: 800, color: primaryText }}
              >
                Ticket Detail
              </span>
              <button
                onClick={() => setActiveView("printable")}
                style={{
                  background: "none",
                  border: 0,
                  color: primaryOrange,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                🖨
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
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: elevated,
                  border: `1px solid ${border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: primaryOrange,
                    fontWeight: 800,
                  }}
                >
                  TKT-10248
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: primaryText,
                    marginTop: 2,
                  }}
                >
                  WB-02 Indicator Not Reading
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 800,
                      background: primaryOrangeSoft,
                      color: primaryOrange,
                    }}
                  >
                    ● HIGH
                  </span>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 800,
                      background: dm ? "rgba(245,158,11,0.15)" : "#FFFBEB",
                      color: statusWarning,
                    }}
                  >
                    ● OPEN
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: elevated,
                  border: `1px solid ${border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: mutedText }}>Category:</span>
                  <strong>Indicator</strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: mutedText }}>Weighbridge:</span>
                  <strong>WB-02</strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: mutedText }}>Assigned To:</span>
                  <strong style={{ color: secondaryGold }}>Raj Kumar</strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: mutedText }}>SLA Remaining:</span>
                  <strong style={{ color: statusSuccess }}>02h 18m</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveView("printable")}
                style={{
                  height: 44,
                  borderRadius: 8,
                  background: primaryOrange,
                  color: "#FFF",
                  border: "none",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                🖨 Print Ticket Report
              </button>
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
                { icon: "🎟", label: "Tickets" },
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

// Helper Printable Styles
const printTdKey: React.CSSProperties = {
  padding: "8px 12px",
  color: "#4B5563",
  fontWeight: 700,
  borderBottom: "1px solid #E2E8F0",
  width: "20%",
};
const printTdVal: React.CSSProperties = {
  padding: "8px 12px",
  color: "#111827",
  fontWeight: 600,
  borderBottom: "1px solid #E2E8F0",
  width: "30%",
};
const printTh: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  color: "#4B5563",
  fontWeight: 800,
  fontSize: 11,
  textTransform: "uppercase",
};
const printTd: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #E2E8F0",
  color: "#111827",
};
