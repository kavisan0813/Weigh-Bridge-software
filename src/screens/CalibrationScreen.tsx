import React, { useState, useMemo } from "react";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export type CalibrationStatus = "VALID" | "DUE SOON" | "OVERDUE" | "SCHEDULED" | "IN_PROGRESS";
export type CalibrationType = "Periodic Calibration" | "After Maintenance" | "After Repair" | "Verification Audit";
export type TestResult = "PASS" | "FAIL" | "CONDITIONAL";

export interface TestPoint {
  loadKg: number;
  expectedKg: number;
  observedKg: number;
  deviationKg: number;
  result: "PASS" | "FAIL";
}

export interface CalibrationItem {
  id: string;
  code: string;
  weighbridgeId: string;
  weighbridgeName: string;
  location: string;
  capacityKg: number;
  divisionKg: number;
  lastCalibrationDate: string;
  nextDueDate: string;
  daysRemaining: number;
  status: CalibrationStatus;
  calibrationType: CalibrationType;
  provider: string;
  technician: string;
  certificateNumber: string;
  certificateFileName: string;
  testResult: TestResult;
  lastUpdated: string;
  testPoints: TestPoint[];
  historyCount: number;
}

const INITIAL_CALIBRATIONS: CalibrationItem[] = [
  {
    id: "CAL-WB01-2026-001",
    code: "CAL-WB01-2026-001",
    weighbridgeId: "WB-01",
    weighbridgeName: "WB-01 — Main Gate",
    location: "Main Gate Entry",
    capacityKg: 80000,
    divisionKg: 20,
    lastCalibrationDate: "02 Aug 2026",
    nextDueDate: "02 Nov 2026",
    daysRemaining: 74,
    status: "VALID",
    calibrationType: "Periodic Calibration",
    provider: "ABC Calibration Services",
    technician: "Rajesh Kumar (Cert #ISO-882)",
    certificateNumber: "CAL-2026-082",
    certificateFileName: "WB01_Calibration_Cert_Aug2026.pdf",
    testResult: "PASS",
    lastUpdated: "Today 10:42 AM",
    historyCount: 8,
    testPoints: [
      { loadKg: 10000, expectedKg: 10000, observedKg: 10000, deviationKg: 0, result: "PASS" },
      { loadKg: 30000, expectedKg: 30000, observedKg: 30020, deviationKg: 20, result: "PASS" },
      { loadKg: 50000, expectedKg: 50000, observedKg: 50040, deviationKg: 40, result: "PASS" },
      { loadKg: 80000, expectedKg: 80000, observedKg: 80060, deviationKg: 60, result: "PASS" },
    ],
  },
  {
    id: "CAL-WB02-2026-001",
    code: "CAL-WB02-2026-001",
    weighbridgeId: "WB-02",
    weighbridgeName: "WB-02 — North Gate",
    location: "North Scale House",
    capacityKg: 80000,
    divisionKg: 20,
    lastCalibrationDate: "15 Jul 2026",
    nextDueDate: "15 Oct 2026",
    daysRemaining: 56,
    status: "VALID",
    calibrationType: "Periodic Calibration",
    provider: "ABC Calibration Services",
    technician: "Suresh Menon (Cert #ISO-911)",
    certificateNumber: "CAL-2026-071",
    certificateFileName: "WB02_Calibration_Cert_Jul2026.pdf",
    testResult: "PASS",
    lastUpdated: "Today 09:15 AM",
    historyCount: 6,
    testPoints: [
      { loadKg: 10000, expectedKg: 10000, observedKg: 10000, deviationKg: 0, result: "PASS" },
      { loadKg: 30000, expectedKg: 30000, observedKg: 30000, deviationKg: 0, result: "PASS" },
      { loadKg: 50000, expectedKg: 50000, observedKg: 50020, deviationKg: 20, result: "PASS" },
      { loadKg: 80000, expectedKg: 80000, observedKg: 80040, deviationKg: 40, result: "PASS" },
    ],
  },
  {
    id: "CAL-WB03-2025-003",
    code: "CAL-WB03-2025-003",
    weighbridgeId: "WB-03",
    weighbridgeName: "WB-03 — Loading Yard",
    location: "Dispatch Area",
    capacityKg: 100000,
    divisionKg: 20,
    lastCalibrationDate: "18 Sep 2025",
    nextDueDate: "18 Sep 2026",
    daysRemaining: 29,
    status: "DUE SOON",
    calibrationType: "Periodic Calibration",
    provider: "Precision Calibration Ltd.",
    technician: "Amit Sharma (Cert #ISO-704)",
    certificateNumber: "CAL-2025-091",
    certificateFileName: "WB03_Calibration_Cert_Sep2025.pdf",
    testResult: "PASS",
    lastUpdated: "Yesterday",
    historyCount: 5,
    testPoints: [
      { loadKg: 10000, expectedKg: 10000, observedKg: 10020, deviationKg: 20, result: "PASS" },
      { loadKg: 40000, expectedKg: 40000, observedKg: 40040, deviationKg: 40, result: "PASS" },
      { loadKg: 70000, expectedKg: 70000, observedKg: 70080, deviationKg: 80, result: "PASS" },
      { loadKg: 100000, expectedKg: 100000, observedKg: 100120, deviationKg: 120, result: "PASS" },
    ],
  },
  {
    id: "CAL-WB04-2025-001",
    code: "CAL-WB04-2025-001",
    weighbridgeId: "WB-04",
    weighbridgeName: "WB-04 — East Gate",
    location: "East Security Cabin",
    capacityKg: 60000,
    divisionKg: 10,
    lastCalibrationDate: "02 Jun 2025",
    nextDueDate: "02 Jun 2026",
    daysRemaining: -79,
    status: "OVERDUE",
    calibrationType: "Periodic Calibration",
    provider: "Precision Calibration Ltd.",
    technician: "Vikas Patil (Cert #ISO-640)",
    certificateNumber: "CAL-2025-061",
    certificateFileName: "WB04_Calibration_Cert_Jun2025.pdf",
    testResult: "PASS",
    lastUpdated: "3 days ago",
    historyCount: 4,
    testPoints: [
      { loadKg: 10000, expectedKg: 10000, observedKg: 10040, deviationKg: 40, result: "PASS" },
      { loadKg: 30000, expectedKg: 30000, observedKg: 30090, deviationKg: 90, result: "PASS" },
      { loadKg: 60000, expectedKg: 60000, observedKg: 60150, deviationKg: 150, result: "PASS" },
    ],
  },
  {
    id: "CAL-WB05-2026-001",
    code: "CAL-WB05-2026-001",
    weighbridgeId: "WB-05",
    weighbridgeName: "WB-05 — West Gate",
    location: "West Kiosk",
    capacityKg: 80000,
    divisionKg: 20,
    lastCalibrationDate: "10 Aug 2026",
    nextDueDate: "10 Nov 2026",
    daysRemaining: 82,
    status: "VALID",
    calibrationType: "After Maintenance",
    provider: "National Standards Lab",
    technician: "Anand Verma (Cert #ISO-990)",
    certificateNumber: "CAL-2026-104",
    certificateFileName: "WB05_Calibration_Cert_Aug2026.pdf",
    testResult: "PASS",
    lastUpdated: "Today 11:00 AM",
    historyCount: 7,
    testPoints: [
      { loadKg: 10000, expectedKg: 10000, observedKg: 10000, deviationKg: 0, result: "PASS" },
      { loadKg: 30000, expectedKg: 30000, observedKg: 30010, deviationKg: 10, result: "PASS" },
      { loadKg: 50000, expectedKg: 50000, observedKg: 50020, deviationKg: 20, result: "PASS" },
      { loadKg: 80000, expectedKg: 80000, observedKg: 80030, deviationKg: 30, result: "PASS" },
    ],
  },
];

export default function CalibrationScreen({ darkMode: dm }: Props) {
  // Design System Tokens
  const bg = dm ? "#111827" : "#F8FAFC";
  const surface = dm ? "#1F2937" : "#FFFFFF";
  const elevated = dm ? "#273449" : "#FFFFFF";
  const primaryText = dm ? "#F9FAFB" : "#111827";
  const secondaryText = dm ? "#D1D5DB" : "#4B5563";
  const mutedText = dm ? "#9CA3AF" : "#6B7280";
  const border = dm ? "#374151" : "#E5E7EB";
  const divider = dm ? "#374151" : "#F1F5F9";
  const inputBg = dm ? "#111827" : "#FFFFFF";
  const primaryOrange = dm ? "#FB923C" : "#F97316";

  // Semantic Status Colors
  const statusValid = "#16A34A";
  const statusDueSoon = "#D97706";
  const statusOverdue = "#DC2626";
  const statusScheduled = "#2563EB";

  // State
  const [calibrations, setCalibrations] = useState<CalibrationItem[]>(INITIAL_CALIBRATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [wbFilter, setWbFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [validityFilter, setValidityFilter] = useState<string>("All");

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("10:42:18 AM");

  // Modals
  const [selectedCalibration, setSelectedCalibration] = useState<CalibrationItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showCertViewerModal, setShowCertViewerModal] = useState(false);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleManualRefresh = () => {
    const timeStr = new Date().toLocaleTimeString();
    setLastUpdatedTime(timeStr);
    showToast("✓ Calibration validity and compliance metrics updated");
  };

  // Schedule Modal Form State
  const [scheduleForm, setScheduleForm] = useState({
    weighbridgeId: "WB-03",
    calibrationType: "Periodic Calibration" as CalibrationType,
    scheduledDate: "2026-09-18",
    preferredTime: "10:00 AM",
    provider: "Precision Calibration Ltd.",
    technician: "Amit Sharma",
    notes: "Annual legal metrology periodic inspection & test weight audit.",
  });

  // Record Calibration Form State
  const [recordForm, setRecordForm] = useState({
    code: "CAL-WB03-2026-001",
    weighbridgeId: "WB-03",
    calibrationDate: "2026-08-20",
    calibrationType: "Periodic Calibration" as CalibrationType,
    provider: "Precision Calibration Ltd.",
    technician: "Amit Sharma (Cert #ISO-704)",
    testResult: "PASS" as TestResult,
    certificateNumber: "CAL-2026-192",
    nextDueDate: "2026-11-20",
    notes: "Verified against 20 Ton M1 Class test weights. All points within legal tolerance.",
  });

  // KPI Metrics
  const totalTracked = calibrations.length;
  const validCount = calibrations.filter((c) => c.status === "VALID").length;
  const dueSoonCount = calibrations.filter((c) => c.status === "DUE SOON").length;
  const overdueCount = calibrations.filter((c) => c.status === "OVERDUE").length;
  const complianceScore = Math.round((validCount / totalTracked) * 100);

  // Filtered List
  const filteredCalibrations = useMemo(() => {
    return calibrations.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        item.code.toLowerCase().includes(q) ||
        item.weighbridgeName.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.technician.toLowerCase().includes(q) ||
        item.certificateNumber.toLowerCase().includes(q);

      const matchWb = wbFilter === "All" || item.weighbridgeId === wbFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchType = typeFilter === "All" || item.calibrationType === typeFilter;

      let matchValidity = true;
      if (validityFilter === "Valid") matchValidity = item.daysRemaining > 30;
      else if (validityFilter === "Due Soon") matchValidity = item.daysRemaining > 0 && item.daysRemaining <= 30;
      else if (validityFilter === "Expired") matchValidity = item.daysRemaining <= 0;

      return matchQ && matchWb && matchStatus && matchType && matchValidity;
    });
  }, [calibrations, searchQuery, wbFilter, statusFilter, typeFilter, validityFilter]);

  // Handle Schedule Submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✓ Calibration scheduled for ${scheduleForm.weighbridgeId} on ${scheduleForm.scheduledDate}`);
    setShowScheduleModal(false);
  };

  // Handle Record Submit
  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wbName = recordForm.weighbridgeId === "WB-01" ? "WB-01 — Main Gate" : recordForm.weighbridgeId === "WB-02" ? "WB-02 — North Gate" : recordForm.weighbridgeId === "WB-03" ? "WB-03 — Loading Yard" : recordForm.weighbridgeId === "WB-04" ? "WB-04 — East Gate" : "WB-05 — West Gate";

    const newItem: CalibrationItem = {
      id: recordForm.code,
      code: recordForm.code,
      weighbridgeId: recordForm.weighbridgeId,
      weighbridgeName: wbName,
      location: "Inspection Scale House",
      capacityKg: 80000,
      divisionKg: 20,
      lastCalibrationDate: recordForm.calibrationDate,
      nextDueDate: recordForm.nextDueDate,
      daysRemaining: 90,
      status: "VALID",
      calibrationType: recordForm.calibrationType,
      provider: recordForm.provider,
      technician: recordForm.technician,
      certificateNumber: recordForm.certificateNumber,
      certificateFileName: `${recordForm.weighbridgeId}_Cert_${recordForm.certificateNumber}.pdf`,
      testResult: recordForm.testResult,
      lastUpdated: "Just now",
      historyCount: 6,
      testPoints: [
        { loadKg: 10000, expectedKg: 10000, observedKg: 10000, deviationKg: 0, result: "PASS" },
        { loadKg: 30000, expectedKg: 30000, observedKg: 30010, deviationKg: 10, result: "PASS" },
        { loadKg: 50000, expectedKg: 50000, observedKg: 50020, deviationKg: 20, result: "PASS" },
        { loadKg: 80000, expectedKg: 80000, observedKg: 80030, deviationKg: 30, result: "PASS" },
      ],
    };

    setCalibrations((prev) => prev.map((item) => (item.weighbridgeId === recordForm.weighbridgeId ? newItem : item)));
    showToast(`✓ Recorded calibration ${recordForm.code} for ${recordForm.weighbridgeId}`);
    setShowRecordModal(false);
  };

  // Status Pill Styling Helper
  const getStatusPill = (status: CalibrationStatus) => {
    let color = statusValid;
    let text = "VALID";
    let bgTint = dm ? "rgba(22,163,74,0.15)" : "#F0FDF4";

    if (status === "DUE SOON") {
      color = statusDueSoon;
      text = "DUE SOON";
      bgTint = dm ? "rgba(217,119,6,0.15)" : "#FFFBEB";
    } else if (status === "OVERDUE") {
      color = statusOverdue;
      text = "OVERDUE";
      bgTint = dm ? "rgba(220,38,38,0.15)" : "#FEF2F2";
    } else if (status === "SCHEDULED") {
      color = statusScheduled;
      text = "SCHEDULED";
      bgTint = dm ? "rgba(37,99,235,0.15)" : "#EFF6FF";
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: 999,
          background: bgTint,
          color: color,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.04em",
          border: `1px solid ${color}35`,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
        {text}
      </span>
    );
  };

  return (
    <div style={{ flex: 1, padding: "24px 32px 48px", background: bg, color: primaryText, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Toast */}
      {toastMessage && (
        <div style={{ position: "fixed", top: 84, right: 32, zIndex: 1200, background: primaryOrange, color: "#FFF", padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13, boxShadow: "0 10px 25px rgba(249,115,22,0.4)" }}>
          {toastMessage}
        </div>
      )}

      {/* ── 1. PAGE HEADER ── */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: primaryText, letterSpacing: "-0.02em" }}>
            Calibration
          </h1>
          <p style={{ fontSize: 13, color: secondaryText, margin: "4px 0 0 0" }}>
            Manage weighbridge calibration schedules, validity, certificates and calibration history.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={handleManualRefresh}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 8,
              background: surface,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>↻</span> Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            style={{
              height: 44,
              padding: "0 20px",
              borderRadius: 8,
              background: primaryOrange,
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
            }}
          >
            <span>+</span> SCHEDULE CALIBRATION
          </button>
        </div>
      </div>

      {/* ── 2. KPI SUMMARY (5 CARDS) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* Total Weighbridges */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            TOTAL WEIGHBRIDGES
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: primaryText, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {totalTracked}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Calibration tracked</div>
        </div>

        {/* Calibrated */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusValid, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              CALIBRATED
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusValid }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusValid, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {validCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Currently valid</div>
        </div>

        {/* Due Soon */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusDueSoon, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              DUE SOON
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusDueSoon }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusDueSoon, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {dueSoonCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Requires scheduling</div>
        </div>

        {/* Overdue */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: statusOverdue, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              OVERDUE
            </span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusOverdue }} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: statusOverdue, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {overdueCount}
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Requires immediate audit</div>
        </div>

        {/* Compliance */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: primaryOrange, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            COMPLIANCE RATE
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: primaryOrange, margin: "6px 0 2px", fontFamily: "monospace" }}>
            {complianceScore}%
          </div>
          <div style={{ fontSize: 12, color: secondaryText }}>Legal metrology score</div>
        </div>
      </div>

      {/* ── 3. UPCOMING & OVERDUE CALIBRATIONS OVERVIEW BANNER ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 24 }}>
        {/* Status Breakdown */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "18px 22px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 }}>
            CALIBRATION STATUS OVERVIEW
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: statusValid }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: statusValid }} /> VALID</span>
              <span style={{ fontWeight: 800, fontFamily: "monospace", color: primaryText }}>{validCount} weighbridges</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: statusDueSoon }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: statusDueSoon }} /> DUE SOON</span>
              <span style={{ fontWeight: 800, fontFamily: "monospace", color: primaryText }}>{dueSoonCount} weighbridge</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: statusOverdue }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: statusOverdue }} /> OVERDUE</span>
              <span style={{ fontWeight: 800, fontFamily: "monospace", color: primaryText }}>{overdueCount} weighbridge</span>
            </div>
          </div>
        </div>

        {/* Actionable Schedule Alerts */}
        <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, padding: "18px 22px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: mutedText, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 }}>
            UPCOMING & OVERDUE SCHEDULES
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: dm ? "rgba(217,119,6,0.1)" : "#FFFBEB", border: `1px solid ${statusDueSoon}40` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, color: primaryText }}>
                <span>WB-03 — Loading Yard</span>
                <span style={{ color: statusDueSoon }}>● DUE SOON</span>
              </div>
              <div style={{ fontSize: 11.5, color: secondaryText, marginTop: 4 }}>Due Date: 18 Sep 2026 (29 days remaining)</div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                style={{ marginTop: 8, padding: "4px 10px", borderRadius: 6, background: statusDueSoon, color: "#FFF", border: "none", fontSize: 11, fontWeight: 800, cursor: "pointer" }}
              >
                Schedule Now
              </button>
            </div>

            <div style={{ padding: "12px 14px", borderRadius: 8, background: dm ? "rgba(220,38,38,0.1)" : "#FEF2F2", border: `1px solid ${statusOverdue}40` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, color: primaryText }}>
                <span>WB-04 — East Gate</span>
                <span style={{ color: statusOverdue }}>● OVERDUE</span>
              </div>
              <div style={{ fontSize: 11.5, color: secondaryText, marginTop: 4 }}>Due Date: 02 Jun 2026 (79 days overdue!)</div>
              <button
                type="button"
                onClick={() => setShowRecordModal(true)}
                style={{ marginTop: 8, padding: "4px 10px", borderRadius: 6, background: statusOverdue, color: "#FFF", border: "none", fontSize: 11, fontWeight: 800, cursor: "pointer" }}
              >
                Record Audit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. FILTER BAR ── */}
      <div
        style={{
          background: surface,
          borderRadius: 12,
          border: `1px solid ${border}`,
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, flex: 1 }}>
          {/* Search Input */}
          <div style={{ position: "relative", minWidth: 260, flex: 1 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search weighbridge, calibration ID, certificate..."
              style={{
                width: "100%",
                height: 42,
                padding: "0 14px",
                borderRadius: 8,
                background: inputBg,
                border: `1px solid ${border}`,
                color: primaryText,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Weighbridge Filter */}
          <select
            value={wbFilter}
            onChange={(e) => setWbFilter(e.target.value)}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 8,
              background: inputBg,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 12.5,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Weighbridges ▼</option>
            <option value="WB-01">WB-01 — Main Gate</option>
            <option value="WB-02">WB-02 — North Gate</option>
            <option value="WB-03">WB-03 — Loading Yard</option>
            <option value="WB-04">WB-04 — East Gate</option>
            <option value="WB-05">WB-05 — West Gate</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 8,
              background: inputBg,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 12.5,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Statuses ▼</option>
            <option value="VALID">● VALID</option>
            <option value="DUE SOON">● DUE SOON</option>
            <option value="OVERDUE">● OVERDUE</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 8,
              background: inputBg,
              border: `1px solid ${border}`,
              color: primaryText,
              fontSize: 12.5,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Calibration Types ▼</option>
            <option value="Periodic Calibration">Periodic Calibration</option>
            <option value="After Maintenance">After Maintenance</option>
            <option value="After Repair">After Repair</option>
            <option value="Verification Audit">Verification Audit</option>
          </select>
        </div>

        {/* Server Status & Auto Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: statusValid, fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusValid }} />
            ISO/IEC 17025 ACCREDITED ({lastUpdatedTime})
          </div>

          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 999,
              background: autoRefresh ? (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4") : elevated,
              border: `1px solid ${autoRefresh ? statusValid : border}`,
              color: autoRefresh ? statusValid : mutedText,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Auto Refresh {autoRefresh ? "15s" : "OFF"}
          </button>
        </div>
      </div>

      {/* ── 5. MAIN CALIBRATION TABLE ── */}
      <div style={{ background: surface, borderRadius: 12, border: `1px solid ${border}`, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${border}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: primaryText }}>CALIBRATION RECORDS</h2>
            <p style={{ fontSize: 12, color: secondaryText, margin: "2px 0 0 0" }}>
              {filteredCalibrations.length} physical weighbridges tracked for legal compliance
            </p>
          </div>

          <div style={{ fontSize: 12, color: mutedText, fontWeight: 600 }}>
            Showing {filteredCalibrations.length} of {calibrations.length} weighbridges
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: dm ? "#1A2332" : "#F8FAFC", borderBottom: `1px solid ${border}`, color: mutedText, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "14px 20px" }}>WEIGHBRIDGE</th>
                <th style={{ padding: "14px 16px" }}>CALIBRATION ID</th>
                <th style={{ padding: "14px 16px" }}>LAST CALIBRATION</th>
                <th style={{ padding: "14px 16px" }}>NEXT DUE DATE</th>
                <th style={{ padding: "14px 16px" }}>STATUS</th>
                <th style={{ padding: "14px 16px" }}>CALIBRATED BY</th>
                <th style={{ padding: "14px 16px" }}>CERTIFICATE</th>
                <th style={{ padding: "14px 16px" }}>VALIDITY</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalibrations.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "48px 20px", textAlign: "center", color: mutedText }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: primaryText }}>No calibration records found</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search query or filter selection.</div>
                  </td>
                </tr>
              ) : (
                filteredCalibrations.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: `1px solid ${divider}`, transition: "background 0.15s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = dm ? "rgba(255,255,255,0.03)" : "#F8FAFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Weighbridge Name */}
                    <td style={{ padding: "16px 20px", fontWeight: 800, color: primaryText }}>
                      <div>{item.weighbridgeName}</div>
                      <div style={{ fontSize: 11, color: mutedText, fontWeight: 500 }}>{item.location} · {item.capacityKg / 1000}T Capacity</div>
                    </td>

                    {/* Calibration ID */}
                    <td style={{ padding: "16px 16px", fontWeight: 700, fontFamily: "monospace", color: primaryOrange }}>
                      {item.code}
                    </td>

                    {/* Last Calibration Date */}
                    <td style={{ padding: "16px 16px", color: primaryText, fontWeight: 600 }}>
                      {item.lastCalibrationDate}
                    </td>

                    {/* Next Due Date */}
                    <td style={{ padding: "16px 16px", color: item.daysRemaining < 0 ? statusOverdue : item.daysRemaining < 30 ? statusDueSoon : primaryText, fontWeight: 700 }}>
                      {item.nextDueDate}
                    </td>

                    {/* Status Pill */}
                    <td style={{ padding: "16px 16px" }}>
                      {getStatusPill(item.status)}
                    </td>

                    {/* Provider & Technician */}
                    <td style={{ padding: "16px 16px", color: secondaryText, fontWeight: 600 }}>
                      <div>{item.provider}</div>
                      <div style={{ fontSize: 11, color: mutedText }}>{item.technician}</div>
                    </td>

                    {/* Certificate Number */}
                    <td style={{ padding: "16px 16px" }}>
                      <span
                        onClick={() => {
                          setSelectedCalibration(item);
                          setShowCertViewerModal(true);
                        }}
                        style={{ cursor: "pointer", color: primaryOrange, fontWeight: 700, textDecoration: "underline", fontSize: 12.5 }}
                      >
                        📜 {item.certificateNumber}
                      </span>
                    </td>

                    {/* Days Remaining / Validity */}
                    <td style={{ padding: "16px 16px", fontWeight: 800, color: item.daysRemaining < 0 ? statusOverdue : item.daysRemaining < 30 ? statusDueSoon : statusValid }}>
                      {item.daysRemaining > 0 ? `${item.daysRemaining} days left` : `${Math.abs(item.daysRemaining)} days overdue`}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 20px", textAlign: "right", position: "relative" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCalibration(item);
                            setShowDetailModal(true);
                          }}
                          style={{ padding: "6px 12px", borderRadius: 6, background: primaryOrange, color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowScheduleModal(true)}
                          style={{ padding: "6px 12px", borderRadius: 6, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                        >
                          Schedule
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          style={{ padding: "6px 8px", borderRadius: 6, background: elevated, border: `1px solid ${border}`, color: secondaryText, fontSize: 12, cursor: "pointer" }}
                        >
                          ⋮
                        </button>
                      </div>

                      {/* Row Context Menu */}
                      {activeMenuId === item.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: 50,
                            right: 20,
                            width: 200,
                            background: surface,
                            borderRadius: 8,
                            border: `1px solid ${border}`,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            zIndex: 100,
                            padding: "4px 0",
                            textAlign: "left",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCalibration(item);
                              setShowCertViewerModal(true);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📜 View Certificate PDF
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`✓ Downloaded calibration certificate ${item.certificateNumber}`);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📥 Download Certificate
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCalibration(item);
                              setShowDetailModal(true);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📊 View Test Points Matrix
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowRecordModal(true);
                              setActiveMenuId(null);
                            }}
                            style={contextMenuItemStyle}
                          >
                            📝 Record Completed Audit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 6. CALIBRATION DETAIL INSPECTOR MODAL ── */}
      {showDetailModal && selectedCalibration && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 820, maxHeight: "90vh", background: surface, borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: primaryText }}>{selectedCalibration.weighbridgeName}</h2>
                  {getStatusPill(selectedCalibration.status)}
                </div>
                <div style={{ fontSize: 12.5, color: secondaryText, marginTop: 4 }}>
                  Calibration ID: <strong style={{ color: primaryOrange, fontFamily: "monospace" }}>{selectedCalibration.code}</strong> · Cert #: {selectedCalibration.certificateNumber}
                </div>
              </div>

              <button type="button" onClick={() => setShowDetailModal(false)} style={{ background: "none", border: 0, color: mutedText, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Compliance Status Banner */}
              <div style={{ padding: "18px 22px", borderRadius: 12, background: selectedCalibration.daysRemaining < 0 ? (dm ? "rgba(220,38,38,0.15)" : "#FEF2F2") : selectedCalibration.daysRemaining < 30 ? (dm ? "rgba(217,119,6,0.15)" : "#FFFBEB") : (dm ? "rgba(22,163,74,0.15)" : "#F0FDF4"), border: `1px solid ${border}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: selectedCalibration.daysRemaining < 0 ? statusOverdue : selectedCalibration.daysRemaining < 30 ? statusDueSoon : statusValid, textTransform: "uppercase", letterSpacing: "0.05em" }}>CALIBRATION COMPLIANCE STATUS</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: primaryText, margin: "4px 0" }}>
                    {selectedCalibration.daysRemaining > 0 ? `${selectedCalibration.daysRemaining} Days Remaining Until Expiry` : `${Math.abs(selectedCalibration.daysRemaining)} Days Overdue!`}
                  </div>
                  <div style={{ fontSize: 12, color: secondaryText }}>
                    Last calibrated: <strong>{selectedCalibration.lastCalibrationDate}</strong> · Next Due Date: <strong>{selectedCalibration.nextDueDate}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowScheduleModal(true);
                  }}
                  style={{ padding: "10px 18px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
                >
                  Schedule Recalibration
                </button>
              </div>

              {/* Specifications & Provider Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Weighbridge Specs */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>WEIGHBRIDGE SCALE PARAMETERS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Weighbridge ID</span><span style={{ fontWeight: 700 }}>{selectedCalibration.weighbridgeId}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Location</span><span style={{ fontWeight: 700 }}>{selectedCalibration.location}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Max Capacity</span><span style={{ fontWeight: 800, fontFamily: "monospace" }}>{selectedCalibration.capacityKg.toLocaleString()} KG</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Scale Division (e)</span><span style={{ fontWeight: 800, fontFamily: "monospace" }}>{selectedCalibration.divisionKg} KG</span></div>
                  </div>
                </div>

                {/* Audit Information */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryOrange, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>INSPECTION & PROVIDER DETAILS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Calibration Type</span><span style={{ fontWeight: 700 }}>{selectedCalibration.calibrationType}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Agency / Provider</span><span style={{ fontWeight: 700 }}>{selectedCalibration.provider}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Lead Inspector</span><span style={{ fontWeight: 700 }}>{selectedCalibration.technician}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: mutedText }}>Overall Result</span><span style={{ fontWeight: 800, color: statusValid }}>● {selectedCalibration.testResult}</span></div>
                  </div>
                </div>
              </div>

              {/* Calibration Test Points Matrix */}
              <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: primaryText, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>LEGAL METROLOGY TEST POINTS MATRIX</div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}`, color: mutedText, fontSize: 11, textTransform: "uppercase" }}>
                      <th style={{ padding: "8px 12px" }}>TEST LOAD</th>
                      <th style={{ padding: "8px 12px" }}>EXPECTED</th>
                      <th style={{ padding: "8px 12px" }}>OBSERVED</th>
                      <th style={{ padding: "8px 12px" }}>DEVIATION</th>
                      <th style={{ padding: "8px 12px", textAlign: "right" }}>RESULT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCalibration.testPoints.map((tp, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${divider}` }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700 }}>{tp.loadKg / 1000} Ton ({tp.loadKg.toLocaleString()} KG)</td>
                        <td style={{ padding: "10px 12px", fontFamily: "monospace" }}>{tp.expectedKg.toLocaleString()} KG</td>
                        <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700 }}>{tp.observedKg.toLocaleString()} KG</td>
                        <td style={{ padding: "10px 12px", fontFamily: "monospace", color: tp.deviationKg > 0 ? statusDueSoon : statusValid }}>
                          {tp.deviationKg > 0 ? `+${tp.deviationKg} KG` : "0 KG"}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: statusValid }}>● PASS</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Certificate & Historical Timeline */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Certificate */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryText, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>OFFICIAL CERTIFICATE</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: primaryOrange, fontFamily: "monospace" }}>📜 {selectedCalibration.certificateNumber}</div>
                  <div style={{ fontSize: 12, color: secondaryText, margin: "4px 0 12px" }}>File: {selectedCalibration.certificateFileName}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowCertViewerModal(true);
                    }}
                    style={{ padding: "8px 14px", borderRadius: 6, background: primaryOrange, color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                  >
                    View Official Certificate PDF
                  </button>
                </div>

                {/* History */}
                <div style={{ padding: 18, borderRadius: 10, background: elevated, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: primaryText, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>CALIBRATION HISTORY ({selectedCalibration.historyCount} Audits)</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>{selectedCalibration.lastCalibrationDate}</span><span style={{ color: statusValid, fontWeight: 700 }}>● PASS</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>15 Aug 2025</span><span style={{ color: mutedText }}>● EXPIRED</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>10 Aug 2024</span><span style={{ color: mutedText }}>● EXPIRED</span></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                style={{ padding: "10px 20px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. SCHEDULE CALIBRATION MODAL ── */}
      {showScheduleModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 580, background: surface, borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
            <form onSubmit={handleScheduleSubmit}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: primaryText }}>+ Schedule Calibration Audit</h2>
                <button type="button" onClick={() => setShowScheduleModal(false)} style={{ background: "none", border: 0, color: mutedText, fontSize: 20, cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={formLabelStyle}>Select Weighbridge Station *</label>
                  <select
                    value={scheduleForm.weighbridgeId}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, weighbridgeId: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="WB-01">WB-01 — Main Gate</option>
                    <option value="WB-02">WB-02 — North Gate</option>
                    <option value="WB-03">WB-03 — Loading Yard</option>
                    <option value="WB-04">WB-04 — East Gate</option>
                    <option value="WB-05">WB-05 — West Gate</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Calibration Type *</label>
                  <select
                    value={scheduleForm.calibrationType}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, calibrationType: e.target.value as CalibrationType })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="Periodic Calibration">Periodic Calibration</option>
                    <option value="After Maintenance">After Maintenance</option>
                    <option value="After Repair">After Repair</option>
                    <option value="Verification Audit">Verification Audit</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Scheduled Audit Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Preferred Time Window</label>
                  <input
                    type="text"
                    value={scheduleForm.preferredTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, preferredTime: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Calibration Agency / Provider</label>
                  <input
                    type="text"
                    value={scheduleForm.provider}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, provider: e.target.value })}
                    placeholder="ABC Calibration Services"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={formLabelStyle}>Notes / Special Instructions</label>
                  <input
                    type="text"
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    placeholder="Test weights, Metrology Inspector details..."
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>
              </div>

              <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} style={{ padding: "10px 18px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 22px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Schedule Calibration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 8. RECORD COMPLETED CALIBRATION MODAL ── */}
      {showRecordModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 640, maxHeight: "90vh", background: surface, borderRadius: 16, border: `1px solid ${border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflowY: "auto" }}>
            <form onSubmit={handleRecordSubmit}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: primaryText }}>📝 Record Completed Calibration Audit</h2>
                <button type="button" onClick={() => setShowRecordModal(false)} style={{ background: "none", border: 0, color: mutedText, fontSize: 20, cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={formLabelStyle}>Calibration ID / Code *</label>
                  <input
                    type="text"
                    required
                    value={recordForm.code}
                    onChange={(e) => setRecordForm({ ...recordForm, code: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Weighbridge Station *</label>
                  <select
                    value={recordForm.weighbridgeId}
                    onChange={(e) => setRecordForm({ ...recordForm, weighbridgeId: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="WB-01">WB-01 — Main Gate</option>
                    <option value="WB-02">WB-02 — North Gate</option>
                    <option value="WB-03">WB-03 — Loading Yard</option>
                    <option value="WB-04">WB-04 — East Gate</option>
                    <option value="WB-05">WB-05 — West Gate</option>
                  </select>
                </div>

                <div>
                  <label style={formLabelStyle}>Calibration Audit Date *</label>
                  <input
                    type="date"
                    required
                    value={recordForm.calibrationDate}
                    onChange={(e) => setRecordForm({ ...recordForm, calibrationDate: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Next Due Date *</label>
                  <input
                    type="date"
                    required
                    value={recordForm.nextDueDate}
                    onChange={(e) => setRecordForm({ ...recordForm, nextDueDate: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Certificate Number *</label>
                  <input
                    type="text"
                    required
                    value={recordForm.certificateNumber}
                    onChange={(e) => setRecordForm({ ...recordForm, certificateNumber: e.target.value })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>

                <div>
                  <label style={formLabelStyle}>Audit Result *</label>
                  <select
                    value={recordForm.testResult}
                    onChange={(e) => setRecordForm({ ...recordForm, testResult: e.target.value as TestResult })}
                    style={formInputStyle(inputBg, border, primaryText)}
                  >
                    <option value="PASS">PASS (Compliant)</option>
                    <option value="CONDITIONAL">CONDITIONAL (Minor Deviation)</option>
                    <option value="FAIL">FAIL (Non-Compliant)</option>
                  </select>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={formLabelStyle}>Calibration Agency & Lead Inspector</label>
                  <input
                    type="text"
                    value={recordForm.technician}
                    onChange={(e) => setRecordForm({ ...recordForm, technician: e.target.value })}
                    placeholder="Precision Calibration Ltd. / Inspector Name"
                    style={formInputStyle(inputBg, border, primaryText)}
                  />
                </div>
              </div>

              <div style={{ padding: "16px 24px", borderTop: `1px solid ${border}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button type="button" onClick={() => setShowRecordModal(false)} style={{ padding: "10px 18px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 22px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Save Calibration Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 9. CERTIFICATE VIEWER MODAL ── */}
      {showCertViewerModal && selectedCalibration && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: 540, background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📜</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: primaryText }}>Calibration Certificate Viewer</h3>
            <p style={{ fontSize: 12.5, color: secondaryText, margin: "0 0 16px" }}>
              Official Certificate <strong>{selectedCalibration.certificateNumber}</strong> for {selectedCalibration.weighbridgeName}
            </p>

            <div style={{ padding: 20, borderRadius: 10, background: dm ? "#1A2332" : "#FFF7ED", border: `1px solid ${primaryOrange}40`, textAlign: "left", fontSize: 12, fontFamily: "monospace", color: primaryText, marginBottom: 20 }}>
              <div style={{ textAlign: "center", fontWeight: 800, color: primaryOrange, marginBottom: 10 }}>GOVERNMENT OF INDIA METROLOGY DEPT</div>
              <div style={{ textAlign: "center", fontSize: 11, color: mutedText, marginBottom: 12 }}>ISO/IEC 17025 ACCREDITED CALIBRATION CERTIFICATE</div>
              <div>Certificate No: {selectedCalibration.certificateNumber}</div>
              <div>Weighbridge ID: {selectedCalibration.weighbridgeId}</div>
              <div>Station: {selectedCalibration.weighbridgeName}</div>
              <div>Issue Date: {selectedCalibration.lastCalibrationDate}</div>
              <div>Valid Until: {selectedCalibration.nextDueDate}</div>
              <div>Agency: {selectedCalibration.provider}</div>
              <div>Inspector: {selectedCalibration.technician}</div>
              <div>Overall Result: PASS</div>
              <div style={{ textAlign: "center", fontSize: 10, color: statusValid, marginTop: 12, fontWeight: 800 }}>✓ STAMPED & VERIFIED ACCORDING TO STANDARDS</div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setShowCertViewerModal(false)}
                style={{ padding: "10px 18px", borderRadius: 8, background: elevated, border: `1px solid ${border}`, color: primaryText, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`✓ Downloaded certificate PDF ${selectedCalibration.certificateFileName}`);
                  setShowCertViewerModal(false);
                }}
                style={{ padding: "10px 22px", borderRadius: 8, background: primaryOrange, color: "#FFF", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
              >
                Download Official Certificate PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const formLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const formInputStyle = (bg: string, border: string, text: string): React.CSSProperties => ({
  width: "100%",
  height: 42,
  padding: "0 12px",
  borderRadius: 8,
  background: bg,
  border: `1px solid ${border}`,
  color: text,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
});

const contextMenuItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 16px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  fontSize: 12.5,
  fontWeight: 600,
  color: "inherit",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
};
