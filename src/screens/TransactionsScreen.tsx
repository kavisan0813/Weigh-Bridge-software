import { useState, useMemo } from "react";

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
    primarySoft: dark ? "#273449" : "#FFF7ED",
    secondaryGold: dark ? "#D4A83A" : "#C99A2E",
    secondarySoft: dark ? "#422F0A" : "#FFFBEB",
  };
}

const ALL_TRANSACTIONS = [
  {
    ticket: "WB-2026-00458",
    time: "19 Aug, 10:50 AM",
    wb: "WB-01",
    vehicle: "TN20AB1234",
    customer: "ABC Construction",
    material: "Gravel",
    gross: "38,500 KG",
    tare: "13,500 KG",
    net: "25,000 KG",
    operator: "Arun",
    type: "First Weigh",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
  {
    ticket: "WB-2026-00457",
    time: "19 Aug, 10:42 AM",
    wb: "WB-03",
    vehicle: "TN18CD5678",
    customer: "XYZ Logistics",
    material: "Sand",
    gross: "32,100 KG",
    tare: "12,100 KG",
    net: "20,000 KG",
    operator: "Ravi",
    type: "Second Weigh",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
  {
    ticket: "WB-2026-00456",
    time: "19 Aug, 10:35 AM",
    wb: "WB-02",
    vehicle: "TN10EF9012",
    customer: "Global Cement",
    material: "Cement",
    gross: "--",
    tare: "--",
    net: "--",
    operator: "Kumar",
    type: "First Weigh",
    status: "PENDING",
    statusColor: "#F59E0B",
  },
  {
    ticket: "WB-2026-00455",
    time: "19 Aug, 10:28 AM",
    wb: "WB-05",
    vehicle: "TN09GH3456",
    customer: "ABC Steel",
    material: "Steel",
    gross: "42,800 KG",
    tare: "20,000 KG",
    net: "22,800 KG",
    operator: "Suresh",
    type: "Single Weigh",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
  {
    ticket: "WB-2026-00451",
    time: "19 Aug, 09:56 AM",
    wb: "WB-01",
    vehicle: "TN12JK7890",
    customer: "XYZ Logistics",
    material: "Sand",
    gross: "31,500 KG",
    tare: "12,000 KG",
    net: "19,500 KG",
    operator: "Arun",
    type: "Second Weigh",
    status: "CORRECTION REQUIRED",
    statusColor: "#DC2626",
  },
  {
    ticket: "WB-2026-00448",
    time: "19 Aug, 09:20 AM",
    wb: "WB-04",
    vehicle: "TN22JK7102",
    customer: "Infrastructure Ltd",
    material: "Aggregate",
    gross: "41,200 KG",
    tare: "16,200 KG",
    net: "25,000 KG",
    operator: "Arun",
    type: "First Weigh",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
  {
    ticket: "WB-2026-00443",
    time: "19 Aug, 08:45 AM",
    wb: "WB-01",
    vehicle: "TN37GH3345",
    customer: "Metro Highways",
    material: "Fly Ash",
    gross: "29,400 KG",
    tare: "11,200 KG",
    net: "18,200 KG",
    operator: "Arun",
    type: "Second Weigh",
    status: "COMPLETED",
    statusColor: "#16A34A",
  },
];

export default function TransactionsScreen({
  darkMode: dm,
  onToggleDark,
}: Props) {
  const p = pal(dm);

  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState("Today");
  const [wbFilter, setWbFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drawerTx, setDrawerTx] = useState<(typeof ALL_TRANSACTIONS)[0] | null>(
    null,
  );
  const [printModalTx, setPrintModalTx] = useState<
    (typeof ALL_TRANSACTIONS)[0] | null
  >(null);
  const [correctionModalTx, setCorrectionModalTx] = useState<
    (typeof ALL_TRANSACTIONS)[0] | null
  >(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const filtered = useMemo(() => {
    return ALL_TRANSACTIONS.filter((r) => {
      const matchQ = `${r.ticket} ${r.vehicle} ${r.customer} ${r.operator}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchWb = wbFilter === "All" || r.wb === wbFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchQ && matchWb && matchStatus;
    });
  }, [query, wbFilter, statusFilter]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        background: p.bg,
        color: p.text,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* MAIN CONTENT AREA */}
      {/* TOP HEADER */}
      <header
        style={{
          height: 60,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          background: p.surface,
          borderBottom: `1px solid ${p.border}`,
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: p.muted,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>Admin</span>
            <span>/</span>
            <span>Transactions</span>
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: p.text,
              marginTop: 1,
            }}
          >
            Transaction Log & Records
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setShowExportModal(true)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: 0,
              background: p.primaryOrange,
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ↓ Export Transactions
          </button>
          <button
            onClick={onToggleDark}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `1px solid ${p.border}`,
              background: "transparent",
              color: p.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {dm ? "☼" : "◐"}
          </button>
        </div>
      </header>

      {/* MAIN BODY */}
      <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px 40px" }}>
        {/* SUMMARY 5 KPI CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              TODAY'S TRANSACTIONS
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: p.text,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              248
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#16A34A",
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              ↑ +12.5% vs yesterday
            </div>
          </div>

          <div
            style={{
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              COMPLETED
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#16A34A",
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              230
            </div>
            <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>
              Finalized tickets
            </div>
          </div>

          <div
            style={{
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              PENDING
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#F59E0B",
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              18
            </div>
            <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>
              Incomplete weighments
            </div>
          </div>

          <div
            style={{
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              TOTAL NET WEIGHT
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: p.secondaryGold,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              4,285 <span style={{ fontSize: 14 }}>MT</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: p.secondaryGold,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              Secondary Gold Metric
            </div>
          </div>

          <div
            style={{
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              CORRECTION REQUESTS
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#DC2626",
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              3
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#DC2626",
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              ⚠ Pending admin review
            </div>
          </div>
        </div>

        {/* FILTER & SEARCH TOOLBAR */}
        <div
          style={{
            background: p.surface,
            border: `1px solid ${p.border}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 240px" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transaction, vehicle number, ticket..."
              style={{
                width: "100%",
                height: 42,
                borderRadius: 8,
                border: `1px solid ${p.border}`,
                background: p.input,
                color: p.text,
                padding: "0 14px",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              height: 42,
              borderRadius: 8,
              border: `1px solid ${p.border}`,
              background: p.input,
              color: p.text,
              padding: "0 12px",
              fontSize: 12,
              fontWeight: 600,
              outline: "none",
            }}
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>

          <select
            value={wbFilter}
            onChange={(e) => setWbFilter(e.target.value)}
            style={{
              height: 42,
              borderRadius: 8,
              border: `1px solid ${p.border}`,
              background: p.input,
              color: p.text,
              padding: "0 12px",
              fontSize: 12,
              fontWeight: 600,
              outline: "none",
            }}
          >
            <option value="All">All Weighbridges</option>
            <option value="WB-01">WB-01 (Main Gate)</option>
            <option value="WB-02">WB-02 (North Gate)</option>
            <option value="WB-03">WB-03 (Loading Yard)</option>
            <option value="WB-04">WB-04 (East Gate)</option>
            <option value="WB-05">WB-05 (West Gate)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: 42,
              borderRadius: 8,
              border: `1px solid ${p.border}`,
              background: p.input,
              color: p.text,
              padding: "0 12px",
              fontSize: 12,
              fontWeight: 600,
              outline: "none",
            }}
          >
            <option value="All">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CORRECTION REQUIRED">Correction Required</option>
          </select>

          <button
            onClick={() => {
              setQuery("");
              setWbFilter("All");
              setStatusFilter("All");
            }}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 8,
              border: `1px solid ${p.border}`,
              background: "transparent",
              color: p.muted,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* MAIN TRANSACTION TABLE */}
        <div
          style={{
            background: p.surface,
            border: `1px solid ${p.border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${p.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: 15, fontWeight: 800, color: p.text }}>
                All Transactions
              </span>
              <span style={{ fontSize: 12, color: p.muted, marginLeft: 8 }}>
                ({filtered.length} of 248 records)
              </span>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12.5,
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: p.sub, color: p.muted }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    TICKET
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    DATE & TIME
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    SCALE
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    VEHICLE
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    CUSTOMER
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    MATERIAL
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    GROSS
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    TARE
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    NET
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    OPERATOR
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    STATUS
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                      textAlign: "right",
                    }}
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.ticket}
                    style={{ borderTop: `1px solid ${p.divider}` }}
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 800,
                        color: p.text,
                      }}
                    >
                      {r.ticket}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: p.muted,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.time}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 700,
                        color: p.text,
                      }}
                    >
                      {r.wb}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 800,
                        color: p.primaryOrange,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.vehicle}
                    </td>
                    <td style={{ padding: "14px 16px", color: p.secondary }}>
                      {r.customer}
                    </td>
                    <td style={{ padding: "14px 16px", color: p.secondary }}>
                      {r.material}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.gross}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.tare}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 800,
                        color: p.text,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.net}
                    </td>
                    <td style={{ padding: "14px 16px", color: p.secondary }}>
                      {r.operator}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 10.5,
                          fontWeight: 700,
                          background: `${r.statusColor}18`,
                          color: r.statusColor,
                          border: `1px solid ${r.statusColor}35`,
                        }}
                      >
                        ● {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => setDrawerTx(r)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 6,
                            border: `1px solid ${p.border}`,
                            background: p.surface,
                            color: p.text,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => setPrintModalTx(r)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: 0,
                            background: p.primaryOrange,
                            color: "white",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          🖨 Ticket
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* TRANSACTION DETAIL SLIDE-OVER DRAWER */}
      {drawerTx && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: 440,
              background: p.surface,
              height: "100%",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "-4px 0 20px rgba(0,0,0,0.2)",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 11, color: p.muted, fontWeight: 700 }}
                  >
                    TRANSACTION RECORD
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: p.text,
                    }}
                  >
                    {drawerTx.ticket}
                  </h3>
                </div>
                <button
                  onClick={() => setDrawerTx(null)}
                  style={{
                    background: "none",
                    border: 0,
                    fontSize: 18,
                    color: p.muted,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Weight Breakdown Highlight */}
              <div
                style={{
                  background: p.secondarySoft,
                  border: `1.5px solid ${p.secondaryGold}`,
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 20,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  textAlign: "center",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: p.secondaryGold,
                      fontWeight: 700,
                    }}
                  >
                    GROSS
                  </span>
                  <div style={{ fontSize: 14, fontWeight: 800, color: p.text }}>
                    {drawerTx.gross}
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: p.secondaryGold,
                      fontWeight: 700,
                    }}
                  >
                    TARE
                  </span>
                  <div style={{ fontSize: 14, fontWeight: 800, color: p.text }}>
                    {drawerTx.tare}
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: p.secondaryGold,
                      fontWeight: 800,
                    }}
                  >
                    NET (GOLD)
                  </span>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: p.secondaryGold,
                    }}
                  >
                    {drawerTx.net}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: p.muted }}>Vehicle Number</span>
                  <b
                    style={{
                      color: p.primaryOrange,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {drawerTx.vehicle}
                  </b>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: p.muted }}>Customer</span>
                  <b>{drawerTx.customer}</b>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: p.muted }}>Material</span>
                  <b>{drawerTx.material}</b>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: p.muted }}>Weighbridge Scale</span>
                  <b>{drawerTx.wb}</b>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: p.muted }}>Operator</span>
                  <b>{drawerTx.operator}</b>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: p.muted }}>Timestamp</span>
                  <span>{drawerTx.time}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                borderTop: `1px solid ${p.border}`,
                paddingTop: 16,
              }}
            >
              <button
                onClick={() => {
                  setPrintModalTx(drawerTx);
                  setDrawerTx(null);
                }}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 8,
                  border: 0,
                  background: p.primaryOrange,
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                🖨 Print Official Ticket
              </button>
              <button
                onClick={() => {
                  setCorrectionModalTx(drawerTx);
                  setDrawerTx(null);
                }}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: 8,
                  border: `1px solid ${p.border}`,
                  background: p.surface,
                  color: p.secondary,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Request Correction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT TICKET PREVIEW MODAL */}
      {printModalTx && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 480,
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 16px 36px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                borderBottom: `1px solid ${p.border}`,
                paddingBottom: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  color: p.text,
                }}
              >
                ABC INDUSTRIES
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: p.primaryOrange,
                  letterSpacing: "0.15em",
                  marginTop: 2,
                }}
              >
                WEIGHBRIDGE MANAGEMENT SOFTWARE
              </div>
              <div style={{ fontSize: 12, color: p.muted, marginTop: 6 }}>
                Official Weighment Ticket • {printModalTx.ticket}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 12.5,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: p.muted }}>Vehicle:</span>
                <b>{printModalTx.vehicle}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: p.muted }}>Customer:</span>
                <b>{printModalTx.customer}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: p.muted }}>Material:</span>
                <b>{printModalTx.material}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: p.muted }}>Gross Weight:</span>
                <b>{printModalTx.gross}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: p.muted }}>Tare Weight:</span>
                <b>{printModalTx.tare}</b>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: `1px solid ${p.border}`,
                  paddingTop: 8,
                  fontSize: 15,
                }}
              >
                <span style={{ color: p.secondaryGold, fontWeight: 800 }}>
                  NET WEIGHT:
                </span>
                <b
                  style={{
                    color: p.secondaryGold,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {printModalTx.net}
                </b>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  alert("Ticket sent to thermal printer.");
                  setPrintModalTx(null);
                }}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 8,
                  border: 0,
                  background: p.primaryOrange,
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                🖨 Print Ticket
              </button>
              <button
                onClick={() => setPrintModalTx(null)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 8,
                  border: `1px solid ${p.border}`,
                  background: p.surface,
                  color: p.secondary,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 420,
              background: p.surface,
              border: `1px solid ${p.border}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: 18,
                fontWeight: 800,
                color: p.text,
              }}
            >
              Export Transaction Data
            </h3>
            <p
              style={{ fontSize: 13, color: p.secondary, margin: "0 0 16px 0" }}
            >
              Choose export format for current transaction dataset (
              {filtered.length} records).
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {["CSV", "Excel", "PDF Report"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() =>
                    alert(`Exporting ${filtered.length} records as ${fmt}...`)
                  }
                  style={{
                    padding: "12px 0",
                    borderRadius: 8,
                    border: `1px solid ${p.primaryOrange}`,
                    background: p.primarySoft,
                    color: p.primaryOrange,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: 8,
                border: `1px solid ${p.border}`,
                background: p.surface,
                color: p.secondary,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
