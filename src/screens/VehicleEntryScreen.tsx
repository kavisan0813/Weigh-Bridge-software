import React, { useState } from "react";
import type { OperatorView } from "./OperatorScreens";

type ViewDevice = "desktop" | "tablet" | "mobile";
type EntryState =
  | "found"
  | "new-vehicle"
  | "anpr-detected"
  | "anpr-low-confidence"
  | "duplicate-warning"
  | "vehicle-blocked"
  | "driver-blocked"
  | "wb-offline"
  | "indicator-offline"
  | "show-confirmation";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: OperatorView) => void;
}

export default function VehicleEntryScreen({ darkMode, onToggleDark, onLogout, onNavigate }: Props) {
  // Viewport & Demo Presets
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [entryState, setEntryState] = useState<EntryState>("found");

  // Form Field States
  const [vehicleNumber, setVehicleNumber] = useState("TN22GH3456");
  const [vehicleType, setVehicleType] = useState("Heavy Truck");
  const [driverName, setDriverName] = useState("Arun Kumar");
  const [driverPhone, setDriverPhone] = useState("98765 43210");
  const [driverDl, setDriverDl] = useState("TN12 20260012345");
  const [partyType, setPartyType] = useState<"customer" | "supplier">("customer");
  const [customerName, setCustomerName] = useState("Metro Builders Ltd");
  const [supplierName, setSupplierName] = useState("Metro Aggregates");
  const [material, setMaterial] = useState("Gravel");
  const [transactionType, setTransactionType] = useState("Sales");
  const [purpose, setPurpose] = useState("Delivery");
  const [remarks, setRemarks] = useState("");
  const [imageCaptured, setImageCaptured] = useState(true);

  // Modals
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");
  const [newDriverDl, setNewDriverDl] = useState("");

  // Dark Mode Tokens
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
  const secondaryGoldSoft = dm ? "#422F0A" : "#FFFBEB";

  // Status Colors
  const statusOnline = "#16A34A";
  const statusWarning = "#F59E0B";
  const statusOffline = "#DC2626";
  const statusInfo = "#2563EB";

  // Validation
  const isWbOffline = entryState === "wb-offline";
  const isIndicatorOffline = entryState === "indicator-offline";
  const isVehicleBlocked = entryState === "vehicle-blocked";
  const isDriverBlocked = entryState === "driver-blocked";
  const isDuplicate = entryState === "duplicate-warning";

  const canProceed =
    !isWbOffline && !isIndicatorOffline && !isVehicleBlocked && !isDriverBlocked && !isDuplicate && vehicleNumber.trim() !== "";

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim()) return;
    setDriverName(newDriverName);
    setDriverPhone(newDriverPhone || "98765 00000");
    setDriverDl(newDriverDl || "TN12 20269999");
    setShowDriverModal(false);
    alert(`Driver ${newDriverName} added and assigned to entry.`);
  };

  const handleStartFirstWeighing = () => {
    if (!canProceed) return;
    setEntryState("show-confirmation");
  };

  const handleConfirmAndProceed = () => {
    setEntryState("found");
    alert("Audit Log Created: Weighment Started for " + vehicleNumber + " by Arun Kumar (WB-01).");
    onNavigate("live-weighment");
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: primaryText,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP TOOLBAR / DEMO PRESET TESTER (Master Design System)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header
        style={{
          width: "100%",
          background: dm ? "#1F2937" : "#FFFFFF",
          borderBottom: `1px solid ${dm ? "#374151" : "#E5E7EB"}`,
          padding: "8px 20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Title */}
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
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB", letterSpacing: "0.03em" }}>
              VEHICLE ENTRY / GATE REGISTRATION
            </div>
            <div style={{ fontSize: 10, color: secondaryGold, fontWeight: 600 }}>
              SCREEN 21 — WEIGHMENT WORKFLOW STEP 1
            </div>
          </div>
        </div>

        {/* State Presets Tester */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Test Scenario:</span>
          {[
            { id: "found", label: "Registered Vehicle" },
            { id: "anpr-detected", label: "ANPR 98%" },
            { id: "new-vehicle", label: "New Vehicle" },
            { id: "duplicate-warning", label: "Duplicate Active" },
            { id: "vehicle-blocked", label: "Blocked Vehicle" },
            { id: "driver-blocked", label: "Driver Inactive" },
            { id: "wb-offline", label: "WB Offline" },
            { id: "indicator-offline", label: "Scale Off" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setEntryState(st.id as EntryState)}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                fontSize: 10.5,
                fontWeight: entryState === st.id ? 700 : 500,
                border: entryState === st.id ? `1px solid ${secondaryGold}` : "1px solid rgba(255,255,255,0.15)",
                background: entryState === st.id ? "rgba(201,154,46,0.25)" : "transparent",
                color: entryState === st.id ? "#FDE047" : "#CBD5E1",
                cursor: "pointer",
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Viewport & Theme Controls */}
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
      </header>

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
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => onNavigate("operator-dashboard")} style={{ background: "none", border: "none", fontSize: 16, color: primaryOrange, cursor: "pointer" }}>
                  ←
                </button>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: primaryText }}>Vehicle Entry</div>
                  <div style={{ fontSize: 10.5, color: secondaryGold, fontWeight: 700 }}>WB-01 Main Gate • Step 1</div>
                </div>
              </div>
            </div>

            {/* Mobile Body Content */}
            <div style={{ padding: "16px 20px 90px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Stepper Progress */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: primaryOrange }} />
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: border }} />
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: border }} />
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: border }} />
              </div>

              {/* Vehicle Number Search */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. TN22GH3456"
                  style={{
                    width: "100%",
                    height: 48,
                    padding: "0 14px",
                    borderRadius: 8,
                    border: `1.5px solid ${primaryOrange}`,
                    background: inputBg,
                    color: primaryText,
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: "monospace",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Vehicle Details Card */}
              <div style={{ padding: 14, borderRadius: 10, background: elevatedSurface, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, marginBottom: 6 }}>REGISTERED DETAILS</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: primaryText }}>TN22GH3456 (Heavy Truck)</div>
                <div style={{ fontSize: 12, color: secondaryText, marginTop: 2 }}>Owner: ABC Transport</div>
                <div style={{ fontSize: 12, color: secondaryGold, fontWeight: 700, marginTop: 4 }}>Tare Weight: 13,500 KG</div>
              </div>

              {/* Driver Details */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>
                  Driver Name *
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              {/* Material Details */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>
                  Material *
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 14, boxSizing: "border-box" }}
                >
                  <option>Gravel</option>
                  <option>Sand</option>
                  <option>Cement</option>
                  <option>Steel</option>
                </select>
              </div>

              {/* Camera Preview */}
              <div style={{ padding: 12, borderRadius: 10, background: elevatedSurface, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, marginBottom: 6 }}>ENTRY CAMERA</div>
                <div style={{ height: 100, borderRadius: 6, background: "#0F172A", color: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                  📷 ANPR Image Captured
                </div>
              </div>
            </div>

            {/* Mobile Sticky Bottom Action Bar */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: surface, borderTop: `1px solid ${border}`, display: "flex", gap: 10 }}>
              <button
                onClick={handleStartFirstWeighing}
                disabled={!canProceed}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 10,
                  background: canProceed ? primaryOrange : "#9CA3AF",
                  color: "#FFF",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: canProceed ? "pointer" : "not-allowed",
                }}
              >
                START WEIGHING →
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
              boxShadow: viewDevice === "tablet" ? "0 20px 40px rgba(0,0,0,0.15)" : "none",
              borderRadius: viewDevice === "tablet" ? 16 : 0,
              overflow: "hidden",
            }}
          >
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                DESKTOP HEADER & STEPPER BAR
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
                  onClick={() => onNavigate("operator-dashboard")}
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
                  ← Back to Dashboard
                </button>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.01em" }}>
                    Vehicle Entry / Gate Registration
                  </h1>
                  <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>
                    Register and verify vehicle details before launching First Weighing.
                  </p>
                </div>
              </div>

              {/* Station Info & Operator */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: primaryText }}>WB-01 — Main Gate</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isWbOffline ? statusOffline : statusOnline }}>
                    ● {isWbOffline ? "OFFLINE" : "ONLINE"}
                  </div>
                </div>

                <div style={{ height: 28, width: 1, background: border }} />

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 999, background: primaryOrange, color: "#FFF", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    AK
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: primaryText }}>Arun Kumar</div>
                </div>
              </div>
            </header>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                WORKFLOW STEPPER BAR (Step 1: Vehicle Entry Active)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div
              style={{
                padding: "16px 32px",
                background: elevatedSurface,
                borderBottom: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {[
                { step: 1, label: "Vehicle Entry", active: true, done: false },
                { step: 2, label: "First Weighing", active: false, done: false },
                { step: 3, label: "Second Weighing", active: false, done: false },
                { step: 4, label: "Ticket Printed", active: false, done: false },
              ].map((st, idx) => (
                <React.Fragment key={st.step}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: st.active ? primaryOrange : st.done ? statusOnline : dm ? "#374151" : "#E5E7EB",
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
                      <div style={{ fontSize: 13, fontWeight: st.active ? 800 : 600, color: st.active ? primaryOrange : primaryText }}>
                        Step {st.step}: {st.label}
                      </div>
                      <div style={{ fontSize: 10.5, color: st.active ? primaryOrange : mutedText, fontWeight: 500 }}>
                        {st.active ? "ACTIVE REGISTRATION" : "PENDING"}
                      </div>
                    </div>
                  </div>
                  {idx < 3 && <div style={{ flex: 1, height: 2, background: border, margin: "0 20px" }} />}
                </React.Fragment>
              ))}
            </div>

            {/* Warning Exception Banners */}
            {isWbOffline && (
              <div style={{ margin: "16px 32px 0 32px", padding: 14, borderRadius: 8, background: dm ? "#450A0A" : "#FEF2F2", border: `1px solid ${statusOffline}`, color: statusOffline, fontWeight: 700, fontSize: 13 }}>
                ⚠️ WB-01 Weighbridge is offline. New vehicle weighments cannot be launched.
              </div>
            )}

            {isIndicatorOffline && (
              <div style={{ margin: "16px 32px 0 32px", padding: 14, borderRadius: 8, background: dm ? "#450A0A" : "#FEF2F2", border: `1px solid ${statusOffline}`, color: statusOffline, fontWeight: 700, fontSize: 13 }}>
                🔌 Weight Indicator disconnected. Check scale sensor cable before continuing.
              </div>
            )}

            {isDuplicate && (
              <div style={{ margin: "16px 32px 0 32px", padding: 16, borderRadius: 10, background: dm ? "#422F0A" : "#FFFBEB", border: `1.5px solid ${secondaryGold}`, color: secondaryGold }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>⚠️ Vehicle Already in Weighment</div>
                <div style={{ fontSize: 12.5, color: secondaryText, marginTop: 4 }}>
                  Vehicle <strong>{vehicleNumber}</strong> currently has an active pending transaction: <strong>WB-2026-00462 (Awaiting Second Weighing)</strong>.
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={() => onNavigate("pending-weighments")} style={{ padding: "6px 14px", borderRadius: 6, background: secondaryGold, color: "#FFF", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Continue Existing Weighment →
                  </button>
                  <button onClick={() => setEntryState("found")} style={{ padding: "6px 14px", borderRadius: 6, background: "transparent", color: secondaryGold, border: `1px solid ${secondaryGold}`, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Cancel & Register New
                  </button>
                </div>
              </div>
            )}

            {isVehicleBlocked && (
              <div style={{ margin: "16px 32px 0 32px", padding: 14, borderRadius: 8, background: dm ? "#450A0A" : "#FEF2F2", border: `1px solid ${statusOffline}`, color: statusOffline, fontWeight: 700, fontSize: 13 }}>
                🚫 Vehicle Restricted: Registration expired or flagged by security. Cannot start weighment.
              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                MAIN FORM GRID (2 Column Desktop Layout)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div style={{ flex: 1, padding: "24px 32px", display: "grid", gridTemplateColumns: viewDevice === "tablet" ? "1fr" : "1.2fr 0.8fr", gap: 24, overflowY: "auto" }}>
              {/* LEFT COLUMN: VEHICLE & DRIVER & PARTY DETAILS */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* CARD 1: VEHICLE IDENTIFICATION */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: primaryText }}>1. Vehicle Identification</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, color: primaryOrange, padding: "2px 8px", borderRadius: 4, background: primaryOrangeSoft }}>
                      * REQUIRED
                    </span>
                  </div>

                  {/* ANPR Automatic Recognition Banner if state */}
                  {entryState === "anpr-detected" && (
                    <div style={{ padding: 12, borderRadius: 8, background: "rgba(22,163,74,0.12)", border: `1px solid ${statusOnline}`, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>📷</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: statusOnline }}>ANPR Camera Detection: TN22GH3456</div>
                          <div style={{ fontSize: 11, color: secondaryText }}>Plate Recognition Confidence: 98%</div>
                        </div>
                      </div>
                      <button onClick={() => setVehicleNumber("TN22GH3456")} style={{ padding: "4px 10px", borderRadius: 6, background: statusOnline, color: "#FFF", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                        Use Detected Number
                      </button>
                    </div>
                  )}

                  {/* Vehicle Search Input */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>
                      Vehicle Registration Number *
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: mutedText }}>
                        🔍
                      </span>
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                        placeholder="Enter vehicle number (e.g. TN22GH3456)"
                        style={{
                          width: "100%",
                          height: 48,
                          paddingLeft: 42,
                          paddingRight: 14,
                          borderRadius: 8,
                          border: `1.5px solid ${primaryOrange}`,
                          background: inputBg,
                          color: primaryText,
                          fontSize: 16,
                          fontWeight: 800,
                          fontFamily: "monospace",
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  {/* Found Registered Vehicle Specs */}
                  {entryState === "found" || entryState === "anpr-detected" ? (
                    <div style={{ padding: 14, borderRadius: 10, background: elevatedSurface, border: `1px solid ${border}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: primaryText, fontFamily: "monospace" }}>TN22GH3456</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(22,163,74,0.15)", color: statusOnline }}>
                            ✓ REGISTERED VEHICLE
                          </span>
                        </div>
                        <button onClick={() => setEntryState("new-vehicle")} style={{ background: "none", border: "none", color: primaryOrange, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
                          Change Vehicle
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 12, color: secondaryText }}>
                        <div>Type: <strong style={{ color: primaryText }}>{vehicleType}</strong></div>
                        <div>Owner: <strong style={{ color: primaryText }}>ABC Transport</strong></div>
                        <div>Tare Weight: <strong style={{ color: secondaryGold }}>13,500 KG</strong></div>
                      </div>
                    </div>
                  ) : entryState === "new-vehicle" ? (
                    <div style={{ padding: 14, borderRadius: 10, background: secondaryGoldSoft, border: `1px solid ${secondaryGold}` }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: secondaryGold, marginBottom: 4 }}>
                        ⚠️ Vehicle Not Previously Registered
                      </div>
                      <div style={{ fontSize: 12, color: secondaryText, marginBottom: 10 }}>
                        No existing record found for this registration number. Complete details to register.
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setEntryState("found")} style={{ padding: "6px 12px", borderRadius: 6, background: secondaryGold, color: "#FFF", border: "none", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                          Register New Vehicle
                        </button>
                        <button onClick={() => setEntryState("found")} style={{ padding: "6px 12px", borderRadius: 6, background: "transparent", color: secondaryGold, border: `1px solid ${secondaryGold}`, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
                          Continue as Temporary
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Vehicle Type Dropdown */}
                  <div style={{ marginTop: 14 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>
                      Vehicle Type *
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13, outline: "none" }}
                    >
                      <option>Heavy Truck</option>
                      <option>Tipper</option>
                      <option>Trailer</option>
                      <option>Container Truck</option>
                      <option>Tanker</option>
                      <option>Mini Truck</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* CARD 2: DRIVER INFORMATION */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: primaryText }}>2. Driver Information</h3>
                    <button
                      type="button"
                      onClick={() => setShowDriverModal(true)}
                      style={{ background: "none", border: "none", color: primaryOrange, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      + Add New Driver
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>
                        Driver Name *
                      </label>
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        placeholder="Search or enter driver name"
                        style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13, outline: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13, outline: "none" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 12, fontSize: 11.5, color: mutedText, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>License #: <strong>{driverDl}</strong></span>
                    <span style={{ color: statusOnline, fontWeight: 700 }}>● DRIVER ACTIVE</span>
                  </div>
                </div>

                {/* CARD 3: TRANSACTION PARTY & MATERIAL */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: primaryText }}>3. Party & Material Details</h3>

                    {/* Party Segmented Tabs */}
                    <div style={{ display: "flex", background: elevatedSurface, padding: 3, borderRadius: 6 }}>
                      <button
                        type="button"
                        onClick={() => setPartyType("customer")}
                        style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: partyType === "customer" ? primaryOrange : "transparent", color: partyType === "customer" ? "#FFF" : secondaryText, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                      >
                        Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => setPartyType("supplier")}
                        style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: partyType === "supplier" ? secondaryGold : "transparent", color: partyType === "supplier" ? "#FFF" : secondaryText, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                      >
                        Supplier
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>
                        {partyType === "customer" ? "Customer Name *" : "Supplier Name *"}
                      </label>
                      <input
                        type="text"
                        value={partyType === "customer" ? customerName : supplierName}
                        onChange={(e) => partyType === "customer" ? setCustomerName(e.target.value) : setSupplierName(e.target.value)}
                        style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13, outline: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>
                        Material Type *
                      </label>
                      <select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13, outline: "none" }}
                      >
                        <option>Gravel</option>
                        <option>Sand</option>
                        <option>M-Sand</option>
                        <option>Cement</option>
                        <option>Steel</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Informational Read-only Rate */}
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: primaryOrangeSoft, border: `1px solid ${dm ? "#5A430E" : "#FFEDD5"}`, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                    <span>Configured Material Rate: <strong style={{ color: primaryOrange }}>₹2,500 / TON</strong></span>
                    <span style={{ fontSize: 11, color: mutedText }}>Read-only rate</span>
                  </div>
                </div>

                {/* CARD 4: TRANSACTION TYPE & PURPOSE */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px 0", color: primaryText }}>4. Transaction Type & Purpose</h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>
                        Transaction Type *
                      </label>
                      <div style={{ display: "flex", gap: 6 }}>
                        {["Sales", "Purchase", "Transfer"].map((tt) => (
                          <button
                            key={tt}
                            type="button"
                            onClick={() => setTransactionType(tt)}
                            style={{
                              flex: 1,
                              padding: "8px 0",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              border: transactionType === tt ? `1.5px solid ${primaryOrange}` : `1px solid ${border}`,
                              background: transactionType === tt ? primaryOrangeSoft : inputBg,
                              color: transactionType === tt ? primaryOrange : secondaryText,
                              cursor: "pointer",
                            }}
                          >
                            {tt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 6 }}>
                        Purpose
                      </label>
                      <select
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        style={{ width: "100%", height: 40, padding: "0 12px", borderRadius: 6, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13 }}
                      >
                        <option>Delivery</option>
                        <option>Dispatch</option>
                        <option>Purchase</option>
                        <option>Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>
                      Remarks / Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add operational notes or gate entry comments..."
                      style={{ width: "100%", height: 40, padding: "0 12px", borderRadius: 6, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: CAMERA & ENTRY INFO & CONFIRMATION SUMMARY */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* ANPR CAMERA CAPTURE BOX */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: primaryText }}>ANPR Camera Live View</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, color: statusOnline }}>● LIVE STREAM</span>
                  </div>

                  <div
                    style={{
                      height: 160,
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
                    <svg width="100%" height="100%" viewBox="0 0 300 160" style={{ opacity: 0.8 }}>
                      <rect x="40" y="40" width="180" height="80" rx="6" fill="#334155" />
                      <path d="M 220 60 L 260 60 L 270 120 L 220 120 Z" fill="#475569" />
                      <circle cx="80" cy="126" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="3" />
                      <circle cx="240" cy="126" r="14" fill="#0F172A" stroke="#F97316" strokeWidth="3" />
                    </svg>

                    <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: 11, color: "#F97316", fontFamily: "monospace", fontWeight: 700, background: "rgba(0,0,0,0.7)", padding: "3px 8px", borderRadius: 4 }}>
                      WB-01 • 10:52:18 AM • PLATE: TN22GH3456
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setImageCaptured(true);
                        alert("Gate entry photo captured successfully.");
                      }}
                      style={{ flex: 1, padding: "8px", borderRadius: 6, background: primaryOrangeSoft, border: `1px solid ${primaryOrange}`, color: primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Retaking ANPR capture...")}
                      style={{ padding: "8px 14px", borderRadius: 6, background: inputBg, border: `1px solid ${border}`, color: secondaryText, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >
                      Retake
                    </button>
                  </div>
                </div>

                {/* ENTRY METADATA (SYSTEM GENERATED) */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px 0", color: primaryText }}>System Entry Info</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 6, background: elevatedSurface }}>
                      <span style={{ color: mutedText }}>Entry Reference:</span>
                      <strong style={{ color: primaryOrange, fontFamily: "monospace" }}>ENT-2026-00842</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 6, background: elevatedSurface }}>
                      <span style={{ color: mutedText }}>Entry Timestamp:</span>
                      <strong style={{ color: primaryText }}>19 Aug 2026, 10:52 AM</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 6, background: elevatedSurface }}>
                      <span style={{ color: mutedText }}>Operator:</span>
                      <strong style={{ color: primaryText }}>Arun Kumar (EMP-0012)</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 6, background: elevatedSurface }}>
                      <span style={{ color: mutedText }}>Assigned Weighbridge:</span>
                      <strong style={{ color: statusOnline }}>WB-01 — Main Gate</strong>
                    </div>
                  </div>
                </div>

                {/* LIVE WEIGHT PREVIEW CARD */}
                <div style={{ padding: 20, borderRadius: 14, background: elevatedSurface, border: `1.5px solid ${statusOnline}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.08em" }}>SCALE SIGNAL PREVIEW</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: statusOnline }}>● STABLE</span>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "monospace", color: primaryText }}>
                    38,500 KG
                  </div>
                  <div style={{ fontSize: 11.5, color: mutedText, marginTop: 4 }}>
                    Scale sensor ready for First Weighing capture.
                  </div>
                </div>

                {/* PRIMARY ACTIONS PANEL */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={handleStartFirstWeighing}
                    disabled={!canProceed}
                    style={{
                      width: "100%",
                      height: 54,
                      borderRadius: 10,
                      background: canProceed ? primaryOrange : "#9CA3AF",
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: 800,
                      border: "none",
                      cursor: canProceed ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      boxShadow: canProceed ? "0 4px 16px rgba(249,115,22,0.35)" : "none",
                    }}
                  >
                    START FIRST WEIGHING →
                  </button>

                  <button
                    onClick={() => {
                      alert("Vehicle entry saved as Pending (ENT-2026-00842).");
                      onNavigate("pending-weighments");
                    }}
                    style={{
                      width: "100%",
                      height: 44,
                      borderRadius: 8,
                      background: "transparent",
                      border: `1px solid ${secondaryGold}`,
                      color: secondaryGold,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Save as Pending
                  </button>
                </div>
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                CONFIRMATION MODAL BEFORE LAUNCHING WEIGHING
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {entryState === "show-confirmation" && (
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: primaryText }}>Ready to Start First Weighing</div>
                    <button onClick={() => setEntryState("found")} style={{ background: "none", border: "none", fontSize: 18, color: mutedText, cursor: "pointer" }}>✕</button>
                  </div>

                  <div style={{ padding: 14, borderRadius: 10, background: elevatedSurface, border: `1px solid ${border}`, marginBottom: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Vehicle:</span><strong style={{ fontFamily: "monospace", color: primaryOrange }}>{vehicleNumber}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Driver:</span><strong>{driverName}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Party:</span><strong>{customerName}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Material:</span><strong>{material}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Station:</span><strong style={{ color: statusOnline }}>WB-01 Main Gate</strong></div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={handleConfirmAndProceed}
                      style={{ flex: 1, height: 48, borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}
                    >
                      Confirm & Start Weighing →
                    </button>
                    <button
                      onClick={() => setEntryState("found")}
                      style={{ padding: "0 16px", height: 48, borderRadius: 8, background: inputBg, border: `1px solid ${border}`, color: secondaryText, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ADD DRIVER QUICK MODAL
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            {showDriverModal && (
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
                  onSubmit={handleSaveDriver}
                  style={{
                    width: "100%",
                    maxWidth: 440,
                    borderRadius: 16,
                    background: surface,
                    border: `1px solid ${border}`,
                    padding: 24,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: primaryText }}>+ Add New Driver</h3>
                    <button type="button" onClick={() => setShowDriverModal(false)} style={{ background: "none", border: "none", fontSize: 18, color: mutedText, cursor: "pointer" }}>✕</button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>Full Driver Name *</label>
                      <input type="text" value={newDriverName} onChange={(e) => setNewDriverName(e.target.value)} placeholder="e.g. Rajesh Kumar" required style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>Phone Number *</label>
                      <input type="text" value={newDriverPhone} onChange={(e) => setNewDriverPhone(e.target.value)} placeholder="e.g. 98765 43210" required style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: secondaryText, marginBottom: 4 }}>Driving License # *</label>
                      <input type="text" value={newDriverDl} onChange={(e) => setNewDriverDl(e.target.value)} placeholder="e.g. TN12 202600123" required style={{ width: "100%", height: 44, padding: "0 12px", borderRadius: 8, border: `1px solid ${border}`, background: inputBg, color: primaryText, fontSize: 14 }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit" style={{ flex: 1, height: 46, borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                      Save & Select Driver
                    </button>
                    <button type="button" onClick={() => setShowDriverModal(false)} style={{ padding: "0 16px", height: 46, borderRadius: 8, background: inputBg, border: `1px solid ${border}`, color: secondaryText, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
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
