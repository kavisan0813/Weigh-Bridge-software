import React, { useState } from "react";
import type { OperatorView } from "./OperatorScreens";

type ViewDevice = "desktop" | "tablet" | "mobile";
type PrintStatusState = "printed" | "printer-offline" | "print-error" | "printing";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: OperatorView) => void;
}

export default function TicketCompletedScreen({ darkMode, onToggleDark, onLogout, onNavigate }: Props) {
  // Viewport & Demo Presets
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [printState, setPrintState] = useState<PrintStatusState>("printed");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showFullscreenPhoto, setShowFullscreenPhoto] = useState<string | null>(null);

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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopyTicket = () => {
    navigator.clipboard?.writeText("WB-2026-00463");
    triggerToast("✓ Ticket number WB-2026-00463 copied to clipboard.");
  };

  const handlePrint = () => {
    if (printState === "printer-offline") {
      triggerToast("⚠️ Printer offline — Ticket ready for PDF download.");
      return;
    }
    if (printState === "print-error") {
      triggerToast("✕ Unable to print ticket — Check printer cable.");
      return;
    }
    setPrintState("printing");
    setTimeout(() => {
      setPrintState("printed");
      triggerToast("✓ Ticket sent to WB-01 printer and printed at 11:15 AM.");
    }, 1200);
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
          TOP TOOLBAR / DEMO PRESET TESTER
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
            ← Back to Dashboard
          </button>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F9FAFB", letterSpacing: "0.03em" }}>
              WEIGHMENT COMPLETED & TICKET CONTROL
            </div>
            <div style={{ fontSize: 10, color: secondaryGold, fontWeight: 600 }}>
              SCREEN 24 — WEIGHMENT WORKFLOW STEP 4 (FINAL)
            </div>
          </div>
        </div>

        {/* Printer Preset Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Printer Preset:</span>
          {[
            { id: "printed", label: "✓ Printed (11:15 AM)" },
            { id: "printer-offline", label: "⚠️ Printer Offline" },
            { id: "print-error", label: "✕ Print Error" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setPrintState(st.id as PrintStatusState)}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                fontSize: 10.5,
                fontWeight: printState === st.id ? 700 : 500,
                border: printState === st.id ? `1px solid ${primaryOrange}` : "1px solid rgba(255,255,255,0.15)",
                background: printState === st.id ? primaryOrange : "transparent",
                color: printState === st.id ? "#FFF" : "#CBD5E1",
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

      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 300,
            background: dm ? "#1E293B" : "#0F172A",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            border: `1px solid ${primaryOrange}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {toastMessage}
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
                <button onClick={() => onNavigate("operator-dashboard")} style={{ background: "none", border: "none", fontSize: 16, color: primaryOrange, cursor: "pointer" }}>
                  ←
                </button>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>Weighment Completed</div>
                  <div style={{ fontSize: 10.5, color: statusOnline, fontWeight: 700 }}>✓ TICKET WB-2026-00463</div>
                </div>
              </div>
            </div>

            {/* Mobile Content */}
            <div style={{ padding: "16px 20px 90px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Success Banner */}
              <div style={{ padding: 20, borderRadius: 16, background: "rgba(22,163,74,0.12)", border: `2px solid ${statusOnline}`, textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: statusOnline, color: "#FFF", fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px auto" }}>
                  ✓
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: statusOnline }}>WEIGHMENT COMPLETED</div>
                <div style={{ fontSize: 11.5, color: secondaryText, marginTop: 2 }}>Transaction recorded at 11:14 AM</div>
                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 800, fontFamily: "monospace", color: primaryOrange }}>
                  TICKET: WB-2026-00463
                </div>
              </div>

              {/* Mobile Net Weight Summary */}
              <div style={{ padding: 20, borderRadius: 16, background: primaryOrangeSoft, border: `2px solid ${primaryOrange}`, textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, letterSpacing: "0.08em" }}>FINAL NET WEIGHT</div>
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "monospace", color: primaryOrange, margin: "4px 0" }}>
                  11,350 KG
                </div>
                <div style={{ fontSize: 12, color: secondaryText, fontWeight: 600 }}>
                  Gross: 24,850 KG − Tare: 13,500 KG
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button
                  onClick={handlePrint}
                  style={{ height: 46, borderRadius: 10, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
                >
                  🖨️ PRINT TICKET
                </button>
                <button
                  onClick={() => triggerToast("Downloading PDF ticket WB-2026-00463.pdf...")}
                  style={{ height: 46, borderRadius: 10, background: elevatedSurface, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  📄 PDF DOWNLOAD
                </button>
              </div>

              {/* Station Readiness */}
              <div style={{ padding: 12, borderRadius: 10, background: elevatedSurface, border: `1px solid ${border}`, textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: statusOnline }}>● WB-01 READY FOR NEXT VEHICLE</div>
                <div style={{ fontSize: 11, color: mutedText, marginTop: 2 }}>Current Platform Weight: 0 KG</div>
              </div>
            </div>

            {/* Mobile Sticky Action */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: surface, borderTop: `1px solid ${border}` }}>
              <button
                onClick={() => onNavigate("vehicle-entry")}
                style={{ width: "100%", height: 50, borderRadius: 10, background: primaryOrange, color: "#FFF", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer" }}
              >
                + START NEXT WEIGHMENT →
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
                    Weighment Completed
                  </h1>
                  <p style={{ fontSize: 12, color: mutedText, margin: "2px 0 0 0" }}>
                    The vehicle weighment for ticket WB-2026-00463 has been successfully recorded.
                  </p>
                </div>
              </div>

              {/* Station Info & Operator */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: primaryText }}>WB-01 — Main Gate</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: statusOnline }}>
                    ● ONLINE
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

            {/* SUCCESS CONFIRMATION BANNER */}
            <div
              style={{
                margin: "20px 32px 0 32px",
                padding: "18px 24px",
                borderRadius: 14,
                background: "rgba(22,163,74,0.12)",
                border: `2px solid ${statusOnline}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: statusOnline, color: "#FFF", fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: statusOnline }}>
                    WEIGHMENT COMPLETED & RECORDED
                  </div>
                  <div style={{ fontSize: 12.5, color: secondaryText, marginTop: 2 }}>
                    Transaction finished at 11:14 AM by Operator Arun Kumar • Audit log recorded.
                  </div>
                </div>
              </div>

              {/* Ticket Reference & Copy */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mutedText, letterSpacing: "0.05em" }}>TICKET NUMBER</div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: primaryOrange }}>
                    WB-2026-00463
                  </div>
                </div>
                <button
                  onClick={handleCopyTicket}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: `1px solid ${border}`,
                    background: surface,
                    color: primaryText,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  📋 Copy Ticket ID
                </button>
              </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div style={{ flex: 1, padding: "20px 32px 32px 32px", display: "grid", gridTemplateColumns: viewDevice === "tablet" ? "1fr" : "1.1fr 0.9fr", gap: 24, overflowY: "auto" }}>
              {/* LEFT COLUMN: FINAL WEIGHT SUMMARY, DETAILS, TIMELINE & PHOTOS */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* FINAL WEIGHT SUMMARY CARD */}
                <div style={{ padding: 24, borderRadius: 16, background: surface, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: mutedText, letterSpacing: "0.08em", marginBottom: 16 }}>
                    FINAL CERTIFIED WEIGHT SUMMARY
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: 14 }}>
                    {/* Gross */}
                    <div style={{ padding: 16, borderRadius: 10, background: elevatedSurface }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>GROSS WEIGHT</div>
                      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", color: primaryText, marginTop: 4 }}>
                        24,850 KG
                      </div>
                      <div style={{ fontSize: 10.5, color: mutedText, marginTop: 4 }}>Captured: 10:55:24 AM</div>
                    </div>

                    {/* Tare */}
                    <div style={{ padding: 16, borderRadius: 10, background: elevatedSurface }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: mutedText }}>TARE WEIGHT</div>
                      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", color: secondaryGold, marginTop: 4 }}>
                        13,500 KG
                      </div>
                      <div style={{ fontSize: 10.5, color: mutedText, marginTop: 4 }}>Captured: 11:12:42 AM</div>
                    </div>

                    {/* Final Net (Hero Highlight) */}
                    <div style={{ padding: 18, borderRadius: 12, background: primaryOrangeSoft, border: `2px solid ${primaryOrange}` }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, letterSpacing: "0.06em" }}>FINAL NET WEIGHT</div>
                      <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "monospace", color: primaryOrange, margin: "2px 0" }}>
                        11,350 KG
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: statusOnline }}>✓ 24,850 KG − 13,500 KG</div>
                    </div>
                  </div>
                </div>

                {/* TRANSACTION DETAILS & AUDIT */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px 0", color: primaryText }}>Transaction Record</h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                    <div>Vehicle: <strong style={{ color: primaryText }}>TN22GH3456 (Heavy Truck)</strong></div>
                    <div>Driver: <strong style={{ color: primaryText }}>Arun Kumar</strong></div>
                    <div>Customer: <strong style={{ color: primaryText }}>Metro Builders Ltd</strong></div>
                    <div>Material: <strong style={{ color: primaryText }}>Gravel</strong></div>
                    <div>Transaction Type: <strong style={{ color: secondaryGold }}>Sales (Outbound)</strong></div>
                    <div>Weighbridge: <strong style={{ color: primaryText }}>WB-01 Main Gate</strong></div>
                    <div>Assigned Operator: <strong style={{ color: primaryText }}>Arun Kumar</strong></div>
                    <div>Transaction Status: <strong style={{ color: statusOnline }}>● COMPLETED</strong></div>
                  </div>
                </div>

                {/* WEIGHMENT WORKFLOW TIMELINE */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px 0", color: primaryText }}>Weighment Audit Timeline</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { time: "10:52:18 AM", title: "Vehicle Entry / Gate Registration", detail: "Registered TN22GH3456 by Arun Kumar", done: true },
                      { time: "10:55:24 AM", title: "First Weighing Captured (Gross)", detail: "24,850 KG recorded & verified", done: true },
                      { time: "11:12:42 AM", title: "Second Weighing Captured (Tare)", detail: "13,500 KG recorded & verified", done: true },
                      { time: "11:14:05 AM", title: "Weighment Completed", detail: "Net weight 11,350 KG calculated. Ticket WB-2026-00463 generated.", done: true },
                    ].map((tl) => (
                      <div key={tl.title} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: statusOnline, color: "#FFF", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                          ✓
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: primaryText }}>{tl.title}</div>
                          <div style={{ fontSize: 11.5, color: secondaryText }}>{tl.detail} • <span style={{ fontFamily: "monospace", color: mutedText }}>{tl.time}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BEFORE & AFTER VEHICLE IMAGES */}
                <div style={{ padding: 20, borderRadius: 14, background: surface, border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px 0", color: primaryText }}>Captured Vehicle Images</h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ padding: 10, borderRadius: 10, background: "#0F172A", border: "1px solid #334155", textAlign: "center" }}>
                      <div style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 700, marginBottom: 6 }}>1ST WEIGHING ENTRY (10:55 AM)</div>
                      <div style={{ height: 90, background: "#1E293B", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#F97316", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>
                        TN22GH3456 • 24,850 KG
                      </div>
                    </div>

                    <div style={{ padding: 10, borderRadius: 10, background: "#0F172A", border: "1px solid #334155", textAlign: "center" }}>
                      <div style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 700, marginBottom: 6 }}>2ND WEIGHING EXIT (11:12 AM)</div>
                      <div style={{ height: 90, background: "#1E293B", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>
                        TN22GH3456 • 13,500 KG
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: DIGITAL TICKET PREVIEW, PRINT ACTIONS & NEXT VEHICLE CTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* REALISTIC DIGITAL TICKET PREVIEW */}
                <div style={{ padding: 24, borderRadius: 16, background: elevatedSurface, border: `1px solid ${border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                  {/* Ticket Header */}
                  <div style={{ textAlign: "center", borderBottom: `1px solid ${border}`, paddingBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.06em", color: primaryText }}>
                      ABC INDUSTRIAL WEIGHBRIDGE
                    </div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: primaryOrange, letterSpacing: "0.15em", marginTop: 2 }}>
                      OFFICIAL WEIGHMENT TICKET
                    </div>
                    <div style={{ fontSize: 11, color: mutedText, marginTop: 4 }}>
                      WB-01 Main Gate Station • Serial # WB-2026-00463
                    </div>
                  </div>

                  {/* Ticket Body Details */}
                  <div style={{ margin: "16px 0", fontSize: 12.5, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Date & Time:</span> <strong>19 Aug 2026, 11:14 AM</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Vehicle Number:</span> <strong style={{ fontFamily: "monospace", color: primaryOrange }}>TN22GH3456</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Driver:</span> <strong>Arun Kumar</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Customer:</span> <strong>Metro Builders Ltd</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Material:</span> <strong>Gravel</strong></div>
                    <div style={{ height: 1, background: border, margin: "6px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Gross Weight:</span> <strong style={{ fontFamily: "monospace" }}>24,850 KG</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Tare Weight:</span> <strong style={{ fontFamily: "monospace" }}>13,500 KG</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, paddingTop: 4 }}><span style={{ fontWeight: 800, color: primaryText }}>NET WEIGHT:</span> <strong style={{ fontFamily: "monospace", color: primaryOrange, fontSize: 16 }}>11,350 KG</strong></div>
                  </div>

                  {/* QR & Barcode Section */}
                  <div style={{ padding: 12, borderRadius: 10, background: surface, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: mutedText }}>SECURITY VERIFICATION</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: statusOnline, marginTop: 2 }}>✓ DIGITAL SIGNATURE VERIFIED</div>
                    </div>
                    {/* Simulated QR Code Box */}
                    <div style={{ width: 44, height: 44, background: dm ? "#374151" : "#E5E7EB", borderRadius: 6, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, padding: 4 }}>
                      <div style={{ background: "#000" }} /><div style={{ background: "transparent" }} /><div style={{ background: "#000" }} />
                      <div style={{ background: "transparent" }} /><div style={{ background: "#000" }} /><div style={{ background: "transparent" }} />
                      <div style={{ background: "#000" }} /><div style={{ background: "#000" }} /><div style={{ background: "#000" }} />
                    </div>
                  </div>

                  {/* Print Actions */}
                  <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    <button
                      onClick={handlePrint}
                      style={{
                        width: "100%",
                        height: 52,
                        borderRadius: 10,
                        background: primaryOrange,
                        color: "#FFFFFF",
                        fontSize: 15,
                        fontWeight: 800,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
                      }}
                    >
                      🖨️ PRINT TICKET
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <button
                        onClick={() => triggerToast("Downloading PDF ticket WB-2026-00463.pdf...")}
                        style={{ height: 42, borderRadius: 8, background: surface, border: `1px solid ${border}`, color: primaryText, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                      >
                        📄 Download PDF
                      </button>
                      <button
                        onClick={() => triggerToast("Email sent to customer Metro Builders Ltd.")}
                        style={{ height: 42, borderRadius: 8, background: surface, border: `1px solid ${border}`, color: primaryText, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                      >
                        ✉️ Email / Share
                      </button>
                    </div>
                  </div>

                  {/* Printer Status Notice */}
                  {printState === "printed" && (
                    <div style={{ marginTop: 12, padding: 8, borderRadius: 6, background: "rgba(22,163,74,0.12)", border: `1px solid ${statusOnline}`, color: statusOnline, fontSize: 11, fontWeight: 700, textAlign: "center" }}>
                      ✓ Ticket printed at 11:15 AM on WB-01 Printer
                    </div>
                  )}

                  {printState === "printer-offline" && (
                    <div style={{ marginTop: 12, padding: 8, borderRadius: 6, background: "rgba(245,158,11,0.12)", border: `1px solid ${statusWarning}`, color: statusWarning, fontSize: 11, fontWeight: 700, textAlign: "center" }}>
                      ⚠️ Printer offline — Weighment recorded cleanly. Use PDF download.
                    </div>
                  )}
                </div>

                {/* STATION READINESS & PRIMARY NEXT WEIGHMENT CTA */}
                <div style={{ padding: 24, borderRadius: 16, background: surface, border: `1px solid ${border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: statusOnline, letterSpacing: "0.06em" }}>
                    ● STATION WB-01 READY FOR NEXT VEHICLE
                  </div>
                  <div style={{ fontSize: 12, color: mutedText, marginTop: 4 }}>
                    Platform Deck Weight: 0 KG (Idle)
                  </div>

                  <button
                    onClick={() => onNavigate("vehicle-entry")}
                    style={{
                      marginTop: 18,
                      width: "100%",
                      height: 56,
                      borderRadius: 10,
                      background: primaryOrange,
                      color: "#FFFFFF",
                      fontSize: 16,
                      fontWeight: 800,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
                    }}
                  >
                    + START NEXT WEIGHMENT →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
