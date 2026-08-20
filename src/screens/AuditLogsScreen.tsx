import { useMemo, useState } from "react";

export interface AuditLogsProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: any) => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES & DATA SCHEMAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SeverityType = "INFO" | "WARNING" | "CRITICAL";
export type ResultType = "SUCCESS" | "FAILED" | "BLOCKED";

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  role: "Admin" | "Employee / Operator";
  action: string;
  module:
    | "Authentication"
    | "Weighbridges"
    | "Transactions"
    | "Vehicles"
    | "Drivers"
    | "Customers"
    | "Suppliers"
    | "Materials"
    | "Employees"
    | "Tickets"
    | "Billing"
    | "Reports"
    | "Settings"
    | "System";
  reference: string;
  weighbridge: string;
  ipAddress: string;
  result: ResultType;
  severity: SeverityType;
  // Detail Fields
  deviceInfo: {
    os: string;
    browser: string;
    sessionId: string;
  };
  details: {
    reason?: string;
    previousStatus?: string;
    newStatus?: string;
    delta?: { field: string; before: string; after: string }[];
  };
  timeline: { time: string; event: string; actor: string }[];
  relatedRecords: {
    ticket?: string;
    vehicle?: string;
    material?: string;
    customer?: string;
    supplier?: string;
    operator?: string;
  };
}

// Initial Sample Audit Logs Dataset
const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: "AUD-2026-001842",
    timestamp: "19 Aug 2026, 11:20 AM",
    user: "Admin",
    role: "Admin",
    action: "Ticket Voided",
    module: "Tickets",
    reference: "WB-2026-00451",
    weighbridge: "WB-01",
    ipAddress: "192.168.1.10",
    result: "SUCCESS",
    severity: "CRITICAL",
    deviceInfo: { os: "Windows 11 Enterprise", browser: "Chrome 127.0", sessionId: "SES-8F42K92L" },
    details: {
      reason: "Duplicate ticket generated due to operator re-entry request.",
      previousStatus: "COMPLETED",
      newStatus: "VOID",
      delta: [
        { field: "Status", before: "COMPLETED", after: "VOID" },
        { field: "Ticket State", before: "ACTIVE", after: "VOIDED" },
        { field: "Void Reason", before: "N/A", after: "Duplicate ticket" },
        { field: "Authorized By", before: "N/A", after: "Admin (EMP-001)" }
      ]
    },
    timeline: [
      { time: "09:15 AM", event: "Ticket Created", actor: "Arun Kumar" },
      { time: "09:16 AM", event: "First Weighing Recorded (38,300 KG)", actor: "WB-01 Scale" },
      { time: "09:20 AM", event: "Second Weighing Recorded (13,500 KG)", actor: "WB-01 Scale" },
      { time: "09:21 AM", event: "Ticket Printed", actor: "Arun Kumar" },
      { time: "11:20 AM", event: "Ticket Voided", actor: "Admin" }
    ],
    relatedRecords: {
      ticket: "WB-2026-00451",
      vehicle: "TN22GH3456",
      material: "Gravel 20mm",
      customer: "Metro Builders",
      supplier: "Metro Aggregates",
      operator: "Arun Kumar"
    }
  },
  {
    id: "AUD-2026-001841",
    timestamp: "19 Aug 2026, 10:51 AM",
    user: "Arun Kumar",
    role: "Employee / Operator",
    action: "Ticket Printed",
    module: "Tickets",
    reference: "WB-2026-00458",
    weighbridge: "WB-01",
    ipAddress: "192.168.1.24",
    result: "SUCCESS",
    severity: "INFO",
    deviceInfo: { os: "Windows 10 IoT", browser: "Edge 125.0", sessionId: "SES-33A190KK" },
    details: {
      reason: "Standard ticket print request following completed net weighing.",
      previousStatus: "READY",
      newStatus: "PRINTED",
      delta: [{ field: "Copies Printed", before: "0", after: "1" }]
    },
    timeline: [
      { time: "10:45 AM", event: "Vehicle Positioned on Scale", actor: "WB-01 Sensor" },
      { time: "10:48 AM", event: "Net Weight Stabilized (25,000 KG)", actor: "Indicator #1" },
      { time: "10:51 AM", event: "Ticket Printed", actor: "Arun Kumar" }
    ],
    relatedRecords: {
      ticket: "WB-2026-00458",
      vehicle: "TN20AB1234",
      material: "Gravel",
      customer: "ABC Construction",
      supplier: "Alpha Quarries",
      operator: "Arun Kumar"
    }
  },
  {
    id: "AUD-2026-001840",
    timestamp: "19 Aug 2026, 10:48 AM",
    user: "Arun Kumar",
    role: "Employee / Operator",
    action: "Weighment Completed",
    module: "Transactions",
    reference: "WB-2026-00458",
    weighbridge: "WB-01",
    ipAddress: "192.168.1.24",
    result: "SUCCESS",
    severity: "INFO",
    deviceInfo: { os: "Windows 10 IoT", browser: "Edge 125.0", sessionId: "SES-33A190KK" },
    details: {
      reason: "Net weight calculated automatically from Gross (38,500 KG) and Tare (13,500 KG).",
      previousStatus: "WEIGHING",
      newStatus: "COMPLETED",
      delta: [
        { field: "Gross Weight", before: "Pending", after: "38,500 KG" },
        { field: "Tare Weight", before: "13,500 KG", after: "13,500 KG" },
        { field: "Net Weight", before: "0 KG", after: "25,000 KG" }
      ]
    },
    timeline: [
      { time: "10:42 AM", event: "Vehicle Arrived at WB-01", actor: "ANPR Camera" },
      { time: "10:48 AM", event: "Weighment Completed", actor: "Arun Kumar" }
    ],
    relatedRecords: {
      ticket: "WB-2026-00458",
      vehicle: "TN20AB1234",
      material: "Gravel",
      customer: "ABC Construction",
      operator: "Arun Kumar"
    }
  },
  {
    id: "AUD-2026-001839",
    timestamp: "19 Aug 2026, 10:15 AM",
    user: "Admin",
    role: "Admin",
    action: "Operator Permission Updated",
    module: "Employees",
    reference: "EMP-0012",
    weighbridge: "WB-01",
    ipAddress: "192.168.1.10",
    result: "SUCCESS",
    severity: "CRITICAL",
    deviceInfo: { os: "Windows 11 Enterprise", browser: "Chrome 127.0", sessionId: "SES-8F42K92L" },
    details: {
      reason: "Granted Tare Manual Override access for night shift supervisor.",
      previousStatus: "STANDARD_OPERATOR",
      newStatus: "SENIOR_OPERATOR",
      delta: [
        { field: "Manual Tare Override", before: "Disabled", after: "Enabled" },
        { field: "Max Manual Tolerance", before: "0 KG", after: "500 KG" }
      ]
    },
    timeline: [
      { time: "10:12 AM", event: "Permission Change Requested", actor: "Priya Sharma" },
      { time: "10:15 AM", event: "Permission Granted & Saved", actor: "Admin" }
    ],
    relatedRecords: {
      operator: "Ravi Kumar (EMP-0012)"
    }
  },
  {
    id: "AUD-2026-001838",
    timestamp: "19 Aug 2026, 09:32 AM",
    user: "Suresh Kumar",
    role: "Employee / Operator",
    action: "Login Failed",
    module: "Authentication",
    reference: "--",
    weighbridge: "--",
    ipAddress: "192.168.1.35",
    result: "FAILED",
    severity: "WARNING",
    deviceInfo: { os: "Windows 10 Pro", browser: "Chrome 126.0", sessionId: "SES-FAILED-01" },
    details: {
      reason: "Incorrect password attempt (2nd consecutive failed attempt).",
      previousStatus: "UNAUTHENTICATED",
      newStatus: "UNAUTHENTICATED",
      delta: [{ field: "Failed Attempt Count", before: "1", after: "2" }]
    },
    timeline: [
      { time: "09:31 AM", event: "Attempt 1 Failed", actor: "Auth Gateway" },
      { time: "09:32 AM", event: "Attempt 2 Failed", actor: "Auth Gateway" }
    ],
    relatedRecords: {
      operator: "Suresh Kumar"
    }
  },
  {
    id: "AUD-2026-001837",
    timestamp: "19 Aug 2026, 09:15 AM",
    user: "Admin",
    role: "Admin",
    action: "Billing Rate Changed",
    module: "Billing",
    reference: "MAT-SLAG-01",
    weighbridge: "--",
    ipAddress: "192.168.1.10",
    result: "SUCCESS",
    severity: "CRITICAL",
    deviceInfo: { os: "Windows 11 Enterprise", browser: "Chrome 127.0", sessionId: "SES-8F42K92L" },
    details: {
      reason: "Updated per-ton rate for Blast Furnace Slag as per Q3 pricing contract.",
      previousStatus: "₹450 / MT",
      newStatus: "₹480 / MT",
      delta: [
        { field: "Base Tariff Rate", before: "₹450.00 / MT", after: "₹480.00 / MT" },
        { field: "Effective Date", before: "01 Jul 2026", after: "19 Aug 2026" }
      ]
    },
    timeline: [
      { time: "09:10 AM", event: "Tariff Revision Inputted", actor: "Admin" },
      { time: "09:15 AM", event: "Tariff Rate Saved & Published", actor: "Admin" }
    ],
    relatedRecords: {
      material: "Blast Furnace Slag (MAT-SLAG-01)"
    }
  },
  {
    id: "AUD-2026-001836",
    timestamp: "19 Aug 2026, 08:50 AM",
    user: "Ravi",
    role: "Employee / Operator",
    action: "Weighbridge Config Changed",
    module: "Weighbridges",
    reference: "WB-03",
    weighbridge: "WB-03",
    ipAddress: "192.168.1.18",
    result: "SUCCESS",
    severity: "CRITICAL",
    deviceInfo: { os: "Windows 10 IoT", browser: "Chrome 126.0", sessionId: "SES-WB03-CONFIG" },
    details: {
      reason: "Zero point re-calibration performed prior to morning shift start.",
      previousStatus: "CALIB_ZERO_+15KG",
      newStatus: "CALIB_ZERO_0KG",
      delta: [
        { field: "Zero Calibration Offset", before: "+15 KG", after: "0 KG" },
        { field: "Calibration Certificate", before: "CERT-2025-88", after: "CERT-2026-04" }
      ]
    },
    timeline: [
      { time: "08:45 AM", event: "Calibration Weight Placed (10,000 KG)", actor: "Technician Team" },
      { time: "08:50 AM", event: "Zero Calibrated & Saved", actor: "Ravi" }
    ],
    relatedRecords: {
      operator: "Ravi",
      ticket: "WB-03 System Log"
    }
  },
  {
    id: "AUD-2026-001835",
    timestamp: "19 Aug 2026, 08:42 AM",
    user: "Arun Kumar",
    role: "Employee / Operator",
    action: "Login Successful",
    module: "Authentication",
    reference: "--",
    weighbridge: "WB-01",
    ipAddress: "192.168.1.24",
    result: "SUCCESS",
    severity: "INFO",
    deviceInfo: { os: "Windows 10 IoT", browser: "Edge 125.0", sessionId: "SES-33A190KK" },
    details: {
      reason: "Operator authenticated via 2FA security challenge.",
      previousStatus: "UNAUTHENTICATED",
      newStatus: "AUTHENTICATED",
      delta: [{ field: "Session Token", before: "None", after: "Active (SES-33A190KK)" }]
    },
    timeline: [
      { time: "08:41 AM", event: "Credentials Entered", actor: "Arun Kumar" },
      { time: "08:42 AM", event: "OTP Verified & Session Started", actor: "Auth Gateway" }
    ],
    relatedRecords: {
      operator: "Arun Kumar"
    }
  },
  {
    id: "AUD-2026-001834",
    timestamp: "19 Aug 2026, 08:15 AM",
    user: "Priya Sharma",
    role: "Admin",
    action: "Invoice Cancelled",
    module: "Billing",
    reference: "INV-2026-089",
    weighbridge: "--",
    ipAddress: "192.168.1.12",
    result: "SUCCESS",
    severity: "CRITICAL",
    deviceInfo: { os: "Windows 11 Pro", browser: "Firefox 128.0", sessionId: "SES-PRIYA-99" },
    details: {
      reason: "Incorrect billing slab applied to customer invoice. Re-issuing correct tax invoice.",
      previousStatus: "ISSUED",
      newStatus: "CANCELLED",
      delta: [
        { field: "Invoice Status", before: "ISSUED", after: "CANCELLED" },
        { field: "Tax Amount", before: "₹18,400", after: "₹0.00" }
      ]
    },
    timeline: [
      { time: "08:10 AM", event: "Customer Dispute Logged", actor: "Accounts Dept" },
      { time: "08:15 AM", event: "Invoice Cancelled", actor: "Priya Sharma" }
    ],
    relatedRecords: {
      customer: "Metro Infra",
      ticket: "INV-2026-089"
    }
  },
  {
    id: "AUD-2026-001833",
    timestamp: "19 Aug 2026, 07:55 AM",
    user: "Kumar",
    role: "Employee / Operator",
    action: "Transaction Modified",
    module: "Transactions",
    reference: "WB-2026-00445",
    weighbridge: "WB-02",
    ipAddress: "192.168.1.29",
    result: "SUCCESS",
    severity: "CRITICAL",
    deviceInfo: { os: "Windows 10 IoT", browser: "Chrome 126.0", sessionId: "SES-KUMAR-02" },
    details: {
      reason: "Corrected customer GSTIN number upon physical challan verification.",
      previousStatus: "POSTED",
      newStatus: "POSTED_UPDATED",
      delta: [
        { field: "Customer GSTIN", before: "33AAAAB0000A1Z5", after: "33AAACK9988B1Z2" },
        { field: "Challan Ref", before: "CH-9002", after: "CH-9002-REV" }
      ]
    },
    timeline: [
      { time: "07:50 AM", event: "Challan Variance Identified", actor: "Kumar" },
      { time: "07:55 AM", event: "GSTIN Corrected & Saved", actor: "Kumar" }
    ],
    relatedRecords: {
      ticket: "WB-2026-00445",
      customer: "Kumar Traders",
      vehicle: "TN10EF9012"
    }
  },
  {
    id: "AUD-2026-001832",
    timestamp: "19 Aug 2026, 07:30 AM",
    user: "Admin",
    role: "Admin",
    action: "Audit Logs Exported",
    module: "System",
    reference: "EXP-2026-902",
    weighbridge: "--",
    ipAddress: "192.168.1.10",
    result: "SUCCESS",
    severity: "INFO",
    deviceInfo: { os: "Windows 11 Enterprise", browser: "Chrome 127.0", sessionId: "SES-8F42K92L" },
    details: {
      reason: "Routine daily shift audit log export for compliance archive.",
      previousStatus: "NONE",
      newStatus: "EXPORTED",
      delta: [
        { field: "Records Exported", before: "0", after: "1,248" },
        { field: "Export Format", before: "N/A", after: "PDF & CSV" }
      ]
    },
    timeline: [
      { time: "07:29 AM", event: "Export Requested", actor: "Admin" },
      { time: "07:30 AM", event: "Archive Generated & Downloaded", actor: "System Security Gateway" }
    ],
    relatedRecords: {
      operator: "Admin"
    }
  },
  {
    id: "AUD-2026-001831",
    timestamp: "19 Aug 2026, 07:05 AM",
    user: "Unknown / Unauthorized",
    role: "Employee / Operator",
    action: "Access Blocked",
    module: "Authentication",
    reference: "--",
    weighbridge: "WB-04",
    ipAddress: "192.168.4.102",
    result: "BLOCKED",
    severity: "WARNING",
    deviceInfo: { os: "Unknown OS", browser: "Curl/7.68.0", sessionId: "NONE" },
    details: {
      reason: "IP Address outside corporate whitelist attempted direct port scan on Weighbridge #4 gateway.",
      previousStatus: "PROBED",
      newStatus: "BLOCKED",
      delta: [{ field: "Firewall Action", before: "MONITOR", after: "DROP_AND_BLOCK" }]
    },
    timeline: [
      { time: "07:04 AM", event: "Port 8443 Probe Detected", actor: "Hardware Firewall" },
      { time: "07:05 AM", event: "IP 192.168.4.102 Blacklisted", actor: "SecOps Daemon" }
    ],
    relatedRecords: {
      ticket: "WB-04 Security Event"
    }
  }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function AuditLogsScreen({
  darkMode,
  onToggleDark,
  onLogout,
  onNavigate,
}: AuditLogsProps) {
  // Theme Tokens
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
  const [logs, setLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedUser, setSelectedUser] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedAction, setSelectedAction] = useState("All");
  const [selectedWeighbridge, setSelectedWeighbridge] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedResult, setSelectedResult] = useState("All");

  // Interactive Drawers / Modals / Views
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter Options
  const dateOptions = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Custom Range"];
  const roleOptions = ["All", "Admin", "Employee / Operator"];
  const moduleOptions = [
    "All",
    "Authentication",
    "Weighbridges",
    "Transactions",
    "Vehicles",
    "Drivers",
    "Customers",
    "Suppliers",
    "Materials",
    "Employees",
    "Tickets",
    "Billing",
    "Reports",
    "Settings",
    "System",
  ];
  const severityOptions = ["All", "INFO", "WARNING", "CRITICAL"];
  const resultOptions = ["All", "SUCCESS", "FAILED", "BLOCKED"];
  const weighbridgeOptions = ["All", "WB-01", "WB-02", "WB-03", "WB-04", "WB-05"];
  const userOptions = [
    "All",
    "Admin",
    "Arun Kumar",
    "Suresh Kumar",
    "Ravi",
    "Kumar",
    "Priya Sharma",
  ];
  const actionOptions = [
    "All",
    "Ticket Voided",
    "Ticket Printed",
    "Weighment Completed",
    "Login Failed",
    "Login Successful",
    "Operator Permission Updated",
    "Billing Rate Changed",
    "Weighbridge Config Changed",
    "Invoice Cancelled",
    "Transaction Modified",
    "Audit Logs Exported",
    "Access Blocked",
  ];

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Clear Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDate("Today");
    setSelectedUser("All");
    setSelectedRole("All");
    setSelectedModule("All");
    setSelectedAction("All");
    setSelectedWeighbridge("All");
    setSelectedSeverity("All");
    setSelectedResult("All");
    showToast("Filters reset to default.");
  };

  // Count Active Filters
  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedDate !== "Today" ? 1 : 0) +
    (selectedUser !== "All" ? 1 : 0) +
    (selectedRole !== "All" ? 1 : 0) +
    (selectedModule !== "All" ? 1 : 0) +
    (selectedAction !== "All" ? 1 : 0) +
    (selectedWeighbridge !== "All" ? 1 : 0) +
    (selectedSeverity !== "All" ? 1 : 0) +
    (selectedResult !== "All" ? 1 : 0);

  // Filtered Dataset Computation
  const filteredLogs = useMemo(() => {
    return logs.filter((ev) => {
      // Search text match
      const q = searchQuery.toLowerCase().trim();
      if (
        q &&
        !ev.id.toLowerCase().includes(q) &&
        !ev.user.toLowerCase().includes(q) &&
        !ev.action.toLowerCase().includes(q) &&
        !ev.reference.toLowerCase().includes(q) &&
        !ev.weighbridge.toLowerCase().includes(q) &&
        !ev.ipAddress.toLowerCase().includes(q) &&
        !ev.module.toLowerCase().includes(q)
      ) {
        return false;
      }
      // Role
      if (selectedRole !== "All" && ev.role !== selectedRole) return false;
      // User
      if (selectedUser !== "All" && !ev.user.toLowerCase().includes(selectedUser.toLowerCase()))
        return false;
      // Module
      if (selectedModule !== "All" && ev.module !== selectedModule) return false;
      // Action
      if (selectedAction !== "All" && ev.action !== selectedAction) return false;
      // Weighbridge
      if (selectedWeighbridge !== "All" && ev.weighbridge !== selectedWeighbridge) return false;
      // Severity
      if (selectedSeverity !== "All" && ev.severity !== selectedSeverity) return false;
      // Result
      if (selectedResult !== "All" && ev.result !== selectedResult) return false;

      return true;
    });
  }, [
    logs,
    searchQuery,
    selectedRole,
    selectedUser,
    selectedModule,
    selectedAction,
    selectedWeighbridge,
    selectedSeverity,
    selectedResult,
  ]);

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

  // Refresh handler (simulates real-time telemetry pulse)
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Audit Log feed refreshed. All 1,248 entries synchronized.");
    }, 600);
  };

  // Export Confirmation Handler
  const handleExportConfirm = (format: string) => {
    setIsExportModalOpen(false);
    // Log the export action itself to enforce immutable security rules!
    const newExportEvent: AuditEvent = {
      id: `AUD-2026-00${Math.floor(1843 + Math.random() * 100)}`,
      timestamp: "19 Aug 2026, 11:30 AM",
      user: "Admin",
      role: "Admin",
      action: "Audit Logs Exported",
      module: "System",
      reference: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      weighbridge: "--",
      ipAddress: "192.168.1.10",
      result: "SUCCESS",
      severity: "INFO",
      deviceInfo: { os: "Windows 11 Enterprise", browser: "Chrome 127.0", sessionId: "SES-8F42K92L" },
      details: {
        reason: `Exported ${filteredLogs.length} audit records in ${format.toUpperCase()} format.`,
        previousStatus: "READY",
        newStatus: "EXPORTED",
        delta: [{ field: "Export Format", before: "None", after: format.toUpperCase() }],
      },
      timeline: [
        { time: "11:30 AM", event: `Audit Logs Export Initiated (${format})`, actor: "Admin" },
        { time: "11:30 AM", event: "File Generated & Security Signed", actor: "Audit Logger System" },
      ],
      relatedRecords: { operator: "Admin" },
    };

    setLogs((prev) => [newExportEvent, ...prev]);
    showToast(`Audit log successfully exported in ${format.toUpperCase()} format. Security record added.`);
  };

  return (
    <div style={{ minHeight: "100vh", background: p.bg, color: p.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN CONTENT AREA
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: p.text }}>Audit Logs</h1>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  background: dm ? "#1E293B" : "#F1F5F9",
                  color: p.muted,
                  border: `1px solid ${p.border}`,
                }}
              >
                🔒 IMMUTABLE SYSTEM LOGS
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: p.muted, marginTop: 2 }}>
              Track system activity, user actions and critical changes across 5 weighbridges.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Quick Mode & Demo Toggles */}
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
              title="Toggle Skeleton Loading State"
            >
              {isLoading ? "⚡ Stop Skeleton" : "⌛ Skeleton Test"}
            </button>
            <button
              onClick={() => setHasError(!hasError)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid ${hasError ? "#DC2626" : p.border}`,
                background: hasError ? (dm ? "#450A0A" : "#FEF2F2") : p.sub,
                color: hasError ? "#DC2626" : p.secondary,
                cursor: "pointer",
              }}
              title="Toggle Error State View"
            >
              {hasError ? "⚠ Clear Error View" : "⚠ Error State View"}
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                border: `1px solid ${p.border}`,
                background: p.surface,
                color: p.secondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>↻</span> Refresh
            </button>

            {/* Export Primary Button */}
            <button
              onClick={() => setIsExportModalOpen(true)}
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
                boxShadow: "0 1px 3px rgba(249,115,22,0.3)",
              }}
            >
              <span>↓</span> Export Logs
            </button>

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

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            03. MAIN DASHBOARD CONTENT AREA
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {/* TOAST NOTIFICATION */}
          {toastMessage && (
            <div
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 100,
                background: dm ? "#1E293B" : "#1E293B",
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

          {/* ERROR STATE VIEW */}
          {hasError ? (
            <div
              style={{
                background: p.surface,
                border: `1px solid ${p.border}`,
                borderRadius: 12,
                padding: "60px 24px",
                textAlign: "center",
                maxWidth: 540,
                margin: "40px auto",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 999,
                  background: dm ? "#450A0A" : "#FEF2F2",
                  color: "#DC2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  margin: "0 auto 16px",
                  border: "1px solid #FCA5A5",
                }}
              >
                ⚠
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px", color: p.text }}>
                Unable to load audit logs
              </h2>
              <p style={{ fontSize: 13, color: p.muted, margin: "0 0 24px" }}>
                Check your network connection or system authority credentials and try again.
              </p>
              <button
                onClick={() => setHasError(false)}
                style={{
                  height: 40,
                  padding: "0 20px",
                  borderRadius: 8,
                  background: p.orange,
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 13,
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Retry Request
              </button>
            </div>
          ) : (
            <>
              {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  04. SUMMARY KPI ROW (4 Cards)
                 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {/* KPI Card 1: Today's Events */}
                <div
                  style={{
                    background: p.surface,
                    border: `1px solid ${p.border}`,
                    borderRadius: 12,
                    padding: "20px",
                    position: "relative",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
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
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: p.muted,
                      }}
                    >
                      TODAY'S EVENTS
                    </span>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: p.orangeSoft,
                        color: p.orange,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      ⚡
                    </span>
                  </div>
                  {isLoading ? (
                    <div
                      style={{
                        height: 32,
                        width: 100,
                        background: p.sub,
                        borderRadius: 6,
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 32, fontWeight: 800, color: p.text, fontVariantNumeric: "tabular-nums" }}>
                      1,248
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12 }}>
                    <span style={{ color: "#16A34A", fontWeight: 700 }}>+14.2%</span>
                    <span style={{ color: p.muted }}>vs yesterday</span>
                  </div>
                </div>

                {/* KPI Card 2: Admin Actions */}
                <div
                  style={{
                    background: p.surface,
                    border: `1px solid ${p.border}`,
                    borderRadius: 12,
                    padding: "20px",
                    position: "relative",
                  }}
                >
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
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: p.muted,
                      }}
                    >
                      ADMIN ACTIONS
                    </span>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: p.goldSoft,
                        color: p.gold,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      🛡️
                    </span>
                  </div>
                  {isLoading ? (
                    <div
                      style={{
                        height: 32,
                        width: 90,
                        background: p.sub,
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 32, fontWeight: 800, color: p.text, fontVariantNumeric: "tabular-nums" }}>
                      184
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12 }}>
                    <span style={{ color: p.gold, fontWeight: 700 }}>14.7%</span>
                    <span style={{ color: p.muted }}>of total activity</span>
                  </div>
                </div>

                {/* KPI Card 3: Operator Actions */}
                <div
                  style={{
                    background: p.surface,
                    border: `1px solid ${p.border}`,
                    borderRadius: 12,
                    padding: "20px",
                    position: "relative",
                  }}
                >
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
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: p.muted,
                      }}
                    >
                      OPERATOR ACTIONS
                    </span>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: dm ? "#1E293B" : "#F1F5F9",
                        color: "#2563EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      👷
                    </span>
                  </div>
                  {isLoading ? (
                    <div
                      style={{
                        height: 32,
                        width: 110,
                        background: p.sub,
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 32, fontWeight: 800, color: p.text, fontVariantNumeric: "tabular-nums" }}>
                      1,064
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12 }}>
                    <span style={{ color: "#2563EB", fontWeight: 700 }}>85.3%</span>
                    <span style={{ color: p.muted }}>scale operations</span>
                  </div>
                </div>

                {/* KPI Card 4: Critical Events */}
                <div
                  style={{
                    background: p.surface,
                    border: `1px solid ${p.border}`,
                    borderRadius: 12,
                    padding: "20px",
                    position: "relative",
                  }}
                >
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
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: p.muted,
                      }}
                    >
                      CRITICAL EVENTS
                    </span>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: dm ? "#450A0A" : "#FEF2F2",
                        color: "#DC2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      🚨
                    </span>
                  </div>
                  {isLoading ? (
                    <div
                      style={{
                        height: 32,
                        width: 80,
                        background: p.sub,
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 32, fontWeight: 800, color: "#DC2626", fontVariantNumeric: "tabular-nums" }}>
                      12
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12 }}>
                    <span style={{ color: "#DC2626", fontWeight: 700 }}>● Requires Review</span>
                    <span style={{ color: p.muted }}>0 unresolved</span>
                  </div>
                </div>
              </div>

              {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  05. SEARCH & FILTER TOOLBAR
                 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
              <div
                style={{
                  background: p.surface,
                  border: `1px solid ${p.border}`,
                  borderRadius: 12,
                  padding: "16px",
                  marginBottom: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Search Bar & Primary Filters */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                  }}
                >
                  {/* Search Box */}
                  <div style={{ position: "relative", gridColumn: "span 2" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 12,
                        top: 11,
                        fontSize: 14,
                        color: p.muted,
                      }}
                    >
                      🔍
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search user, ticket, vehicle, event or IP address..."
                      style={{
                        width: "100%",
                        height: 40,
                        paddingLeft: 36,
                        paddingRight: 14,
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

                  {/* Date Filter */}
                  <div>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        width: "100%",
                        height: 40,
                        padding: "0 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background: p.input,
                        color: p.text,
                        border: `1px solid ${p.border}`,
                        outline: "none",
                      }}
                    >
                      {dateOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          Date: {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      style={{
                        width: "100%",
                        height: 40,
                        padding: "0 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background: p.input,
                        color: p.text,
                        border: `1px solid ${p.border}`,
                        outline: "none",
                      }}
                    >
                      {roleOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          Role: {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Module Filter */}
                  <div>
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      style={{
                        width: "100%",
                        height: 40,
                        padding: "0 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background: p.input,
                        color: p.text,
                        border: `1px solid ${p.border}`,
                        outline: "none",
                      }}
                    >
                      {moduleOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          Module: {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Secondary Filters Row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  {/* Severity Select */}
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      background: p.sub,
                      color: p.secondary,
                      border: `1px solid ${p.border}`,
                    }}
                  >
                    {severityOptions.map((s) => (
                      <option key={s} value={s}>
                        Severity: {s}
                      </option>
                    ))}
                  </select>

                  {/* Result Status Select */}
                  <select
                    value={selectedResult}
                    onChange={(e) => setSelectedResult(e.target.value)}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      background: p.sub,
                      color: p.secondary,
                      border: `1px solid ${p.border}`,
                    }}
                  >
                    {resultOptions.map((r) => (
                      <option key={r} value={r}>
                        Result: {r}
                      </option>
                    ))}
                  </select>

                  {/* Weighbridge Select */}
                  <select
                    value={selectedWeighbridge}
                    onChange={(e) => setSelectedWeighbridge(e.target.value)}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      background: p.sub,
                      color: p.secondary,
                      border: `1px solid ${p.border}`,
                    }}
                  >
                    {weighbridgeOptions.map((wb) => (
                      <option key={wb} value={wb}>
                        Weighbridge: {wb}
                      </option>
                    ))}
                  </select>

                  {/* Action Dropdown */}
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      background: p.sub,
                      color: p.secondary,
                      border: `1px solid ${p.border}`,
                    }}
                  >
                    {actionOptions.map((act) => (
                      <option key={act} value={act}>
                        Action: {act}
                      </option>
                    ))}
                  </select>

                  {/* User Dropdown */}
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    style={{
                      height: 34,
                      padding: "0 10px",
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      background: p.sub,
                      color: p.secondary,
                      border: `1px solid ${p.border}`,
                    }}
                  >
                    {userOptions.map((u) => (
                      <option key={u} value={u}>
                        User: {u}
                      </option>
                    ))}
                  </select>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleClearFilters}
                      style={{
                        height: 34,
                        padding: "0 12px",
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: "transparent",
                        color: p.orange,
                        border: 0,
                        cursor: "pointer",
                      }}
                    >
                      Clear All Filters ({activeFiltersCount})
                    </button>
                  )}
                </div>

                {/* Filter Chips Display */}
                {activeFiltersCount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      paddingTop: 8,
                      borderTop: `1px solid ${p.divider}`,
                    }}
                  >
                    {searchQuery && (
                      <Chip label={`Search: "${searchQuery}"`} onRemove={() => setSearchQuery("")} p={p} />
                    )}
                    {selectedDate !== "Today" && (
                      <Chip label={`Date: ${selectedDate}`} onRemove={() => setSelectedDate("Today")} p={p} />
                    )}
                    {selectedRole !== "All" && (
                      <Chip label={`Role: ${selectedRole}`} onRemove={() => setSelectedRole("All")} p={p} />
                    )}
                    {selectedModule !== "All" && (
                      <Chip label={`Module: ${selectedModule}`} onRemove={() => setSelectedModule("All")} p={p} />
                    )}
                    {selectedSeverity !== "All" && (
                      <Chip label={`Severity: ${selectedSeverity}`} onRemove={() => setSelectedSeverity("All")} p={p} />
                    )}
                    {selectedResult !== "All" && (
                      <Chip label={`Result: ${selectedResult}`} onRemove={() => setSelectedResult("All")} p={p} />
                    )}
                    {selectedWeighbridge !== "All" && (
                      <Chip label={`WB: ${selectedWeighbridge}`} onRemove={() => setSelectedWeighbridge("All")} p={p} />
                    )}
                    {selectedAction !== "All" && (
                      <Chip label={`Action: ${selectedAction}`} onRemove={() => setSelectedAction("All")} p={p} />
                    )}
                  </div>
                )}
              </div>

              {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  06. MAIN AUDIT LOG DATA TABLE (READ-ONLY ENFORCED)
                 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
              <div
                style={{
                  background: p.surface,
                  border: `1px solid ${p.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                {/* Table Header / Title Row */}
                <div
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    background: p.surface,
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: p.text }}>System Activity</h2>
                    <p style={{ margin: 0, fontSize: 12, color: p.muted, marginTop: 2 }}>
                      Showing {filteredLogs.length} events logged under current search parameters
                    </p>
                  </div>
                  <div style={{ fontSize: 11, color: p.muted, fontWeight: 600 }}>
                    🔒 Read-Only Log Stream
                  </div>
                </div>

                {/* Empty State Check */}
                {filteredLogs.length === 0 ? (
                  <div style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 999,
                        background: p.sub,
                        color: p.muted,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        margin: "0 auto 12px",
                      }}
                    >
                      📋
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: p.text }}>
                      No audit events found
                    </h3>
                    <p style={{ fontSize: 12.5, color: p.muted, margin: "0 0 16px" }}>
                      No activity matches your current search filters or date criteria.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        background: p.orange,
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 700,
                        border: 0,
                        cursor: "pointer",
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr
                          style={{
                            background: p.sub,
                            borderBottom: `1px solid ${p.border}`,
                            color: p.muted,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                            textTransform: "uppercase",
                          }}
                        >
                          <th style={{ padding: "12px 16px" }}>Timestamp</th>
                          <th style={{ padding: "12px 16px" }}>User</th>
                          <th style={{ padding: "12px 16px" }}>Role</th>
                          <th style={{ padding: "12px 16px" }}>Action</th>
                          <th style={{ padding: "12px 16px" }}>Module</th>
                          <th style={{ padding: "12px 16px" }}>Reference</th>
                          <th style={{ padding: "12px 16px" }}>Weighbridge</th>
                          <th style={{ padding: "12px 16px" }}>IP Address</th>
                          <th style={{ padding: "12px 16px" }}>Result</th>
                          <th style={{ padding: "12px 16px" }}>Severity</th>
                          <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.map((row) => {
                          const isCritical = row.severity === "CRITICAL";
                          return (
                            <tr
                              key={row.id}
                              style={{
                                borderBottom: `1px solid ${p.divider}`,
                                transition: "background 0.15s ease",
                                background: isCritical
                                  ? dm
                                    ? "#35161615"
                                    : "#FEF2F240"
                                  : "transparent",
                              }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            >
                              {/* Timestamp */}
                              <td
                                style={{
                                  padding: "14px 16px",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: p.text,
                                  fontVariantNumeric: "tabular-nums",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {row.timestamp}
                              </td>

                              {/* User */}
                              <td style={{ padding: "14px 16px", fontSize: 12.5, fontWeight: 700, color: p.text }}>
                                {row.user}
                              </td>

                              {/* Role */}
                              <td style={{ padding: "14px 16px" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "2px 8px",
                                    borderRadius: 4,
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    background:
                                      row.role === "Admin"
                                        ? p.goldSoft
                                        : dm
                                        ? "#1E293B"
                                        : "#F1F5F9",
                                    color: row.role === "Admin" ? p.gold : p.secondary,
                                    border: `1px solid ${row.role === "Admin" ? p.gold + "30" : p.border}`,
                                  }}
                                >
                                  {row.role}
                                </span>
                              </td>

                              {/* Action */}
                              <td style={{ padding: "14px 16px", fontSize: 12.5, fontWeight: 700, color: p.text }}>
                                {row.action}
                              </td>

                              {/* Module */}
                              <td style={{ padding: "14px 16px" }}>
                                <span
                                  style={{
                                    padding: "2px 8px",
                                    borderRadius: 4,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    background: p.sub,
                                    color: p.secondary,
                                    border: `1px solid ${p.border}`,
                                  }}
                                >
                                  {row.module}
                                </span>
                              </td>

                              {/* Reference */}
                              <td
                                style={{
                                  padding: "14px 16px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: row.reference !== "--" ? p.orange : p.muted,
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                {row.reference}
                              </td>

                              {/* Weighbridge */}
                              <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 600, color: p.secondary }}>
                                {row.weighbridge}
                              </td>

                              {/* IP Address */}
                              <td
                                style={{
                                  padding: "14px 16px",
                                  fontSize: 11.5,
                                  fontWeight: 500,
                                  color: p.muted,
                                  fontFamily: "monospace",
                                }}
                              >
                                {row.ipAddress}
                              </td>

                              {/* Result Badge */}
                              <td style={{ padding: "14px 16px" }}>
                                <ResultBadge result={row.result} dm={dm} />
                              </td>

                              {/* Severity Badge */}
                              <td style={{ padding: "14px 16px" }}>
                                <SeverityBadge severity={row.severity} dm={dm} />
                              </td>

                              {/* Row Action */}
                              <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                <button
                                  onClick={() => setSelectedEvent(row)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: 6,
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    background: p.orangeSoft,
                                    color: p.orange,
                                    border: 0,
                                    cursor: "pointer",
                                  }}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Table Footer Pagination */}
                <div
                  style={{
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${p.border}`,
                    background: p.surface,
                    fontSize: 12,
                    color: p.muted,
                  }}
                >
                  <div>
                    Showing <strong>{filteredLogs.length}</strong> of <strong>1,248</strong> total records
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      disabled
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        background: p.sub,
                        border: `1px solid ${p.border}`,
                        color: p.muted,
                        cursor: "not-allowed",
                      }}
                    >
                      ← Previous
                    </button>
                    <button
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        background: p.orange,
                        border: 0,
                        color: "#FFFFFF",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      1
                    </button>
                    <button
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        background: p.surface,
                        border: `1px solid ${p.border}`,
                        color: p.secondary,
                        cursor: "pointer",
                      }}
                    >
                      2
                    </button>
                    <button
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 12,
                        background: p.surface,
                        border: `1px solid ${p.border}`,
                        color: p.secondary,
                        cursor: "pointer",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          07. AUDIT EVENT DETAIL DRAWER (SLIDE-OVER RIGHT)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 580,
              height: "100%",
              background: p.surface,
              borderLeft: `1px solid ${p.border}`,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-12px 0 30px rgba(0,0,0,0.3)",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${p.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: p.surface,
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>
                    {selectedEvent.action}
                  </h2>
                  <SeverityBadge severity={selectedEvent.severity} dm={dm} />
                  <ResultBadge result={selectedEvent.result} dm={dm} />
                </div>
                <div style={{ fontSize: 12, color: p.muted, marginTop: 4 }}>
                  Event Reference: <strong style={{ color: p.orange }}>{selectedEvent.id}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${p.border}`,
                  background: p.sub,
                  color: p.muted,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Drawer Body Content */}
            <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Event Metadata Card */}
              <div
                style={{
                  background: p.sub,
                  border: `1px solid ${p.border}`,
                  borderRadius: 10,
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: p.muted,
                    marginBottom: 12,
                  }}
                >
                  EVENT IDENTIFICATION
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12.5 }}>
                  <div>
                    <span style={{ color: p.muted }}>Timestamp:</span>
                    <div style={{ fontWeight: 700, color: p.text }}>{selectedEvent.timestamp}</div>
                  </div>
                  <div>
                    <span style={{ color: p.muted }}>User & Role:</span>
                    <div style={{ fontWeight: 700, color: p.text }}>
                      {selectedEvent.user} ({selectedEvent.role})
                    </div>
                  </div>
                  <div>
                    <span style={{ color: p.muted }}>Module:</span>
                    <div style={{ fontWeight: 700, color: p.text }}>{selectedEvent.module}</div>
                  </div>
                  <div>
                    <span style={{ color: p.muted }}>Reference Entity:</span>
                    <div style={{ fontWeight: 700, color: p.orange }}>{selectedEvent.reference}</div>
                  </div>
                </div>
              </div>

              {/* Weighbridge & Device Details */}
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: p.muted, textTransform: "uppercase", margin: "0 0 10px" }}>
                  WEIGHBRIDGE & DEVICE TELEMETRY
                </h3>
                <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 10, padding: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12.5 }}>
                    <div>
                      <span style={{ color: p.muted }}>Weighbridge:</span>
                      <div style={{ fontWeight: 700, color: p.text }}>
                        {selectedEvent.weighbridge === "--" ? "N/A (System Level)" : selectedEvent.weighbridge}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: p.muted }}>IP Address:</span>
                      <div style={{ fontWeight: 700, fontFamily: "monospace", color: p.text }}>
                        {selectedEvent.ipAddress}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: p.muted }}>Operating System:</span>
                      <div style={{ fontWeight: 600, color: p.text }}>{selectedEvent.deviceInfo.os}</div>
                    </div>
                    <div>
                      <span style={{ color: p.muted }}>Browser Agent:</span>
                      <div style={{ fontWeight: 600, color: p.text }}>{selectedEvent.deviceInfo.browser}</div>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <span style={{ color: p.muted }}>Session Identifier:</span>
                      <div style={{ fontWeight: 600, fontFamily: "monospace", color: p.gold }}>
                        {selectedEvent.deviceInfo.sessionId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Description & Reason */}
              {selectedEvent.details.reason && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: p.muted, textTransform: "uppercase", margin: "0 0 10px" }}>
                    ACTION RATIONALE & DETAILS
                  </h3>
                  <div
                    style={{
                      background: dm ? "#1E293B" : "#FFF7ED",
                      border: `1px solid ${p.orange + "40"}`,
                      borderRadius: 10,
                      padding: "16px",
                      fontSize: 13,
                      color: p.text,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Reason specified:</strong> {selectedEvent.details.reason}
                  </div>
                </div>
              )}

              {/* BEFORE / AFTER COMPARISON SECTION */}
              {selectedEvent.details.delta && selectedEvent.details.delta.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: p.muted, textTransform: "uppercase", margin: "0 0 10px" }}>
                    BEFORE / AFTER VALUE DELTA
                  </h3>
                  <div style={{ border: `1px solid ${p.border}`, borderRadius: 10, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: p.sub, color: p.muted, fontSize: 11, fontWeight: 700 }}>
                          <th style={{ padding: "10px 14px" }}>FIELD MODIFIED</th>
                          <th style={{ padding: "10px 14px" }}>BEFORE VALUE</th>
                          <th style={{ padding: "10px 14px" }}>AFTER VALUE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.details.delta.map((d, i) => (
                          <tr key={i} style={{ borderTop: `1px solid ${p.divider}` }}>
                            <td style={{ padding: "12px 14px", fontWeight: 700, color: p.text }}>{d.field}</td>
                            <td
                              style={{
                                padding: "12px 14px",
                                color: "#DC2626",
                                background: dm ? "#450A0A20" : "#FEF2F2",
                                fontWeight: 600,
                              }}
                            >
                              {d.before}
                            </td>
                            <td
                              style={{
                                padding: "12px 14px",
                                color: "#16A34A",
                                background: dm ? "#064E3B20" : "#F0FDF4",
                                fontWeight: 700,
                              }}
                            >
                              {d.after}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AUDIT TIMELINE */}
              {selectedEvent.timeline && selectedEvent.timeline.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: p.muted, textTransform: "uppercase", margin: "0 0 12px" }}>
                    EVENT CHRONOLOGY TIMELINE
                  </h3>
                  <div style={{ paddingLeft: 8, display: "flex", flexDirection: "column", gap: 16 }}>
                    {selectedEvent.timeline.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 14, position: "relative" }}>
                        {/* Timeline Connector Line */}
                        {idx < selectedEvent.timeline.length - 1 && (
                          <div
                            style={{
                              position: "absolute",
                              left: 5,
                              top: 14,
                              bottom: -16,
                              width: 2,
                              background: p.border,
                            }}
                          />
                        )}
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: idx === selectedEvent.timeline.length - 1 ? p.orange : "#16A34A",
                            marginTop: 3,
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>{item.event}</div>
                          <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>
                            {item.time} • Performed by <strong>{item.actor}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RELATED RECORDS */}
              {selectedEvent.relatedRecords && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: p.muted, textTransform: "uppercase", margin: "0 0 10px" }}>
                    LINKED DOMAIN ENTITIES
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedEvent.relatedRecords.ticket && (
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: p.sub,
                          border: `1px solid ${p.border}`,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Ticket: <strong style={{ color: p.orange }}>{selectedEvent.relatedRecords.ticket}</strong>
                      </span>
                    )}
                    {selectedEvent.relatedRecords.vehicle && (
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: p.sub,
                          border: `1px solid ${p.border}`,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Vehicle: <strong>{selectedEvent.relatedRecords.vehicle}</strong>
                      </span>
                    )}
                    {selectedEvent.relatedRecords.material && (
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: p.sub,
                          border: `1px solid ${p.border}`,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Material: <strong>{selectedEvent.relatedRecords.material}</strong>
                      </span>
                    )}
                    {selectedEvent.relatedRecords.customer && (
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: p.sub,
                          border: `1px solid ${p.border}`,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Customer: <strong>{selectedEvent.relatedRecords.customer}</strong>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: `1px solid ${p.border}`,
                background: p.surface,
                display: "flex",
                gap: 12,
                position: "sticky",
                bottom: 0,
              }}
            >
              <button
                onClick={() => {
                  showToast(`Event detail JSON copied to clipboard (${selectedEvent.id}).`);
                }}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  background: p.sub,
                  color: p.text,
                  border: `1px solid ${p.border}`,
                  cursor: "pointer",
                }}
              >
                Copy Raw Event JSON
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  background: p.orange,
                  color: "#FFFFFF",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          08. EXPORT AUDIT LOGS MODAL
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {isExportModalOpen && (
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
          onClick={() => setIsExportModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 16,
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${p.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: p.text }}>Export Audit Logs</h3>
                <p style={{ margin: 0, fontSize: 12, color: p.muted, marginTop: 2 }}>
                  Generate an authenticated audit archive report
                </p>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: 0,
                  background: p.sub,
                  color: p.muted,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Date Range Selection */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
                  Date Range Target
                </label>
                <select
                  defaultValue="19 Aug 2026 (Today)"
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    background: p.input,
                    color: p.text,
                    border: `1px solid ${p.border}`,
                  }}
                >
                  <option>19 Aug 2026 (Today)</option>
                  <option>Last 7 Days (12 Aug - 19 Aug)</option>
                  <option>Current Month (August 2026)</option>
                  <option>Custom Date Range</option>
                </select>
              </div>

              {/* Format Option */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
                  Export File Format
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {["CSV", "Excel", "PDF Report"].map((fmt) => (
                    <label
                      key={fmt}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: `1px solid ${p.border}`,
                        background: p.sub,
                        cursor: "pointer",
                        fontSize: 12.5,
                        fontWeight: 600,
                      }}
                    >
                      <input type="radio" name="exportFmt" defaultChecked={fmt === "CSV"} />
                      {fmt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Data Fields Checklist */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: p.text, display: "block", marginBottom: 6 }}>
                  Data Fields to Include
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  {[
                    "Timestamp & UTC ISO",
                    "User Identity & Role",
                    "Action & Module Name",
                    "Reference Ticket / Entity",
                    "Weighbridge Station",
                    "IP Address & Browser",
                    "Result & Severity Status",
                    "Before/After Delta",
                  ].map((field) => (
                    <label key={field} style={{ display: "flex", alignItems: "center", gap: 6, color: p.secondary }}>
                      <input type="checkbox" defaultChecked />
                      {field}
                    </label>
                  ))}
                </div>
              </div>

              {/* Security Compliance Callout */}
              <div
                style={{
                  background: p.goldSoft,
                  border: `1px solid ${p.gold + "40"}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 11.5,
                  color: p.gold,
                  lineHeight: 1.4,
                }}
              >
                🛡️ <strong>SECURITY COMPLIANCE AUDIT:</strong> Exporting audit logs generates a permanent audit trail
                entry. Export action initiated by <strong>Admin (192.168.1.10)</strong> will be appended to the log
                stream.
              </div>
            </div>

            {/* Modal Actions */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: `1px solid ${p.border}`,
                background: p.sub,
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                onClick={() => setIsExportModalOpen(false)}
                style={{
                  height: 38,
                  padding: "0 16px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: `1px solid ${p.border}`,
                  background: p.surface,
                  color: p.secondary,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleExportConfirm("CSV")}
                style={{
                  height: 38,
                  padding: "0 20px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: 0,
                  background: p.orange,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(249,115,22,0.3)",
                }}
              >
                Download Export File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER COMPONENTS (BADGES & CHIPS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SeverityBadge({ severity, dm }: { severity: SeverityType; dm: boolean }) {
  const isCritical = severity === "CRITICAL";
  const isWarning = severity === "WARNING";

  const bg = isCritical
    ? dm
      ? "#450A0A"
      : "#FEF2F2"
    : isWarning
    ? dm
      ? "#451A03"
      : "#FFFBEB"
    : dm
    ? "#1E293B"
    : "#EFF6FF";

  const color = isCritical ? "#DC2626" : isWarning ? "#D97706" : "#2563EB";
  const border = isCritical ? "#FCA5A5" : isWarning ? "#FDE68A" : "#BFDBFE";
  const icon = isCritical ? "🚨" : isWarning ? "⚠️" : "ⓘ";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 10.5,
        fontWeight: 800,
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span>{icon}</span> {severity}
    </span>
  );
}

function ResultBadge({ result, dm }: { result: ResultType; dm: boolean }) {
  const isSuccess = result === "SUCCESS";
  const isFailed = result === "FAILED";

  const bg = isSuccess
    ? dm
      ? "#064E3B"
      : "#F0FDF4"
    : isFailed
    ? dm
      ? "#450A0A"
      : "#FEF2F2"
    : dm
    ? "#382A0B"
    : "#FFFBEB";

  const color = isSuccess ? "#16A34A" : isFailed ? "#DC2626" : "#D97706";
  const border = isSuccess ? "#86EFAC" : isFailed ? "#FCA5A5" : "#FDE68A";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 10.5,
        fontWeight: 700,
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 8 }}>●</span> {result}
    </span>
  );
}

function Chip({
  label,
  onRemove,
  p,
}: {
  label: string;
  onRemove: () => void;
  p: any;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: p.orangeSoft,
        color: p.orange,
        border: `1px solid ${p.orange + "40"}`,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          border: 0,
          background: "transparent",
          color: p.orange,
          cursor: "pointer",
          fontWeight: 800,
          fontSize: 12,
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </span>
  );
}
