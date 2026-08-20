import React, { useState } from "react";

type RoleMode = "operator" | "admin";
type ScreenState =
  | "default"
  | "id-error"
  | "invalid-creds"
  | "no-wb"
  | "wb-offline"
  | "device-error"
  | "authenticating"
  | "connecting"
  | "locked"
  | "disabled"
  | "success";

type ViewDevice = "desktop" | "tablet" | "mobile";

interface Weighbridge {
  id: string;
  name: string;
  location: string;
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE" | "WARNING";
  assigned: boolean;
  weightIndicator: boolean;
  printer: boolean;
  camera: boolean;
  lastSync: string;
}

const WEIGHBRIDGES: Weighbridge[] = [
  {
    id: "WB-01",
    name: "Main Gate Weighbridge",
    location: "Main Gate",
    status: "ONLINE",
    assigned: true,
    weightIndicator: true,
    printer: true,
    camera: true,
    lastSync: "Just now",
  },
  {
    id: "WB-02",
    name: "North Yard Scale",
    location: "North Yard",
    status: "ONLINE",
    assigned: true,
    weightIndicator: true,
    printer: true,
    camera: true,
    lastSync: "2 mins ago",
  },
  {
    id: "WB-03",
    name: "Material Yard Scale",
    location: "Material Yard",
    status: "ONLINE",
    assigned: false,
    weightIndicator: true,
    printer: true,
    camera: true,
    lastSync: "5 mins ago",
  },
  {
    id: "WB-04",
    name: "Dispatch Gate Weighbridge",
    location: "Dispatch Gate",
    status: "ONLINE",
    assigned: false,
    weightIndicator: true,
    printer: false,
    camera: true,
    lastSync: "1 min ago",
  },
  {
    id: "WB-05",
    name: "Secondary Gate Scale",
    location: "Secondary Gate",
    status: "OFFLINE",
    assigned: false,
    weightIndicator: false,
    printer: false,
    camera: false,
    lastSync: "Offline 3h ago",
  },
];

interface LoginScreenProps {
  onLogin: (role: "admin" | "operator") => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function LoginScreen({ onLogin, darkMode, onToggleDark }: LoginScreenProps) {
  // Navigation & Role states
  const [roleMode, setRoleMode] = useState<RoleMode>("operator");
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [activeState, setActiveState] = useState<ScreenState>("default");

  // Form Fields
  const [operatorId, setOperatorId] = useState("EMP-0012");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedWbId, setSelectedWbId] = useState<string>("WB-01");
  const [filterAssignedOnly, setFilterAssignedOnly] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  // UI Interactive States
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [idFocused, setIdFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [wbDropdownOpen, setWbDropdownOpen] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState("");

  // Dark Mode Tokens
  const dm = darkMode;

  // Master Design System Color Tokens
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

  // Filtered Weighbridges
  const availableWbs = WEIGHBRIDGES.filter((wb) =>
    filterAssignedOnly ? wb.assigned : true
  );

  const selectedWb = WEIGHBRIDGES.find((w) => w.id === selectedWbId);

  // Quick State Trigger
  const triggerStatePreset = (state: ScreenState) => {
    setActiveState(state);
    if (state === "no-wb") {
      setSelectedWbId("");
    } else if (state === "wb-offline") {
      setSelectedWbId("WB-05");
    } else if (state === "device-error") {
      setSelectedWbId("WB-04");
    } else if (state === "id-error") {
      setOperatorId("");
    } else if (state === "default") {
      setOperatorId("EMP-0012");
      setPassword("••••••••");
      setSelectedWbId("WB-01");
    } else if (state === "locked" || state === "disabled" || state === "invalid-creds") {
      setSelectedWbId("WB-01");
    }
  };

  const handleStartWeighbridge = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!operatorId.trim()) {
      setActiveState("id-error");
      return;
    }
    if (!selectedWbId) {
      setActiveState("no-wb");
      return;
    }
    if (selectedWb && selectedWb.status === "OFFLINE") {
      setActiveState("wb-offline");
      return;
    }

    // Trigger authenticating state animation
    setActiveState("authenticating");
    setLoadingStepText("Authenticating Operator ID & Credentials...");

    setTimeout(() => {
      setActiveState("connecting");
      setLoadingStepText(`Establishing secure link to ${selectedWbId || "WB-01"} Workstation...`);
      setTimeout(() => {
        setActiveState("success");
        setTimeout(() => {
          onLogin(roleMode);
        }, 1200);
      }, 1000);
    }, 1000);
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
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP DEMO CONTROL BAR (Master Design System Toolbar)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header
        style={{
          width: "100%",
          background: dm ? "#1F2937" : "#FFFFFF",
          borderBottom: `1px solid ${dm ? "#374151" : "#E5E7EB"}`,
          padding: "10px 20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Left: Role Switcher & System Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                fontSize: 14,
              }}
            >
              ⚖
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB", letterSpacing: "0.03em" }}>
                WEIGHBRIDGE MANAGEMENT SOFTWARE
              </div>
              <div style={{ fontSize: 10, color: secondaryGold, fontWeight: 600 }}>
                SCREEN 19 — OPERATOR LOGIN
              </div>
            </div>
          </div>

          <div style={{ height: 24, width: 1, background: "rgba(255,255,255,0.15)" }} />

          {/* Role selector */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6 }}>
            <button
              onClick={() => setRoleMode("operator")}
              style={{
                padding: "5px 12px",
                borderRadius: 4,
                border: "none",
                background: roleMode === "operator" ? primaryOrange : "transparent",
                color: roleMode === "operator" ? "#FFFFFF" : "#94A3B8",
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>👤</span> Operator Login
            </button>
            <button
              onClick={() => {
                setRoleMode("admin");
                onLogin("admin");
              }}
              style={{
                padding: "5px 12px",
                borderRadius: 4,
                border: "none",
                background: roleMode === "admin" ? secondaryGold : "transparent",
                color: roleMode === "admin" ? "#FFFFFF" : "#94A3B8",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>🛡️</span> Switch to Admin Login
            </button>
          </div>
        </div>

        {/* Center: State Presets Tester */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Login State Simulator:
          </span>
          {[
            { id: "default", label: "Default" },
            { id: "id-error", label: "ID Error" },
            { id: "invalid-creds", label: "Invalid Creds" },
            { id: "no-wb", label: "No WB" },
            { id: "wb-offline", label: "WB Offline" },
            { id: "device-error", label: "Device Warning" },
            { id: "authenticating", label: "Authenticating" },
            { id: "locked", label: "Account Locked" },
            { id: "disabled", label: "Disabled" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => triggerStatePreset(st.id as ScreenState)}
              style={{
                padding: "4px 9px",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: activeState === st.id ? 700 : 500,
                border: activeState === st.id ? `1px solid ${secondaryGold}` : "1px solid rgba(255,255,255,0.15)",
                background: activeState === st.id ? "rgba(201,154,46,0.25)" : "rgba(255,255,255,0.05)",
                color: activeState === st.id ? "#FDE047" : "#CBD5E1",
                cursor: "pointer",
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Right: Device Viewport Controls & Dark Mode */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Device Frame selector */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", padding: 3, borderRadius: 6 }}>
            <button
              onClick={() => setViewDevice("desktop")}
              style={{
                padding: "4px 10px",
                borderRadius: 4,
                border: "none",
                background: viewDevice === "desktop" ? "rgba(255,255,255,0.2)" : "transparent",
                color: viewDevice === "desktop" ? "#FFF" : "#94A3B8",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Desktop 1440 x 1024 Split View"
            >
              💻 Desktop
            </button>
            <button
              onClick={() => setViewDevice("tablet")}
              style={{
                padding: "4px 10px",
                borderRadius: 4,
                border: "none",
                background: viewDevice === "tablet" ? "rgba(255,255,255,0.2)" : "transparent",
                color: viewDevice === "tablet" ? "#FFF" : "#94A3B8",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Tablet Layout"
            >
              📱 Tablet
            </button>
            <button
              onClick={() => setViewDevice("mobile")}
              style={{
                padding: "4px 10px",
                borderRadius: 4,
                border: "none",
                background: viewDevice === "mobile" ? primaryOrange : "transparent",
                color: viewDevice === "mobile" ? "#FFF" : "#94A3B8",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Mobile 390 x 844 Touch View"
            >
              📲 Mobile (390×844)
            </button>
          </div>

          <button
            onClick={onToggleDark}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              color: "#F9FAFB",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {dm ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN CANVAS CONTAINING DESKTOP / TABLET / MOBILE FRAME
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: viewDevice === "desktop" ? "0" : "32px 16px",
          background: viewDevice !== "desktop" ? (dm ? "#111827" : "#E5E7EB") : bg,
          overflowY: "auto",
        }}
      >
        {/* -------------------------------------------------------------
            MOBILE FRAME (390 x 844)
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

            {/* Mobile Content */}
            <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Header Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: primaryOrange,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                    <path d="M12 2a3 3 0 0 0-3 3c0 1.5.83 2.8 2 3.46V10H7l-2 12h14L17 10h-4V8.46A3.5 3.5 0 0 0 15 5a3 3 0 0 0-3-3z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, letterSpacing: "0.1em" }}>
                    WEIGHBRIDGE
                  </div>
                  <div style={{ fontSize: 10, color: mutedText, fontWeight: 600 }}>
                    OPERATOR PORTAL
                  </div>
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0", color: primaryText }}>
                  Welcome Back
                </h2>
                <p style={{ fontSize: 13, color: secondaryText, margin: 0 }}>
                  Sign in to start your weighbridge operations.
                </p>
              </div>

              {/* Role Confirmation Banner */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: secondaryGoldSoft,
                  border: `1px solid ${dm ? "#5A430E" : "#FEF3C7"}`,
                  marginBottom: 20,
                  fontSize: 12,
                  color: secondaryGold,
                  fontWeight: 600,
                }}
              >
                <span>👤</span>
                Signing in as Weighbridge Operator
              </div>

              {/* Mobile Login Form */}
              <form onSubmit={handleStartWeighbridge} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Operator ID */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>
                    Operator ID *
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: mutedText }}>
                      👤
                    </span>
                    <input
                      type="text"
                      value={operatorId}
                      onChange={(e) => setOperatorId(e.target.value)}
                      placeholder="e.g. EMP-0012"
                      style={{
                        width: "100%",
                        height: 48,
                        paddingLeft: 40,
                        paddingRight: 14,
                        borderRadius: 8,
                        border: activeState === "id-error" ? `1.5px solid ${statusOffline}` : `1px solid ${border}`,
                        background: inputBg,
                        color: primaryText,
                        fontSize: 14,
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                  </div>
                  {activeState === "id-error" && (
                    <div style={{ fontSize: 11, color: statusOffline, marginTop: 4, fontWeight: 500 }}>
                      ⚠️ Operator ID is required.
                    </div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>
                    Password *
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: mutedText }}>
                      🔒
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      style={{
                        width: "100%",
                        height: 48,
                        paddingLeft: 40,
                        paddingRight: 60,
                        borderRadius: 8,
                        border: `1px solid ${border}`,
                        background: inputBg,
                        color: primaryText,
                        fontSize: 14,
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: primaryOrange,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Weighbridge Selection via Bottom Sheet Trigger */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>
                    Weighbridge Station *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBottomSheetOpen(true)}
                    style={{
                      width: "100%",
                      minHeight: 48,
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: activeState === "no-wb" ? `1.5px solid ${statusOffline}` : `1px solid ${border}`,
                      background: inputBg,
                      color: primaryText,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      {selectedWb ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: selectedWb.status === "ONLINE" ? statusOnline : statusOffline,
                            }}
                          />
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{selectedWb.id}</span>
                          <span style={{ fontSize: 12, color: mutedText }}>— {selectedWb.location}</span>
                        </div>
                      ) : (
                        <span style={{ color: mutedText, fontSize: 13 }}>Select Weighbridge...</span>
                      )}
                    </div>
                    <span style={{ color: primaryOrange, fontWeight: 700, fontSize: 13 }}>Tap to Select ▼</span>
                  </button>
                  {activeState === "no-wb" && (
                    <div style={{ fontSize: 11, color: statusOffline, marginTop: 4, fontWeight: 500 }}>
                      ⚠️ Select a weighbridge to continue.
                    </div>
                  )}
                </div>

                {/* Selected WB Status Compact Card */}
                {selectedWb && (
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: dm ? "#111827" : "#F8FAFC",
                      border: `1px solid ${selectedWb.status === "ONLINE" ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: primaryText }}>{selectedWb.id} ({selectedWb.location})</span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: selectedWb.status === "ONLINE" ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
                          color: selectedWb.status === "ONLINE" ? statusOnline : statusOffline,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        ● {selectedWb.status}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, fontSize: 10.5, color: secondaryText }}>
                      <div>Scale: <span style={{ color: selectedWb.weightIndicator ? statusOnline : statusOffline, fontWeight: 600 }}>{selectedWb.weightIndicator ? "✓ Ready" : "✕ Off"}</span></div>
                      <div>Printer: <span style={{ color: selectedWb.printer ? statusOnline : statusOffline, fontWeight: 600 }}>{selectedWb.printer ? "✓ Ready" : "✕ Off"}</span></div>
                      <div>Camera: <span style={{ color: selectedWb.camera ? statusOnline : statusOffline, fontWeight: 600 }}>{selectedWb.camera ? "✓ Ready" : "✕ Off"}</span></div>
                    </div>
                  </div>
                )}

                {/* Remember Device */}
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: secondaryText }}>
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    style={{ accentColor: primaryOrange, width: 16, height: 16 }}
                  />
                  Remember this workstation device
                </label>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={selectedWb?.status === "OFFLINE" || activeState === "locked" || activeState === "disabled"}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 8,
                    background: selectedWb?.status === "OFFLINE" ? "#9CA3AF" : primaryOrange,
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    cursor: selectedWb?.status === "OFFLINE" ? "not-allowed" : "pointer",
                    boxShadow: selectedWb?.status === "OFFLINE" ? "none" : "0 4px 12px rgba(249,115,22,0.3)",
                  }}
                >
                  START WEIGHBRIDGE →
                </button>
              </form>

              {/* Security Footer */}
              <div style={{ marginTop: "auto", paddingTop: 16, textAlign: "center", fontSize: 11, color: mutedText }}>
                🔒 Secure Workstation Log • Version 1.0.0
              </div>
            </div>

            {/* Mobile Bottom Sheet Modal */}
            {isBottomSheetOpen && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(2px)",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    background: surface,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    padding: "20px 20px 30px 20px",
                    maxHeight: "80%",
                    overflowY: "auto",
                    boxShadow: "0 -10px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: primaryText }}>Select Weighbridge</h3>
                      <span style={{ fontSize: 11, color: mutedText }}>Choose active workstation scale</span>
                    </div>
                    <button
                      onClick={() => setIsBottomSheetOpen(false)}
                      style={{ background: "none", border: "none", fontSize: 18, color: mutedText, cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {WEIGHBRIDGES.map((wb) => {
                      const isSelected = wb.id === selectedWbId;
                      return (
                        <div
                          key={wb.id}
                          onClick={() => {
                            setSelectedWbId(wb.id);
                            setIsBottomSheetOpen(false);
                            if (wb.status === "OFFLINE") {
                              setActiveState("wb-offline");
                            } else {
                              setActiveState("default");
                            }
                          }}
                          style={{
                            padding: "14px 16px",
                            minHeight: 64,
                            borderRadius: 12,
                            border: isSelected ? `2px solid ${primaryOrange}` : `1px solid ${border}`,
                            background: isSelected ? primaryOrangeSoft : elevatedSurface,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontWeight: 800, fontSize: 15, color: isSelected ? primaryOrange : primaryText }}>
                                {wb.id}
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  background: wb.status === "ONLINE" ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
                                  color: wb.status === "ONLINE" ? statusOnline : statusOffline,
                                }}
                              >
                                ● {wb.status}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: secondaryText, marginTop: 2 }}>{wb.name}</div>
                          </div>
                          {isSelected && <span style={{ fontSize: 18, color: primaryOrange, fontWeight: 800 }}>✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* -------------------------------------------------------------
              DESKTOP (1440 x 1024) / TABLET LAYOUT
             ------------------------------------------------------------- */
          <div
            style={{
              width: "100%",
              maxWidth: 1440,
              minHeight: viewDevice === "desktop" ? "calc(100vh - 50px)" : 800,
              display: "flex",
              background: surface,
              boxShadow: viewDevice === "tablet" ? "0 20px 40px rgba(0,0,0,0.15)" : "none",
              borderRadius: viewDevice === "tablet" ? 16 : 0,
              overflow: "hidden",
            }}
          >
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                LEFT PANEL — BRAND & INDUSTRIAL VISUAL AREA (55%)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div
              style={{
                width: viewDevice === "tablet" ? "42%" : "55%",
                minWidth: viewDevice === "tablet" ? "42%" : "55%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                background: dm
                  ? "linear-gradient(145deg, #111827 0%, #1F2937 60%, #273449 100%)"
                  : "linear-gradient(145deg, #1F2937 0%, #273449 65%, #111827 100%)",
                padding: viewDevice === "tablet" ? "32px 36px" : "48px 56px",
                borderRight: `1px solid ${dm ? "#374151" : "#E5E7EB"}`,
              }}
            >
              {/* Subtle Grid Pattern Overlay */}
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.05,
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <pattern id="wb-op-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F97316" strokeWidth="0.75" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#wb-op-grid)" />
              </svg>

              {/* Ambient Glow Orbs */}
              <div
                style={{
                  position: "absolute",
                  top: "-10%",
                  left: "-10%",
                  width: "60%",
                  height: "60%",
                  background: "radial-gradient(ellipse, rgba(249,115,22,0.18) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "5%",
                  right: "5%",
                  width: "60%",
                  height: "50%",
                  background: "radial-gradient(ellipse, rgba(201,154,46,0.14) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Left Header */}
              <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: primaryOrange,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                      <path d="M12 2a3 3 0 0 0-3 3c0 1.5.83 2.8 2 3.46V10H7l-2 12h14L17 10h-4V8.46A3.5 3.5 0 0 0 15 5a3 3 0 0 0-3-3z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.16em", color: "#F97316" }}>
                      WEIGHBRIDGE
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.04em" }}>
                      MANAGEMENT SYSTEM
                    </div>
                  </div>
                </div>

                {/* Industrial Role Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 999,
                    background: "rgba(201,154,46,0.15)",
                    border: "1px solid rgba(201,154,46,0.35)",
                    color: "#D4A83A",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C99A2E" }} />
                  OPERATOR WORKSTATION
                </div>
              </div>

              {/* Central Technical Visual Component */}
              <div style={{ position: "relative", zIndex: 10, margin: "auto 0", padding: "28px 0" }}>
                {/* Weighbridge Graphic Vector */}
                <svg viewBox="0 0 600 260" fill="none" style={{ width: "100%", maxHeight: 240, marginBottom: 24 }}>
                  {/* Ground dashed line */}
                  <line x1="20" y1="220" x2="580" y2="220" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

                  {/* Weighbridge Steel Deck */}
                  <rect x="60" y="190" width="480" height="26" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                  <rect x="60" y="190" width="480" height="5" rx="2" fill="#F97316" opacity="0.9" />

                  {/* Load Cells Sensors under deck */}
                  <rect x="80" y="216" width="28" height="12" rx="2" fill="#C99A2E" />
                  <rect x="220" y="216" width="28" height="12" rx="2" fill="#334155" />
                  <rect x="360" y="216" width="28" height="12" rx="2" fill="#334155" />
                  <rect x="490" y="216" width="28" height="12" rx="2" fill="#C99A2E" />

                  {/* Truck Silhouette */}
                  <g opacity="0.95">
                    {/* Cargo */}
                    <rect x="100" y="105" width="270" height="85" rx="6" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                    {[140, 180, 220, 260, 300, 340].map((x) => (
                      <line key={x} x1={x} y1="113" x2={x} y2="182" stroke="#1E293B" strokeWidth="2" />
                    ))}
                    <rect x="100" y="140" width="270" height="8" fill="#C99A2E" opacity="0.85" />

                    {/* Cab */}
                    <path d="M 370 120 L 440 120 C 455 120, 465 130, 468 145 L 472 190 L 370 190 Z" fill="#475569" stroke="#64748B" strokeWidth="1.5" />
                    <path d="M 405 128 L 438 128 C 445 128, 450 134, 452 145 L 405 145 Z" fill="#0F172A" />

                    {/* Wheels */}
                    <circle cx="140" cy="202" r="16" fill="#0F172A" stroke="#64748B" strokeWidth="3" />
                    <circle cx="180" cy="202" r="16" fill="#0F172A" stroke="#64748B" strokeWidth="3" />
                    <circle cx="330" cy="202" r="16" fill="#0F172A" stroke="#64748B" strokeWidth="3" />
                    <circle cx="430" cy="202" r="16" fill="#0F172A" stroke="#F97316" strokeWidth="3" />
                  </g>

                  {/* Weight Indicator Box Terminal */}
                  <rect x="490" y="60" width="95" height="115" rx="8" fill="#0F172A" stroke="#C99A2E" strokeWidth="1.5" />
                  <rect x="498" y="68" width="79" height="44" rx="4" fill="#1E293B" />
                  <text x="537" y="93" textAnchor="middle" fill="#F97316" fontSize="14" fontWeight="800" fontFamily="monospace">
                    38,500
                  </text>
                  <text x="537" y="105" textAnchor="middle" fill="#C99A2E" fontSize="9" fontWeight="700">
                    KG STABLE
                  </text>

                  <circle cx="508" cy="126" r="3.5" fill="#16A34A" />
                  <text x="516" y="129" fill="#94A3B8" fontSize="8" fontWeight="600">WB-01 OK</text>
                  <circle cx="508" cy="140" r="3.5" fill="#F97316" />
                  <text x="516" y="143" fill="#94A3B8" fontSize="8" fontWeight="600">RFID OK</text>
                  <circle cx="508" cy="154" r="3.5" fill="#C99A2E" />
                  <text x="516" y="157" fill="#94A3B8" fontSize="8" fontWeight="600">ANPR OK</text>

                  <line x1="435" y1="115" x2="490" y2="115" stroke="#F97316" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>

                {/* Subtitle & Tagline */}
                <div style={{ maxWidth: 500 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: "#F8FAFC", lineHeight: 1.25, marginBottom: 10 }}>
                    Smart Weighing. Accurate Records. Reliable Operations.
                  </h1>
                  <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginBottom: 20 }}>
                    Fast, secure operator sign-in for real-time axle & gross vehicle weight recording across all 5 industrial weighbridge stations.
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {[
                      { label: "5 Weighbridges Configured", icon: "⚖" },
                      { label: "Hardware Self-Test Active", icon: "🔌" },
                      { label: "Audit Logged Access", icon: "🔒" },
                    ].map((f) => (
                      <div
                        key={f.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#E2E8F0",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ color: "#F97316" }}>{f.icon}</span>
                        {f.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  SYSTEM STATUS CARD (Master Design System Specification)
                 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  background: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", color: "#94A3B8" }}>
                    SYSTEM STATUS
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(22,163,74,0.18)",
                      border: "1px solid rgba(22,163,74,0.35)",
                      color: "#4ADE80",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    ● ALL SYSTEMS ONLINE
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { label: "Connection", status: "Connected", ok: true },
                    { label: "Weight Indicator", status: "Connected", ok: true },
                    { label: "Printer", status: "Connected", ok: true },
                    { label: "Camera", status: "Connected", ok: true },
                  ].map((dev) => (
                    <div key={dev.label} style={{ background: "rgba(255,255,255,0.04)", padding: 8, borderRadius: 6 }}>
                      <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>{dev.label}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: dev.ok ? "#4ADE80" : "#F87171", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <span>{dev.ok ? "✓" : "✕"}</span> {dev.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                RIGHT PANEL — OPERATOR LOGIN FORM (45%)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: surface,
                padding: viewDevice === "tablet" ? "36px 32px" : "48px 48px",
                overflowY: "auto",
              }}
            >
              {/* Login Card Header */}
              <div style={{ width: "100%", maxWidth: 440, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 6,
                      background: primaryOrangeSoft,
                      border: `1px solid ${dm ? "#5A430E" : "#FFEDD5"}`,
                      color: primaryOrange,
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    👤 OPERATOR / EMPLOYEE LOGIN
                  </div>

                  <span style={{ fontSize: 12, color: mutedText }}>
                    WB Version v1.0.0
                  </span>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 30, fontWeight: 800, color: primaryText, margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
                    Welcome Back
                  </h2>
                  <p style={{ fontSize: 14, color: secondaryText, margin: 0, lineHeight: 1.5 }}>
                    Sign in to start your weighbridge operations.
                  </p>
                </div>

                {/* State Banner Notifications */}
                {activeState === "invalid-creds" && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "12px 14px",
                      borderRadius: 8,
                      background: dm ? "#450A0A" : "#FEF2F2",
                      border: `1px solid ${statusOffline}`,
                      color: statusOffline,
                      fontSize: 13,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>⚠️</span>
                    <div>
                      <div>Invalid Operator ID or password.</div>
                      <div style={{ fontSize: 11.5, fontWeight: 400, opacity: 0.9, marginTop: 2 }}>
                        Please check your credentials and try again.
                      </div>
                    </div>
                  </div>
                )}

                {activeState === "locked" && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "14px",
                      borderRadius: 8,
                      background: dm ? "#450A0A" : "#FEF2F2",
                      border: `1.5px solid ${statusOffline}`,
                      color: statusOffline,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>🔒 Account Temporarily Locked</span>
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.4, opacity: 0.9 }}>
                      Your account has been temporarily locked after multiple unsuccessful login attempts.
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Please contact system administrator to unlock operator account.")}
                      style={{
                        marginTop: 10,
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: statusOffline,
                        color: "#FFF",
                        border: "none",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Contact Administrator
                    </button>
                  </div>
                )}

                {activeState === "disabled" && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "14px",
                      borderRadius: 8,
                      background: dm ? "#374151" : "#F3F4F6",
                      border: `1.5px solid ${mutedText}`,
                      color: primaryText,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>🚫 Account Disabled</span>
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4, color: secondaryText }}>
                      Your operator account is currently inactive. Please contact your administrator.
                    </div>
                  </div>
                )}

                {activeState === "wb-offline" && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "12px 14px",
                      borderRadius: 8,
                      background: dm ? "#450A0A" : "#FEF2F2",
                      border: `1px solid ${statusOffline}`,
                      color: statusOffline,
                      fontSize: 13,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>⚠️</span>
                    <div>
                      <div>This weighbridge is currently offline.</div>
                      <div style={{ fontSize: 11.5, fontWeight: 400, marginTop: 2 }}>
                        Please select another available weighbridge to continue operations.
                      </div>
                    </div>
                  </div>
                )}

                {activeState === "device-error" && (
                  <div
                    style={{
                      marginBottom: 20,
                      padding: "14px",
                      borderRadius: 8,
                      background: dm ? "#422F0A" : "#FFFBEB",
                      border: `1px solid ${secondaryGold}`,
                      color: secondaryGold,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>⚠️ Printer connection unavailable.</span>
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4, color: secondaryText }}>
                      Contact your administrator before starting operations.
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={() => triggerStatePreset("default")}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: secondaryGold,
                          color: "#FFF",
                          border: "none",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Retry Connection
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedWbId("WB-01")}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: "transparent",
                          color: secondaryGold,
                          border: `1px solid ${secondaryGold}`,
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Select WB-01
                      </button>
                    </div>
                  </div>
                )}

                {/* Loading / Authenticating State Transition Overlay */}
                {(activeState === "authenticating" || activeState === "connecting" || activeState === "success") && (
                  <div
                    style={{
                      marginBottom: 24,
                      padding: "20px 24px",
                      borderRadius: 12,
                      background: activeState === "success" ? "rgba(22,163,74,0.12)" : primaryOrangeSoft,
                      border: `1.5px solid ${activeState === "success" ? statusOnline : primaryOrange}`,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>
                      {activeState === "success" ? "✓" : "⏳"}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: activeState === "success" ? statusOnline : primaryOrange }}>
                      {activeState === "success" ? "Welcome, Arun Kumar" : "Authenticating..."}
                    </div>
                    <div style={{ fontSize: 13, color: secondaryText, marginTop: 4, fontWeight: 500 }}>
                      {activeState === "success" ? `${selectedWbId} — Main Gate ● READY. Launching workstation...` : loadingStepText}
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleStartWeighbridge} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Field 1: Operator ID */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>
                      Operator ID *
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: idFocused ? primaryOrange : mutedText,
                          fontSize: 15,
                        }}
                      >
                        👤
                      </span>
                      <input
                        type="text"
                        value={operatorId}
                        onChange={(e) => {
                          setOperatorId(e.target.value);
                          if (activeState === "id-error") setActiveState("default");
                        }}
                        onFocus={() => setIdFocused(true)}
                        onBlur={() => setIdFocused(false)}
                        placeholder="e.g. EMP-0012"
                        style={{
                          width: "100%",
                          height: 48,
                          paddingLeft: 42,
                          paddingRight: 14,
                          borderRadius: 8,
                          fontSize: 14,
                          outline: "none",
                          boxSizing: "border-box",
                          background: inputBg,
                          color: primaryText,
                          border: activeState === "id-error"
                            ? `1.5px solid ${statusOffline}`
                            : idFocused
                              ? `1.5px solid ${primaryOrange}`
                              : `1px solid ${border}`,
                          boxShadow: idFocused && activeState !== "id-error" ? `0 0 0 3px rgba(249,115,22,0.15)` : "none",
                          transition: "all 0.15s ease-in-out",
                        }}
                      />
                    </div>
                    {activeState === "id-error" && (
                      <div style={{ fontSize: 12, color: statusOffline, marginTop: 6, fontWeight: 500 }}>
                        ⚠️ Operator ID is required.
                      </div>
                    )}
                  </div>

                  {/* Field 2: Password */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: secondaryText, marginBottom: 6 }}>
                      Password *
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: passFocused ? primaryOrange : mutedText,
                          fontSize: 15,
                        }}
                      >
                        🔒
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPassFocused(true)}
                        onBlur={() => setPassFocused(false)}
                        placeholder="Enter your password"
                        style={{
                          width: "100%",
                          height: 48,
                          paddingLeft: 42,
                          paddingRight: 64,
                          borderRadius: 8,
                          fontSize: 14,
                          outline: "none",
                          boxSizing: "border-box",
                          background: inputBg,
                          color: primaryText,
                          border: passFocused ? `1.5px solid ${primaryOrange}` : `1px solid ${border}`,
                          boxShadow: passFocused ? `0 0 0 3px rgba(249,115,22,0.15)` : "none",
                          transition: "all 0.15s ease-in-out",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: primaryOrange,
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Field 3: Weighbridge Selection */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: secondaryText }}>
                        Weighbridge Station *
                      </label>
                      <label style={{ fontSize: 11.5, color: secondaryGold, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={filterAssignedOnly}
                          onChange={(e) => setFilterAssignedOnly(e.target.checked)}
                          style={{ accentColor: secondaryGold }}
                        />
                        Only Assigned to Me
                      </label>
                    </div>

                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => setWbDropdownOpen(!wbDropdownOpen)}
                        style={{
                          width: "100%",
                          height: 48,
                          padding: "0 14px",
                          borderRadius: 8,
                          border: activeState === "no-wb" ? `1.5px solid ${statusOffline}` : `1px solid ${border}`,
                          background: inputBg,
                          color: primaryText,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: 14,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        {selectedWb ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span
                              style={{
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                background: selectedWb.status === "ONLINE" ? statusOnline : statusOffline,
                              }}
                            />
                            <span style={{ fontWeight: 700 }}>{selectedWb.id}</span>
                            <span style={{ color: secondaryText }}>— {selectedWb.name}</span>
                          </div>
                        ) : (
                          <span style={{ color: mutedText }}>Select Weighbridge...</span>
                        )}
                        <span style={{ color: mutedText, fontSize: 12 }}>▼</span>
                      </button>

                      {/* Dropdown Options List */}
                      {wbDropdownOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            marginTop: 4,
                            background: surface,
                            borderRadius: 10,
                            border: `1px solid ${border}`,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            zIndex: 50,
                            maxHeight: 240,
                            overflowY: "auto",
                          }}
                        >
                          {availableWbs.map((wb) => (
                            <div
                              key={wb.id}
                              onClick={() => {
                                setSelectedWbId(wb.id);
                                setWbDropdownOpen(false);
                                if (wb.status === "OFFLINE") {
                                  setActiveState("wb-offline");
                                } else {
                                  setActiveState("default");
                                }
                              }}
                              style={{
                                padding: "12px 14px",
                                cursor: "pointer",
                                borderBottom: `1px solid ${divider}`,
                                background: wb.id === selectedWbId ? primaryOrangeSoft : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontWeight: 700, fontSize: 13, color: wb.id === selectedWbId ? primaryOrange : primaryText }}>
                                    {wb.id}
                                  </span>
                                  <span style={{ fontSize: 12, color: secondaryText }}>{wb.name}</span>
                                  {wb.assigned && (
                                    <span
                                      style={{
                                        fontSize: 10,
                                        padding: "1px 6px",
                                        borderRadius: 4,
                                        background: "rgba(201,154,46,0.15)",
                                        color: secondaryGold,
                                        fontWeight: 600,
                                      }}
                                    >
                                      Assigned
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>Location: {wb.location}</div>
                              </div>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: wb.status === "ONLINE" ? statusOnline : statusOffline,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                ● {wb.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {activeState === "no-wb" && (
                      <div style={{ fontSize: 12, color: statusOffline, marginTop: 6, fontWeight: 500 }}>
                        ⚠️ Select a weighbridge to continue.
                      </div>
                    )}
                  </div>

                  {/* WEIGHBRIDGE AVAILABILITY & HARDWARE CONNECTION CARD */}
                  {selectedWb && (
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: dm ? "#111827" : "#F8FAFC",
                        border: `1.5px solid ${
                          selectedWb.status === "OFFLINE"
                            ? statusOffline
                            : activeState === "device-error"
                              ? statusWarning
                              : primaryOrange
                        }`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: 14, color: primaryText }}>{selectedWb.id}</span>
                          <span style={{ fontSize: 13, color: secondaryText }}>{selectedWb.location}</span>
                        </div>

                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: selectedWb.status === "ONLINE" ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
                            color: selectedWb.status === "ONLINE" ? statusOnline : statusOffline,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          ● {selectedWb.status}
                        </div>
                      </div>

                      {/* Device Connections list */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 11.5, marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ color: selectedWb.weightIndicator ? statusOnline : statusOffline, fontWeight: 800 }}>
                            {selectedWb.weightIndicator ? "✓" : "✕"}
                          </span>
                          <span style={{ color: secondaryText }}>Indicator</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span
                            style={{
                              color: activeState === "device-error" ? statusWarning : selectedWb.printer ? statusOnline : statusOffline,
                              fontWeight: 800,
                            }}
                          >
                            {activeState === "device-error" ? "✕" : selectedWb.printer ? "✓" : "✕"}
                          </span>
                          <span style={{ color: secondaryText }}>Printer</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ color: selectedWb.camera ? statusOnline : statusOffline, fontWeight: 800 }}>
                            {selectedWb.camera ? "✓" : "✕"}
                          </span>
                          <span style={{ color: secondaryText }}>Camera</span>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: selectedWb.status === "ONLINE" && activeState !== "device-error" ? statusOnline : statusOffline,
                          borderTop: `1px solid ${border}`,
                          paddingTop: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          Status:{" "}
                          {selectedWb.status === "ONLINE" && activeState !== "device-error"
                            ? "READY FOR OPERATION"
                            : activeState === "device-error"
                              ? "HARDWARE WARNING"
                              : "WEIGHBRIDGE OFFLINE"}
                        </span>
                        <span style={{ color: mutedText, fontWeight: 400, fontSize: 10.5 }}>Sync: {selectedWb.lastSync}</span>
                      </div>
                    </div>
                  )}

                  {/* Remember Device & Forgot Password */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: primaryOrange, cursor: "pointer" }}
                      />
                      <div>
                        <div style={{ fontSize: 13, color: secondaryText, fontWeight: 600 }}>Remember this device</div>
                        <div style={{ fontSize: 11, color: mutedText }}>Keep workstation recognized</div>
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={() => alert("Password reset instructions sent to supervisor.")}
                      style={{
                        background: "none",
                        border: "none",
                        color: primaryOrange,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Primary Login Button */}
                  <button
                    type="submit"
                    disabled={selectedWb?.status === "OFFLINE" || activeState === "locked" || activeState === "disabled"}
                    style={{
                      width: "100%",
                      height: 50,
                      borderRadius: 8,
                      background: selectedWb?.status === "OFFLINE" || activeState === "locked" || activeState === "disabled" ? "#9CA3AF" : primaryOrange,
                      color: "#FFFFFF",
                      fontSize: 15,
                      fontWeight: 700,
                      border: "none",
                      cursor: selectedWb?.status === "OFFLINE" || activeState === "locked" || activeState === "disabled" ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      boxShadow: selectedWb?.status === "OFFLINE" ? "none" : "0 4px 14px rgba(249,115,22,0.35)",
                      transition: "all 0.15s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedWb?.status !== "OFFLINE") e.currentTarget.style.background = primaryOrangeHover;
                    }}
                    onMouseLeave={(e) => {
                      if (selectedWb?.status !== "OFFLINE") e.currentTarget.style.background = primaryOrange;
                    }}
                  >
                    START WEIGHBRIDGE
                    <span style={{ fontSize: 16 }}>→</span>
                  </button>
                </form>

                {/* Security Notification Message */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 20,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: dm ? "#111827" : "#F8FAFC",
                    border: `1px solid ${border}`,
                    color: mutedText,
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontSize: 14 }}>🔒</span>
                  <div>
                    <strong style={{ color: secondaryText }}>Secure Operator Access</strong> — Your workstation activity is recorded for operational security.
                  </div>
                </div>

                {/* Last Login Info */}
                <div style={{ marginTop: 16, fontSize: 11.5, color: mutedText, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Last Login: 18 Aug 2026, 08:42 AM</span>
                  <span>Workstation: Main Gate</span>
                </div>
              </div>

              {/* Login Card Footer */}
              <div style={{ width: "100%", maxWidth: 440, margin: "24px auto 0 auto", textAlign: "center", borderTop: `1px solid ${divider}`, paddingTop: 16 }}>
                <div style={{ fontSize: 12, color: mutedText }}>
                  Weighbridge Management System • Version 1.0.0
                </div>
                <div style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>
                  © 2026 Industrial Weighing Systems Inc. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
