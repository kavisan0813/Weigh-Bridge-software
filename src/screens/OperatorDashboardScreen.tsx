import React, { useState } from "react";
import type { OperatorView } from "./OperatorScreens";

type ViewDevice = "desktop" | "tablet" | "mobile";
type WeightState =
  | "no-vehicle"
  | "stabilizing"
  | "stable"
  | "capturing"
  | "device-error";
type SystemHardwareState =
  | "all-online"
  | "wb-offline"
  | "indicator-offline"
  | "printer-offline"
  | "camera-offline"
  | "empty"
  | "loading"
  | "error";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: OperatorView) => void;
}

export default function OperatorDashboardScreen({
  darkMode,
  onToggleDark,
  onNavigate,
}: Props) {
  // Demo State Controls
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [weightState, setWeightState] = useState<WeightState>("stable");
  const [hardwareState, setHardwareState] =
    useState<SystemHardwareState>("all-online");

  // Design Tokens based on MASTER DESIGN SYSTEM
  const dm = darkMode;

  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const elevatedSurface = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const divider = dm ? "#1F2937" : "#F1F5F9";
  const inputBg = dm ? "#111827" : "#FFFFFF";

  // Brand Colors (Orange + Gold)
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const primaryOrangeHover = dm ? "#F97316" : "#EA580C";
  const primaryOrangeSoft = dm ? "#2A1809" : "#FFF7ED";
  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";

  // Status Colors
  const statusOnline = "#16A34A";
  const statusWarning = "#F59E0B";
  const statusOffline = "#DC2626";
  const statusInfo = "#2563EB";
  const statusWeighing = "#8B5CF6";

  // Simulated Hardware Statuses based on hardwareState
  const isWbOffline = hardwareState === "wb-offline";
  const isIndicatorOffline =
    hardwareState === "indicator-offline" || weightState === "device-error";
  const isPrinterOffline = hardwareState === "printer-offline";
  const isCameraOffline = hardwareState === "camera-offline";
  const isEmptyState = hardwareState === "empty";
  const isErrorState = hardwareState === "error";

  const canStartWeighment =
    !isWbOffline && !isIndicatorOffline && !isErrorState;

  // Weight State Data
  const weightValues = {
    "no-vehicle": {
      weight: "0 KG",
      status: "WAITING FOR VEHICLE",
      statusColor: statusInfo,
      indicator: "✓ READY",
    },
    stabilizing: {
      weight: "38,460 KG",
      status: "STABILIZING",
      statusColor: statusWeighing,
      indicator: "⏳ SAMPLING",
    },
    stable: {
      weight: "38,500 KG",
      status: "STABLE",
      statusColor: statusOnline,
      indicator: "✓ READY",
    },
    capturing: {
      weight: "38,500 KG",
      status: "CAPTURING...",
      statusColor: statusWeighing,
      indicator: "⚙️ RECORDING",
    },
    "device-error": {
      weight: "-- KG",
      status: "INDICATOR DISCONNECTED",
      statusColor: statusOffline,
      indicator: "✕ OFFLINE",
    },
  };

  const currentWeightData = weightValues[weightState];

  // Pending Weighments Data
  const pendingWeighments = [
    {
      ticket: "WB-2026-00462",
      vehicle: "TN22GH3456",
      customer: "ABC Transport",
      material: "Gravel",
      firstWeight: "24,500 KG",
      time: "10:45 AM",
      status: "AWAITING SECOND WEIGHING",
    },
    {
      ticket: "WB-2026-00459",
      vehicle: "TN09AB7821",
      customer: "XYZ Logistics",
      material: "Sand",
      firstWeight: "21,800 KG",
      time: "10:32 AM",
      status: "AWAITING SECOND WEIGHING",
    },
    {
      ticket: "WB-2026-00457",
      vehicle: "TN18CD4521",
      customer: "Metro Transport",
      material: "Cement",
      firstWeight: "18,600 KG",
      time: "10:15 AM",
      status: "AWAITING SECOND WEIGHING",
    },
    {
      ticket: "WB-2026-00451",
      vehicle: "TN37GH3345",
      customer: "Global Infra",
      material: "Iron Ore",
      firstWeight: "19,400 KG",
      time: "09:58 AM",
      status: "AWAITING SECOND WEIGHING",
    },
  ];

  // Recent Transactions Data
  const recentTransactions = [
    {
      ticket: "WB-2026-00458",
      vehicle: "TN20AB1234",
      customer: "BuildCorp",
      material: "Gravel",
      gross: "38,500 KG",
      tare: "13,500 KG",
      net: "25,000 KG",
      time: "10:51 AM",
      status: "COMPLETED",
    },
    {
      ticket: "WB-2026-00456",
      vehicle: "TN22JK7102",
      customer: "SteelWorks",
      material: "Steel Bars",
      gross: "42,200 KG",
      tare: "14,200 KG",
      net: "28,000 KG",
      time: "10:28 AM",
      status: "COMPLETED",
    },
    {
      ticket: "WB-2026-00454",
      vehicle: "TN37GH3345",
      customer: "Apex Quarry",
      material: "Aggregates",
      gross: "37,700 KG",
      tare: "13,500 KG",
      net: "24,200 KG",
      time: "10:10 AM",
      status: "COMPLETED",
    },
    {
      ticket: "WB-2026-00448",
      vehicle: "TN10LM5321",
      customer: "City Infra",
      material: "Cement",
      gross: "31,800 KG",
      tare: "13,200 KG",
      net: "18,600 KG",
      time: "09:42 AM",
      status: "COMPLETED",
    },
    {
      ticket: "WB-2026-00444",
      vehicle: "TN18NP8882",
      customer: "Prime Mines",
      material: "Coal",
      gross: "35,000 KG",
      tare: "14,000 KG",
      net: "21,000 KG",
      time: "09:15 AM",
      status: "COMPLETED",
    },
  ];
  const showPresetToolbar = false;

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
          OPERATOR DEMO PRESET TOOLBAR (COMMENTED OUT)
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
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: primaryOrange,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#FFF",
                fontSize: 13,
              }}
            >
              ⚖
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#F9FAFB",
                  letterSpacing: "0.03em",
                }}
              >
                WEIGHBRIDGE CONTROL CENTER
              </div>
              <div
                style={{ fontSize: 10, color: secondaryGold, fontWeight: 600 }}
              >
                SCREEN 20 — OPERATOR DASHBOARD (WB-01)
              </div>
            </div>
          </div>

          {/* Middle: Interactive Controls for Hardware & Weight States */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {/* Weight Simulator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,255,255,0.06)",
                padding: "3px 6px",
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Weight State:
              </span>
              {[
                { id: "stable", label: "Stable (38.5t)" },
                { id: "stabilizing", label: "Stabilizing" },
                { id: "no-vehicle", label: "No Vehicle" },
                { id: "capturing", label: "Capturing" },
                { id: "device-error", label: "Error" },
              ].map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => setWeightState(ws.id as WeightState)}
                  style={{
                    padding: "3px 7px",
                    borderRadius: 4,
                    fontSize: 10.5,
                    fontWeight: weightState === ws.id ? 700 : 500,
                    border:
                      weightState === ws.id
                        ? `1px solid ${primaryOrange}`
                        : "none",
                    background:
                      weightState === ws.id ? primaryOrange : "transparent",
                    color: weightState === ws.id ? "#FFF" : "#CBD5E1",
                    cursor: "pointer",
                  }}
                >
                  {ws.label}
                </button>
              ))}
            </div>

            {/* Hardware Status Simulator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,255,255,0.06)",
                padding: "3px 6px",
                borderRadius: 6,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#94A3B8",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Hardware State:
              </span>
              {[
                { id: "all-online", label: "All Online" },
                { id: "wb-offline", label: "WB Offline" },
                { id: "indicator-offline", label: "Indicator Off" },
                { id: "printer-offline", label: "Printer Off" },
                { id: "loading", label: "Loading" },
                { id: "empty", label: "Empty" },
              ].map((hs) => (
                <button
                  key={hs.id}
                  onClick={() => setHardwareState(hs.id as SystemHardwareState)}
                  style={{
                    padding: "3px 7px",
                    borderRadius: 4,
                    fontSize: 10.5,
                    fontWeight: hardwareState === hs.id ? 700 : 500,
                    border:
                      hardwareState === hs.id
                        ? `1px solid ${secondaryGold}`
                        : "none",
                    background:
                      hardwareState === hs.id
                        ? "rgba(201,154,46,0.25)"
                        : "transparent",
                    color: hardwareState === hs.id ? "#FDE047" : "#CBD5E1",
                    cursor: "pointer",
                  }}
                >
                  {hs.label}
                </button>
              ))}
            </div>
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
            {/* Phone Notch */}
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
                padding: "16px 20px",
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
                  Good Morning, Arun 👋
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: secondaryGold,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isWbOffline ? statusOffline : statusOnline,
                    }}
                  />
                  WB-01 Main Gate • {isWbOffline ? "OFFLINE" : "ONLINE"}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: `1px solid ${border}`,
                    background: inputBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🔔
                </button>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    background: primaryOrange,
                    color: "#FFF",
                    fontWeight: 700,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  AK
                </div>
              </div>
            </div>

            {/* Mobile Body Content */}
            <div
              style={{
                padding: "16px 20px 80px 20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Hardware Warning Alert if offline */}
              {isWbOffline && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: dm ? "#450A0A" : "#FEF2F2",
                    border: `1px solid ${statusOffline}`,
                    color: statusOffline,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ⚠️ WB-01 Connection Unavailable. Weighments paused.
                </div>
              )}

              {/* Mobile Primary Action: START WEIGHMENT CTA */}
              <button
                onClick={() => onNavigate("live-weighment")}
                disabled={!canStartWeighment}
                style={{
                  width: "100%",
                  minHeight: 56,
                  borderRadius: 12,
                  background: canStartWeighment ? primaryOrange : "#9CA3AF",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: canStartWeighment
                    ? "0 4px 14px rgba(249,115,22,0.35)"
                    : "none",
                  cursor: canStartWeighment ? "pointer" : "not-allowed",
                }}
              >
                <span>🚛</span> + START WEIGHMENT →
              </button>

              {/* Mobile Live Weight Card */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: elevatedSurface,
                  border: `1.5px solid ${currentWeightData.statusColor}`,
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
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: mutedText,
                      letterSpacing: "0.05em",
                    }}
                  >
                    CURRENT WEIGHT
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: `${currentWeightData.statusColor}20`,
                      color: currentWeightData.statusColor,
                    }}
                  >
                    ● {currentWeightData.status}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    fontFamily: "monospace",
                    color: primaryText,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {currentWeightData.weight}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: secondaryText,
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    Indicator:{" "}
                    <strong
                      style={{
                        color: isIndicatorOffline
                          ? statusOffline
                          : statusOnline,
                      }}
                    >
                      {currentWeightData.indicator}
                    </strong>
                  </span>
                  <button
                    onClick={() => onNavigate("live-weighment")}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: primaryOrangeSoft,
                      border: `1px solid ${primaryOrange}`,
                      color: primaryOrange,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    Capture
                  </button>
                </div>
              </div>

              {/* Mobile Summary KPI 2x2 Grid */}
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
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10.5,
                      color: mutedText,
                      fontWeight: 600,
                    }}
                  >
                    VEHICLES
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    58
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10.5,
                      color: mutedText,
                      fontWeight: 600,
                    }}
                  >
                    COMPLETED
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: statusOnline,
                    }}
                  >
                    54
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10.5,
                      color: mutedText,
                      fontWeight: 600,
                    }}
                  >
                    PENDING
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: secondaryGold,
                    }}
                  >
                    4
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10.5,
                      color: mutedText,
                      fontWeight: 600,
                    }}
                  >
                    NET WEIGHT
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: primaryOrange,
                    }}
                  >
                    1,248 MT
                  </div>
                </div>
              </div>

              {/* Mobile Pending Weighments */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: primaryText,
                    }}
                  >
                    Pending Weighments (4)
                  </span>
                  <button
                    onClick={() => onNavigate("pending-weighments")}
                    style={{
                      background: "none",
                      border: "none",
                      color: primaryOrange,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    View All
                  </button>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {pendingWeighments.slice(0, 2).map((pw) => (
                    <div
                      key={pw.ticket}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        background: elevatedSurface,
                        border: `1px solid ${border}`,
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
                          {pw.vehicle}
                        </div>
                        <div style={{ fontSize: 11, color: secondaryText }}>
                          {pw.material} • 1st: {pw.firstWeight}
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate("pending-weighments")}
                        style={{
                          height: 38,
                          padding: "0 12px",
                          borderRadius: 8,
                          background: primaryOrange,
                          color: "#FFF",
                          border: "none",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile System Status Bar */}
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: elevatedSurface,
                  border: `1px solid ${border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: mutedText,
                    marginBottom: 6,
                  }}
                >
                  HARDWARE STATUS
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    fontSize: 11,
                  }}
                >
                  <div>
                    Indicator:{" "}
                    <span
                      style={{
                        color: isIndicatorOffline
                          ? statusOffline
                          : statusOnline,
                        fontWeight: 700,
                      }}
                    >
                      {isIndicatorOffline ? "✕ Off" : "✓ On"}
                    </span>
                  </div>
                  <div>
                    Printer:{" "}
                    <span
                      style={{
                        color: isPrinterOffline ? statusOffline : statusOnline,
                        fontWeight: 700,
                      }}
                    >
                      {isPrinterOffline ? "✕ Off" : "✓ On"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Navigation (Master Design System Specification) */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 64,
                background: dm ? "#111827" : "#FFFFFF",
                borderTop: `1px solid ${border}`,
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                alignItems: "center",
                zIndex: 40,
              }}
            >
              {[
                { id: "dashboard", label: "Home", icon: "🏠" },
                { id: "transactions", label: "History", icon: "📋" },
                { id: "weigh", label: "WEIGH", icon: "⚖️", isProminent: true },
                { id: "alerts", label: "Alerts", icon: "🔔" },
                { id: "more", label: "More", icon: "⚙️" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "weigh") onNavigate("live-weighment");
                    else if (item.id === "transactions")
                      onNavigate("live-weighment");
                    else if (item.id === "alerts")
                      alert("Viewing operational alerts");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    color:
                      item.id === "dashboard" ? primaryOrange : secondaryText,
                    cursor: "pointer",
                  }}
                >
                  {item.isProminent ? (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: primaryOrange,
                        color: "#FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        boxShadow: "0 4px 10px rgba(249,115,22,0.4)",
                        marginTop: -16,
                      }}
                    >
                      ⚖️
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: item.id === "dashboard" ? 700 : 500,
                        }}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </button>
              ))}
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
              background: surface,
              boxShadow:
                viewDevice === "tablet"
                  ? "0 20px 40px rgba(0,0,0,0.15)"
                  : "none",
              borderRadius: viewDevice === "tablet" ? 16 : 0,
              overflow: "hidden",
            }}
          >
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                RIGHT DASHBOARD MAIN CONTROL CENTER AREA
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <main
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {/* Top Header Bar */}
              <header
                style={{
                  height: 68,
                  padding: "0 28px",
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
                    Good Morning, Arun 👋
                  </h1>
                  <p
                    style={{
                      fontSize: 12.5,
                      color: mutedText,
                      margin: "2px 0 0 0",
                    }}
                  >
                    Ready to start today's weighbridge operations.
                  </p>
                </div>

                {/* Right Status Badge & Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* Station Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: isWbOffline
                        ? "rgba(220,38,38,0.12)"
                        : "rgba(22,163,74,0.12)",
                      border: `1px solid ${isWbOffline ? "rgba(220,38,38,0.3)" : "rgba(22,163,74,0.3)"}`,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: isWbOffline ? statusOffline : statusOnline,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        WB-01 — Main Gate
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: isWbOffline ? statusOffline : statusOnline,
                        }}
                      >
                        ● {isWbOffline ? "OFFLINE" : "ONLINE"}
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      border: `1px solid ${border}`,
                      background: inputBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 16,
                      position: "relative",
                    }}
                  >
                    🔔
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: primaryOrange,
                      }}
                    />
                  </button>
                </div>
              </header>

              {/* System Banners for Offline/Error States */}
              {isWbOffline && (
                <div
                  style={{
                    margin: "16px 28px 0 28px",
                    padding: "14px 20px",
                    borderRadius: 10,
                    background: dm ? "#450A0A" : "#FEF2F2",
                    border: `1.5px solid ${statusOffline}`,
                    color: statusOffline,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>
                        Weighbridge Connection Unavailable
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 400,
                          marginTop: 2,
                        }}
                      >
                        New weighments cannot be started. Existing transaction
                        data is preserved.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setHardwareState("all-online")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      background: statusOffline,
                      color: "#FFF",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Retry Connection
                  </button>
                </div>
              )}

              {isIndicatorOffline && !isWbOffline && (
                <div
                  style={{
                    margin: "16px 28px 0 28px",
                    padding: "14px 20px",
                    borderRadius: 10,
                    background: dm ? "#450A0A" : "#FEF2F2",
                    border: `1.5px solid ${statusOffline}`,
                    color: statusOffline,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ fontSize: 20 }}>🔌</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>
                        Weight Indicator Disconnected
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 400,
                          marginTop: 2,
                        }}
                      >
                        Live weight measurement signal unavailable. Reconnect
                        device to start weighing.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setHardwareState("all-online");
                      setWeightState("stable");
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      background: statusOffline,
                      color: "#FFF",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Reconnect Device
                  </button>
                </div>
              )}

              {isPrinterOffline && (
                <div
                  style={{
                    margin: "16px 28px 0 28px",
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: dm ? "#422F0A" : "#FFFBEB",
                    border: `1px solid ${secondaryGold}`,
                    color: secondaryGold,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span>🖨️</span>
                    <span>
                      <strong>Printer Offline</strong> — Weighments can
                      continue, but tickets cannot be automatically printed.
                    </span>
                  </div>
                  <button
                    onClick={() => setHardwareState("all-online")}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      background: secondaryGold,
                      color: "#FFF",
                      border: "none",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Retry Printer
                  </button>
                </div>
              )}

              {/* Main Dashboard Content Area */}
              <div
                style={{
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    PROMINENT WEIGHBRIDGE STATUS BAR (Master Design System)
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    background: elevatedSurface,
                    border: `1px solid ${border}`,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: mutedText,
                          letterSpacing: "0.08em",
                        }}
                      >
                        ACTIVE STATION
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: primaryText,
                          marginTop: 2,
                        }}
                      >
                        WB-01 — Main Gate
                      </div>
                    </div>

                    <div style={{ height: 28, width: 1, background: border }} />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        fontSize: 12,
                      }}
                    >
                      <div>
                        <span style={{ color: mutedText }}>Indicator: </span>
                        <strong
                          style={{
                            color: isIndicatorOffline
                              ? statusOffline
                              : statusOnline,
                          }}
                        >
                          {isIndicatorOffline ? "✕ Offline" : "✓ Connected"}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: mutedText }}>Printer: </span>
                        <strong
                          style={{
                            color: isPrinterOffline
                              ? statusWarning
                              : statusOnline,
                          }}
                        >
                          {isPrinterOffline ? "✕ Offline" : "✓ Connected"}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: mutedText }}>Camera: </span>
                        <strong
                          style={{
                            color: isCameraOffline
                              ? statusWarning
                              : statusOnline,
                          }}
                        >
                          {isCameraOffline ? "✕ Offline" : "✓ Connected"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ fontSize: 11.5, color: mutedText }}>
                      Last Sync: <strong>Just now</strong>
                    </span>
                    <button
                      onClick={() =>
                        alert(
                          "Weighbridge WB-01 Diagnostics: All sensors operating normally.",
                        )
                      }
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: `1px solid ${border}`,
                        background: inputBg,
                        color: secondaryText,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      View Status
                    </button>
                  </div>
                </div>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ROW 1: PRIMARY ACTION (+ START WEIGHMENT) & LIVE WEIGHT
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      viewDevice === "tablet" ? "1fr" : "1.1fr 1fr",
                    gap: 20,
                  }}
                >
                  {/* Primary CTA: + START WEIGHMENT CARD */}
                  <div
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      background: canStartWeighment
                        ? dm
                          ? "linear-gradient(135deg, #1F2937 0%, #2A1809 100%)"
                          : "linear-gradient(135deg, #FFFFFF 0%, #FFF7ED 100%)"
                        : elevatedSurface,
                      border: `2px solid ${canStartWeighment ? primaryOrange : border}`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      boxShadow: canStartWeighment
                        ? "0 8px 24px rgba(249,115,22,0.15)"
                        : "none",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 12,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: primaryOrange,
                            letterSpacing: "0.12em",
                          }}
                        >
                          PRIMARY OPERATION
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: statusOnline,
                            fontWeight: 700,
                          }}
                        >
                          ● WB-01 READY
                        </span>
                      </div>

                      <h2
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          color: primaryText,
                          margin: "0 0 6px 0",
                        }}
                      >
                        New Vehicle Weighment
                      </h2>
                      <p
                        style={{
                          fontSize: 13.5,
                          color: secondaryText,
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        Start a new vehicle weighing process. Capture gross/tare
                        weight and print verified ticket.
                      </p>
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <button
                        onClick={() => onNavigate("live-weighment")}
                        disabled={!canStartWeighment}
                        style={{
                          width: "100%",
                          height: 56,
                          borderRadius: 10,
                          background: canStartWeighment
                            ? primaryOrange
                            : "#9CA3AF",
                          color: "#FFFFFF",
                          border: "none",
                          fontSize: 16,
                          fontWeight: 800,
                          cursor: canStartWeighment ? "pointer" : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 12,
                          boxShadow: canStartWeighment
                            ? "0 4px 16px rgba(249,115,22,0.4)"
                            : "none",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (canStartWeighment)
                            e.currentTarget.style.background =
                              primaryOrangeHover;
                        }}
                        onMouseLeave={(e) => {
                          if (canStartWeighment)
                            e.currentTarget.style.background = primaryOrange;
                        }}
                      >
                        <span style={{ fontSize: 20 }}>🚛</span>+ START
                        WEIGHMENT
                        <span style={{ fontSize: 18 }}>→</span>
                      </button>
                    </div>
                  </div>

                  {/* LIVE WEIGHT HUB CARD */}
                  <div
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      background: elevatedSurface,
                      border: `1.5px solid ${currentWeightData.statusColor}`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 12,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: mutedText,
                            letterSpacing: "0.08em",
                          }}
                        >
                          LIVE WEIGHT INDICATOR
                        </span>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 12px",
                            borderRadius: 999,
                            background: `${currentWeightData.statusColor}18`,
                            color: currentWeightData.statusColor,
                            fontSize: 11.5,
                            fontWeight: 700,
                          }}
                        >
                          ● {currentWeightData.status}
                        </div>
                      </div>

                      {/* Tabular Numerals Weight Display */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 12,
                          margin: "12px 0 8px 0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 44,
                            fontWeight: 800,
                            fontFamily: "monospace",
                            color: primaryText,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {currentWeightData.weight}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: secondaryText,
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                        }}
                      >
                        <span>
                          Signal:{" "}
                          <strong
                            style={{
                              color: isIndicatorOffline
                                ? statusOffline
                                : statusOnline,
                            }}
                          >
                            {currentWeightData.indicator}
                          </strong>
                        </span>
                        <span>
                          Last Updated: <strong>Just now</strong>
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: `1px solid ${border}`,
                        paddingTop: 14,
                      }}
                    >
                      <span style={{ fontSize: 12, color: mutedText }}>
                        Preview Only • Real-time weighing link active
                      </span>
                      <button
                        onClick={() => {
                          if (weightState === "stable") {
                            setWeightState("capturing");
                            setTimeout(() => {
                              alert("Weight recorded: 38,500 KG STABLE");
                              setWeightState("stable");
                            }, 1000);
                          } else {
                            alert("Weight must be STABLE before capture.");
                          }
                        }}
                        disabled={weightState !== "stable"}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 8,
                          background:
                            weightState === "stable"
                              ? primaryOrangeSoft
                              : "transparent",
                          border: `1px solid ${weightState === "stable" ? primaryOrange : border}`,
                          color:
                            weightState === "stable"
                              ? primaryOrange
                              : mutedText,
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor:
                            weightState === "stable"
                              ? "pointer"
                              : "not-allowed",
                        }}
                      >
                        Capture Weight
                      </button>
                    </div>
                  </div>
                </div>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ROW 2: TODAY'S SUMMARY KPI CARDS (4 Compact Cards)
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      margin: "0 0 12px 0",
                      color: primaryText,
                    }}
                  >
                    Today's Operational Summary
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 16,
                    }}
                  >
                    {/* KPI 1 */}
                    <div
                      style={{
                        padding: 18,
                        borderRadius: 12,
                        background: surface,
                        border: `1px solid ${border}`,
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
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: mutedText,
                          }}
                        >
                          TOTAL VEHICLES
                        </span>
                        <span style={{ fontSize: 14 }}>🚛</span>
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 800,
                          color: primaryText,
                          fontFamily: "monospace",
                        }}
                      >
                        58
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: statusOnline,
                          fontWeight: 600,
                          marginTop: 4,
                        }}
                      >
                        +12.5% vs yesterday
                      </div>
                    </div>

                    {/* KPI 2 */}
                    <div
                      style={{
                        padding: 18,
                        borderRadius: 12,
                        background: surface,
                        border: `1px solid ${border}`,
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
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: mutedText,
                          }}
                        >
                          COMPLETED
                        </span>
                        <span style={{ fontSize: 14 }}>✓</span>
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 800,
                          color: statusOnline,
                          fontFamily: "monospace",
                        }}
                      >
                        54
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: mutedText,
                          marginTop: 4,
                        }}
                      >
                        93.1% Completion Rate
                      </div>
                    </div>

                    {/* KPI 3 */}
                    <div
                      style={{
                        padding: 18,
                        borderRadius: 12,
                        background: surface,
                        border: `1px solid ${border}`,
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
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: mutedText,
                          }}
                        >
                          PENDING
                        </span>
                        <span style={{ fontSize: 14 }}>⏳</span>
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 800,
                          color: secondaryGold,
                          fontFamily: "monospace",
                        }}
                      >
                        4
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: secondaryGold,
                          fontWeight: 600,
                          marginTop: 4,
                        }}
                      >
                        Awaiting 2nd Weighing
                      </div>
                    </div>

                    {/* KPI 4 */}
                    <div
                      style={{
                        padding: 18,
                        borderRadius: 12,
                        background: surface,
                        border: `1px solid ${border}`,
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
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: mutedText,
                          }}
                        >
                          NET WEIGHT
                        </span>
                        <span style={{ fontSize: 14 }}>⚖️</span>
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          color: primaryOrange,
                          fontFamily: "monospace",
                        }}
                      >
                        1,248 MT
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: mutedText,
                          marginTop: 4,
                        }}
                      >
                        Today's Processed Cargo
                      </div>
                    </div>
                  </div>
                </div>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ROW 3: PENDING WEIGHMENTS SECTION
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <div
                  style={{
                    padding: 20,
                    borderRadius: 14,
                    background: surface,
                    border: `1px solid ${border}`,
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
                    <div>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          margin: 0,
                          color: primaryText,
                        }}
                      >
                        Pending Weighments{" "}
                        <span
                          style={{
                            fontSize: 13,
                            color: secondaryGold,
                            fontWeight: 700,
                          }}
                        >
                          (4 Vehicles)
                        </span>
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: mutedText,
                          margin: "2px 0 0 0",
                        }}
                      >
                        Vehicles registered for gross/tare weight awaiting
                        second weighing.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate("pending-weighments")}
                      style={{
                        background: "none",
                        border: "none",
                        color: primaryOrange,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View All Pending →
                    </button>
                  </div>

                  {/* Cards List */}
                  {isEmptyState ? (
                    <div
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: mutedText,
                        background: elevatedSurface,
                        borderRadius: 10,
                      }}
                    >
                      <span style={{ fontSize: 24 }}>🎉</span>
                      <div style={{ fontWeight: 700, marginTop: 8 }}>
                        No Pending Weighments
                      </div>
                      <div style={{ fontSize: 12 }}>
                        All vehicles have completed second weighing for today.
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          viewDevice === "tablet" ? "1fr" : "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      {pendingWeighments.map((pw) => (
                        <div
                          key={pw.ticket}
                          style={{
                            padding: 16,
                            borderRadius: 10,
                            background: elevatedSurface,
                            border: `1px solid ${border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 800,
                                  fontSize: 15,
                                  color: primaryText,
                                }}
                              >
                                {pw.vehicle}
                              </span>
                              <span
                                style={{
                                  fontSize: 11,
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  background: primaryOrangeSoft,
                                  color: primaryOrange,
                                  fontWeight: 700,
                                }}
                              >
                                {pw.ticket}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: 12.5,
                                color: secondaryText,
                                marginTop: 4,
                              }}
                            >
                              {pw.customer} •{" "}
                              <strong style={{ color: primaryText }}>
                                {pw.material}
                              </strong>
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                color: mutedText,
                                marginTop: 2,
                              }}
                            >
                              1st Weight:{" "}
                              <strong style={{ color: secondaryGold }}>
                                {pw.firstWeight}
                              </strong>{" "}
                              • Registered: {pw.time}
                            </div>
                          </div>

                          <button
                            onClick={() => onNavigate("pending-weighments")}
                            style={{
                              height: 42,
                              padding: "0 16px",
                              borderRadius: 8,
                              background: primaryOrange,
                              color: "#FFFFFF",
                              border: "none",
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: "pointer",
                              boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
                            }}
                          >
                            Continue →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ROW 4: RECENT TRANSACTIONS TABLE
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <div
                  style={{
                    borderRadius: 14,
                    background: surface,
                    border: `1px solid ${border}`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: `1px solid ${divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          margin: 0,
                          color: primaryText,
                        }}
                      >
                        Recent Transactions
                      </h3>
                      <span style={{ fontSize: 12, color: mutedText }}>
                        Last 5 completed weighment tickets for WB-01
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate("live-weighment")}
                      style={{
                        background: "none",
                        border: "none",
                        color: primaryOrange,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      View All Transactions →
                    </button>
                  </div>

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
                            background: dm ? "#111827" : "#F8FAFC",
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
                            VEHICLE
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
                            GROSS
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            TARE
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            NET WEIGHT
                          </th>
                          <th
                            style={{
                              padding: "12px 18px",
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            TIME
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
                            }}
                          >
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((tx) => (
                          <tr
                            key={tx.ticket}
                            style={{ borderBottom: `1px solid ${divider}` }}
                          >
                            <td
                              style={{
                                padding: "14px 18px",
                                fontWeight: 800,
                                color: primaryOrange,
                              }}
                            >
                              {tx.ticket}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                fontWeight: 700,
                                color: primaryText,
                                fontFamily: "monospace",
                              }}
                            >
                              {tx.vehicle}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                color: secondaryText,
                              }}
                            >
                              {tx.material}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                color: secondaryText,
                                fontFamily: "monospace",
                              }}
                            >
                              {tx.gross}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                color: secondaryText,
                                fontFamily: "monospace",
                              }}
                            >
                              {tx.tare}
                            </td>
                            <td
                              style={{
                                padding: "14px 18px",
                                fontWeight: 800,
                                color: statusOnline,
                                fontFamily: "monospace",
                              }}
                            >
                              {tx.net}
                            </td>
                            <td
                              style={{ padding: "14px 18px", color: mutedText }}
                            >
                              {tx.time}
                            </td>
                            <td style={{ padding: "14px 18px" }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: 999,
                                  background: "rgba(22,163,74,0.15)",
                                  color: statusOnline,
                                }}
                              >
                                ● {tx.status}
                              </span>
                            </td>
                            <td style={{ padding: "14px 18px" }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  onClick={() => onNavigate("ticket-preview")}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: 4,
                                    background: inputBg,
                                    border: `1px solid ${border}`,
                                    color: secondaryText,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  onClick={() =>
                                    alert(`Printing ticket ${tx.ticket}...`)
                                  }
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: 4,
                                    background: primaryOrangeSoft,
                                    border: `1px solid ${primaryOrange}`,
                                    color: primaryOrange,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Print
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ROW 5: HARDWARE HEALTH, CAMERA & SYSTEM ALERTS
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      viewDevice === "tablet" ? "1fr" : "1fr 1fr 1fr",
                    gap: 20,
                  }}
                >
                  {/* DEVICE HEALTH */}
                  <div
                    style={{
                      padding: 18,
                      borderRadius: 12,
                      background: surface,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: primaryText,
                        marginBottom: 12,
                      }}
                    >
                      SYSTEM DEVICE HEALTH
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
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: 6,
                          background: elevatedSurface,
                        }}
                      >
                        <span>Weight Indicator</span>
                        <strong
                          style={{
                            color: isIndicatorOffline
                              ? statusOffline
                              : statusOnline,
                          }}
                        >
                          {isIndicatorOffline
                            ? "✕ Disconnected"
                            : "✓ Connected"}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: 6,
                          background: elevatedSurface,
                        }}
                      >
                        <span>Printer</span>
                        <strong
                          style={{
                            color: isPrinterOffline
                              ? statusWarning
                              : statusOnline,
                          }}
                        >
                          {isPrinterOffline ? "✕ Offline" : "✓ Connected"}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: 6,
                          background: elevatedSurface,
                        }}
                      >
                        <span>ANPR Camera</span>
                        <strong
                          style={{
                            color: isCameraOffline
                              ? statusWarning
                              : statusOnline,
                          }}
                        >
                          {isCameraOffline ? "✕ Offline" : "✓ Connected"}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: 6,
                          background: elevatedSurface,
                        }}
                      >
                        <span>Network Gateway</span>
                        <strong style={{ color: statusOnline }}>
                          ✓ Connected (12ms)
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* CAMERA LIVE PREVIEW */}
                  <div
                    style={{
                      padding: 18,
                      borderRadius: 12,
                      background: surface,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        VEHICLE CAMERA PREVIEW
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: statusOnline,
                        }}
                      >
                        ● LIVE
                      </span>
                    </div>

                    <div
                      style={{
                        height: 120,
                        borderRadius: 8,
                        background: dm ? "#0F172A" : "#1E293B",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #334155",
                      }}
                    >
                      {/* Truck camera placeholder frame */}
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 300 120"
                        style={{ opacity: 0.7 }}
                      >
                        <rect
                          x="50"
                          y="30"
                          width="160"
                          height="60"
                          rx="4"
                          fill="#334155"
                        />
                        <path
                          d="M 210 45 L 250 45 L 260 90 L 210 90 Z"
                          fill="#475569"
                        />
                        <circle
                          cx="90"
                          cy="94"
                          r="10"
                          fill="#0F172A"
                          stroke="#64748B"
                          strokeWidth="2"
                        />
                        <circle
                          cx="235"
                          cy="94"
                          r="10"
                          fill="#0F172A"
                          stroke="#F97316"
                          strokeWidth="2"
                        />
                      </svg>

                      {/* Camera Overlay timestamp */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 6,
                          left: 8,
                          fontSize: 10,
                          color: "#F97316",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          background: "rgba(0,0,0,0.6)",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        WB-01 • 10:51:42 AM • ANPR: TN20AB1234
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() =>
                          alert("Image captured and attached to ticket.")
                        }
                        style={{
                          flex: 1,
                          padding: "6px",
                          borderRadius: 6,
                          background: primaryOrangeSoft,
                          border: `1px solid ${primaryOrange}`,
                          color: primaryOrange,
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Capture Image
                      </button>
                      <button
                        onClick={() => alert("Expanding live camera feed...")}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: inputBg,
                          border: `1px solid ${border}`,
                          color: secondaryText,
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Fullscreen
                      </button>
                    </div>
                  </div>

                  {/* SHIFT & ALERTS */}
                  <div
                    style={{
                      padding: 18,
                      borderRadius: 12,
                      background: surface,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: primaryText,
                        marginBottom: 10,
                      }}
                    >
                      OPERATOR SHIFT SUMMARY
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: secondaryText,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div>
                        Shift:{" "}
                        <strong style={{ color: primaryText }}>
                          Morning (06:00 AM – 02:00 PM)
                        </strong>
                      </div>
                      <div>
                        Operator:{" "}
                        <strong style={{ color: primaryOrange }}>
                          Arun Kumar
                        </strong>
                      </div>
                      <div>
                        Completed Tickets:{" "}
                        <strong style={{ color: statusOnline }}>
                          54 Printed
                        </strong>
                      </div>
                      <div>
                        Reprints Requested:{" "}
                        <strong style={{ color: secondaryGold }}>3</strong>
                      </div>
                      <div
                        style={{
                          borderTop: `1px solid ${divider}`,
                          paddingTop: 8,
                          marginTop: 4,
                          fontSize: 11,
                          color: mutedText,
                        }}
                      >
                        🔒 Shift Activity Logged under Employee ID EMP-0012
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
