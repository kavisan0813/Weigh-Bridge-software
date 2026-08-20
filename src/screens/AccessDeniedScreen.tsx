import AppShell from "../components/AppShell";

interface AccessDeniedScreenProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function AccessDeniedScreen({
  darkMode,
  onToggleDark,
  onLogout,
  onNavigate,
}: AccessDeniedScreenProps) {
  const dm = darkMode;
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const border = dm ? "#374151" : "#E5E7EB";
  const statusOffline = "#DC2626";
  const primaryOrange = dm ? "#FB923C" : "#F97316";

  return (
    <AppShell
      activeView="access-denied"
      userRole="operator"
      userName="Ravi Kumar"
      stationName="WB-01 Main Gate"
      darkMode={darkMode}
      onToggleDark={onToggleDark}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: surface,
            borderRadius: 16,
            border: `1px solid ${border}`,
            padding: 36,
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(220,38,38,0.12)",
              color: statusOffline,
              fontSize: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
            }}
          >
            🚫
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: primaryText, margin: "0 0 8px" }}>
            Access Denied
          </h2>

          <p style={{ fontSize: 13.5, color: secondaryText, lineHeight: 1.5, margin: "0 0 24px" }}>
            You do not have administrative permissions to view this module. This section is restricted to Administrator roles.
          </p>

          <button
            type="button"
            onClick={() => onNavigate("operator-dashboard")}
            style={{
              height: 44,
              padding: "0 24px",
              borderRadius: 8,
              background: primaryOrange,
              color: "#FFFFFF",
              fontSize: 13.5,
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
            }}
          >
            Return to Operator Dashboard →
          </button>
        </div>
      </main>
    </AppShell>
  );
}
