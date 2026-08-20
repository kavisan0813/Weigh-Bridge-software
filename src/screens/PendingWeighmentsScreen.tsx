import React, { useState, useMemo } from "react";
import type { OperatorView } from "./OperatorScreens";

type ViewDevice = "desktop" | "tablet" | "mobile";
type FilterPreset = "all" | "overdue" | "empty" | "offline" | "device-issue";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: OperatorView) => void;
}

interface PendingItem {
  ticket: string;
  vehicle: string;
  driver: string;
  customer: string;
  material: string;
  firstWeight: string;
  entryTime: string;
  waitDuration: string;
  weighbridge: string;
  status: string;
  statusColor: string;
  isOverdue?: boolean;
  hasDeviceIssue?: boolean;
}

const INITIAL_PENDING_ITEMS: PendingItem[] = [
  {
    ticket: "WB-2026-00462",
    vehicle: "TN22GH3456",
    driver: "Arun Kumar",
    customer: "Metro Builders Ltd",
    material: "Gravel",
    firstWeight: "24,850 KG",
    entryTime: "10:55 AM",
    waitDuration: "18 min",
    weighbridge: "WB-01",
    status: "AWAITING SECOND",
    statusColor: "#16A34A",
  },
  {
    ticket: "WB-2026-00459",
    vehicle: "TN09AB7821",
    driver: "Ravi Kumar",
    customer: "Southern Rocks Co",
    material: "Sand",
    firstWeight: "21,800 KG",
    entryTime: "10:42 AM",
    waitDuration: "31 min",
    weighbridge: "WB-01",
    status: "AWAITING SECOND",
    statusColor: "#16A34A",
  },
  {
    ticket: "WB-2026-00457",
    vehicle: "TN18CD4521",
    driver: "Suresh Kumar",
    customer: "Apex Infrastructure",
    material: "Cement",
    firstWeight: "18,600 KG",
    entryTime: "10:34 AM",
    waitDuration: "39 min",
    weighbridge: "WB-02",
    status: "AWAITING SECOND",
    statusColor: "#16A34A",
  },
  {
    ticket: "WB-2026-00454",
    vehicle: "TN11EF9021",
    driver: "Manoj Kumar",
    customer: "Delta Mining Corp",
    material: "M-Sand",
    firstWeight: "22,400 KG",
    entryTime: "09:55 AM",
    waitDuration: "1h 18m",
    weighbridge: "WB-03",
    status: "OVERDUE",
    statusColor: "#F59E0B",
    isOverdue: true,
  },
];

export default function PendingWeighmentsScreen({
  darkMode,
  onToggleDark,
  onNavigate,
}: Props) {
  // Viewport & Presets
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [preset, setPreset] = useState<FilterPreset>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWb, setSelectedWb] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Drawer & Modal State
  const [selectedDrawerItem, setSelectedDrawerItem] =
    useState<PendingItem | null>(null);
  const [cancelModalItem, setCancelModalItem] = useState<PendingItem | null>(
    null,
  );
  const [cancelReason, setCancelReason] = useState("Vehicle left weighbridge");

  // Dark Mode Tokens
  const dm = darkMode;

  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const elevatedSurface = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const divider = dm ? "#374151" : "#F1F5F9";
  const inputBg = dm ? "#111827" : "#FFFFFF";

  // Brand Colors (Orange + Gold)
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const primaryOrangeSoft = dm ? "#2A1809" : "#FFF7ED";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";

  // Status Colors
  const statusOnline = "#16A34A";
  const statusWarning = "#F59E0B";
  const statusOffline = "#DC2626";
  const showPresetToolbar = false;

  // Filtered List Logic
  const itemsList = useMemo(() => {
    if (preset === "empty") return [];
    let list = [...INITIAL_PENDING_ITEMS];
    if (preset === "overdue") {
      list = list.filter((i) => i.isOverdue);
    }
    return list.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        item.ticket.toLowerCase().includes(q) ||
        item.vehicle.toLowerCase().includes(q) ||
        item.driver.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q);

      const matchWb = selectedWb === "All" || item.weighbridge === selectedWb;
      const matchStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Overdue" && item.isOverdue) ||
        (selectedStatus === "Awaiting Second" && !item.isOverdue);

      return matchQ && matchWb && matchStatus;
    });
  }, [searchQuery, selectedWb, selectedStatus, preset]);

  // Handlers
  const handleContinue = (item: PendingItem) => {
    alert(
      `Opening Second Weighing (Screen 23) for Ticket ${item.ticket} | Vehicle ${item.vehicle}`,
    );
    onNavigate("second-weighment");
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalItem) return;
    alert(
      `Pending weighment ${cancelModalItem.ticket} for vehicle ${cancelModalItem.vehicle} cancelled. Reason: ${cancelReason}. Audit Log Recorded.`,
    );
    setCancelModalItem(null);
  };

  return (
    <div
      style={{
        width: "100%",
        flex: 1,
        background: bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: primaryText,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          OPERATOR PENDING WEIGHMENTS PRESET TOOLBAR (COMMENTED OUT)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showPresetToolbar && (
        <div
          style={{
            margin: "16px 24px 0",
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: "10px 20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => onNavigate("operator-dashboard")}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#FFF",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Dashboard
            </button>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#F9FAFB",
                  letterSpacing: "0.03em",
                }}
              >
                PENDING WEIGHMENTS CONTROL CENTER
              </div>
              <div
                style={{ fontSize: 10, color: secondaryGold, fontWeight: 600 }}
              >
                SCREEN 25 — OPERATOR QUEUE MANAGEMENT
              </div>
            </div>
          </div>

          {/* Demo Presets Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 10.5,
                color: "#94A3B8",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Queue State:
            </span>
            {[
              { id: "all", label: "All Pending (4)" },
              { id: "overdue", label: "Overdue Only (1)" },
              { id: "empty", label: "Empty Queue" },
              { id: "offline", label: "WB-04 Offline" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setPreset(st.id as FilterPreset)}
                style={{
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: 10.5,
                  fontWeight: preset === st.id ? 700 : 500,
                  border:
                    preset === st.id
                      ? `1px solid ${primaryOrange}`
                      : "1px solid rgba(255,255,255,0.15)",
                  background: preset === st.id ? primaryOrange : "transparent",
                  color: preset === st.id ? "#FFF" : "#CBD5E1",
                  cursor: "pointer",
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.08)",
                padding: 3,
                borderRadius: 6,
              }}
            >
              <button
                onClick={() => setViewDevice("desktop")}
                style={{
                  padding: "3px 8px",
                  borderRadius: 4,
                  border: "none",
                  background:
                    viewDevice === "desktop"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  color: viewDevice === "desktop" ? "#FFF" : "#94A3B8",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                💻 Desktop
              </button>
              <button
                onClick={() => setViewDevice("tablet")}
                style={{
                  padding: "3px 8px",
                  borderRadius: 4,
                  border: "none",
                  background:
                    viewDevice === "tablet"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  color: viewDevice === "tablet" ? "#FFF" : "#94A3B8",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📱 Tablet
              </button>
              <button
                onClick={() => setViewDevice("mobile")}
                style={{
                  padding: "3px 8px",
                  borderRadius: 4,
                  border: "none",
                  background:
                    viewDevice === "mobile" ? primaryOrange : "transparent",
                  color: viewDevice === "mobile" ? "#FFF" : "#94A3B8",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📲 Mobile
              </button>
            </div>

            <button
              onClick={onToggleDark}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#F9FAFB",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {dm ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN CANVAS — DESKTOP / TABLET / MOBILE VIEWPORTS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          background:
            viewDevice !== "desktop" ? (dm ? "#0B0F17" : "#CBD5E1") : bg,
          padding: viewDevice === "desktop" ? 0 : "24px 16px",
          overflowY: "auto",
        }}
      >
        {/* -------------------------------------------------------------
            MOBILE FRAME (390 × 844)
           ------------------------------------------------------------- */}
        {viewDevice === "mobile" ? (
          <div
            style={{
              width: 390,
              minHeight: 844,
              maxHeight: 900,
              background: surface,
              borderRadius: 36,
              border: `10px solid ${dm ? "#1F2937" : "#0F172A"}`,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Notch */}
            <div
              style={{
                width: 140,
                height: 24,
                background: dm ? "#1F2937" : "#0F172A",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                margin: "0 auto",
                zIndex: 50,
              }}
            />

            {/* Mobile Header */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: primaryText }}
                >
                  Pending Weighments
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: secondaryGold,
                    fontWeight: 700,
                  }}
                >
                  4 Vehicles Waiting
                </div>
              </div>
              <button
                onClick={() => onNavigate("vehicle-entry")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: primaryOrange,
                  color: "#FFF",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                + New
              </button>
            </div>

            {/* Mobile Body Content */}
            <div
              style={{
                padding: "16px 20px 90px 20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Search */}
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicle, ticket, driver..."
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 10,
                  border: `1px solid ${border}`,
                  background: inputBg,
                  color: primaryText,
                  fontSize: 13,
                }}
              />

              {/* KPI Chips */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  fontSize: 11,
                }}
              >
                <div
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div style={{ color: mutedText, fontWeight: 700 }}>
                    TOTAL PENDING
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: primaryOrange,
                      marginTop: 2,
                    }}
                  >
                    {itemsList.length}
                  </div>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div style={{ color: mutedText, fontWeight: 700 }}>
                    OVERDUE
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: statusWarning,
                      marginTop: 2,
                    }}
                  >
                    1
                  </div>
                </div>
              </div>

              {/* Pending Mobile Cards List */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {itemsList.map((item) => (
                  <div
                    key={item.ticket}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      background: elevatedSurface,
                      border: `1.5px solid ${item.isOverdue ? statusWarning : border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          fontFamily: "monospace",
                          color: primaryOrange,
                        }}
                      >
                        {item.vehicle}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: `${item.statusColor}20`,
                          color: item.statusColor,
                        }}
                      >
                        ● {item.status}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: secondaryText,
                        marginBottom: 10,
                      }}
                    >
                      <div>
                        Ticket: <strong>{item.ticket}</strong> • Material:{" "}
                        <strong>{item.material}</strong>
                      </div>
                      <div>
                        First Weight:{" "}
                        <strong
                          style={{
                            color: primaryText,
                            fontFamily: "monospace",
                          }}
                        >
                          {item.firstWeight}
                        </strong>
                      </div>
                      <div>
                        Station: <strong>{item.weighbridge}</strong> • Waiting:{" "}
                        <strong
                          style={{
                            color: item.isOverdue ? statusWarning : primaryText,
                          }}
                        >
                          {item.waitDuration}
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleContinue(item)}
                        style={{
                          flex: 1,
                          height: 42,
                          borderRadius: 8,
                          background: primaryOrange,
                          color: "#FFF",
                          border: "none",
                          fontSize: 13,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        CONTINUE →
                      </button>
                      <button
                        onClick={() => setSelectedDrawerItem(item)}
                        style={{
                          padding: "0 12px",
                          height: 42,
                          borderRadius: 8,
                          background: surface,
                          border: `1px solid ${border}`,
                          color: secondaryText,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Details
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
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                alignItems: "center",
                textTransform: "uppercase",
              }}
            >
              <button
                onClick={() => onNavigate("operator-dashboard")}
                style={{
                  background: "none",
                  border: "none",
                  color: mutedText,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate("vehicle-entry")}
                style={{
                  background: "none",
                  border: "none",
                  color: primaryOrange,
                  fontSize: 10,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Weigh
              </button>
              <button
                onClick={() => onNavigate("pending-weighments")}
                style={{
                  background: "none",
                  border: "none",
                  color: primaryOrange,
                  fontSize: 10,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Pending
              </button>
              <button
                onClick={() => onNavigate("operator-dashboard")}
                style={{
                  background: "none",
                  border: "none",
                  color: mutedText,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Tickets
              </button>
              <button
                onClick={() => onNavigate("operator-dashboard")}
                style={{
                  background: "none",
                  border: "none",
                  color: mutedText,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                More
              </button>
            </div>
          </div>
        ) : (
          /* -------------------------------------------------------------
              DESKTOP (1440 × 1024) / TABLET LAYOUT
             ------------------------------------------------------------- */
          <div
            style={{
              width: "100%",
              maxWidth: 1440,
              minHeight: viewDevice === "desktop" ? "calc(100vh - 50px)" : 840,
              display: "flex",
              flexDirection: "column",
              background: surface,
              boxShadow:
                viewDevice === "tablet"
                  ? "0 20px 40px rgba(0,0,0,0.15)"
                  : "none",
              borderRadius: viewDevice === "tablet" ? 16 : 0,
              overflow: "hidden",
            }}
          >
            {/* DESKTOP HEADER */}
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
                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    margin: 0,
                    color: primaryText,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Pending Weighments Queue
                </h1>
                <p
                  style={{
                    fontSize: 12,
                    color: mutedText,
                    margin: "2px 0 0 0",
                  }}
                >
                  Vehicles that completed first weighing and are awaiting second
                  tare weighing.
                </p>
              </div>

              {/* Station Info & Operator */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  onClick={() => onNavigate("vehicle-entry")}
                  style={{
                    height: 42,
                    padding: "0 18px",
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
                  + START NEW WEIGHMENT
                </button>

                <div style={{ height: 28, width: 1, background: border }} />

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    WB-01 — Main Gate
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: statusOnline,
                    }}
                  >
                    ● ONLINE
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      background: primaryOrange,
                      color: "#FFF",
                      fontWeight: 800,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    AK
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: primaryText,
                    }}
                  >
                    Arun Kumar
                  </div>
                </div>
              </div>
            </header>

            {/* BODY CONTAINER */}
            <div
              style={{
                flex: 1,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                overflowY: "auto",
              }}
            >
              {/* SUMMARY KPI CARDS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: mutedText,
                      letterSpacing: "0.05em",
                    }}
                  >
                    TOTAL PENDING
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      color: primaryOrange,
                      marginTop: 4,
                    }}
                  >
                    {itemsList.length}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: secondaryText,
                      marginTop: 2,
                    }}
                  >
                    Awaiting 2nd weighing
                  </div>
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: mutedText,
                      letterSpacing: "0.05em",
                    }}
                  >
                    WAITING &lt; 30 MIN
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      color: secondaryGold,
                      marginTop: 4,
                    }}
                  >
                    2
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: secondaryText,
                      marginTop: 2,
                    }}
                  >
                    Normal waiting queue
                  </div>
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: mutedText,
                      letterSpacing: "0.05em",
                    }}
                  >
                    WAITING &gt; 30 MIN
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      color: statusWarning,
                      marginTop: 4,
                    }}
                  >
                    1
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: secondaryText,
                      marginTop: 2,
                    }}
                  >
                    Extended wait time
                  </div>
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 12,
                    background: elevatedSurface,
                    border: `1.5px solid ${statusWarning}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: statusWarning,
                      letterSpacing: "0.05em",
                    }}
                  >
                    OVERDUE (&gt; 60 MIN)
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      color: statusWarning,
                      marginTop: 4,
                    }}
                  >
                    1
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: statusWarning,
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    ⚠ Ticket WB-2026-00454
                  </div>
                </div>
              </div>

              {/* WEIGHBRIDGE MULTI-STATION STATUS CHIPS BAR */}
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: 10,
                  background: elevatedSurface,
                  border: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: mutedText,
                      letterSpacing: "0.06em",
                    }}
                  >
                    STATIONS:
                  </span>
                  {[
                    {
                      wb: "WB-01",
                      count: 2,
                      status: "● ONLINE",
                      color: statusOnline,
                    },
                    {
                      wb: "WB-02",
                      count: 1,
                      status: "● ONLINE",
                      color: statusOnline,
                    },
                    {
                      wb: "WB-03",
                      count: 1,
                      status: "⚠ OVERDUE",
                      color: statusWarning,
                    },
                    {
                      wb: "WB-04",
                      count: 0,
                      status: "● OFFLINE",
                      color: statusOffline,
                    },
                    {
                      wb: "WB-05",
                      count: 0,
                      status: "● ONLINE",
                      color: statusOnline,
                    },
                  ].map((st) => (
                    <button
                      key={st.wb}
                      onClick={() =>
                        setSelectedWb(selectedWb === st.wb ? "All" : st.wb)
                      }
                      style={{
                        padding: "5px 12px",
                        borderRadius: 6,
                        border:
                          selectedWb === st.wb
                            ? `1.5px solid ${primaryOrange}`
                            : `1px solid ${border}`,
                        background:
                          selectedWb === st.wb ? primaryOrangeSoft : surface,
                        color:
                          selectedWb === st.wb ? primaryOrange : primaryText,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>{st.wb}</span>
                      <span style={{ color: st.color, fontSize: 11 }}>
                        {st.status}
                      </span>
                      <span
                        style={{
                          padding: "1px 6px",
                          borderRadius: 999,
                          background: dm ? "#374151" : "#E5E7EB",
                          fontSize: 10,
                        }}
                      >
                        {st.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Auto Refresh */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 12,
                    color: secondaryText,
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    <span>Auto-refresh ON</span>
                  </label>
                  <span style={{ color: mutedText }}>
                    • Last updated: Just now
                  </span>
                </div>
              </div>

              {/* SEARCH & MULTI-FILTER CONTROL BAR */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: surface,
                  border: `1px solid ${border}`,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", gap: 12, flex: 1, minWidth: 300 }}
                >
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vehicle number, ticket ID, driver, customer, or material..."
                    style={{
                      flex: 1,
                      height: 42,
                      padding: "0 14px",
                      borderRadius: 8,
                      border: `1px solid ${border}`,
                      background: inputBg,
                      color: primaryText,
                      fontSize: 13,
                    }}
                  />

                  <select
                    value={selectedWb}
                    onChange={(e) => setSelectedWb(e.target.value)}
                    style={{
                      height: 42,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: `1px solid ${border}`,
                      background: inputBg,
                      color: primaryText,
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    <option value="All">All Weighbridges</option>
                    <option value="WB-01">WB-01 (Main Gate)</option>
                    <option value="WB-02">WB-02 (North Gate)</option>
                    <option value="WB-03">WB-03 (Loading Yard)</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      height: 42,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: `1px solid ${border}`,
                      background: inputBg,
                      color: primaryText,
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Awaiting Second">Awaiting Second</option>
                    <option value="Overdue">Overdue (&gt; 60m)</option>
                  </select>
                </div>

                {(searchQuery ||
                  selectedWb !== "All" ||
                  selectedStatus !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedWb("All");
                      setSelectedStatus("All");
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 6,
                      border: `1px solid ${border}`,
                      background: "transparent",
                      color: secondaryText,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* PENDING WEIGHMENTS DATA TABLE */}
              <div
                style={{
                  background: surface,
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      Pending Weighment Queue
                    </h3>
                    <div
                      style={{ fontSize: 11.5, color: mutedText, marginTop: 2 }}
                    >
                      {itemsList.length} vehicles waiting for second weighing
                    </div>
                  </div>
                </div>

                {itemsList.length === 0 ? (
                  /* EMPTY STATE */
                  <div style={{ padding: 48, textAlign: "center" }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "rgba(22,163,74,0.12)",
                        color: statusOnline,
                        fontSize: 28,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px auto",
                      }}
                    >
                      ✓
                    </div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      No Pending Weighments
                    </h4>
                    <p
                      style={{
                        fontSize: 13,
                        color: mutedText,
                        margin: "6px 0 20px 0",
                      }}
                    >
                      All vehicles have completed their weighing process
                      cleanly.
                    </p>
                    <button
                      onClick={() => onNavigate("vehicle-entry")}
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
                      + Start New Weighment
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                        textAlign: "left",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: elevatedSurface,
                            color: mutedText,
                            borderBottom: `1px solid ${border}`,
                          }}
                        >
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            TICKET #
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            VEHICLE #
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            DRIVER
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            CUSTOMER
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            MATERIAL
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            FIRST WEIGHT
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            WAITING
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            WEIGHBRIDGE
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            STATUS
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                              textAlign: "right",
                            }}
                          >
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsList.map((row) => (
                          <tr
                            key={row.ticket}
                            style={{
                              borderBottom: `1px solid ${divider}`,
                              background: row.isOverdue
                                ? dm
                                  ? "#451A03"
                                  : "#FEF3C7"
                                : "transparent",
                            }}
                          >
                            <td
                              style={{
                                padding: "14px 18px",
                                fontWeight: 800,
                                color: primaryText,
                                fontFamily: "monospace",
                              }}
                            >
                              {row.ticket}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                fontWeight: 800,
                                color: primaryOrange,
                                fontFamily: "monospace",
                              }}
                            >
                              {row.vehicle}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                color: secondaryText,
                              }}
                            >
                              {row.driver}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                color: secondaryText,
                              }}
                            >
                              {row.customer}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                color: secondaryText,
                              }}
                            >
                              {row.material}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                fontWeight: 800,
                                color: secondaryGold,
                                fontFamily: "monospace",
                              }}
                            >
                              {row.firstWeight}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                fontWeight: 700,
                                color: row.isOverdue
                                  ? statusWarning
                                  : secondaryText,
                              }}
                            >
                              {row.waitDuration}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                fontWeight: 700,
                                color: primaryText,
                              }}
                            >
                              {row.weighbridge}
                            </td>
                            <td style={{ padding: "14px 18px" }}>
                              <span
                                style={{
                                  padding: "3px 10px",
                                  borderRadius: 999,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  background: `${row.statusColor}20`,
                                  color: row.statusColor,
                                }}
                              >
                                ● {row.status}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                textAlign: "right",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  justifyContent: "flex-end",
                                }}
                              >
                                <button
                                  onClick={() => handleContinue(row)}
                                  style={{
                                    padding: "6px 14px",
                                    borderRadius: 6,
                                    background: primaryOrange,
                                    color: "#FFFFFF",
                                    fontSize: 12,
                                    fontWeight: 800,
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  Continue →
                                </button>
                                <button
                                  onClick={() => setSelectedDrawerItem(row)}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: 6,
                                    border: `1px solid ${border}`,
                                    background: inputBg,
                                    color: secondaryText,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SLIDE-OVER DETAIL DRAWER */}
            {selectedDrawerItem && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(2px)",
                  zIndex: 200,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: 440,
                    height: "100%",
                    background: surface,
                    borderLeft: `1px solid ${border}`,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "-10px 0 30px rgba(0,0,0,0.25)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 20,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: mutedText,
                            letterSpacing: "0.08em",
                          }}
                        >
                          PENDING TRANSACTION DETAIL
                        </div>
                        <h3
                          style={{
                            margin: "2px 0 0 0",
                            fontSize: 20,
                            fontWeight: 800,
                            color: primaryText,
                          }}
                        >
                          {selectedDrawerItem.ticket}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedDrawerItem(null)}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: 20,
                          color: mutedText,
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Vehicle Card */}
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: elevatedSurface,
                        border: `1.5px solid ${primaryOrange}`,
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: mutedText,
                        }}
                      >
                        VEHICLE NUMBER
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          fontFamily: "monospace",
                          color: primaryOrange,
                          marginTop: 2,
                        }}
                      >
                        {selectedDrawerItem.vehicle}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: secondaryText,
                          marginTop: 4,
                        }}
                      >
                        Customer: <strong>{selectedDrawerItem.customer}</strong>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        fontSize: 13,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: `1px solid ${border}`,
                          paddingBottom: 8,
                        }}
                      >
                        <span style={{ color: mutedText }}>Driver Name</span>
                        <strong style={{ color: primaryText }}>
                          {selectedDrawerItem.driver}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: `1px solid ${border}`,
                          paddingBottom: 8,
                        }}
                      >
                        <span style={{ color: mutedText }}>Material</span>
                        <strong style={{ color: primaryText }}>
                          {selectedDrawerItem.material}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: `1px solid ${border}`,
                          paddingBottom: 8,
                        }}
                      >
                        <span style={{ color: mutedText }}>
                          Weighbridge Station
                        </span>
                        <strong style={{ color: primaryText }}>
                          {selectedDrawerItem.weighbridge}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: `1px solid ${border}`,
                          paddingBottom: 8,
                        }}
                      >
                        <span style={{ color: mutedText }}>
                          Locked First Weight (Gross)
                        </span>
                        <strong
                          style={{
                            fontFamily: "monospace",
                            color: secondaryGold,
                            fontSize: 15,
                          }}
                        >
                          {selectedDrawerItem.firstWeight}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: `1px solid ${border}`,
                          paddingBottom: 8,
                        }}
                      >
                        <span style={{ color: mutedText }}>
                          First Weighing Time
                        </span>
                        <strong style={{ fontFamily: "monospace" }}>
                          {selectedDrawerItem.entryTime}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: `1px solid ${border}`,
                          paddingBottom: 8,
                        }}
                      >
                        <span style={{ color: mutedText }}>
                          Current Waiting Time
                        </span>
                        <strong
                          style={{
                            color: selectedDrawerItem.isOverdue
                              ? statusWarning
                              : primaryText,
                          }}
                        >
                          {selectedDrawerItem.waitDuration}
                        </strong>
                      </div>
                    </div>

                    {/* Entry Photo Preview */}
                    <div
                      style={{
                        marginTop: 20,
                        padding: 12,
                        borderRadius: 10,
                        background: "#0F172A",
                        border: "1px solid #334155",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10.5,
                          color: "#94A3B8",
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        ENTRY PHOTO (10:55 AM)
                      </div>
                      <div
                        style={{
                          height: 80,
                          background: "#1E293B",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#F97316",
                          fontFamily: "monospace",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {selectedDrawerItem.vehicle} •{" "}
                        {selectedDrawerItem.firstWeight}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      borderTop: `1px solid ${border}`,
                      paddingTop: 16,
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedDrawerItem(null);
                        handleContinue(selectedDrawerItem);
                      }}
                      style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 8,
                        background: primaryOrange,
                        color: "#FFF",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Continue Second Weighing →
                    </button>
                    <button
                      onClick={() => {
                        setCancelModalItem(selectedDrawerItem);
                        setSelectedDrawerItem(null);
                      }}
                      style={{
                        width: "100%",
                        height: 44,
                        borderRadius: 8,
                        background: "transparent",
                        border: `1px solid ${statusOffline}`,
                        color: statusOffline,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Cancel Weighment Transaction
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CANCEL MODAL */}
            {cancelModalItem && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(4px)",
                  zIndex: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <form
                  onSubmit={handleCancelSubmit}
                  style={{
                    width: "100%",
                    maxWidth: 440,
                    borderRadius: 16,
                    background: surface,
                    border: `1px solid ${border}`,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        color: statusOffline,
                      }}
                    >
                      Cancel Pending Weighment?
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCancelModalItem(null)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: 18,
                        color: mutedText,
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: secondaryText,
                      margin: "0 0 16px 0",
                      lineHeight: 1.5,
                    }}
                  >
                    Cancel pending transaction{" "}
                    <strong>{cancelModalItem.ticket}</strong> for vehicle{" "}
                    <strong>{cancelModalItem.vehicle}</strong> (First weight:{" "}
                    {cancelModalItem.firstWeight}).
                  </p>

                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 700,
                        color: secondaryText,
                        marginBottom: 6,
                      }}
                    >
                      Cancellation Reason *
                    </label>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      style={{
                        width: "100%",
                        height: 44,
                        padding: "0 12px",
                        borderRadius: 8,
                        border: `1px solid ${border}`,
                        background: inputBg,
                        color: primaryText,
                        fontSize: 13,
                      }}
                    >
                      <option>Vehicle left weighbridge</option>
                      <option>Duplicate transaction</option>
                      <option>Wrong vehicle number</option>
                      <option>Device issue</option>
                      <option>Customer cancelled</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        height: 46,
                        borderRadius: 8,
                        background: statusOffline,
                        color: "#FFF",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Cancel Weighment
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelModalItem(null)}
                      style={{
                        padding: "0 16px",
                        height: 46,
                        borderRadius: 8,
                        background: inputBg,
                        border: `1px solid ${border}`,
                        color: secondaryText,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Keep Weighment
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
