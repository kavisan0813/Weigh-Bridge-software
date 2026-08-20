import React, { useState } from "react";
import type { OperatorView } from "./OperatorScreens";

type ViewDevice = "desktop" | "tablet" | "mobile";
type WeightState =
  | "no-vehicle"
  | "detecting"
  | "stabilizing"
  | "stable"
  | "capturing"
  | "captured"
  | "indicator-error";
type SystemHardwareState =
  | "all-online"
  | "wb-offline"
  | "printer-offline"
  | "camera-offline"
  | "show-override"
  | "show-cancel";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: OperatorView) => void;
}

export default function LiveWeighmentScreen({ darkMode, onNavigate }: Props) {
  // Viewport & Demo Presets
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [weightState, setWeightState] = useState<WeightState>("stable");
  const [hardwareState, setHardwareState] =
    useState<SystemHardwareState>("all-online");

  // Interactive Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Vehicle left weighbridge");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideAdminCode, setOverrideAdminCode] = useState("");

  // Dark Mode Tokens
  const dm = darkMode;

  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const elevatedSurface = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const inputBg = dm ? "#111827" : "#FFFFFF";

  // Brand Colors (Orange + Gold)
  const primaryOrange = dm ? "#FB923C" : "#F97316";
  const primaryOrangeSoft = dm ? "#2A1809" : "#FFF7ED";

  const secondaryGold = dm ? "#D4A83A" : "#C99A2E";
  const secondaryGoldSoft = dm ? "#422F0A" : "#FFFBEB";

  // Status Colors
  const statusOnline = "#16A34A";
  const statusWarning = "#F59E0B";
  const statusOffline = "#DC2626";
  const statusInfo = "#2563EB";
  const statusWeighing = "#8B5CF6";

  // Hardware Status Checks
  const isWbOffline = hardwareState === "wb-offline";
  const isCameraOffline = hardwareState === "camera-offline";
  const isIndicatorError = weightState === "indicator-error";

  // Weight State Configurations
  const weightValues = {
    "no-vehicle": {
      value: "0",
      unit: "KG",
      status: "WAITING FOR VEHICLE",
      statusColor: statusInfo,
      message: "Drive the vehicle onto the weighbridge platform.",
      canCapture: false,
    },
    detecting: {
      value: "24,800",
      unit: "KG",
      status: "DETECTING VEHICLE",
      statusColor: statusWarning,
      message: "Vehicle detected on deck. Sampling weight sensors...",
      canCapture: false,
    },
    stabilizing: {
      value: "24,850",
      unit: "KG",
      status: "STABILIZING",
      statusColor: statusWeighing,
      message: "Wait for axle vibrations to settle completely.",
      canCapture: false,
    },
    stable: {
      value: "24,850",
      unit: "KG",
      status: "STABLE",
      statusColor: statusOnline,
      message: "Weight is stable and ready to capture.",
      canCapture: true,
    },
    capturing: {
      value: "24,850",
      unit: "KG",
      status: "CAPTURING...",
      statusColor: statusWeighing,
      message: "Recording weight signal & generating audit log...",
      canCapture: false,
    },
    captured: {
      value: "24,850",
      unit: "KG",
      status: "FIRST WEIGHT CAPTURED",
      statusColor: statusOnline,
      message: "First weight recorded at 10:55:24 AM. Ready to proceed.",
      canCapture: false,
    },
    "indicator-error": {
      value: "--",
      unit: "KG",
      status: "INDICATOR ERROR",
      statusColor: statusOffline,
      message: "Weight indicator signal disconnected. Check cabling.",
      canCapture: false,
    },
  };

  const currentData = weightValues[weightState];
  const isCaptureAllowed =
    currentData.canCapture && !isWbOffline && !isIndicatorError;

  // Handler for Capture
  const handleCaptureClick = () => {
    if (!isCaptureAllowed) return;
    setShowConfirmModal(true);
  };

  const handleConfirmWeight = () => {
    setShowConfirmModal(false);
    setWeightState("capturing");
    setTimeout(() => {
      setWeightState("captured");
      alert(
        "Audit Log Event Created: First Weight Captured (24,850 KG) for WB-2026-00463 by Arun Kumar.",
      );
    }, 1200);
  };

  const handleCancelWeighmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCancelModal(false);
    alert(
      `Weighment WB-2026-00463 cancelled. Reason: ${cancelReason}. Recorded in Audit Log.`,
    );
    onNavigate("operator-dashboard");
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideAdminCode) {
      alert("Admin authorization code required for weight override.");
      return;
    }
    setShowOverrideModal(false);
    setWeightState("captured");
    alert(
      `Admin Weight Override Authorized. Reason: ${overrideReason}. Audit Log Created.`,
    );
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
          OPERATOR LIVE WEIGHING PRESET TOOLBAR (COMMENTED OUT)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*
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
            onClick={() => onNavigate("vehicle-entry")}
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
            ← Vehicle Entry
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
              FIRST WEIGHING CONTROL HUB
            </div>
            <div
              style={{ fontSize: 10, color: secondaryGold, fontWeight: 600 }}
            >
              SCREEN 22 — WEIGHMENT WORKFLOW STEP 2
            </div>
          </div>
        </div>

        <div style={{ color: "transparent" }}>Live Weight Presets Tester</div>
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
            Weight Preset:
          </span>
          {[
            { id: "stable", label: "Stable (24.85t)" },
            { id: "stabilizing", label: "Stabilizing" },
            { id: "detecting", label: "Detecting" },
            { id: "no-vehicle", label: "No Vehicle" },
            { id: "captured", label: "Captured" },
            { id: "indicator-error", label: "Scale Error" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setWeightState(st.id as WeightState)}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                fontSize: 10.5,
                fontWeight: weightState === st.id ? 700 : 500,
                border:
                  weightState === st.id
                    ? `1px solid ${primaryOrange}`
                    : "1px solid rgba(255,255,255,0.15)",
                background:
                  weightState === st.id ? primaryOrange : "transparent",
                color: weightState === st.id ? "#FFF" : "#CBD5E1",
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
      */}

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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => onNavigate("vehicle-entry")}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    color: primaryOrange,
                    cursor: "pointer",
                  }}
                >
                  ←
                </button>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: primaryText,
                    }}
                  >
                    First Weighing
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: secondaryGold,
                      fontWeight: 700,
                    }}
                  >
                    WB-01 Main Gate • Step 2
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Body Content */}
            <div
              style={{
                padding: "16px 20px 90px 20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Workflow Progress Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    background: statusOnline,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    background: primaryOrange,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    background: border,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 999,
                    background: border,
                  }}
                />
              </div>

              {/* Mobile Vehicle Summary Pill */}
              <div
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
                      fontSize: 14,
                      fontWeight: 800,
                      color: primaryText,
                      fontFamily: "monospace",
                    }}
                  >
                    TN22GH3456
                  </div>
                  <div style={{ fontSize: 11, color: secondaryText }}>
                    Heavy Truck • Gravel • Sales
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: primaryOrangeSoft,
                    color: primaryOrange,
                  }}
                >
                  WB-2026-00463
                </div>
              </div>

              {/* Mobile Live Weight Card (48-64px Numerals) */}
              <div
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: elevatedSurface,
                  border: `2px solid ${currentData.statusColor}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: mutedText,
                    letterSpacing: "0.08em",
                    marginBottom: 6,
                  }}
                >
                  LIVE WEIGHT
                </div>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    fontFamily: "monospace",
                    color: primaryText,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {currentData.value}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: secondaryGold,
                    marginTop: -4,
                  }}
                >
                  {currentData.unit}
                </div>

                <div
                  style={{
                    marginTop: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 12px",
                    borderRadius: 999,
                    background: `${currentData.statusColor}20`,
                    color: currentData.statusColor,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ● {currentData.status}
                </div>
              </div>

              {/* Mobile Device Status Pill Bar */}
              <div
                style={{
                  padding: 10,
                  borderRadius: 8,
                  background: elevatedSurface,
                  border: `1px solid ${border}`,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                  fontSize: 11,
                }}
              >
                <div>
                  Indicator:{" "}
                  <strong
                    style={{
                      color: isIndicatorError ? statusOffline : statusOnline,
                    }}
                  >
                    {isIndicatorError ? "✕ Off" : "✓ On"}
                  </strong>
                </div>
                <div>
                  Camera:{" "}
                  <strong
                    style={{
                      color: isCameraOffline ? statusWarning : statusOnline,
                    }}
                  >
                    {isCameraOffline ? "✕ Off" : "✓ On"}
                  </strong>
                </div>
              </div>

              {/* Safety Checks */}
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
                  SAFETY CHECKS
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    fontSize: 11,
                    color: statusOnline,
                    fontWeight: 600,
                  }}
                >
                  <div>✓ Vehicle Detected</div>
                  <div>✓ Scale Connected</div>
                  <div>✓ Weight Stable</div>
                  <div>✓ Camera Ready</div>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Bottom Action */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "12px 16px",
                background: surface,
                borderTop: `1px solid ${border}`,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {weightState === "captured" ? (
                <button
                  onClick={() => onNavigate("second-weighment")}
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 10,
                    background: statusOnline,
                    color: "#FFF",
                    border: "none",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  CONTINUE TO SECOND WEIGHING →
                </button>
              ) : (
                <button
                  onClick={handleCaptureClick}
                  disabled={!isCaptureAllowed}
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 10,
                    background: isCaptureAllowed ? primaryOrange : "#9CA3AF",
                    color: "#FFF",
                    border: "none",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: isCaptureAllowed ? "pointer" : "not-allowed",
                  }}
                >
                  {isCaptureAllowed
                    ? "CAPTURE FIRST WEIGHT"
                    : "WAITING FOR STABLE WEIGHT..."}
                </button>
              )}
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
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                DESKTOP HEADER
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  onClick={() => onNavigate("vehicle-entry")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${border}`,
                    background: inputBg,
                    color: secondaryText,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Back to Entry
                </button>
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
                    First Weighing Control
                  </h1>
                  <p
                    style={{
                      fontSize: 12,
                      color: mutedText,
                      margin: "2px 0 0 0",
                    }}
                  >
                    Verify scale stability and capture the gross/tare weight for
                    ticket WB-2026-00463.
                  </p>
                </div>
              </div>
            </header>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                WORKFLOW STEPPER BAR (Step 2: First Weighing Active)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div
              style={{
                padding: "14px 32px",
                background: elevatedSurface,
                borderBottom: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {[
                { step: 1, label: "Vehicle Entry", active: false, done: true },
                {
                  step: 2,
                  label: "First Weighing",
                  active: true,
                  done: weightState === "captured",
                },
                {
                  step: 3,
                  label: "Second Weighing",
                  active: false,
                  done: false,
                },
                {
                  step: 4,
                  label: "Ticket Printed",
                  active: false,
                  done: false,
                },
              ].map((st, idx) => (
                <React.Fragment key={st.step}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: st.done
                          ? statusOnline
                          : st.active
                            ? primaryOrange
                            : dm
                              ? "#374151"
                              : "#E5E7EB",
                        color: st.active || st.done ? "#FFF" : mutedText,
                        fontWeight: 800,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: st.active
                          ? "0 2px 8px rgba(249,115,22,0.35)"
                          : "none",
                      }}
                    >
                      {st.done ? "✓" : st.step}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: st.active ? 800 : 600,
                          color: st.active
                            ? primaryOrange
                            : st.done
                              ? statusOnline
                              : primaryText,
                        }}
                      >
                        Step {st.step}: {st.label}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: st.active
                            ? primaryOrange
                            : st.done
                              ? statusOnline
                              : mutedText,
                          fontWeight: 500,
                        }}
                      >
                        {st.done
                          ? "COMPLETED"
                          : st.active
                            ? "ACTIVE WEIGHING"
                            : "PENDING"}
                      </div>
                    </div>
                  </div>
                  {idx < 3 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: border,
                        margin: "0 20px",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Offline Alerts */}
            {isWbOffline && (
              <div
                style={{
                  margin: "16px 32px 0 32px",
                  padding: 14,
                  borderRadius: 8,
                  background: dm ? "#450A0A" : "#FEF2F2",
                  border: `1px solid ${statusOffline}`,
                  color: statusOffline,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                ⚠️ WB-01 Weighbridge connection unavailable. Scale capture
                disabled.
              </div>
            )}

            {isIndicatorError && (
              <div
                style={{
                  margin: "16px 32px 0 32px",
                  padding: 14,
                  borderRadius: 8,
                  background: dm ? "#450A0A" : "#FEF2F2",
                  border: `1px solid ${statusOffline}`,
                  color: statusOffline,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                🔌 Weight Indicator disconnected. Check physical load cell
                sensor cable.
              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                VEHICLE SUMMARY COMPACT CARD (READ-ONLY)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div
              style={{
                margin: "16px 32px 0 32px",
                padding: "14px 20px",
                borderRadius: 12,
                background: surface,
                border: `1px solid ${border}`,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: mutedText,
                      letterSpacing: "0.05em",
                    }}
                  >
                    VEHICLE NUMBER
                  </span>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: primaryOrange,
                      fontFamily: "monospace",
                      marginTop: 2,
                    }}
                  >
                    TN22GH3456
                  </div>
                </div>

                <div style={{ height: 24, width: 1, background: border }} />

                <div
                  style={{
                    fontSize: 12.5,
                    color: secondaryText,
                    display: "flex",
                    gap: 16,
                  }}
                >
                  <div>
                    Type:{" "}
                    <strong style={{ color: primaryText }}>Heavy Truck</strong>
                  </div>
                  <div>
                    Driver:{" "}
                    <strong style={{ color: primaryText }}>Arun Kumar</strong>
                  </div>
                  <div>
                    Customer:{" "}
                    <strong style={{ color: primaryText }}>
                      Metro Builders
                    </strong>
                  </div>
                  <div>
                    Material:{" "}
                    <strong style={{ color: primaryText }}>Gravel</strong>
                  </div>
                  <div>
                    Transaction:{" "}
                    <strong style={{ color: secondaryGold }}>Sales</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: statusInfo,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: "rgba(37,99,235,0.12)",
                  }}
                >
                  TICKET # WB-2026-00463
                </span>
                <button
                  onClick={() => onNavigate("vehicle-entry")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${border}`,
                    background: inputBg,
                    color: secondaryText,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Edit Entry Details
                </button>
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                MAIN CONTENT GRID (Live Weight Center Hub + Right Panel)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div
              style={{
                flex: 1,
                padding: "20px 32px 32px 32px",
                display: "grid",
                gridTemplateColumns:
                  viewDevice === "tablet" ? "1fr" : "1.3fr 0.7fr",
                gap: 24,
                overflowY: "auto",
              }}
            >
              {/* LEFT COLUMN: MAIN LIVE WEIGHT CARD & SETTLING HISTORY */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    MAIN LIVE WEIGHT CARD (PRIMARY HERO COMPONENT)
                   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <div
                  style={{
                    padding: 32,
                    borderRadius: 20,
                    background: elevatedSurface,
                    border: `2px solid ${currentData.statusColor}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    boxShadow:
                      weightState === "stable"
                        ? "0 12px 36px rgba(22,163,74,0.15)"
                        : "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: mutedText,
                        letterSpacing: "0.12em",
                      }}
                    >
                      WEIGHBRIDGE LIVE SCALE DISPLAY
                    </span>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 14px",
                        borderRadius: 999,
                        background: `${currentData.statusColor}20`,
                        color: currentData.statusColor,
                        fontSize: 12.5,
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                      }}
                    >
                      ● {currentData.status}
                    </div>
                  </div>

                  {/* 64–96px Desktop Tabular Numerals Display */}
                  <div
                    style={{
                      margin: "16px 0 8px 0",
                      display: "flex",
                      alignItems: "baseline",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 84,
                        fontWeight: 800,
                        fontFamily: "monospace",
                        color: primaryText,
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {currentData.value}
                    </div>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: secondaryGold,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {currentData.unit}
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: 14,
                      color: secondaryText,
                      margin: "8px 0 20px 0",
                      fontWeight: 500,
                    }}
                  >
                    {currentData.message}
                  </p>

                  {/* Scale Status Details Line */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      fontSize: 12.5,
                      color: mutedText,
                      borderTop: `1px solid ${border}`,
                      paddingTop: 16,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <span>
                      Indicator Status:{" "}
                      <strong
                        style={{
                          color: isIndicatorError
                            ? statusOffline
                            : statusOnline,
                        }}
                      >
                        {isIndicatorError
                          ? "✕ Disconnected"
                          : "✓ Connected (Loadcell OK)"}
                      </strong>
                    </span>
                    <span>
                      Max Scale Capacity:{" "}
                      <strong style={{ color: primaryText }}>60 TON</strong>
                    </span>
                  </div>

                  {/* Primary Weight Action Button */}
                  <div style={{ marginTop: 24, width: "100%", maxWidth: 440 }}>
                    {weightState === "captured" ? (
                      <div
                        style={{
                          padding: 16,
                          borderRadius: 12,
                          background: "rgba(22,163,74,0.12)",
                          border: `1.5px solid ${statusOnline}`,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: statusOnline,
                          }}
                        >
                          ✓ FIRST WEIGHT CAPTURED: 24,850 KG
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: secondaryText,
                            marginTop: 4,
                          }}
                        >
                          Recorded at 10:55:24 AM by Operator Arun Kumar (WB-01)
                        </div>
                        <button
                          onClick={() => onNavigate("second-weighment")}
                          style={{
                            marginTop: 14,
                            width: "100%",
                            height: 52,
                            borderRadius: 10,
                            background: statusOnline,
                            color: "#FFFFFF",
                            fontSize: 15,
                            fontWeight: 800,
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          CONTINUE TO SECOND WEIGHING →
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleCaptureClick}
                        disabled={!isCaptureAllowed}
                        style={{
                          width: "100%",
                          height: 56,
                          borderRadius: 10,
                          background: isCaptureAllowed
                            ? primaryOrange
                            : "#9CA3AF",
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: 800,
                          border: "none",
                          cursor: isCaptureAllowed ? "pointer" : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 12,
                          boxShadow: isCaptureAllowed
                            ? "0 4px 16px rgba(249,115,22,0.35)"
                            : "none",
                        }}
                      >
                        <span>⚖️</span>
                        CAPTURE FIRST WEIGHT
                      </button>
                    )}
                  </div>
                </div>

                {/* REAL-TIME WEIGHT HISTORY & SETTLING LOG */}
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
                      marginBottom: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        margin: 0,
                        color: primaryText,
                      }}
                    >
                      Real-Time Weight Stability Log
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        color: statusOnline,
                        fontWeight: 700,
                      }}
                    >
                      ● 10Hz SENSOR STREAM
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: 10,
                    }}
                  >
                    {[
                      {
                        time: "10:55:18",
                        weight: "24,820 KG",
                        status: "Sampling",
                      },
                      {
                        time: "10:55:19",
                        weight: "24,840 KG",
                        status: "Sampling",
                      },
                      {
                        time: "10:55:20",
                        weight: "24,850 KG",
                        status: "Settling",
                      },
                      {
                        time: "10:55:21",
                        weight: "24,850 KG",
                        status: "Settling",
                      },
                      {
                        time: "10:55:22",
                        weight: "24,850 KG",
                        status: "STABLE ✓",
                      },
                    ].map((log, i) => (
                      <div
                        key={log.time}
                        style={{
                          padding: 10,
                          borderRadius: 8,
                          background:
                            i === 4 ? "rgba(22,163,74,0.12)" : elevatedSurface,
                          border: `1px solid ${i === 4 ? statusOnline : border}`,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10.5,
                            color: mutedText,
                            fontFamily: "monospace",
                          }}
                        >
                          {log.time}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: i === 4 ? statusOnline : primaryText,
                            fontFamily: "monospace",
                            marginTop: 2,
                          }}
                        >
                          {log.weight}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: i === 4 ? statusOnline : secondaryGold,
                            marginTop: 2,
                          }}
                        >
                          {log.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PRE-CAPTURE SAFETY CHECKS, ANPR & ACTIONS */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* PRE-CAPTURE SAFETY CHECKS CARD */}
                <div
                  style={{
                    padding: 20,
                    borderRadius: 14,
                    background: surface,
                    border: `1px solid ${border}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      margin: "0 0 14px 0",
                      color: primaryText,
                    }}
                  >
                    Pre-Capture System Checks
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      fontSize: 12.5,
                    }}
                  >
                    {[
                      {
                        label: "Vehicle detected on deck platform",
                        ok: weightState !== "no-vehicle",
                      },
                      {
                        label: "Weight Indicator signal connected",
                        ok: !isIndicatorError,
                      },
                      {
                        label: "Scale weight reading stable",
                        ok:
                          weightState === "stable" ||
                          weightState === "captured",
                      },
                      {
                        label: "WB-01 Station online & responsive",
                        ok: !isWbOffline,
                      },
                      { label: "Operator Arun Kumar authenticated", ok: true },
                      {
                        label: "ANPR Camera feed verified",
                        ok: !isCameraOffline,
                      },
                    ].map((chk) => (
                      <div
                        key={chk.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: 6,
                          background: elevatedSurface,
                        }}
                      >
                        <span style={{ color: secondaryText }}>
                          {chk.label}
                        </span>
                        <strong
                          style={{
                            color: chk.ok ? statusOnline : statusOffline,
                            fontSize: 12,
                          }}
                        >
                          {chk.ok ? "✓ PASSED" : "✕ FAILED"}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ANPR CAMERA LIVE CARD */}
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
                      marginBottom: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        margin: 0,
                        color: primaryText,
                      }}
                    >
                      Vehicle Camera Feed
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: statusOnline,
                      }}
                    >
                      ● LIVE STREAM
                    </span>
                  </div>

                  <div
                    style={{
                      height: 140,
                      borderRadius: 10,
                      background: "#0F172A",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid #334155",
                      overflow: "hidden",
                    }}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 300 140"
                      style={{ opacity: 0.8 }}
                    >
                      <rect
                        x="40"
                        y="30"
                        width="180"
                        height="70"
                        rx="6"
                        fill="#334155"
                      />
                      <path
                        d="M 220 50 L 260 50 L 270 100 L 220 100 Z"
                        fill="#475569"
                      />
                      <circle
                        cx="80"
                        cy="106"
                        r="12"
                        fill="#0F172A"
                        stroke="#64748B"
                        strokeWidth="3"
                      />
                      <circle
                        cx="240"
                        cy="106"
                        r="12"
                        fill="#0F172A"
                        stroke="#F97316"
                        strokeWidth="3"
                      />
                    </svg>

                    <div
                      style={{
                        position: "absolute",
                        bottom: 8,
                        left: 10,
                        fontSize: 11,
                        color: "#F97316",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        background: "rgba(0,0,0,0.7)",
                        padding: "3px 8px",
                        borderRadius: 4,
                      }}
                    >
                      WB-01 • 10:55:24 AM • TN22GH3456
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 11.5,
                      color: statusOnline,
                      fontWeight: 700,
                    }}
                  >
                    ✓ Vehicle entry image captured & attached to ticket
                    WB-2026-00463
                  </div>
                </div>

                {/* RESTRICTED ACTIONS & CANCELLATION */}
                <div
                  style={{
                    padding: 20,
                    borderRadius: 14,
                    background: surface,
                    border: `1px solid ${border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <button
                    onClick={() => setShowOverrideModal(true)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      border: `1px solid ${secondaryGold}`,
                      background: secondaryGoldSoft,
                      color: secondaryGold,
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🔒 Request Authorized Weight Override
                  </button>

                  <button
                    onClick={() => setShowCancelModal(true)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      border: `1px solid ${statusOffline}`,
                      background: "transparent",
                      color: statusOffline,
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Cancel Weighment...
                  </button>
                </div>
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                PRE-CAPTURE CONFIRMATION MODAL
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {showConfirmModal && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(4px)",
                  zIndex: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 480,
                    borderRadius: 16,
                    background: surface,
                    border: `1px solid ${border}`,
                    padding: 24,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
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
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: primaryText,
                      }}
                    >
                      Confirm First Weight
                    </div>
                    <button
                      onClick={() => setShowConfirmModal(false)}
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

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: elevatedSurface,
                      border: `1.5px solid ${statusOnline}`,
                      marginBottom: 16,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: mutedText,
                        letterSpacing: "0.08em",
                      }}
                    >
                      STABLE WEIGHT TO RECORD
                    </div>
                    <div
                      style={{
                        fontSize: 40,
                        fontWeight: 800,
                        fontFamily: "monospace",
                        color: primaryText,
                        margin: "4px 0",
                      }}
                    >
                      24,850 KG
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: statusOnline,
                        fontWeight: 700,
                      }}
                    >
                      ● STABLE & VERIFIED
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      color: secondaryText,
                      marginBottom: 20,
                      lineHeight: 1.5,
                    }}
                  >
                    Confirm that vehicle <strong>TN22GH3456</strong> is
                    correctly positioned on WB-01 Main Gate deck.
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={handleConfirmWeight}
                      style={{
                        flex: 1,
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
                      Confirm Weight
                    </button>
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      style={{
                        padding: "0 16px",
                        height: 48,
                        borderRadius: 8,
                        background: inputBg,
                        border: `1px solid ${border}`,
                        color: secondaryText,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                CANCEL WEIGHMENT MODAL (Requires Reason + Audit Log)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {showCancelModal && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(4px)",
                  zIndex: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <form
                  onSubmit={handleCancelWeighmentSubmit}
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
                      Cancel Weighment?
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(false)}
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
                    This vehicle (TN22GH3456) will not continue through the
                    current weighing process. Select cancellation reason for
                    audit logging.
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
                      <option>Wrong vehicle number</option>
                      <option>Duplicate transaction</option>
                      <option>Device error</option>
                      <option>Operator error</option>
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
                      onClick={() => setShowCancelModal(false)}
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

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                RESTRICTED OVERRIDE MODAL
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {showOverrideModal && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(4px)",
                  zIndex: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <form
                  onSubmit={handleOverrideSubmit}
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
                        color: secondaryGold,
                      }}
                    >
                      🔒 Authorized Weight Override
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowOverrideModal(false)}
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

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      marginBottom: 20,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 700,
                          color: secondaryText,
                          marginBottom: 4,
                        }}
                      >
                        Admin Code / PIN *
                      </label>
                      <input
                        type="password"
                        value={overrideAdminCode}
                        onChange={(e) => setOverrideAdminCode(e.target.value)}
                        placeholder="Enter Admin Authorization Code"
                        required
                        style={{
                          width: "100%",
                          height: 44,
                          padding: "0 12px",
                          borderRadius: 8,
                          border: `1px solid ${border}`,
                          background: inputBg,
                          color: primaryText,
                          fontSize: 14,
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 700,
                          color: secondaryText,
                          marginBottom: 4,
                        }}
                      >
                        Override Reason *
                      </label>
                      <input
                        type="text"
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        placeholder="State reason for manual weight override..."
                        required
                        style={{
                          width: "100%",
                          height: 44,
                          padding: "0 12px",
                          borderRadius: 8,
                          border: `1px solid ${border}`,
                          background: inputBg,
                          color: primaryText,
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        height: 46,
                        borderRadius: 8,
                        background: secondaryGold,
                        color: "#FFF",
                        border: "none",
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Authorize Override
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOverrideModal(false)}
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
                      Cancel
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
