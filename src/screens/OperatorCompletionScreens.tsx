import React, { useState } from "react";
import type { OperatorView } from "./OperatorScreens";
import TicketCompletedScreen from "./TicketCompletedScreen";

type ViewDevice = "desktop" | "tablet" | "mobile";
type SecondWeightState = "no-vehicle" | "detecting" | "stabilizing" | "stable" | "capturing" | "captured" | "tolerance-warning" | "indicator-error";
type SystemHardwareState = "all-online" | "wb-offline" | "printer-offline" | "camera-offline";

interface Props {
  view: Extract<OperatorView, "second-weighment" | "ticket-preview">;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: OperatorView) => void;
}

export default function OperatorCompletionScreens({ view, darkMode, onToggleDark, onLogout, onNavigate }: Props) {
  // Screen 24: Ticket Preview Render Mode
  if (view === "ticket-preview") {
    return <TicketCompletedScreen darkMode={darkMode} onToggleDark={onToggleDark} onLogout={onLogout} onNavigate={onNavigate} />;
  }

  return <SecondWeighingScreen darkMode={darkMode} onToggleDark={onToggleDark} onLogout={onLogout} onNavigate={onNavigate} />;
}

/* ============================================================================
   SCREEN 23: SECOND WEIGHING & FINAL NET WEIGHT VERIFICATION
   ============================================================================ */
function SecondWeighingScreen({ darkMode, onToggleDark, onLogout, onNavigate }: Omit<Props, "view">) {
  // Viewport & Demo Presets
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [weightState, setWeightState] = useState<SecondWeightState>("stable");
  const [hardwareState, setHardwareState] = useState<SystemHardwareState>("all-online");

  // Interactive Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Vehicle left weighbridge");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideAdminCode, setOverrideAdminCode] = useState("");

  const dm = darkMode;

  // Design Tokens
  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const elevatedSurface = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const inputBg = dm ? "#111827" : "#FFFFFF";

  // Brand Colors
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
  const isPrinterOffline = hardwareState === "printer-offline";
  const isCameraOffline = hardwareState === "camera-offline";
  const isIndicatorError = weightState === "indicator-error";

  // Fixed baseline first weight (LOCKED)
  const firstWeightKg = 24850;

  // Weight State Configurations
  const secondWeightValues = {
    "no-vehicle": {
      value: 0,
      valueText: "0",
      status: "WAITING FOR VEHICLE",
      statusColor: statusInfo,
      message: "Drive the vehicle onto the weighbridge platform for second weighing.",
      canCapture: false,
    },
    detecting: {
      value: 13420,
      valueText: "13,420",
      status: "DETECTING VEHICLE",
      statusColor: statusWarning,
      message: "Vehicle detected on deck. Sampling weight sensors...",
      canCapture: false,
    },
    stabilizing: {
      value: 13540,
      valueText: "13,540",
      status: "STABILIZING",
      statusColor: statusWeighing,
      message: "Wait for tare weight to stabilize.",
      canCapture: false,
    },
    stable: {
      value: 13500,
      valueText: "13,500",
      status: "STABLE",
      statusColor: statusOnline,
      message: "Second weight is stable and ready to capture.",
      canCapture: true,
    },
    capturing: {
      value: 13500,
      valueText: "13,500",
      status: "CAPTURING...",
      statusColor: statusWeighing,
      message: "Recording tare weight & computing NET weight...",
      canCapture: false,
    },
    captured: {
      value: 13500,
      valueText: "13,500",
      status: "SECOND WEIGHT CAPTURED",
      statusColor: statusOnline,
      message: "Second weight recorded at 11:12:42 AM. Ready to complete.",
      canCapture: false,
    },
    "tolerance-warning": {
      value: 14400,
      valueText: "14,400",
      status: "TARE DISCREPANCY (+900 KG)",
      statusColor: statusWarning,
      message: "Tare weight exceeds expected range (±500 KG tolerance limit).",
      canCapture: false,
    },
    "indicator-error": {
      value: 0,
      valueText: "--",
      status: "INDICATOR ERROR",
      statusColor: statusOffline,
      message: "Weight indicator signal disconnected.",
      canCapture: false,
    },
  };

  const currentData = secondWeightValues[weightState];
  const secondWeightKg = currentData.value;
  const netWeightKg = firstWeightKg - secondWeightKg;
  const isCaptureAllowed = currentData.canCapture && !isWbOffline && !isIndicatorError;

  const handleCaptureClick = () => {
    if (!isCaptureAllowed) return;
    setShowConfirmModal(true);
  };

  const handleConfirmWeight = () => {
    setShowConfirmModal(false);
    setWeightState("capturing");
    setTimeout(() => {
      setWeightState("captured");
      alert("Audit Log Event Created: Second Weight Captured (13,500 KG) | Net Computed: 11,350 KG for WB-2026-00463.");
    }, 1200);
  };

  const handleCompleteWeighment = () => {
    alert("Audit Log Event: Weighment WB-2026-00463 Completed! Generating Ticket...");
    onNavigate("ticket-preview");
  };

  const handleCancelWeighmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCancelModal(false);
    alert(`Weighment WB-2026-00463 cancelled. Reason: ${cancelReason}. Recorded in Audit Log.`);
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
    alert(`Admin Weight Override Authorized. Reason: ${overrideReason}. Audit Log Created.`);
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
          OPERATOR SECOND WEIGHING PRESET TOOLBAR (COMMENTED OUT)
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
            onClick={() => onNavigate("live-weighment")}
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
            ← First Weighing
          </button>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB", letterSpacing: "0.03em" }}>
              SECOND WEIGHING & NET VERIFICATION
            </div>
            <div style={{ fontSize: 10, color: secondaryGold, fontWeight: 600 }}>
              SCREEN 23 — WEIGHMENT WORKFLOW STEP 3
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>State Preset:</span>
          {[
            { id: "stable", label: "Stable (13.50t)" },
            { id: "stabilizing", label: "Stabilizing" },
            { id: "detecting", label: "Detecting" },
            { id: "captured", label: "Captured" },
            { id: "tolerance-warning", label: "Tolerance Warn" },
            { id: "indicator-error", label: "Scale Error" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setWeightState(st.id as SecondWeightState)}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                fontSize: 10.5,
                fontWeight: weightState === st.id ? 700 : 500,
                border: weightState === st.id ? `1px solid ${primaryOrange}` : "1px solid rgba(255,255,255,0.15)",
                background: weightState === st.id ? primaryOrange : "transparent",
                color: weightState === st.id ? "#FFF" : "#CBD5E1",
                cursor: "pointer",
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6 }}>
            <button
              onClick={() => setViewDevice("desktop")}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                border: "none",
                background: viewDevice === "desktop" ? "rgba(255,255,255,0.2)" : "transparent",
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
                background: viewDevice === "tablet" ? "rgba(255,255,255,0.2)" : "transparent",
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
                background: viewDevice === "mobile" ? primaryOrange : "transparent",
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
          background: viewDevice !== "desktop" ? (dm ? "#0B0F17" : "#CBD5E1") : bg,
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
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => onNavigate("live-weighment")} style={{ background: "none", border: "none", fontSize: 16, color: primaryOrange, cursor: "pointer" }}>
                  ←
                </button>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>Second Weighing</div>
                  <div style={{ fontSize: 10.5, color: secondaryGold, fontWeight: 700 }}>WB-01 Main Gate • Step 3</div>
                </div>
              </div>
            </div>

            {/* Mobile Body Content */}
            <div style={{ padding: "16px 20px 90px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Stepper Progress */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: statusOnline }} />
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: statusOnline }} />
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: primaryOrange }} />
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: border }} />
              </div>

              {/* Locked First Weight Card */}
              <div style={{ padding: 12, borderRadius: 10, background: elevatedSurface, border: `1.5px solid ${statusOnline}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: statusOnline, letterSpacing: "0.05em" }}>LOCKED FIRST WEIGHT</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "monospace", color: primaryText, marginTop: 2 }}>
                    24,850 KG
                  </div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(22,163,74,0.12)", color: statusOnline }}>
                  ✓ VERIFIED
                </div>
              </div>

              {/* Mobile Current Weight Display */}
              <div style={{ padding: 20, borderRadius: 16, background: elevatedSurface, border: `2px solid ${currentData.statusColor}`, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.08em", marginBottom: 6 }}>CURRENT TARE WEIGHT</div>
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "monospace", color: primaryText, letterSpacing: "-0.03em" }}>
                  {currentData.valueText}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: secondaryGold }}>KG</div>

                <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: `${currentData.statusColor}20`, color: currentData.statusColor, fontSize: 11.5, fontWeight: 700 }}>
                  ● {currentData.status}
                </div>
              </div>

              {/* Mobile Final Net Weight Calculation Card */}
              <div style={{ padding: 16, borderRadius: 12, background: primaryOrangeSoft, border: `1.5px solid ${primaryOrange}`, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, letterSpacing: "0.06em" }}>FINAL CALCULATED NET WEIGHT</div>
                <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "monospace", color: primaryOrange, margin: "4px 0" }}>
                  {netWeightKg > 0 ? `${netWeightKg.toLocaleString()} KG` : "-- KG"}
                </div>
                <div style={{ fontSize: 11, color: secondaryText, fontWeight: 600 }}>
                  24,850 KG (Gross) − {currentData.valueText} KG (Tare)
                </div>
              </div>

              {/* Mobile Validation Checks */}
              <div style={{ padding: 12, borderRadius: 10, background: elevatedSurface, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, marginBottom: 6 }}>COMPLETION CHECKS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11, color: statusOnline, fontWeight: 600 }}>
                  <div>✓ First Weight Locked</div>
                  <div>✓ Tare Stable</div>
                  <div>✓ Net Calculated</div>
                  <div>✓ Within Tolerance</div>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Bottom Action */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: surface, borderTop: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 8 }}>
              {weightState === "captured" ? (
                <button
                  onClick={handleCompleteWeighment}
                  style={{ width: "100%", height: 50, borderRadius: 10, background: statusOnline, color: "#FFF", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer" }}
                >
                  COMPLETE WEIGHMENT →
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
                  {isCaptureAllowed ? "CAPTURE SECOND WEIGHT" : "WAITING FOR STABLE WEIGHT..."}
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
              boxShadow: viewDevice === "tablet" ? "0 20px 40px rgba(0,0,0,0.15)" : "none",
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
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  onClick={() => onNavigate("live-weighment")}
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
                  ← Back to First Weighing
                </button>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>
                    Second Weighing & Net Calculation
                  </h1>
                  <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>
                    Capture the tare weight and complete ticket WB-2026-00463 for vehicle TN22GH3456.
                  </p>
                </div>
              </div>
            </header>

            {/* WORKFLOW STEPPER BAR */}
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
                { step: 2, label: "First Weighing", active: false, done: true },
                { step: 3, label: "Second Weighing", active: true, done: weightState === "captured" },
                { step: 4, label: "Ticket Printed", active: false, done: false },
              ].map((st, idx) => (
                <React.Fragment key={st.step}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: st.done ? statusOnline : st.active ? primaryOrange : dm ? "#374151" : "#E2E8F0",
                        color: st.active || st.done ? "#FFF" : mutedText,
                        fontWeight: 800,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: st.active ? "0 2px 8px rgba(249,115,22,0.35)" : "none",
                      }}
                    >
                      {st.done ? "✓" : st.step}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: st.active ? 800 : 600, color: st.active ? primaryOrange : st.done ? statusOnline : primaryText }}>
                        Step {st.step}: {st.label}
                      </div>
                      <div style={{ fontSize: 10.5, color: st.active ? primaryOrange : st.done ? statusOnline : mutedText, fontWeight: 500 }}>
                        {st.done ? "VERIFIED" : st.active ? "ACTIVE WEIGHING" : "PENDING"}
                      </div>
                    </div>
                  </div>
                  {idx < 3 && <div style={{ flex: 1, height: 2, background: border, margin: "0 20px" }} />}
                </React.Fragment>
              ))}
            </div>

            {/* Discrepancy / Offline Alerts */}
            {weightState === "tolerance-warning" && (
              <div style={{ margin: "16px 32px 0 32px", padding: 14, borderRadius: 8, background: dm ? "#451A03" : "#FEF3C7", border: `1px solid ${statusWarning}`, color: "#B45309", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>⚠️ Tare Weight Difference Warning: Current tare (14,400 KG) exceeds expected tare (13,500 KG) by +900 KG. (Limit: ±500 KG).</div>
                <button onClick={() => setShowOverrideModal(true)} style={{ padding: "4px 12px", borderRadius: 6, background: secondaryGold, color: "#FFF", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Request Override
                </button>
              </div>
            )}

            {/* TRANSACTION SUMMARY & LOCKED FIRST WEIGHT CARD */}
            <div style={{ margin: "16px 32px 0 32px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
              {/* Summary */}
              <div style={{ padding: "14px 20px", borderRadius: 12, background: surface, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: mutedText, letterSpacing: "0.05em" }}>TRANSACTION DETAILS</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: primaryText, marginTop: 2 }}>
                    TN22GH3456 • Heavy Truck • Gravel
                  </div>
                  <div style={{ fontSize: 12, color: secondaryText, marginTop: 4 }}>
                    Customer: Metro Builders | Driver: Arun Kumar | Customer Ticket: WB-2026-00463
                  </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: "rgba(37,99,235,0.12)", color: statusInfo }}>
                  AWAITING TARE
                </div>
              </div>

              {/* Locked Baseline First Weight */}
              <div style={{ padding: "14px 20px", borderRadius: 12, background: "rgba(22,163,74,0.08)", border: `1.5px solid ${statusOnline}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: statusOnline, letterSpacing: "0.05em" }}>LOCKED FIRST WEIGHT (GROSS)</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: primaryText, marginTop: 2 }}>
                    24,850 KG
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: statusOnline }}>✓ VERIFIED & LOCKED</div>
                  <div style={{ fontSize: 10.5, color: mutedText, fontFamily: "monospace", marginTop: 2 }}>10:55:24 AM</div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div style={{ flex: 1, padding: "20px 32px 32px 32px", display: "grid", gridTemplateColumns: viewDevice === "tablet" ? "1fr" : "1.2fr 0.8fr", gap: 24, overflowY: "auto" }}>
              {/* LEFT COLUMN: LIVE TARE WEIGHT & NET WEIGHT CALCULATION HUB */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* LIVE TARE WEIGHT CARD */}
                <div
                  style={{
                    padding: 28,
                    borderRadius: 20,
                    background: elevatedSurface,
                    border: `2px solid ${currentData.statusColor}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    boxShadow: weightState === "stable" ? "0 12px 36px rgba(22,163,74,0.15)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: mutedText, letterSpacing: "0.12em" }}>
                      CURRENT TARE WEIGHT (SECOND WEIGHING)
                    </span>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 999,
                        background: `${currentData.statusColor}20`,
                        color: currentData.statusColor,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      ● {currentData.status}
                    </div>
                  </div>

                  {/* Large Numerals */}
                  <div style={{ margin: "10px 0 4px 0", display: "flex", alignItems: "baseline", gap: 16 }}>
                    <div style={{ fontSize: 72, fontWeight: 800, fontFamily: "monospace", color: primaryText, lineHeight: 1, letterSpacing: "-0.04em" }}>
                      {currentData.valueText}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: secondaryGold }}>KG</div>
                  </div>

                  <p style={{ fontSize: 13, color: secondaryText, margin: "4px 0 16px 0", fontWeight: 500 }}>
                    {currentData.message}
                  </p>

                  {/* Capture Button */}
                  <div style={{ width: "100%", maxWidth: 400 }}>
                    {weightState === "captured" ? (
                      <div style={{ padding: 14, borderRadius: 10, background: "rgba(22,163,74,0.12)", border: `1.5px solid ${statusOnline}`, textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: statusOnline }}>
                          ✓ TARE WEIGHT CAPTURED: 13,500 KG
                        </div>
                        <div style={{ fontSize: 11.5, color: secondaryText, marginTop: 2 }}>
                          Recorded at 11:12:42 AM by Operator Arun Kumar
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleCaptureClick}
                        disabled={!isCaptureAllowed}
                        style={{
                          width: "100%",
                          height: 52,
                          borderRadius: 10,
                          background: isCaptureAllowed ? primaryOrange : "#9CA3AF",
                          color: "#FFF",
                          fontSize: 15,
                          fontWeight: 800,
                          border: "none",
                          cursor: isCaptureAllowed ? "pointer" : "not-allowed",
                          boxShadow: isCaptureAllowed ? "0 4px 16px rgba(249,115,22,0.35)" : "none",
                        }}
                      >
                        ⚖️ CAPTURE SECOND WEIGHT
                      </button>
                    )}
                  </div>
                </div>

                {/* GROSS / TARE / NET CALCULATION HUB */}
                <div style={{ padding: 24, borderRadius: 16, background: surface, border: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: primaryText }}>
                      Final Net Weight Calculation
                    </h3>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: primaryOrangeSoft, color: primaryOrange }}>
                      ● FORMULA: GROSS − TARE = NET
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1.3fr", alignItems: "center", gap: 12 }}>
                    {/* Gross */}
                    <div style={{ padding: 16, borderRadius: 10, background: elevatedSurface, textAlign: "center" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: mutedText }}>GROSS WEIGHT (1st)</div>
                      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: primaryText, marginTop: 4 }}>
                        24,850 KG
                      </div>
                    </div>

                    <div style={{ fontSize: 20, fontWeight: 800, color: mutedText }}>−</div>

                    {/* Tare */}
                    <div style={{ padding: 16, borderRadius: 10, background: elevatedSurface, textAlign: "center" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: mutedText }}>TARE WEIGHT (2nd)</div>
                      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: secondaryGold, marginTop: 4 }}>
                        {currentData.valueText} KG
                      </div>
                    </div>

                    <div style={{ fontSize: 20, fontWeight: 800, color: mutedText }}>=</div>

                    {/* Net Result (Highlighted) */}
                    <div style={{ padding: 18, borderRadius: 12, background: primaryOrangeSoft, border: `2px solid ${primaryOrange}`, textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, letterSpacing: "0.06em" }}>FINAL NET WEIGHT</div>
                      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "monospace", color: primaryOrange, margin: "2px 0" }}>
                        {netWeightKg > 0 ? `${netWeightKg.toLocaleString()} KG` : "-- KG"}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: statusOnline }}>● VERIFIED POSITIVE NET</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PRE-COMPLETION CHECKS, ANPR BEFORE/AFTER & FINAL CTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* PRE-COMPLETION CHECKS */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px 0", color: primaryText }}>
                    Pre-Completion Validation
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    {[
                      { label: "Locked first gross weight verified (24,850 KG)", ok: true },
                      { label: "Second tare weight stable & captured", ok: weightState === "stable" || weightState === "captured" },
                      { label: "Net weight calculated positive (11,350 KG)", ok: netWeightKg > 0 },
                      { label: "Tare tolerance check (±500 KG limit)", ok: weightState !== "tolerance-warning" },
                      { label: "WB-01 station online & operator verified", ok: !isWbOffline },
                      { label: "Before & after vehicle photos attached", ok: !isCameraOffline },
                    ].map((chk) => (
                      <div key={chk.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 6, background: elevatedSurface }}>
                        <span style={{ color: secondaryText }}>{chk.label}</span>
                        <strong style={{ color: chk.ok ? statusOnline : statusOffline, fontSize: 12 }}>
                          {chk.ok ? "✓ PASSED" : "✕ FAILED"}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ANPR BEFORE & AFTER VEHICLE IMAGES */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: primaryText }}>Vehicle Image Verification</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, color: statusOnline }}>✓ 2 PHOTOS MATCHED</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ padding: 8, borderRadius: 8, background: "#0F172A", border: "1px solid #334155", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, marginBottom: 4 }}>1ST WEIGHING (10:55 AM)</div>
                      <div style={{ height: 60, background: "#1E293B", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#F97316", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
                        TN22GH3456
                      </div>
                    </div>
                    <div style={{ padding: 8, borderRadius: 8, background: "#0F172A", border: "1px solid #334155", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, marginBottom: 4 }}>2ND WEIGHING (11:12 AM)</div>
                      <div style={{ height: 60, background: "#1E293B", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>
                        TN22GH3456
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRIMARY FINAL ACTION: COMPLETE WEIGHMENT */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={handleCompleteWeighment}
                    disabled={weightState !== "captured" && weightState !== "stable"}
                    style={{
                      width: "100%",
                      height: 56,
                      borderRadius: 10,
                      background: weightState === "captured" || weightState === "stable" ? statusOnline : "#9CA3AF",
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: 800,
                      border: "none",
                      cursor: weightState === "captured" || weightState === "stable" ? "pointer" : "not-allowed",
                      boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
                    }}
                  >
                    COMPLETE WEIGHMENT →
                  </button>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button onClick={() => setShowOverrideModal(true)} style={{ padding: "8px", borderRadius: 6, border: `1px solid ${secondaryGold}`, background: secondaryGoldSoft, color: secondaryGold, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                      🔒 Request Override
                    </button>
                    <button onClick={() => setShowCancelModal(true)} style={{ padding: "8px", borderRadius: 6, border: `1px solid ${statusOffline}`, background: "transparent", color: statusOffline, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                      Cancel Weighment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirmModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <div style={{ width: "100%", maxWidth: 480, borderRadius: 16, background: surface, border: `1px solid ${border}`, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: primaryText }}>Confirm Second Weight</div>
                    <button onClick={() => setShowConfirmModal(false)} style={{ background: "none", border: "none", fontSize: 18, color: mutedText, cursor: "pointer" }}>✕</button>
                  </div>

                  <div style={{ padding: 16, borderRadius: 12, background: elevatedSurface, border: `1.5px solid ${statusOnline}`, marginBottom: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: mutedText }}>COMPUTED RESULT SUMMARY</div>
                    <div style={{ fontSize: 14, color: secondaryText, marginTop: 4 }}>Gross: <strong>24,850 KG</strong> | Tare: <strong>13,500 KG</strong></div>
                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "monospace", color: primaryOrange, margin: "4px 0" }}>NET: 11,350 KG</div>
                    <div style={{ fontSize: 12, color: statusOnline, fontWeight: 700 }}>● TARE STABLE & VERIFIED</div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={handleConfirmWeight} style={{ flex: 1, height: 48, borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                      Confirm Tare Weight
                    </button>
                    <button onClick={() => setShowConfirmModal(false)} style={{ padding: "0 16px", height: 48, borderRadius: 8, background: inputBg, border: `1px solid ${border}`, color: secondaryText, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CANCEL MODAL */}
            {showCancelModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <form onSubmit={handleCancelWeighmentSubmit} style={{ width: "100%", maxWidth: 440, borderRadius: 16, background: surface, border: `1px solid ${border}`, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: statusOffline }}>Cancel Weighment?</h3>
                    <button type="button" onClick={() => setShowCancelModal(false)} style={{ background: "none", border: "none", fontSize: 18, color: mutedText, cursor: "pointer" }}>✕</button>
                  </div>

                  <p style={{ fontSize: 13, color: secondaryText, margin: "0 0 16px 0", lineHeight: 1.5 }}>
                    This weighment (TN22GH3456) will be cancelled before second weighing completion.
                  </p>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>Cancellation Reason *</label>
                    <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13 }}>
                      <option>Vehicle left weighbridge</option>
                      <option>Wrong vehicle number</option>
                      <option>Duplicate transaction</option>
                      <option>Device error</option>
                      <option>Operator error</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit" style={{ flex: 1, height: 46, borderRadius: 8, background: statusOffline, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                      Cancel Weighment
                    </button>
                    <button type="button" onClick={() => setShowCancelModal(false)} style={{ padding: "0 16px", height: 46, borderRadius: 8, background: inputBg, border: `1px solid ${border}`, color: secondaryText, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Keep Weighment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* RESTRICTED OVERRIDE MODAL */}
            {showOverrideModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <form onSubmit={handleOverrideSubmit} style={{ width: "100%", maxWidth: 440, borderRadius: 16, background: surface, border: `1px solid ${border}`, padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: secondaryGold }}>🔒 Authorized Weight Override</h3>
                    <button type="button" onClick={() => setShowOverrideModal(false)} style={{ background: "none", border: "none", fontSize: 18, color: mutedText, cursor: "pointer" }}>✕</button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>Admin Code / PIN *</label>
                      <input type="password" value={overrideAdminCode} onChange={(e) => setOverrideAdminCode(e.target.value)} placeholder="Enter Admin Authorization Code" required style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>Override Reason *</label>
                      <input type="text" value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="State reason for manual tare override..." required style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 14 }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit" style={{ flex: 1, height: 46, borderRadius: 8, background: secondaryGold, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                      Authorize Override
                    </button>
                    <button type="button" onClick={() => setShowOverrideModal(false)} style={{ padding: "0 16px", height: 46, borderRadius: 8, background: inputBg, border: `1px solid ${border}`, color: secondaryText, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
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

/* ============================================================================
   SCREEN 24: TICKET PREVIEW & PRINTING SCREEN
   ============================================================================ */
function TicketPreviewScreen({ darkMode, onToggleDark, onLogout, onNavigate }: Omit<Props, "view">) {
  const dm = darkMode;
  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const primaryOrange = dm ? "#FB923C" : "#F97316";

  const rows = [
    ["Ticket Number", "WB-2026-00463"],
    ["Vehicle Number", "TN22GH3456"],
    ["Vehicle Type", "Heavy Truck"],
    ["Driver Name", "Arun Kumar"],
    ["Customer", "Metro Builders Ltd"],
    ["Material", "Gravel"],
    ["Gross Weight", "24,850 KG"],
    ["Tare Weight", "13,500 KG"],
    ["FINAL NET WEIGHT", "11,350 KG"],
    ["First Weighing Time", "19 Aug 2026, 10:55 AM"],
    ["Second Weighing Time", "19 Aug 2026, 11:12 AM"],
    ["Weighbridge Station", "WB-01 Main Gate"],
    ["Assigned Operator", "Arun Kumar"],
    ["Transaction Direction", "Sales (Outbound)"],
  ];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: bg, color: primaryText, fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <header style={{ height: 60, padding: "0 24px", background: surface, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => onNavigate("operator-dashboard")} style={{ background: "none", border: `1px solid ${border}`, padding: "6px 12px", borderRadius: 6, color: secondaryText, cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>
            ← Back to Dashboard
          </button>
          <span style={{ fontSize: 16, fontWeight: 800 }}>Weighment Ticket Generated</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onToggleDark} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${border}`, background: "transparent", color: primaryText, fontSize: 12, cursor: "pointer" }}>
            {dm ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* Ticket Body */}
      <div style={{ flex: 1, padding: "32px 16px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 600, background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: 32, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", borderBottom: `1px solid ${border}`, paddingBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#16A34A", color: "#FFF", fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto" }}>
              ✓
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>ABC INDUSTRIAL WEIGHBRIDGE</h2>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: primaryOrange, marginTop: 4 }}>OFFICIAL WEIGHMENT TICKET</div>
          </div>

          <div style={{ margin: "20px 0" }}>
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${border}`, fontSize: 13 }}>
                <span style={{ color: mutedText }}>{k}</span>
                <strong style={{ color: k === "FINAL NET WEIGHT" ? primaryOrange : primaryText, fontFamily: "monospace", fontSize: k === "FINAL NET WEIGHT" ? 18 : 13 }}>
                  {v}
                </strong>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", fontSize: 11, color: mutedText, marginTop: 24 }}>
            System Generated Ticket • Certified Scale Sensor Signal WB-01 • Arun Kumar
          </div>

          {/* Action CTAs */}
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => alert("Printing ticket WB-2026-00463...")} style={{ flex: 1, height: 48, borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
              🖨️ PRINT TICKET
            </button>
            <button onClick={() => alert("Downloading PDF...")} style={{ flex: 1, height: 48, borderRadius: 8, background: "transparent", border: `1px solid ${border}`, color: secondaryText, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              📄 DOWNLOAD PDF
            </button>
          </div>
          <button onClick={() => onNavigate("operator-dashboard")} style={{ marginTop: 12, width: "100%", height: 44, borderRadius: 8, background: "transparent", border: "none", color: primaryOrange, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Start Next Weighment →
          </button>
        </div>
      </div>
    </div>
  );
}
