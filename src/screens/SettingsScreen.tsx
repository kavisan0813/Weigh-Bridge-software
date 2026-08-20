import { useMemo, useState } from "react";

export interface SettingsScreenProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: any) => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES & DATA STRUCTURES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SettingsCategory =
  | "company"
  | "weighbridge"
  | "rules"
  | "ticket"
  | "camera"
  | "billing"
  | "notifications"
  | "users"
  | "security"
  | "preferences"
  | "integrations"
  | "backup";

export interface WeighbridgeConfig {
  id: string;
  name: string;
  location: string;
  capacity: string;
  status: "ONLINE" | "OFFLINE";
  deviceModel: string;
  connectionType: "Serial (RS232)" | "Network (TCP/IP)" | "USB";
  ipAddress: string;
  port: string;
  baudRate: string;
  activeTxCount: number;
}

export interface CameraConfig {
  id: string;
  name: string;
  weighbridgeId: string;
  type: "IP Camera" | "ANPR Camera";
  ipAddress: string;
  port: string;
  status: "ONLINE" | "OFFLINE";
  captureEntry: boolean;
  captureWeighing: boolean;
  captureExit: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function SettingsScreen({
  darkMode,
  onToggleDark,
  onLogout,
  onNavigate,
}: SettingsScreenProps) {
  const dm = darkMode;
  const p = {
    bg: dm ? "#111827" : "#F8FAFC",
    surface: dm ? "#1F2937" : "#FFFFFF",
    elevated: dm ? "#273449" : "#FFFFFF",
    text: dm ? "#F9FAFB" : "#111827",
    secondary: dm ? "#D1D5DB" : "#4B5563",
    muted: dm ? "#9CA3AF" : "#6B7280",
    border: dm ? "#374151" : "#E5E7EB",
    divider: dm ? "#374151" : "#F1F5F9",
    input: dm ? "#111827" : "#FFFFFF",
    sub: dm ? "#273449" : "#F1F5F9",
    orange: dm ? "#FB923C" : "#F97316",
    orangeHover: dm ? "#F97316" : "#EA580C",
    orangeSoft: dm ? "#273449" : "#FFF7ED",
    gold: dm ? "#D4A83A" : "#C99A2E",
    goldSoft: dm ? "#422F0A" : "#FFFBEB",
    goldLight: dm ? "#5A430E" : "#FEF3C7",
  };

  // State Management
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("company");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Modals & Drawers
  const [isDisableWbModalOpen, setIsDisableWbModalOpen] = useState(false);
  const [selectedWbToDisable, setSelectedWbToDisable] = useState<WeighbridgeConfig | null>(null);
  const [wbDisableReason, setWbDisableReason] = useState("");
  const [wbDisableConfirmChecked, setWbDisableConfirmChecked] = useState(false);
  const [isSignOutSessionsModalOpen, setIsSignOutSessionsModalOpen] = useState(false);

  // 1. Company Profile Form State
  const [companyForm, setCompanyForm] = useState({
    name: "ABC Industrial Services Ltd.",
    regNo: "REG-2026-88019",
    gstin: "33ABCDE1234F1Z5",
    phone: "+91 98765 43210",
    email: "admin@abcindustrial.com",
    website: "www.abcindustrial.com",
    address: "Plot 42, Heavy Industrial Corridor, Phase-II",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600001",
  });

  // 2. Weighbridges State (5 Physical Weighbridges)
  const [weighbridges, setWeighbridges] = useState<WeighbridgeConfig[]>([
    {
      id: "WB-01",
      name: "Main Gate Weighbridge",
      location: "Main Gate",
      capacity: "60 TON",
      status: "ONLINE",
      deviceModel: "Avery Weigh-Tronix E1310 Digital",
      connectionType: "Network (TCP/IP)",
      ipAddress: "192.168.1.101",
      port: "8080",
      baudRate: "9600",
      activeTxCount: 2,
    },
    {
      id: "WB-02",
      name: "North Yard Scale",
      location: "North Yard",
      capacity: "60 TON",
      status: "ONLINE",
      deviceModel: "Rice Lake 920i Programmable",
      connectionType: "Serial (RS232)",
      ipAddress: "192.168.1.102",
      port: "COM3",
      baudRate: "9600",
      activeTxCount: 0,
    },
    {
      id: "WB-03",
      name: "Material Yard Heavy Scale",
      location: "Material Yard",
      capacity: "80 TON",
      status: "ONLINE",
      deviceModel: "Mettler Toledo IND780",
      connectionType: "Network (TCP/IP)",
      ipAddress: "192.168.1.103",
      port: "8080",
      baudRate: "19200",
      activeTxCount: 1,
    },
    {
      id: "WB-04",
      name: "Dispatch Gate Scale",
      location: "Dispatch Gate",
      capacity: "60 TON",
      status: "OFFLINE",
      deviceModel: "Cardinal 225 Digital Indicator",
      connectionType: "Network (TCP/IP)",
      ipAddress: "192.168.1.104",
      port: "8080",
      baudRate: "9600",
      activeTxCount: 0,
    },
    {
      id: "WB-05",
      name: "Secondary Gate Scale",
      location: "Secondary Gate",
      capacity: "60 TON",
      status: "ONLINE",
      deviceModel: "Avery Weigh-Tronix ZM510",
      connectionType: "Network (TCP/IP)",
      ipAddress: "192.168.1.105",
      port: "8080",
      baudRate: "9600",
      activeTxCount: 0,
    },
  ]);

  const [selectedWbId, setSelectedWbId] = useState("WB-01");

  // 3. Weighing Rules State
  const [rulesForm, setRulesForm] = useState({
    minWeight: "100 KG",
    maxWeight: "60,000 KG",
    stableRequired: true,
    stableDuration: "3 seconds",
    autoCaptureStable: true,
    allowManualOverride: false,
    requireSecondWeighing: true,
    maxTolerance: "50 KG",
    duplicateVehicleWarning: true,
    showWeightInKg: true,
    allowOperatorCorrection: false,
  });

  // 4. Ticket & Printing State
  const [ticketForm, setTicketForm] = useState({
    autoGenerate: true,
    autoPrint: true,
    allowReprint: true,
    requireReprintReason: true,
    showQrCode: true,
    showVerificationCode: true,
    showOperatorName: true,
    showWbName: true,
    numberPrefix: "WB",
    startingNumber: "000001",
    resetFrequency: "Never",
    defaultPrinter: "WB-01 Thermal Printer",
    paperType: "80mm Thermal Roll",
    copies: "1",
  });

  // 5. Cameras State
  const [cameras, setCameras] = useState<CameraConfig[]>([
    {
      id: "CAM-01-A",
      name: "WB-01 Entry ANPR Camera",
      weighbridgeId: "WB-01",
      type: "ANPR Camera",
      ipAddress: "192.168.1.120",
      port: "8080",
      status: "ONLINE",
      captureEntry: true,
      captureWeighing: true,
      captureExit: true,
    },
    {
      id: "CAM-01-B",
      name: "WB-01 Scale Overview Camera",
      weighbridgeId: "WB-01",
      type: "IP Camera",
      ipAddress: "192.168.1.121",
      port: "8080",
      status: "ONLINE",
      captureEntry: false,
      captureWeighing: true,
      captureExit: false,
    },
    {
      id: "CAM-02-A",
      name: "WB-02 Entry Camera",
      weighbridgeId: "WB-02",
      type: "IP Camera",
      ipAddress: "192.168.1.122",
      port: "8080",
      status: "ONLINE",
      captureEntry: true,
      captureWeighing: true,
      captureExit: false,
    },
  ]);

  // 6. Billing Config State
  const [billingForm, setBillingForm] = useState({
    enableBilling: true,
    currency: "₹ INR",
    defaultTaxRate: "18% GST",
    paymentTerms: "30 Days",
    allowPartialPayment: true,
    allowManualInvoice: true,
    requireInvoiceApproval: false,
  });

  const [tariffs, setTariffs] = useState([
    { material: "Gravel 20mm", method: "Per Ton", rate: "₹2,500.00", unit: "TON", status: "Active" },
    { material: "Sand M-Sand", method: "Per Ton", rate: "₹2,200.00", unit: "TON", status: "Active" },
    { material: "Portland Cement", method: "Per Ton", rate: "₹3,100.00", unit: "TON", status: "Active" },
    { material: "River Sand", method: "Per Ton", rate: "₹2,800.00", unit: "TON", status: "Active" },
    { material: "Blast Furnace Slag", method: "Per Ton", rate: "₹480.00", unit: "MT", status: "Active" },
  ]);

  // 7. Notifications State
  const [notificationsForm, setNotificationsForm] = useState({
    browserNotifs: true,
    emailNotifs: true,
    smsNotifs: false,
    criticalAlerts: true,
    wbOfflineAlert: true,
    printerOfflineAlert: true,
    cameraOfflineAlert: true,
    failedLoginAlert: true,
    ticketVoidAlert: true,
    invoiceOverdueAlert: true,
  });

  const [recipients, setRecipients] = useState([
    "admin@company.com",
    "operations@company.com",
    "security@company.com",
  ]);
  const [newRecipientInput, setNewRecipientInput] = useState("");

  // 8. Users & Operator WB Access State
  const [operatorWbAccess, setOperatorWbAccess] = useState<Record<string, string[]>>({
    "Arun Kumar": ["WB-01", "WB-02"],
    "Ravi Kumar": ["WB-03"],
    "Suresh Kumar": ["WB-05"],
    Kumar: ["WB-02"],
  });

  // 9. Security & Active Sessions State
  const [securityForm, setSecurityForm] = useState({
    enable2FA: true,
    sessionTimeout: "30 Minutes",
    passwordExpiry: "90 Days",
    maxLoginAttempts: "5",
    lockoutDuration: "15 Minutes",
    requireStrongPassword: true,
    reAuthSensitiveActions: true,
  });

  const [activeSessions, setActiveSessions] = useState([
    { user: "Admin", device: "Windows 11 Desktop", location: "Main Office", ip: "192.168.1.10", lastActive: "1 min ago", isCurrent: true },
    { user: "Arun Kumar", device: "Windows 10 Terminal", location: "WB-01 Station", ip: "192.168.1.24", lastActive: "3 mins ago", isCurrent: false },
    { user: "Ravi Kumar", device: "Windows 10 Terminal", location: "WB-03 Station", ip: "192.168.1.18", lastActive: "12 mins ago", isCurrent: false },
  ]);

  // 10. System Preferences State
  const [systemPrefs, setSystemPrefs] = useState({
    language: "English (US)",
    timezone: "Asia/Kolkata (IST +05:30)",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12 Hour (AM/PM)",
    weightUnit: "KG",
    tempUnit: "°C",
    firstDayOfWeek: "Monday",
    autoRefreshInterval: "5 seconds",
  });

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mark Form Changed
  const markChanged = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  // Save Settings Handler
  const handleSaveSettings = () => {
    setHasUnsavedChanges(false);
    showToast("Settings saved successfully. Security audit entry logged.");
  };

  // Discard Settings Handler
  const handleDiscardSettings = () => {
    setHasUnsavedChanges(false);
    showToast("Unsaved changes discarded.");
  };

  // Sidebar Links
  const sidebarLinks = [
    { key: "dashboard", label: "Dashboard", icon: "▦" },
    { key: "monitoring", label: "Weighbridges", icon: "⚖" },
    { key: "transactions", label: "Transactions", icon: "▤" },
    { key: "vehicles", label: "Vehicles", icon: "▱" },
    { key: "drivers", label: "Drivers", icon: "◉" },
    { key: "customers", label: "Customers", icon: "⌂" },
    { key: "suppliers", label: "Suppliers", icon: "⊞" },
    { key: "materials", label: "Materials", icon: "◇" },
    { key: "employees", label: "Employees", icon: "♙" },
    { key: "tickets", label: "Tickets", icon: "▭" },
    { key: "billing", label: "Billing", icon: "◎" },
    { key: "reports", label: "Reports", icon: "▥" },
    { key: "auditlogs", label: "Audit Logs", icon: "≡" },
    { key: "settings", label: "Settings", icon: "⚙" },
  ];

  // Settings Categories Menu
  const settingsCategories: { key: SettingsCategory; label: string; icon: string; section: string }[] = [
    { key: "company", label: "Company Profile", icon: "🏢", section: "GENERAL" },
    { key: "weighbridge", label: "Weighbridge Config", icon: "⚖️", section: "OPERATIONS" },
    { key: "rules", label: "Weighing Rules", icon: "📏", section: "OPERATIONS" },
    { key: "ticket", label: "Ticket & Printing", icon: "🎫", section: "OPERATIONS" },
    { key: "camera", label: "Cameras & Video", icon: "📹", section: "OPERATIONS" },
    { key: "billing", label: "Billing Config", icon: "💳", section: "FINANCE & COMM" },
    { key: "notifications", label: "Notifications", icon: "🔔", section: "FINANCE & COMM" },
    { key: "users", label: "Users & Permissions", icon: "👥", section: "ACCESS & SECURITY" },
    { key: "security", label: "Security & Sessions", icon: "🔒", section: "ACCESS & SECURITY" },
    { key: "preferences", label: "System Preferences", icon: "⚙️", section: "SYSTEM" },
    { key: "integrations", label: "Integrations", icon: "🔌", section: "SYSTEM" },
    { key: "backup", label: "Backup & Data", icon: "💾", section: "SYSTEM" },
  ];

  // Selected Weighbridge Object
  const currentWb = weighbridges.find((w) => w.id === selectedWbId) || weighbridges[0];

  // Disable WB Modal Action
  const handleConfirmDisableWb = () => {
    if (!selectedWbToDisable) return;
    setWeighbridges((prev) =>
      prev.map((w) => (w.id === selectedWbToDisable.id ? { ...w, status: "OFFLINE" } : w))
    );
    setIsDisableWbModalOpen(false);
    setWbDisableReason("");
    setWbDisableConfirmChecked(false);
    showToast(`Weighbridge ${selectedWbToDisable.id} has been disabled. Audit log created.`);
  };

  // Sign out session handler
  const handleSignOutSession = (ip: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.ip !== ip));
    showToast(`Session (${ip}) terminated.`);
  };

  const handleSignOutAllOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    setIsSignOutSessionsModalOpen(false);
    showToast("All other active user sessions signed out.");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: p.bg,
        color: p.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          01. DESKTOP SIDEBAR (248px)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <aside
        style={{
          width: 248,
          minWidth: 248,
          height: "100vh",
          position: "sticky",
          top: 0,
          display: "flex",
          flexDirection: "column",
          background: dm ? "#1F2937" : "#FFFFFF",
          borderRight: `1px solid ${dm ? "#374151" : "#E5E7EB"}`,
          overflowY: "auto",
          zIndex: 40,
          flexShrink: 0,
        }}
        className="hidden lg:flex"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "18px 20px",
            borderBottom: `1px solid ${dm ? "#374151" : "#E5E7EB"}`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#F97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(249,115,22,0.3)",
            }}
          >
            <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 16 }}>⚖</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.01em", color: dm ? p.text : "#FFFFFF" }}>
              WEIGHBRIDGE
            </div>
            <div style={{ fontSize: 11, color: dm ? p.muted : "#94A3B8", fontWeight: 500 }}>Enterprise Operations</div>
          </div>
        </div>

        <nav style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {sidebarLinks.map((link) => {
            const isActive = link.key === "settings";
            return (
              <button
                key={link.key}
                onClick={() => onNavigate(link.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  border: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  background: isActive ? p.orangeSoft : "transparent",
                  color: isActive ? p.orange : (dm ? p.secondary : "#F9FAFB"),
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 3.5,
                      borderRadius: "0 4px 4px 0",
                      background: p.orange,
                    }}
                  />
                )}
                <span style={{ fontSize: 15, opacity: isActive ? 1 : 0.7 }}>{link.icon}</span>
                {link.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 12, borderTop: `1px solid ${p.border}` }}>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: 0,
              background: "transparent",
              color: p.muted,
              cursor: "pointer",
            }}
          >
            <span>↪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          02. MAIN CONTENT AREA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* TOP HEADER BAR */}
        <header
          style={{
            height: 64,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: p.surface,
            borderBottom: `1px solid ${p.border}`,
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: p.text }}>Settings</h1>
            <p style={{ margin: 0, fontSize: 12, color: p.muted, marginTop: 2 }}>
              Configure company profile, weighbridges, hardware and security controls.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Quick State Toggle Buttons */}
            <button
              onClick={() => setIsLoading(!isLoading)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid ${p.border}`,
                background: p.sub,
                color: p.secondary,
                cursor: "pointer",
              }}
            >
              {isLoading ? "⚡ Stop Skeleton" : "⌛ Skeleton Test"}
            </button>

            {/* Save Status / Button Header Indicator */}
            {hasUnsavedChanges ? (
              <button
                onClick={handleSaveSettings}
                style={{
                  height: 38,
                  padding: "0 16px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: 0,
                  background: p.orange,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 6px rgba(249,115,22,0.3)",
                }}
              >
                <span>💾</span> Save Changes
              </button>
            ) : (
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: 700,
                  background: dm ? "#064E3B" : "#F0FDF4",
                  color: "#16A34A",
                  border: "1px solid #86EFAC",
                }}
              >
                ✓ All Settings Saved
              </span>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDark}
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${p.border}`,
                background: p.surface,
                color: p.muted,
                cursor: "pointer",
                fontSize: 15,
              }}
              title="Toggle Theme"
            >
              {dm ? "☼" : "◐"}
            </button>

            {/* Profile Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingLeft: 12,
                borderLeft: `1px solid ${p.border}`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: "#F97316",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                AD
              </div>
              <div className="hidden sm:block">
                <div style={{ fontSize: 12.5, fontWeight: 700, color: p.text }}>Admin User</div>
                <div style={{ fontSize: 10.5, color: p.muted }}>Super Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              bottom: 80,
              right: 24,
              zIndex: 100,
              background: "#1E293B",
              color: "#FFFFFF",
              padding: "12px 20px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${p.orange}`,
            }}
          >
            <span style={{ color: p.orange, fontSize: 16 }}>✓</span>
            {toastMessage}
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            03. TWO-COLUMN SETTINGS BODY
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <main
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            minHeight: 0,
            overflow: "hidden",
          }}
          className="grid-cols-1 md:grid-cols-[260px_1fr]"
        >
          {/* LEFT SETTINGS CATEGORIES NAVIGATION */}
          <div
            style={{
              background: p.surface,
              borderRight: `1px solid ${p.border}`,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {["GENERAL", "OPERATIONS", "FINANCE & COMM", "ACCESS & SECURITY", "SYSTEM"].map((sec) => {
              const secCategories = settingsCategories.filter((c) => c.section === sec);
              return (
                <div key={sec}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: p.muted,
                      marginBottom: 8,
                      paddingLeft: 8,
                    }}
                  >
                    {sec}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {secCategories.map((cat) => {
                      const isActive = activeCategory === cat.key;
                      return (
                        <button
                          key={cat.key}
                          onClick={() => setActiveCategory(cat.key)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "9px 12px",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: isActive ? 700 : 500,
                            border: 0,
                            cursor: "pointer",
                            textAlign: "left",
                            background: isActive ? p.orangeSoft : "transparent",
                            color: isActive ? p.orange : p.secondary,
                            transition: "all 0.15s ease",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>{cat.icon}</span>
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT SETTINGS PANEL CONTENT */}
          <div style={{ padding: "24px", overflowY: "auto" }}>
            {isLoading ? (
              <SettingsSkeleton p={p} />
            ) : hasError ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#DC2626" }}>Unable to load settings</h3>
                <p style={{ fontSize: 13, color: p.muted }}>Check network connection and retry.</p>
                <button
                  onClick={() => setHasError(false)}
                  style={{ padding: "8px 16px", borderRadius: 6, background: p.orange, color: "#FFFFFF", border: 0 }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* 1. COMPANY PROFILE */}
                {activeCategory === "company" && (
                  <CompanyProfileSection
                    form={companyForm}
                    onChange={(field, val) => {
                      setCompanyForm((prev) => ({ ...prev, [field]: val }));
                      markChanged();
                    }}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 2. WEIGHBRIDGE CONFIGURATION */}
                {activeCategory === "weighbridge" && (
                  <WeighbridgeConfigSection
                    weighbridges={weighbridges}
                    selectedId={selectedWbId}
                    onSelectWb={setSelectedWbId}
                    currentWb={currentWb}
                    onUpdateWb={(id, key, val) => {
                      setWeighbridges((prev) =>
                        prev.map((w) => (w.id === id ? { ...w, [key]: val } : w))
                      );
                      markChanged();
                    }}
                    onTriggerDisableModal={(wb) => {
                      setSelectedWbToDisable(wb);
                      setIsDisableWbModalOpen(true);
                    }}
                    onTestConnection={() => showToast(`Testing connection to ${currentWb.id}... ✓ Success (Latency 12ms)`)}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 3. WEIGHING RULES */}
                {activeCategory === "rules" && (
                  <WeighingRulesSection
                    rules={rulesForm}
                    onChange={(key, val) => {
                      setRulesForm((prev) => ({ ...prev, [key]: val }));
                      markChanged();
                    }}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 4. TICKET & PRINTING */}
                {activeCategory === "ticket" && (
                  <TicketPrintingSection
                    form={ticketForm}
                    onChange={(key, val) => {
                      setTicketForm((prev) => ({ ...prev, [key]: val }));
                      markChanged();
                    }}
                    onTestPrint={(printer) => showToast(`Sent test print page to ${printer}. ✓ Printed successfully.`)}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 5. CAMERAS & VIDEO */}
                {activeCategory === "camera" && (
                  <CamerasSection
                    cameras={cameras}
                    onTestCapture={(camName) => showToast(`Test image frame captured from ${camName}. Saved to audit cache.`)}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 6. BILLING CONFIG */}
                {activeCategory === "billing" && (
                  <BillingConfigSection
                    form={billingForm}
                    tariffs={tariffs}
                    onChangeForm={(key, val) => {
                      setBillingForm((prev) => ({ ...prev, [key]: val }));
                      markChanged();
                    }}
                    onChangeTariff={(index, field, val) => {
                      setTariffs((prev) =>
                        prev.map((t, i) => (i === index ? { ...t, [field]: val } : t))
                      );
                      markChanged();
                    }}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 7. NOTIFICATIONS */}
                {activeCategory === "notifications" && (
                  <NotificationsSection
                    form={notificationsForm}
                    recipients={recipients}
                    newRecipient={newRecipientInput}
                    setNewRecipient={setNewRecipientInput}
                    onToggle={(key) => {
                      setNotificationsForm((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notificationsForm] }));
                      markChanged();
                    }}
                    onAddRecipient={() => {
                      if (newRecipientInput.includes("@")) {
                        setRecipients((prev) => [...prev, newRecipientInput]);
                        setNewRecipientInput("");
                        markChanged();
                        showToast("Notification recipient added.");
                      }
                    }}
                    onRemoveRecipient={(email) => {
                      setRecipients((prev) => prev.filter((r) => r !== email));
                      markChanged();
                    }}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 8. USERS & PERMISSIONS */}
                {activeCategory === "users" && (
                  <UsersPermissionsSection
                    operatorWbAccess={operatorWbAccess}
                    onToggleWbAccess={(operator, wbId) => {
                      setOperatorWbAccess((prev) => {
                        const current = prev[operator] || [];
                        const updated = current.includes(wbId)
                          ? current.filter((x) => x !== wbId)
                          : [...current, wbId];
                        return { ...prev, [operator]: updated };
                      });
                      markChanged();
                    }}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 9. SECURITY & SESSIONS */}
                {activeCategory === "security" && (
                  <SecuritySessionsSection
                    form={securityForm}
                    sessions={activeSessions}
                    onChangeForm={(key, val) => {
                      setSecurityForm((prev) => ({ ...prev, [key]: val }));
                      markChanged();
                    }}
                    onSignOutSession={handleSignOutSession}
                    onTriggerSignOutAllModal={() => setIsSignOutSessionsModalOpen(true)}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 10. SYSTEM PREFERENCES */}
                {activeCategory === "preferences" && (
                  <SystemPreferencesSection
                    prefs={systemPrefs}
                    onChange={(key, val) => {
                      setSystemPrefs((prev) => ({ ...prev, [key]: val }));
                      markChanged();
                    }}
                    dm={dm}
                    onToggleDark={onToggleDark}
                    p={p}
                  />
                )}

                {/* 11. INTEGRATIONS */}
                {activeCategory === "integrations" && (
                  <IntegrationsSection
                    onTestIntegration={(name) => showToast(`Testing connection to ${name}... ✓ Service online.`)}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* 12. BACKUP & DATA */}
                {activeCategory === "backup" && (
                  <BackupDataSection
                    onTriggerBackup={() => showToast("Database backup initiated. File archived to cloud storage.")}
                    p={p}
                    dm={dm}
                  />
                )}

                {/* DANGER ZONE (Displayed at bottom of appropriate sections) */}
                {(activeCategory === "weighbridge" || activeCategory === "security" || activeCategory === "backup") && (
                  <DangerZoneSection
                    onDisableWb={() => {
                      setSelectedWbToDisable(currentWb);
                      setIsDisableWbModalOpen(true);
                    }}
                    onResetIntegrations={() => showToast("Integrations reset to default parameters.")}
                    p={p}
                    dm={dm}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            04. UNSAVED CHANGES PERSISTENT BOTTOM BAR
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {hasUnsavedChanges && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 50,
              background: dm ? "#1E293B" : "#1E293B",
              color: "#FFFFFF",
              padding: "14px 24px",
              borderTop: `1px solid ${p.orange}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 -4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600 }}>
              <span style={{ color: p.orange, fontSize: 16 }}>⚠</span>
              You have unsaved settings modifications.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleDiscardSettings}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 600,
                  background: "transparent",
                  color: "#D1D5DB",
                  border: "1px solid #4B5563",
                  cursor: "pointer",
                }}
              >
                Discard
              </button>
              <button
                onClick={handleSaveSettings}
                style={{
                  padding: "8px 20px",
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 700,
                  background: p.orange,
                  color: "#FFFFFF",
                  border: 0,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(249,115,22,0.4)",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          05. MODALS & DIALOGS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* DISABLE WEIGHBRIDGE WARNING MODAL */}
      {isDisableWbModalOpen && selectedWbToDisable && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setIsDisableWbModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 500,
              background: p.surface,
              border: "1px solid #DC2626",
              borderRadius: 16,
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${p.border}`, background: dm ? "#450A0A" : "#FEF2F2" }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#DC2626" }}>
                ⚠ Disable {selectedWbToDisable.id} ({selectedWbToDisable.location})?
              </h3>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16, fontSize: 13 }}>
              {selectedWbToDisable.activeTxCount > 0 ? (
                <div style={{ padding: "12px 14px", borderRadius: 8, background: "#FFFBEB", border: "1px solid #FDE68A", color: "#D97706" }}>
                  <strong>Warning:</strong> This weighbridge currently has <strong>{selectedWbToDisable.activeTxCount} active weighment transaction(s)</strong> in progress. Disabling it will halt new weighments.
                </div>
              ) : (
                <p style={{ margin: 0, color: p.secondary }}>
                  Disabling {selectedWbToDisable.id} will take the scale offline for operators. Historical logs remain preserved.
                </p>
              )}

              <div>
                <label style={{ fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
                  Reason for disabling *
                </label>
                <textarea
                  rows={3}
                  value={wbDisableReason}
                  onChange={(e) => setWbDisableReason(e.target.value)}
                  placeholder="e.g. Scheduled annual load-cell calibration test..."
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    fontSize: 12.5,
                    background: p.input,
                    color: p.text,
                    border: `1px solid ${p.border}`,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, color: p.text, cursor: "pointer", fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={wbDisableConfirmChecked}
                  onChange={(e) => setWbDisableConfirmChecked(e.target.checked)}
                />
                I understand the operational impact of disabling this weighbridge.
              </label>
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${p.border}`, background: p.sub, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setIsDisableWbModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: p.surface, border: `1px solid ${p.border}`, color: p.secondary, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                disabled={!wbDisableReason.trim() || !wbDisableConfirmChecked}
                onClick={handleConfirmDisableWb}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  background: wbDisableReason.trim() && wbDisableConfirmChecked ? "#DC2626" : p.muted,
                  color: "#FFFFFF",
                  border: 0,
                  cursor: wbDisableReason.trim() && wbDisableConfirmChecked ? "pointer" : "not-allowed",
                }}
              >
                Disable Weighbridge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGN OUT ALL SESSIONS MODAL */}
      {isSignOutSessionsModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setIsSignOutSessionsModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${p.border}` }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: p.text }}>
                Terminate All Other User Sessions?
              </h3>
            </div>
            <div style={{ padding: "24px", fontSize: 13, color: p.secondary }}>
              This will log out all other active operators and administrators across all terminals. Your current session will remain active.
            </div>
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${p.border}`, background: p.sub, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setIsSignOutSessionsModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: p.surface, border: `1px solid ${p.border}`, color: p.secondary, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSignOutAllOtherSessions}
                style={{ padding: "8px 18px", borderRadius: 8, fontSize: 12.5, fontWeight: 700, background: "#DC2626", color: "#FFFFFF", border: 0, cursor: "pointer" }}
              >
                Sign Out All Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 1. COMPANY PROFILE
function CompanyProfileSection({ form, onChange, p, dm }: { form: any; onChange: (f: string, v: string) => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Company Profile</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Manage company branding and legal parameters printed on weighment tickets and tax invoices.
        </p>
      </div>

      {/* Logo Upload Card & Live Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 10 }}>
            Company Logo Asset
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                background: "#F97316",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 24,
                boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
              }}
            >
              ABC
            </div>
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <button style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: p.orange, color: "#FFFFFF", border: 0, cursor: "pointer" }}>
                  Upload Logo
                </button>
                <button style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: p.sub, border: `1px solid ${p.border}`, color: p.muted, cursor: "pointer" }}>
                  Remove
                </button>
              </div>
              <div style={{ fontSize: 11, color: p.muted }}>PNG, JPG, SVG max 2MB. Recommended: 300x300px.</div>
            </div>
          </div>
        </div>

        {/* Live Ticket Header Preview */}
        <div style={{ background: p.sub, border: `1px dashed ${p.border}`, borderRadius: 12, padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase", marginBottom: 8 }}>
            TICKET HEADER LIVE PREVIEW
          </div>
          <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 8, padding: "12px", fontSize: 11.5 }}>
            <div style={{ fontWeight: 800, color: p.orange, fontSize: 13 }}>{form.name}</div>
            <div style={{ color: p.muted }}>{form.address}, {form.city} - {form.postalCode}</div>
            <div style={{ color: p.muted }}>GSTIN: {form.gstin} • Tel: {form.phone}</div>
          </div>
        </div>
      </div>

      {/* Fields Grid */}
      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Company Legal Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Company Registration Number
            </label>
            <input
              type="text"
              value={form.regNo}
              onChange={(e) => onChange("regNo", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              GSTIN / Tax Identification
            </label>
            <input
              type="text"
              value={form.gstin}
              onChange={(e) => onChange("gstin", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Official Phone Number
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Official Admin Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Website URL
            </label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => onChange("website", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Address Line
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => onChange("city", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              State / Province
            </label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => onChange("state", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. WEIGHBRIDGE CONFIGURATION
function WeighbridgeConfigSection({
  weighbridges,
  selectedId,
  onSelectWb,
  currentWb,
  onUpdateWb,
  onTriggerDisableModal,
  onTestConnection,
  p,
  dm,
}: {
  weighbridges: WeighbridgeConfig[];
  selectedId: string;
  onSelectWb: (id: string) => void;
  currentWb: WeighbridgeConfig;
  onUpdateWb: (id: string, key: string, val: any) => void;
  onTriggerDisableModal: (wb: WeighbridgeConfig) => void;
  onTestConnection: () => void;
  p: any;
  dm: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Weighbridge Configuration</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Manage physical weighbridge stations, indicator models, COM ports, and connection parameters.
        </p>
      </div>

      {/* 5 Weighbridges Selection Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {weighbridges.map((wb) => {
          const isSelected = wb.id === selectedId;
          const isOnline = wb.status === "ONLINE";
          return (
            <button
              key={wb.id}
              onClick={() => onSelectWb(wb.id)}
              style={{
                padding: "12px",
                borderRadius: 10,
                textAlign: "left",
                background: isSelected ? p.orangeSoft : p.surface,
                border: `1px solid ${isSelected ? p.orange : p.border}`,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800, fontSize: 13, color: isSelected ? p.orange : p.text }}>
                  {wb.id}
                </span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: "1px 6px",
                    borderRadius: 999,
                    background: isOnline ? (dm ? "#064E3B" : "#F0FDF4") : dm ? "#450A0A" : "#FEF2F2",
                    color: isOnline ? "#16A34A" : "#DC2626",
                  }}
                >
                  {wb.status}
                </span>
              </div>
              <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>{wb.location}</div>
            </button>
          );
        })}
      </div>

      {/* Selected WB Form Editor */}
      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: p.text }}>
            {currentWb.id} — {currentWb.name}
          </h3>
          <button
            onClick={() => onTriggerDisableModal(currentWb)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 11.5,
              fontWeight: 700,
              background: dm ? "#450A0A" : "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FCA5A5",
              cursor: "pointer",
            }}
          >
            Disable {currentWb.id}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Weighbridge Display Name
            </label>
            <input
              type="text"
              value={currentWb.name}
              onChange={(e) => onUpdateWb(currentWb.id, "name", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Physical Location
            </label>
            <input
              type="text"
              value={currentWb.location}
              onChange={(e) => onUpdateWb(currentWb.id, "location", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Rated Scale Capacity
            </label>
            <input
              type="text"
              value={currentWb.capacity}
              onChange={(e) => onUpdateWb(currentWb.id, "capacity", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Connection Protocol
            </label>
            <select
              value={currentWb.connectionType}
              onChange={(e) => onUpdateWb(currentWb.id, "connectionType", e.target.value)}
              style={inputStyle(p)}
            >
              <option>Network (TCP/IP)</option>
              <option>Serial (RS232)</option>
              <option>USB</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              IP Address / COM Port
            </label>
            <input
              type="text"
              value={currentWb.ipAddress}
              onChange={(e) => onUpdateWb(currentWb.id, "ipAddress", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
              Port / Baud Rate
            </label>
            <input
              type="text"
              value={currentWb.port}
              onChange={(e) => onUpdateWb(currentWb.id, "port", e.target.value)}
              style={inputStyle(p)}
            />
          </div>
        </div>

        {/* Device Indicator Box */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${p.divider}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.text }}>
              Indicator Model: {currentWb.deviceModel}
            </div>
            <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>
              Status: <span style={{ color: "#16A34A", fontWeight: 700 }}>● CONNECTED</span> (Response: 12ms)
            </div>
          </div>
          <button
            onClick={onTestConnection}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              background: p.orange,
              color: "#FFFFFF",
              border: 0,
              cursor: "pointer",
            }}
          >
            Test Connection
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. WEIGHING RULES
function WeighingRulesSection({ rules, onChange, p, dm }: { rules: any; onChange: (k: string, v: any) => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Weighing Rules & Operational Flow</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Configure scale stabilization, weight thresholds, manual override policies, and vehicle validation flow.
        </p>
      </div>

      {/* VISUAL WEIGHMENT FLOW DIAGRAM */}
      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: p.muted, textTransform: "uppercase", marginBottom: 14 }}>
          SYSTEM WEIGHMENT WORKFLOW DIAGRAM
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {[
            { step: "1. VEHICLE ENTRY", desc: "ANPR / RFID Detect" },
            { step: "2. FIRST WEIGHING", desc: "Gross / Tare Capture" },
            { step: "3. STABLE WEIGHT", desc: "3s Sensor Hold" },
            { step: "4. SECOND WEIGHING", desc: "Net Weight Compute" },
            { step: "5. TICKET PRINT", desc: "Ticket Issued" },
          ].map((item, idx, arr) => (
            <div key={item.step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: p.orangeSoft,
                  border: `1px solid ${p.orange + "40"}`,
                  minWidth: 140,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: p.orange }}>{item.step}</div>
                <div style={{ fontSize: 10.5, color: p.muted, marginTop: 2 }}>{item.desc}</div>
              </div>
              {idx < arr.length - 1 && <span style={{ color: p.gold, fontWeight: 800 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Rules Toggles Grid */}
      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <ToggleField
            label="Require Stable Weight Before Capture"
            desc="Scale must hold weight stable for configured duration before registering."
            checked={rules.stableRequired}
            onChange={(v) => onChange("stableRequired", v)}
            p={p}
          />
          <ToggleField
            label="Auto-Capture Weight On Stabilization"
            desc="Automatically save weight once indicator stabilization signal triggers."
            checked={rules.autoCaptureStable}
            onChange={(v) => onChange("autoCaptureStable", v)}
            p={p}
          />
          <ToggleField
            label="Allow Manual Weight Override"
            desc="Permit operators to type weights manually (Requires Supervisor approval)."
            checked={rules.allowManualOverride}
            onChange={(v) => onChange("allowManualOverride", v)}
            p={p}
          />
          <ToggleField
            label="Require Second Weighing For Net Compute"
            desc="Mandate both Gross and Tare weighings to compute final payload."
            checked={rules.requireSecondWeighing}
            onChange={(v) => onChange("requireSecondWeighing", v)}
            p={p}
          />
        </div>
      </div>
    </div>
  );
}

// 4. TICKET & PRINTING
function TicketPrintingSection({ form, onChange, onTestPrint, p, dm }: { form: any; onChange: (k: string, v: any) => void; onTestPrint: (p: string) => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Ticket & Printing Configuration</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Configure ticket serial number generator, thermal printers, auto-print triggers, and layout parameters.
        </p>
      </div>

      {/* Ticket Numbering Alert */}
      <div style={{ padding: "14px 16px", borderRadius: 10, background: p.goldSoft, border: `1px solid ${p.gold + "40"}`, color: p.gold, fontSize: 12.5 }}>
        ⚠ <strong>TICKET NUMBERING RULE:</strong> Changing ticket format or prefix affects future ticket serials. Current generator output: <strong>WB-2026-00458</strong>.
      </div>

      {/* Thermal Printers Table */}
      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${p.border}`, fontWeight: 700, fontSize: 13, color: p.text }}>
          Connected Thermal Printers (WB-01 to WB-05)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
          <thead>
            <tr style={{ background: p.sub, color: p.muted }}>
              <th style={{ padding: "10px 16px" }}>PRINTER NAME</th>
              <th style={{ padding: "10px 16px" }}>STATION</th>
              <th style={{ padding: "10px 16px" }}>PAPER TYPE</th>
              <th style={{ padding: "10px 16px" }}>STATUS</th>
              <th style={{ padding: "10px 16px", textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "WB-01 Thermal Printer", station: "WB-01 Main Gate", paper: "80mm Thermal", status: "● ONLINE" },
              { name: "WB-02 Thermal Printer", station: "WB-02 North Yard", paper: "80mm Thermal", status: "● ONLINE" },
              { name: "WB-03 Thermal Printer", station: "WB-03 Material Yard", paper: "80mm Thermal", status: "● ONLINE" },
              { name: "WB-04 Thermal Printer", station: "WB-04 Dispatch Gate", paper: "80mm Thermal", status: "● OFFLINE" },
            ].map((row) => (
              <tr key={row.name} style={{ borderTop: `1px solid ${p.divider}` }}>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: p.text }}>{row.name}</td>
                <td style={{ padding: "12px 16px", color: p.secondary }}>{row.station}</td>
                <td style={{ padding: "12px 16px", color: p.secondary }}>{row.paper}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: row.status.includes("ONLINE") ? "#16A34A" : "#DC2626" }}>{row.status}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  <button onClick={() => onTestPrint(row.name)} style={{ padding: "4px 10px", borderRadius: 4, background: p.orangeSoft, color: p.orange, border: 0, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                    Test Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 5. CAMERAS
function CamerasSection({ cameras, onTestCapture, p, dm }: { cameras: CameraConfig[]; onTestCapture: (n: string) => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Surveillance & ANPR Camera Configuration</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Manage IP cameras, ANPR license plate recognition, and video feeds across all weighbridge stations.
        </p>
      </div>

      {/* Live Feed Widget */}
      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: p.text }}>LIVE CAMERA VIEWPORT (WB-01 Entry ANPR Camera)</span>
          <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 700 }}>● LIVE FEED (25 FPS)</span>
        </div>
        <div style={{ height: 200, background: "#0F172A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>📹</div>
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>WB-01 ENTRY CAMERA STREAM</div>
            <div style={{ fontSize: 10, color: "#64748B" }}>19 AUG 2026 11:35:12 AM IST • 192.168.1.120</div>
          </div>
          <button onClick={() => onTestCapture("WB-01 Entry ANPR Camera")} style={{ position: "absolute", bottom: 12, right: 12, padding: "6px 12px", borderRadius: 6, background: p.orange, color: "#FFFFFF", border: 0, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
            Test Image Capture
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. BILLING CONFIG
function BillingConfigSection({ form, tariffs, onChangeForm, onChangeTariff, p, dm }: { form: any; tariffs: any[]; onChangeForm: (k: string, v: any) => void; onChangeTariff: (i: number, f: string, v: any) => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Billing Configuration & Material Tariffs</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Set tax rates, payment terms, and per-ton material billing tariffs.
        </p>
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 10, background: p.sub, border: `1px solid ${p.border}`, fontSize: 12, color: p.secondary }}>
        ⓘ <strong>HISTORICAL PROTECTION:</strong> Tariff rate updates apply exclusively to future invoices. Past billing transactions remain preserved.
      </div>

      {/* Tariff Table */}
      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${p.border}`, fontWeight: 700, fontSize: 13, color: p.text }}>
          Material Billing Tariff Rates
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
          <thead>
            <tr style={{ background: p.sub, color: p.muted }}>
              <th style={{ padding: "10px 16px" }}>MATERIAL</th>
              <th style={{ padding: "10px 16px" }}>BILLING METHOD</th>
              <th style={{ padding: "10px 16px" }}>CURRENT RATE</th>
              <th style={{ padding: "10px 16px" }}>UNIT</th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((t, idx) => (
              <tr key={t.material} style={{ borderTop: `1px solid ${p.divider}` }}>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: p.text }}>{t.material}</td>
                <td style={{ padding: "12px 16px", color: p.secondary }}>{t.method}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: p.orange }}>{t.rate}</td>
                <td style={{ padding: "12px 16px", color: p.muted }}>{t.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 7. NOTIFICATIONS
function NotificationsSection({ form, recipients, newRecipient, setNewRecipient, onToggle, onAddRecipient, onRemoveRecipient, p, dm }: { form: any; recipients: string[]; newRecipient: string; setNewRecipient: (v: string) => void; onToggle: (k: string) => void; onAddRecipient: () => void; onRemoveRecipient: (r: string) => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Notification & Alert Rules</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Configure system triggers for offline weighbridges, ticket voids, and security alerts.
        </p>
      </div>

      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <ToggleField label="Weighbridge Offline Alert" desc="Trigger notification if scale connection drops." checked={form.wbOfflineAlert} onChange={() => onToggle("wbOfflineAlert")} p={p} />
          <ToggleField label="Printer Disconnected Alert" desc="Alert operations team when thermal printer is offline." checked={form.printerOfflineAlert} onChange={() => onToggle("printerOfflineAlert")} p={p} />
          <ToggleField label="Failed Login Attempt Warning" desc="Notify security upon 3+ failed password attempts." checked={form.failedLoginAlert} onChange={() => onToggle("failedLoginAlert")} p={p} />
          <ToggleField label="Ticket Void Notification" desc="Send email alert when an Admin voids a ticket." checked={form.ticketVoidAlert} onChange={() => onToggle("ticketVoidAlert")} p={p} />
        </div>
      </div>
    </div>
  );
}

// 8. USERS & PERMISSIONS
function UsersPermissionsSection({ operatorWbAccess, onToggleWbAccess, p, dm }: { operatorWbAccess: Record<string, string[]>; onToggleWbAccess: (op: string, wb: string) => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>User Roles & Weighbridge Station Access</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Assign operator station access permissions across WB-01 through WB-05.
        </p>
      </div>

      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800, color: p.text }}>
          Operator Station Assignment Matrix
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
          <thead>
            <tr style={{ background: p.sub, color: p.muted }}>
              <th style={{ padding: "10px 16px" }}>OPERATOR</th>
              <th style={{ padding: "10px 16px" }}>WB-01</th>
              <th style={{ padding: "10px 16px" }}>WB-02</th>
              <th style={{ padding: "10px 16px" }}>WB-03</th>
              <th style={{ padding: "10px 16px" }}>WB-04</th>
              <th style={{ padding: "10px 16px" }}>WB-05</th>
            </tr>
          </thead>
          <tbody>
            {["Arun Kumar", "Ravi Kumar", "Suresh Kumar", "Kumar"].map((op) => (
              <tr key={op} style={{ borderTop: `1px solid ${p.divider}` }}>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: p.text }}>{op}</td>
                {["WB-01", "WB-02", "WB-03", "WB-04", "WB-05"].map((wb) => {
                  const hasAccess = (operatorWbAccess[op] || []).includes(wb);
                  return (
                    <td style={{ padding: "12px 16px" }} key={wb}>
                      <input
                        type="checkbox"
                        checked={hasAccess}
                        onChange={() => onToggleWbAccess(op, wb)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 9. SECURITY & SESSIONS
function SecuritySessionsSection({ form, sessions, onChangeForm, onSignOutSession, onTriggerSignOutAllModal, p, dm }: { form: any; sessions: any[]; onChangeForm: (k: string, v: any) => void; onSignOutSession: (ip: string) => void; onTriggerSignOutAllModal: () => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Security & Active User Sessions</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Manage two-factor authentication, password policies, and active user terminal sessions.
        </p>
      </div>

      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: p.text }}>Active Terminal Sessions</span>
          <button onClick={onTriggerSignOutAllModal} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11.5, fontWeight: 700, background: dm ? "#450A0A" : "#FEF2F2", color: "#DC2626", border: "1px solid #FCA5A5", cursor: "pointer" }}>
            Sign Out All Other Sessions
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
          <thead>
            <tr style={{ background: p.sub, color: p.muted }}>
              <th style={{ padding: "10px 16px" }}>USER</th>
              <th style={{ padding: "10px 16px" }}>DEVICE / LOCATION</th>
              <th style={{ padding: "10px 16px" }}>IP ADDRESS</th>
              <th style={{ padding: "10px 16px" }}>LAST ACTIVE</th>
              <th style={{ padding: "10px 16px", textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.ip} style={{ borderTop: `1px solid ${p.divider}` }}>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: p.text }}>{s.user} {s.isCurrent && <span style={{ color: p.orange }}>(Current)</span>}</td>
                <td style={{ padding: "12px 16px", color: p.secondary }}>{s.device} ({s.location})</td>
                <td style={{ padding: "12px 16px", fontFamily: "monospace", color: p.muted }}>{s.ip}</td>
                <td style={{ padding: "12px 16px", color: p.secondary }}>{s.lastActive}</td>
                <td style={{ padding: "12px 16px", textAlign: "right" }}>
                  {!s.isCurrent && (
                    <button onClick={() => onSignOutSession(s.ip)} style={{ padding: "4px 10px", borderRadius: 4, background: p.sub, color: p.muted, border: `1px solid ${p.border}`, fontSize: 11, cursor: "pointer" }}>
                      Sign Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 10. SYSTEM PREFERENCES
function SystemPreferencesSection({ prefs, onChange, dm, onToggleDark, p }: { prefs: any; onChange: (k: string, v: any) => void; dm: boolean; onToggleDark: () => void; p: any }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>System Preferences</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Set regional timezone, date formats, weight units, and theme appearance.
        </p>
      </div>

      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>System Timezone</label>
            <select value={prefs.timezone} onChange={(e) => onChange("timezone", e.target.value)} style={inputStyle(p)}>
              <option>Asia/Kolkata (IST +05:30)</option>
              <option>UTC (Coordinated Universal Time)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>Default Weight Unit</label>
            <select value={prefs.weightUnit} onChange={(e) => onChange("weightUnit", e.target.value)} style={inputStyle(p)}>
              <option>KG (Kilograms)</option>
              <option>TON (Metric Tons)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// 11. INTEGRATIONS
function IntegrationsSection({ onTestIntegration, p, dm }: { onTestIntegration: (n: string) => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Hardware & Software Integrations</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Connected digital scale indicators, thermal printers, cameras, and API services.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { name: "Digital Weight Indicator", type: "Hardware Scale Gateway", status: "✓ Connected", color: "#16A34A" },
          { name: "Thermal Ticket Printer", type: "ESC/POS Printing Daemon", status: "✓ Connected", color: "#16A34A" },
          { name: "ANPR Camera Feed", type: "Hikvision Vision API", status: "✓ Connected", color: "#16A34A" },
          { name: "SMS Gateway", type: "Twilio Telemetry", status: "⚠ Not Connected", color: "#D97706" },
        ].map((item) => (
          <div key={item.name} style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "16px" }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: p.text }}>{item.name}</div>
            <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>{item.type}</div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: item.color }}>{item.status}</span>
              <button onClick={() => onTestIntegration(item.name)} style={{ padding: "4px 10px", borderRadius: 4, background: p.orangeSoft, color: p.orange, border: 0, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                Test Connection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 12. BACKUP & DATA
function BackupDataSection({ onTriggerBackup, p, dm }: { onTriggerBackup: () => void; p: any; dm: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Backup & Data Governance</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12.5, color: p.muted }}>
          Automated database backup archives and retention settings.
        </p>
      </div>

      <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: p.text }}>Last Automated Backup: 19 Aug 2026, 03:00 AM</div>
          <div style={{ fontSize: 11.5, color: p.muted, marginTop: 4 }}>Archive Size: 2.4 GB • Status: <span style={{ color: "#16A34A", fontWeight: 700 }}>✓ Successful</span></div>
        </div>
        <button onClick={onTriggerBackup} style={{ padding: "10px 18px", borderRadius: 8, background: p.orange, color: "#FFFFFF", border: 0, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
          Backup Now
        </button>
      </div>
    </div>
  );
}

// DANGER ZONE
function DangerZoneSection({ onDisableWb, onResetIntegrations, p, dm }: { onDisableWb: () => void; onResetIntegrations: () => void; p: any; dm: boolean }) {
  return (
    <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${p.border}` }}>
      <div style={{ background: dm ? "#301313" : "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "20px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#DC2626" }}>
          ⚠ Danger Zone & Sensitive Controls
        </h3>
        <p style={{ margin: "0 0 16px", fontSize: 12, color: p.muted }}>
          Critical operations requiring administrative authentication and explicit audit logging.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onDisableWb} style={{ padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: "#DC2626", color: "#FFFFFF", border: 0, cursor: "pointer" }}>
            Disable Weighbridge
          </button>
          <button onClick={onResetIntegrations} style={{ padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: p.surface, color: "#DC2626", border: "1px solid #FCA5A5", cursor: "pointer" }}>
            Reset Integrations
          </button>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS
function ToggleField({ label, desc, checked, onChange, p }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; p: any }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: p.text }}>{label}</div>
        <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>{desc}</div>
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ cursor: "pointer", width: 18, height: 18 }} />
    </div>
  );
}

function SettingsSkeleton({ p }: { p: any }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ height: 24, width: 200, background: p.sub, borderRadius: 6 }} />
      <div style={{ height: 120, background: p.sub, borderRadius: 12 }} />
      <div style={{ height: 200, background: p.sub, borderRadius: 12 }} />
    </div>
  );
}

function inputStyle(p: any) {
  return {
    width: "100%",
    height: 38,
    padding: "0 12px",
    borderRadius: 8,
    fontSize: 12.5,
    background: p.input,
    color: p.text,
    border: `1px solid ${p.border}`,
    outline: "none",
    boxSizing: "border-box" as const,
  };
}
