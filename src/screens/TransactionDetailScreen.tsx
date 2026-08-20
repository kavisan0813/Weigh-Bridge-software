import React, { useState } from "react";

type ViewDevice = "desktop" | "tablet" | "mobile";
type UserRole = "admin" | "operator";
type TransactionStatusState = "COMPLETED" | "AWAITING_SECOND" | "IN_PROGRESS" | "CANCELLED" | "DRAFT" | "ERROR" | "WITH_OVERRIDE" | "WITH_WARNING";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

function pal(dark: boolean) {
  return {
    bg: dark ? "#111827" : "#F8FAFC",
    surface: dark ? "#1F2937" : "#FFFFFF",
    elevated: dark ? "#273449" : "#FFFFFF",
    text: dark ? "#F9FAFB" : "#111827",
    secondary: dark ? "#D1D5DB" : "#4B5563",
    muted: dark ? "#9CA3AF" : "#6B7280",
    border: dark ? "#374151" : "#E5E7EB",
    divider: dark ? "#374151" : "#F1F5F9",
    sub: dark ? "#273449" : "#F8FAFC",
    input: dark ? "#111827" : "#FFFFFF",
    primaryOrange: dark ? "#FB923C" : "#F97316",
    primaryHover: "#EA580C",
    primarySoft: dark ? "rgba(251, 146, 60, 0.15)" : "#FFF7ED",
    secondaryGold: dark ? "#D4A83A" : "#C99A2E",
    secondaryGoldDark: "#8C6415",
    secondarySoft: dark ? "#422F0A" : "#FFFBEB",
    sidebarBg: dark ? "#111827" : "#FFFFFF",
    sidebarText: dark ? "#F9FAFB" : "#111827",
    statusSuccess: "#16A34A",
    statusWarning: "#F59E0B",
    statusError: "#DC2626",
    statusInfo: "#2563EB",
    statusProcessing: "#8B5CF6",
  };
}

export default function TransactionDetailScreen({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Props) {
  const p = pal(dm);

  // Interactive UI Controls
  const [viewDevice, setViewDevice] = useState<ViewDevice>("desktop");
  const [role, setRole] = useState<UserRole>("admin");
  const [txState, setTxState] = useState<TransactionStatusState>("COMPLETED");

  // Modals & Feedback State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("Vehicle arrived with additional material. Operator verified vehicle before second weighing.");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(notesText);
  const [auditExpanded, setAuditExpanded] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Status Badge Config Helper
  const getStatusConfig = (state: TransactionStatusState) => {
    switch (state) {
      case "COMPLETED":
        return { label: "✓ COMPLETED", color: p.statusSuccess, bg: dm ? "rgba(22, 163, 74, 0.15)" : "#F0FDF4", border: "#BBF7D0" };
      case "AWAITING_SECOND":
        return { label: "● AWAITING SECOND WEIGHING", color: p.statusWarning, bg: dm ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB", border: "#FDE68A" };
      case "IN_PROGRESS":
        return { label: "⏳ IN PROGRESS", color: p.statusProcessing, bg: dm ? "rgba(139, 92, 246, 0.15)" : "#F3E8FF", border: "#DDD6FE" };
      case "CANCELLED":
        return { label: "✕ CANCELLED", color: p.statusError, bg: dm ? "rgba(220, 38, 38, 0.15)" : "#FEF2F2", border: "#FECACA" };
      case "DRAFT":
        return { label: "● DRAFT", color: p.muted, bg: dm ? "rgba(156, 163, 175, 0.15)" : "#F1F5F9", border: p.border };
      case "ERROR":
        return { label: "● ERROR", color: p.statusError, bg: dm ? "rgba(220, 38, 38, 0.15)" : "#FEF2F2", border: "#FECACA" };
      case "WITH_OVERRIDE":
        return { label: "⚠ WITH OVERRIDE", color: p.statusWarning, bg: dm ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB", border: "#FDE68A" };
      case "WITH_WARNING":
        return { label: "⚠ WITH WARNING", color: p.statusWarning, bg: dm ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB", border: "#FDE68A" };
    }
  };

  const statusBadge = getStatusConfig(txState);

  // Related Transactions Data
  const relatedTransactions = [
    { ticket: "WB-2026-00442", date: "18 Aug 2026, 04:22 PM", net: "10,950 KG", status: "COMPLETED" },
    { ticket: "WB-2026-00418", date: "17 Aug 2026, 02:16 PM", net: "11,420 KG", status: "COMPLETED" },
    { ticket: "WB-2026-00397", date: "16 Aug 2026, 11:05 AM", net: "11,180 KG", status: "COMPLETED" },
  ];

  // Audit Events
  const auditEvents = [
    { time: "10:52 AM", action: "Transaction Created", user: "Arun Kumar", value: "Ticket WB-2026-00463" },
    { time: "10:55 AM", action: "First Weight Captured", user: "Arun Kumar", value: "24,850 KG (Stable)" },
    { time: "11:12 AM", action: "Second Weight Captured", user: "Arun Kumar", value: "13,500 KG (Stable)" },
    { time: "11:14 AM", action: "Weighment Completed", user: "Arun Kumar", value: "Net Weight 11,350 KG" },
    { time: "11:15 AM", action: "Ticket Printed", user: "System", value: "WB-01 Thermal Printer (1 Copy)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: p.bg, color: p.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>


      {/* Toast Notification Pop-up */}
      {toastMessage && (
        <div style={{ position: "fixed", top: 60, right: 24, zIndex: 1200, background: p.primaryOrange, color: "#FFF", padding: "10px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, boxShadow: "0 10px 25px rgba(249,115,22,0.4)" }}>
          {toastMessage}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN VIEWPORT SHELL CONTAINER
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ display: "flex", justifyContent: "center", padding: viewDevice === "desktop" ? "0" : "20px 0" }}>
        {viewDevice === "mobile" ? (
          /* -------------------------------------------------------------
              PURPOSE-BUILT MOBILE VIEW (390 × 844)
             ------------------------------------------------------------- */
          <div
            style={{
              width: 390,
              minHeight: 844,
              background: p.bg,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              borderRadius: 24,
              border: `1px solid ${p.border}`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              paddingBottom: 76,
            }}
          >
            {/* Mobile Header Bar */}
            <div style={{ padding: "16px 18px", background: p.surface, borderBottom: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={() => onNavigate("transactions")} style={{ background: "none", border: 0, color: p.primaryOrange, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                ← Transactions
              </button>
              <span style={{ fontSize: 15, fontWeight: 800, color: p.text }}>Transaction Detail</span>
              <button onClick={() => setShowPrintModal(true)} style={{ background: "none", border: 0, color: p.secondaryGold, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Print
              </button>
            </div>

            {/* Mobile Scrollable Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* 1. Status & Ticket Badge Header */}
              <div style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.border}` }}>
                    {statusBadge.label}
                  </span>
                  <span style={{ fontSize: 11, color: p.muted, fontWeight: 600 }}>19 Aug 2026, 11:14 AM</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: p.primaryOrange, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>WB-2026-00463</div>
                <div style={{ fontSize: 12, color: p.secondary, marginTop: 2 }}>Weighbridge WB-01 • Main Gate</div>
              </div>

              {/* 2. Mobile Weight Summary */}
              <div style={{ background: p.primarySoft, borderRadius: 14, border: `1px solid ${p.primaryOrange}`, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: p.primaryOrange, letterSpacing: "0.08em" }}>FINAL NET WEIGHT</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: p.primaryOrange, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                  {txState === "AWAITING_SECOND" ? "PENDING" : "11,350 KG"}
                </div>

                <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${p.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: p.secondary }}>Gross Weight</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: p.text, fontVariantNumeric: "tabular-nums" }}>24,850 KG</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: p.secondary }}>Tare Weight</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: p.secondaryGold, fontVariantNumeric: "tabular-nums" }}>
                      {txState === "AWAITING_SECOND" ? "—" : "13,500 KG"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Mobile Vehicle & Driver Summary */}
              <div style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: p.muted }}>VEHICLE & DRIVER</span>
                  <button onClick={() => onNavigate("vehicle-detail")} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Vehicle Profile →</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: p.secondary }}>Vehicle No:</span>
                  <strong style={{ color: p.text, fontVariantNumeric: "tabular-nums" }}>TN22GH3456 (Heavy Truck)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: p.secondary }}>Driver:</span>
                  <strong style={{ color: p.text }}>Arun Kumar</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: p.secondary }}>Customer:</span>
                  <strong style={{ color: p.text }}>Metro Builders Ltd</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: p.secondary }}>Material:</span>
                  <strong style={{ color: p.text }}>Gravel (Construction)</strong>
                </div>
              </div>

              {/* 4. Mobile Weighment Timeline */}
              <div style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: p.muted, letterSpacing: "0.08em", marginBottom: 12 }}>WEIGHMENT TIMELINE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ borderLeft: `2px solid ${p.statusSuccess}`, paddingLeft: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: p.text }}>Step 1: Vehicle Entry (10:52 AM)</div>
                    <div style={{ fontSize: 11, color: p.secondary }}>Gate registration verified</div>
                  </div>
                  <div style={{ borderLeft: `2px solid ${p.statusSuccess}`, paddingLeft: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: p.text }}>Step 2: First Weighing (10:55 AM)</div>
                    <div style={{ fontSize: 11, color: p.secondary }}>Gross: 24,850 KG (Stable)</div>
                  </div>
                  <div style={{ borderLeft: `2px solid ${txState === "AWAITING_SECOND" ? p.statusWarning : p.statusSuccess}`, paddingLeft: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: p.text }}>Step 3: Second Weighing (11:12 AM)</div>
                    <div style={{ fontSize: 11, color: p.secondary }}>{txState === "AWAITING_SECOND" ? "Pending vehicle return" : "Tare: 13,500 KG (Stable)"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Bottom Action Bar */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: p.surface, borderTop: `1px solid ${p.border}`, padding: "10px 16px", display: "flex", gap: 10, alignItems: "center" }}>
              {txState === "AWAITING_SECOND" ? (
                <button onClick={() => onNavigate("second-weighment")} style={{ flex: 1, height: 48, borderRadius: 10, background: p.primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                  CONTINUE SECOND WEIGHING →
                </button>
              ) : (
                <>
                  <button onClick={() => setShowPrintModal(true)} style={{ flex: 1, height: 48, borderRadius: 10, background: p.primaryOrange, color: "#FFF", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                    PRINT TICKET
                  </button>
                  <button onClick={() => setShowExportModal(true)} style={{ height: 48, padding: "0 16px", borderRadius: 10, background: p.sub, color: p.text, border: `1px solid ${p.border}`, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Export
                  </button>
                </>
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
              background: p.surface,
              boxShadow: viewDevice === "tablet" ? "0 20px 40px rgba(0,0,0,0.15)" : "none",
              borderRadius: viewDevice === "tablet" ? 16 : 0,
              overflow: "hidden",
            }}
          >
            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                LEFT SIDEBAR — NAVIGATION (248px Wide)
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <aside
              style={{
                width: viewDevice === "tablet" ? 200 : 248,
                minWidth: viewDevice === "tablet" ? 200 : 248,
                background: p.sidebarBg,
                borderRight: `1px solid ${p.border}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                {/* Branding Header */}
                <div style={{ padding: "20px 20px", borderBottom: `1px solid ${p.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: p.primaryOrange, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 800 }}>
                    ⚖
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", color: p.primaryOrange }}>WEIGHBRIDGE</div>
                    <div style={{ fontSize: 11, color: p.muted, fontWeight: 500 }}>ABC Industries</div>
                  </div>
                </div>

                {/* Nav Links */}
                <nav style={{ padding: "12px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    ["dashboard", "Dashboard", "📊"],
                    ["live-weighment", "Weigh", "⚖️"],
                    ["pending-weighments", "Pending Weighments", "⏳"],
                    ["transactions", "Transactions", "📋"],
                    ["vehicles", "Vehicles", "🚚"],
                    ["drivers", "Drivers", "👤"],
                    ["customers", "Customers", "🏢"],
                    ["suppliers", "Suppliers", "🏬"],
                    ["materials", "Materials", "📦"],
                    ["tickets", "Tickets", "🎟️"],
                    ["reports", "Reports", "📈"],
                    ["settings", "Settings", "⚙️"],
                  ].map(([key, label, icon]) => {
                    const active = label === "Transactions";
                    return (
                      <button
                        key={label}
                        onClick={() => onNavigate(key)}
                        style={{
                          width: "100%",
                          padding: "9.5px 12px",
                          borderRadius: 8,
                          border: "none",
                          background: active ? p.primarySoft : "transparent",
                          color: active ? p.primaryOrange : p.secondary,
                          fontSize: 13.5,
                          fontWeight: active ? 700 : 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.12s ease-in-out",
                        }}
                      >
                        <span style={{ fontSize: 14, color: active ? p.primaryOrange : p.secondaryGold }}>{icon}</span>
                        {label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer User Info */}
              <div style={{ padding: "16px 20px", borderTop: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 999, background: p.primaryOrange, color: "#FFF", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                    {role === "admin" ? "AD" : "OP"}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: p.text }}>{role === "admin" ? "Super Admin" : "Arun Kumar"}</div>
                    <div style={{ fontSize: 10.5, color: p.muted }}>{role === "admin" ? "Platform Admin" : "WB Operator"}</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                RIGHT MAIN CONTENT AREA
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: p.bg }}>
              {/* Desktop Main Header */}
              <header style={{ padding: "16px 32px", background: p.surface, borderBottom: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 11.5, color: p.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => onNavigate("transactions")} style={{ background: "none", border: 0, color: p.secondary, cursor: "pointer", padding: 0, fontSize: 11.5 }}>
                      Transactions
                    </button>
                    <span>/</span>
                    <span style={{ color: p.primaryOrange, fontWeight: 700 }}>Transaction Detail</span>
                  </div>
                  <h1 style={{ margin: "4px 0 0 0", fontSize: 24, fontWeight: 800, color: p.text }}>Transaction Detail</h1>
                  <p style={{ margin: "2px 0 0 0", fontSize: 12.5, color: p.secondary }}>CompleteInformation and certified weighing history for this transaction.</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 12, textAlign: "right", marginRight: 8 }}>
                    <div style={{ fontWeight: 800, color: p.primaryOrange }}>WB-01 — Main Gate</div>
                    <div style={{ color: p.statusSuccess, fontWeight: 700 }}>● ONLINE • Operator: Arun Kumar</div>
                  </div>

                  <button
                    onClick={() => setShowPrintModal(true)}
                    style={{ height: 40, padding: "0 16px", borderRadius: 8, background: p.primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    🖨 Print Ticket
                  </button>
                  <button
                    onClick={() => setShowExportModal(true)}
                    style={{ height: 40, padding: "0 14px", borderRadius: 8, background: p.sub, border: `1px solid ${p.border}`, color: p.text, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    ↓ Download PDF / Export
                  </button>

                  {role === "admin" && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      style={{ height: 40, padding: "0 12px", borderRadius: 8, background: dm ? "rgba(220,38,38,0.15)" : "#FEF2F2", color: p.statusError, border: "1px solid #FECACA", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    >
                      Cancel Tx
                    </button>
                  )}
                </div>
              </header>

              {/* Scrollable Main Content */}
              <main style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
                {/* 1. TRANSACTION IDENTITY BANNER CARD */}
                <div style={{ background: p.surface, borderRadius: 16, border: `1px solid ${p.border}`, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", color: p.muted }}>TRANSACTION RECORD</span>
                      <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 800, background: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.border}` }}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <h2 style={{ margin: "6px 0 0 0", fontSize: 32, fontWeight: 900, color: p.primaryOrange, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>WB-2026-00463</h2>
                    <div style={{ fontSize: 13, color: p.secondary, marginTop: 4, display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span>Date: <strong style={{ color: p.text }}>19 Aug 2026</strong></span>
                      <span>Time: <strong style={{ color: p.text }}>11:14 AM</strong></span>
                      <span>Vehicle: <strong style={{ color: p.primaryOrange }}>TN22GH3456</strong></span>
                      <span>Weighbridge: <strong style={{ color: p.text }}>WB-01 — Main Gate</strong></span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => showToast("✓ Transaction ID copied to clipboard")}
                      style={{ padding: "8px 14px", borderRadius: 8, background: p.sub, border: `1px solid ${p.border}`, color: p.text, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      📋 Copy Ticket ID
                    </button>
                    {txState === "AWAITING_SECOND" && (
                      <button
                        onClick={() => onNavigate("second-weighment")}
                        style={{ padding: "8px 16px", borderRadius: 8, background: p.primaryOrange, color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
                      >
                        Continue Second Weighing →
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. PRIMARY WEIGHT SUMMARY CARD (Visual Hierarchy Strongest) */}
                <div style={{ background: p.surface, borderRadius: 16, border: `2px solid ${p.primaryOrange}`, padding: 24, boxShadow: "0 10px 30px rgba(249,115,22,0.12)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: p.primaryOrange, letterSpacing: "0.06em" }}>FINAL WEIGHT SUMMARY</h3>
                    <span style={{ fontSize: 12, color: p.muted, fontWeight: 600 }}>Formula: GROSS WEIGHT − TARE WEIGHT = NET WEIGHT</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: 16, alignItems: "center" }}>
                    <div style={{ background: p.sub, padding: 18, borderRadius: 12, border: `1px solid ${p.border}` }}>
                      <div style={{ fontSize: 11.5, color: p.muted, fontWeight: 700, textTransform: "uppercase" }}>GROSS WEIGHT (1st Weighing)</div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: p.text, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>24,850 KG</div>
                      <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>Captured 10:55 AM (WB-01)</div>
                    </div>

                    <div style={{ background: p.secondarySoft, padding: 18, borderRadius: 12, border: `1px solid ${p.secondaryGold}` }}>
                      <div style={{ fontSize: 11.5, color: p.secondaryGold, fontWeight: 800, textTransform: "uppercase" }}>TARE WEIGHT (2nd Weighing)</div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: p.secondaryGold, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                        {txState === "AWAITING_SECOND" ? "PENDING" : "13,500 KG"}
                      </div>
                      <div style={{ fontSize: 11, color: p.secondary, marginTop: 2 }}>{txState === "AWAITING_SECOND" ? "Awaiting vehicle return" : "Captured 11:12 AM (WB-01)"}</div>
                    </div>

                    <div style={{ background: p.primarySoft, padding: 20, borderRadius: 12, border: `2px solid ${p.primaryOrange}`, textAlign: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: p.primaryOrange, letterSpacing: "0.1em" }}>CERTIFIED FINAL NET WEIGHT</div>
                      <div style={{ fontSize: 40, fontWeight: 900, color: p.primaryOrange, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                        {txState === "AWAITING_SECOND" ? "PENDING 2ND" : "11,350 KG"}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: p.text, marginTop: 2 }}>
                        {txState === "AWAITING_SECOND" ? "Gross 24,850 KG captured" : "11.35 Metric Tons Net Material"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional Alert Cards for Overrides or Warnings */}
                {txState === "WITH_OVERRIDE" && (
                  <div style={{ background: dm ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: p.statusWarning }}>⚠️ MANUAL OVERRIDE RECORDED</div>
                    <div style={{ fontSize: 12, color: p.text, marginTop: 4 }}>
                      Reason: Unexpected cargo variation on platform • Requested by Operator Arun Kumar • Approved by Super Admin at 11:14 AM
                    </div>
                  </div>
                )}

                {txState === "WITH_WARNING" && (
                  <div style={{ background: dm ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: p.statusWarning }}>⚠️ TARE VARIANCE WARNING</div>
                    <div style={{ fontSize: 12, color: p.text, marginTop: 4 }}>
                      Tare weight difference (+50 KG) exceeded baseline (13,450 KG registered vs 13,500 KG actual). Status: ✓ Within Allowed ±100 KG Tolerance.
                    </div>
                  </div>
                )}

                {/* 3. ENTITY INFORMATION GRID CARDS */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
                  {/* TRANSACTION INFORMATION CARD */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <h3 style={{ margin: "0 0 14px 0", fontSize: 15, fontWeight: 800, color: p.text }}>TRANSACTION INFORMATION</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Transaction ID</span>
                        <span style={{ fontWeight: 800, color: p.text, fontVariantNumeric: "tabular-nums" }}>WB-2026-00463</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Ticket Number</span>
                        <span style={{ fontWeight: 800, color: p.primaryOrange, fontVariantNumeric: "tabular-nums" }}>WB-2026-00463</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Transaction Type</span>
                        <span style={{ fontWeight: 700, color: p.text }}>Outbound Sales Delivery</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Status</span>
                        <span style={{ fontWeight: 800, color: statusBadge.color }}>{statusBadge.label}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Created</span>
                        <span style={{ fontWeight: 700, color: p.text }}>19 Aug 2026, 10:52 AM</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: p.muted }}>Completed</span>
                        <span style={{ fontWeight: 700, color: p.text }}>19 Aug 2026, 11:14 AM</span>
                      </div>
                    </div>
                  </section>

                  {/* VEHICLE INFORMATION CARD */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: p.text }}>VEHICLE INFORMATION</h3>
                      <button onClick={() => onNavigate("vehicle-detail")} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        View Vehicle →
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Vehicle Number</span>
                        <span style={{ fontWeight: 800, color: p.primaryOrange, fontVariantNumeric: "tabular-nums" }}>TN22GH3456</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Vehicle Type</span>
                        <span style={{ fontWeight: 700, color: p.text }}>Heavy Truck (Commercial)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Registered Tare</span>
                        <span style={{ fontWeight: 700, color: p.text, fontVariantNumeric: "tabular-nums" }}>13,450 KG</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: p.muted }}>Actual Tare</span>
                        <span style={{ fontWeight: 800, color: p.secondaryGold, fontVariantNumeric: "tabular-nums" }}>13,500 KG</span>
                      </div>
                    </div>
                  </section>

                  {/* DRIVER INFORMATION CARD */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: p.text }}>DRIVER INFORMATION</h3>
                      <button onClick={() => onNavigate("drivers")} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        View Driver →
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Driver Name</span>
                        <span style={{ fontWeight: 800, color: p.text }}>Arun Kumar</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Phone</span>
                        <span style={{ fontWeight: 700, color: p.text }}>+91 98765 43210</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: p.muted }}>License Status</span>
                        <span style={{ fontWeight: 800, color: p.statusSuccess }}>● VALID (TN-XX-XXXXXXXX)</span>
                      </div>
                    </div>
                  </section>

                  {/* CUSTOMER & MATERIAL CARDS */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: p.text }}>CUSTOMER & MATERIAL</h3>
                      <button onClick={() => onNavigate("customers")} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        View Customer →
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>Customer</span>
                        <span style={{ fontWeight: 800, color: p.text }}>Metro Builders Ltd</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${p.border}`, paddingBottom: 8 }}>
                        <span style={{ color: p.muted }}>GST Number</span>
                        <span style={{ fontWeight: 700, color: p.text, fontVariantNumeric: "tabular-nums" }}>33AAAAA0000A1Z5</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: p.muted }}>Material & Qty</span>
                        <span style={{ fontWeight: 800, color: p.primaryOrange }}>Gravel • 11,350 KG</span>
                      </div>
                    </div>
                  </section>
                </div>

                {/* 4. WEIGHMENT TIMELINE & WEIGHT COMPARISON GRID */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
                  {/* WEIGHMENT TIMELINE */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: 800, color: p.text }}>WEIGHMENT TIMELINE</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 12, height: 12, borderRadius: 999, background: p.statusSuccess }} />
                          <div style={{ width: 2, flex: 1, background: p.border, marginTop: 4 }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: p.text }}>Step 1: Vehicle Entry (10:52 AM)</div>
                          <div style={{ fontSize: 12, color: p.secondary, marginTop: 2 }}>Gate Registration Verified • Driver: Arun Kumar</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 12, height: 12, borderRadius: 999, background: p.statusSuccess }} />
                          <div style={{ width: 2, flex: 1, background: p.border, marginTop: 4 }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: p.text }}>Step 2: First Weighing (10:55 AM)</div>
                          <div style={{ fontSize: 12, color: p.secondary, marginTop: 2 }}>Gross Weight Captured: <strong style={{ color: p.text, fontVariantNumeric: "tabular-nums" }}>24,850 KG</strong> • Indicator Connected</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 12, height: 12, borderRadius: 999, background: txState === "AWAITING_SECOND" ? p.statusWarning : p.statusSuccess }} />
                          <div style={{ width: 2, flex: 1, background: p.border, marginTop: 4 }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: p.text }}>Step 3: Second Weighing (11:12 AM)</div>
                          <div style={{ fontSize: 12, color: p.secondary, marginTop: 2 }}>
                            {txState === "AWAITING_SECOND" ? "Awaiting vehicle return to scale" : "Tare Weight Captured: 13,500 KG (Stable)"}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 12, height: 12, borderRadius: 999, background: txState === "AWAITING_SECOND" ? p.muted : p.statusSuccess }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: p.text }}>Step 4: Weighment Completed (11:14 AM)</div>
                          <div style={{ fontSize: 12, color: p.secondary, marginTop: 2 }}>
                            {txState === "AWAITING_SECOND" ? "Pending final net weight calculation" : "Certified Net Weight: 11,350 KG • Ticket Generated"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* DEVICE & PRINTER STATUS CARD */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <h3 style={{ margin: "0 0 14px 0", fontSize: 15, fontWeight: 800, color: p.text }}>CONNECTED DEVICE STATUS</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                      <div style={{ padding: 10, background: p.sub, borderRadius: 8, border: `1px solid ${p.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Scale Indicator</span>
                        <strong style={{ color: p.statusSuccess }}>✓ Connected</strong>
                      </div>
                      <div style={{ padding: 10, background: p.sub, borderRadius: 8, border: `1px solid ${p.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>ANPR Camera</span>
                        <strong style={{ color: p.statusSuccess }}>✓ Connected</strong>
                      </div>
                      <div style={{ padding: 10, background: p.sub, borderRadius: 8, border: `1px solid ${p.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Thermal Printer</span>
                        <strong style={{ color: p.statusSuccess }}>✓ Connected (WB-01)</strong>
                      </div>
                      <div style={{ padding: 10, background: p.sub, borderRadius: 8, border: `1px solid ${p.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Weighbridge Status</span>
                        <strong style={{ color: p.statusSuccess }}>✓ Online</strong>
                      </div>
                    </div>
                  </section>
                </div>

                {/* 5. WEIGHMENT IMAGES & TICKET PREVIEW GRID */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* WEIGHMENT CAPTURED PHOTOS CARD */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: p.text }}>WEIGHMENT CAPTURED PHOTOS</h3>
                      <button onClick={() => setShowImageLightbox(true)} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        View Fullscreen
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div onClick={() => setShowImageLightbox(true)} style={{ height: 140, background: p.sub, borderRadius: 10, border: `1px solid ${p.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <div style={{ fontSize: 36 }}>🚛</div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: p.text, marginTop: 4 }}>1st Weighing Photo</div>
                        <div style={{ fontSize: 10.5, color: p.muted }}>10:55:23 AM (WB-01)</div>
                      </div>

                      <div onClick={() => setShowImageLightbox(true)} style={{ height: 140, background: p.sub, borderRadius: 10, border: `1px solid ${p.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <div style={{ fontSize: 36 }}>🚚</div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: p.text, marginTop: 4 }}>2nd Weighing Photo</div>
                        <div style={{ fontSize: 10.5, color: p.muted }}>11:12:41 AM (WB-01)</div>
                      </div>
                    </div>
                  </section>

                  {/* TICKET PREVIEW CARD */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: p.text }}>CERTIFIED TICKET PREVIEW</h3>
                      <button onClick={() => setShowPrintModal(true)} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        Print Preview →
                      </button>
                    </div>

                    <div style={{ background: dm ? "#172033" : "#FFFBEB", borderRadius: 12, border: `1px dashed ${p.secondaryGold}`, padding: 16, fontFamily: "monospace", fontSize: 12, color: p.text }}>
                      <div style={{ textAlign: "center", fontWeight: 800, color: p.primaryOrange }}>ABC INDUSTRIES WEIGHBRIDGE</div>
                      <div style={{ textAlign: "center", fontSize: 10, color: p.secondary }}>Main Gate • WB-01 • Ticket: WB-2026-00463</div>
                      <div style={{ borderBottom: `1px dashed ${p.border}`, margin: "8px 0" }} />
                      <div>Vehicle: TN22GH3456 • Driver: Arun Kumar</div>
                      <div>Material: Gravel • Customer: Metro Builders</div>
                      <div style={{ borderBottom: `1px dashed ${p.border}`, margin: "8px 0" }} />
                      <div>Gross: 24,850 KG (10:55 AM)</div>
                      <div>Tare : 13,500 KG (11:12 AM)</div>
                      <div style={{ fontWeight: 900, color: p.primaryOrange, marginTop: 4 }}>NET  : 11,350 KG</div>
                      <div style={{ borderBottom: `1px dashed ${p.border}`, margin: "8px 0" }} />
                      <div style={{ textAlign: "center", fontSize: 10, color: p.muted }}>✓ Certified by Operator Arun Kumar</div>
                    </div>
                  </section>
                </div>

                {/* 6. AUDIT HISTORY TIMELINE LOG & NOTES */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20, marginBottom: 24 }}>
                  {/* AUDIT LOG */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: p.text }}>TRANSACTION AUDIT HISTORY</h3>
                      <button onClick={() => setAuditExpanded(!auditExpanded)} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {auditExpanded ? "Collapse" : "Expand All"}
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {auditEvents.map((evt, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: p.sub, borderRadius: 8, border: `1px solid ${p.border}`, fontSize: 12.5 }}>
                          <div>
                            <div style={{ fontWeight: 800, color: p.text }}>{evt.action}</div>
                            <div style={{ fontSize: 11, color: p.secondary }}>{evt.value} • By {evt.user}</div>
                          </div>
                          <span style={{ fontSize: 11, color: p.muted, fontVariantNumeric: "tabular-nums" }}>{evt.time}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* TRANSACTION NOTES CARD */}
                  <section style={{ background: p.surface, borderRadius: 14, border: `1px solid ${p.border}`, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: p.text }}>TRANSACTION NOTES</h3>
                        {role === "admin" && !isEditingNotes && (
                          <button onClick={() => { setTempNotes(notesText); setIsEditingNotes(true); }} style={{ background: "none", border: 0, color: p.primaryOrange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            Edit Notes
                          </button>
                        )}
                      </div>

                      {isEditingNotes ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <textarea
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            style={{ width: "100%", height: 90, borderRadius: 8, padding: 10, background: p.input, color: p.text, border: `1px solid ${p.primaryOrange}`, fontSize: 12.5, outline: "none" }}
                          />
                          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button onClick={() => setIsEditingNotes(false)} style={{ padding: "6px 12px", borderRadius: 6, background: p.sub, border: `1px solid ${p.border}`, color: p.secondary, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                              Cancel
                            </button>
                            <button onClick={() => { setNotesText(tempNotes); setIsEditingNotes(false); showToast("✓ Notes saved"); }} style={{ padding: "6px 12px", borderRadius: 6, background: p.primaryOrange, color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ background: p.sub, padding: 14, borderRadius: 10, border: `1px solid ${p.border}`, fontSize: 13, color: p.text, lineHeight: 1.5 }}>
                          "{notesText}"
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${p.border}`, fontSize: 11, color: p.muted }}>
                      Added by <strong style={{ color: p.text }}>Arun Kumar</strong> on 19 Aug 2026, 11:13 AM
                    </div>
                  </section>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MODALS & DIALOGS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. PRINT TICKET MODAL */}
      {showPrintModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 440, background: p.surface, borderRadius: 16, border: `1px solid ${p.border}`, padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: p.text }}>Print Weighment Ticket</h3>
              <button onClick={() => setShowPrintModal(false)} style={{ background: "none", border: 0, fontSize: 18, color: p.muted, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: p.muted }}>Select Thermal Printer</label>
                <select style={{ width: "100%", height: 40, marginTop: 4, borderRadius: 8, padding: "0 12px", background: p.input, color: p.text, border: `1px solid ${p.border}` }}>
                  <option>WB-01 Thermal Printer (Default - Online)</option>
                  <option>Office Laser Printer (Online)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: p.muted }}>Number of Copies</label>
                <input defaultValue="1" type="number" style={{ width: "100%", height: 40, marginTop: 4, borderRadius: 8, padding: "0 12px", background: p.input, color: p.text, border: `1px solid ${p.border}` }} />
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowPrintModal(false)} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: p.sub, border: `1px solid ${p.border}`, color: p.text, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  showToast("✓ Ticket printed successfully on WB-01 Thermal Printer");
                }}
                style={{ height: 40, padding: "0 18px", borderRadius: 8, background: p.primaryOrange, color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Print Ticket Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXPORT MODAL */}
      {showExportModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 400, background: p.surface, borderRadius: 16, border: `1px solid ${p.border}`, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: p.text }}>Export Transaction WB-2026-00463</h3>
              <button onClick={() => setShowExportModal(false)} style={{ background: "none", border: 0, fontSize: 18, color: p.muted, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["PDF Document (.pdf)", "Excel Spreadsheet (.xlsx)", "CSV Data File (.csv)"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    setShowExportModal(false);
                    showToast(`✓ Transaction exported as ${fmt.split(" ")[0]}`);
                  }}
                  style={{ padding: 12, borderRadius: 8, background: p.sub, border: `1px solid ${p.border}`, color: p.text, fontWeight: 700, fontSize: 13, textAlign: "left", cursor: "pointer" }}
                >
                  ↓ Export as {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. CANCEL TRANSACTION MODAL */}
      {showCancelModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 440, background: p.surface, borderRadius: 16, border: `1px solid ${p.border}`, padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 900, color: p.text }}>Cancel Transaction WB-2026-00463?</h3>
            <p style={{ margin: "0 0 14px 0", fontSize: 13, color: p.secondary }}>
              Cancelling will invalidate this ticket. Historical weighing audit logs will remain preserved for legal compliance.
            </p>
            <input placeholder="Reason for cancellation (e.g. Duplicate Entry)" style={{ width: "100%", height: 40, borderRadius: 8, padding: "0 12px", background: p.input, color: p.text, border: `1px solid ${p.border}`, fontSize: 12.5, outline: "none", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCancelModal(false)} style={{ height: 40, padding: "0 16px", borderRadius: 8, background: p.sub, border: `1px solid ${p.border}`, color: p.text, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                Keep Active
              </button>
              <button
                onClick={() => {
                  setTxState("CANCELLED");
                  setShowCancelModal(false);
                  showToast("✓ Transaction WB-2026-00463 cancelled");
                }}
                style={{ height: 40, padding: "0 18px", borderRadius: 8, background: p.statusError, color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {showImageLightbox && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 720, background: p.surface, borderRadius: 20, border: `1px solid ${p.border}`, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: p.text }}>TN22GH3456 — Weighment Photo (WB-01)</span>
              <button onClick={() => setShowImageLightbox(false)} style={{ background: "none", border: 0, fontSize: 20, color: p.text, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ width: "100%", height: 320, background: dm ? "#172033" : "#E2E8F0", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 96 }}>
              🚛
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: p.muted }}>Captured: 19 Aug 2026, 10:55 AM • ANPR Verified</span>
              <button onClick={() => setShowImageLightbox(false)} style={{ height: 36, padding: "0 16px", borderRadius: 8, background: p.primaryOrange, color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
