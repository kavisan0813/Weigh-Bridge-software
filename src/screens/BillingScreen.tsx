import { useState, useMemo } from "react";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: any) => void;
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

const REGISTERED_INVOICES = [
  {
    invNo: "INV-2026-00458",
    date: "19 Aug 2026",
    customer: "Viyan Construction",
    ticket: "WB-2026-00458",
    material: "Gravel",
    net: "25,000 KG",
    amount: "₹62,500",
    paid: "₹62,500",
    balance: "₹0",
    status: "PAID",
    statusColor: "#16A34A",
    gstin: "33ViyanDE1234F1Z5",
    method: "Bank Transfer",
    refNo: "TXN-784521",
  },
  {
    invNo: "INV-2026-00457",
    date: "19 Aug 2026",
    customer: "XYZ Logistics",
    ticket: "WB-2026-00457",
    material: "Sand",
    net: "27,700 KG",
    amount: "₹69,250",
    paid: "₹40,000",
    balance: "₹29,250",
    status: "PARTIALLY PAID",
    statusColor: "#F59E0B",
    gstin: "33XYZDE5678F1Z2",
    method: "UPI",
    refNo: "UPI-991204",
  },
  {
    invNo: "INV-2026-00442",
    date: "18 Aug 2026",
    customer: "Metro Builders",
    ticket: "WB-2026-00442",
    material: "Gravel",
    net: "24,800 KG",
    amount: "₹62,000",
    paid: "₹0",
    balance: "₹62,000",
    status: "OVERDUE",
    statusColor: "#DC2626",
    gstin: "33METRO7890F1Z1",
    method: "--",
    refNo: "--",
  },
  {
    invNo: "INV-2026-00438",
    date: "17 Aug 2026",
    customer: "Global Cement",
    ticket: "WB-2026-00438",
    material: "Cement",
    net: "31,500 KG",
    amount: "₹94,500",
    paid: "₹94,500",
    balance: "₹0",
    status: "PAID",
    statusColor: "#16A34A",
    gstin: "33GLOBL9012F1Z9",
    method: "Cheque",
    refNo: "CHQ-44012",
  },
];

export default function BillingScreen({ darkMode: dm, onToggleDark }: Props) {
  const p = pal(dm);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [detailDrawerItem, setDetailDrawerItem] = useState<
    (typeof REGISTERED_INVOICES)[0] | null
  >(null);
  const [recordPaymentItem, setRecordPaymentItem] = useState<
    (typeof REGISTERED_INVOICES)[0] | null
  >(null);
  const [paymentInput, setPaymentInput] = useState("");
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);

  const filtered = useMemo(() => {
    return REGISTERED_INVOICES.filter((inv) => {
      const matchQ =
        `${inv.invNo} ${inv.customer} ${inv.ticket} ${inv.material}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchStatus = statusFilter === "All" || inv.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [query, statusFilter]);

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
            <span>Billing & Payments</span>
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: p.text,
              marginTop: 1,
            }}
          >
            Weighment Billing, Invoices & Payment Ledger
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setCreateInvoiceOpen(true)}
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
            + Create Invoice
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
                fontSize: 10.5,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              TODAY'S BILLING
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: p.text,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ₹1,24,500
            </div>
            <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>
              Daily generated revenue
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
                fontSize: 10.5,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              THIS MONTH
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: p.text,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ₹28,45,600
            </div>
            <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>
              Monthly volume total
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
                fontSize: 10.5,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              PAID AMOUNT
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#16A34A",
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ₹22,84,200
            </div>
            <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>
              Settled transactions
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
                fontSize: 10.5,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              PENDING BALANCE
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: p.secondaryGold,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ₹5,61,400
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
                fontSize: 10.5,
                fontWeight: 700,
                color: p.muted,
                textTransform: "uppercase",
              }}
            >
              OVERDUE AMOUNT
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#DC2626",
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ₹1,42,800
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#DC2626",
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              Over 30 days outstanding
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
              placeholder="Search invoice no, customer, ticket..."
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
            <option value="All">All Payment Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PARTIALLY PAID">Partially Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <button
            onClick={() => {
              setQuery("");
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

        {/* MAIN BILLING TABLE */}
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
                Billing Records
              </span>
              <span style={{ fontSize: 12, color: p.muted, marginLeft: 8 }}>
                ({filtered.length} invoices)
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
                    INVOICE NO
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    DATE
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
                    TICKET NO
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
                    NET WEIGHT
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    AMOUNT
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    PAID
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    BALANCE
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
                {filtered.map((inv) => (
                  <tr
                    key={inv.invNo}
                    style={{ borderTop: `1px solid ${p.divider}` }}
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 800,
                        color: p.primaryOrange,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {inv.invNo}
                    </td>
                    <td style={{ padding: "14px 16px", color: p.muted }}>
                      {inv.date}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 700,
                        color: p.text,
                      }}
                    >
                      {inv.customer}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: p.secondary,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {inv.ticket}
                    </td>
                    <td style={{ padding: "14px 16px", color: p.secondary }}>
                      {inv.material}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 700,
                        color: p.text,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {inv.net}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 900,
                        color: p.text,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {inv.amount}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "#16A34A",
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {inv.paid}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 900,
                        color: inv.balance !== "₹0" ? "#DC2626" : p.muted,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {inv.balance}
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
                          background: `${inv.statusColor}18`,
                          color: inv.statusColor,
                          border: `1px solid ${inv.statusColor}35`,
                        }}
                      >
                        ● {inv.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <button
                        onClick={() => setDetailDrawerItem(inv)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 6,
                          border: `1px solid ${p.border}`,
                          background: p.surface,
                          color: p.text,
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          marginRight: 6,
                        }}
                      >
                        View
                      </button>
                      {inv.balance !== "₹0" && (
                        <button
                          onClick={() => {
                            setRecordPaymentItem(inv);
                            setPaymentInput(
                              inv.balance.replace("₹", "").replace(",", ""),
                            );
                          }}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: 0,
                            background: p.secondaryGold,
                            color: "white",
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* INVOICE DETAIL DRAWER */}
      {detailDrawerItem && (
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
                    INVOICE BREAKDOWN
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 20,
                      fontWeight: 900,
                      color: p.primaryOrange,
                    }}
                  >
                    {detailDrawerItem.invNo}
                  </h3>
                </div>
                <button
                  onClick={() => setDetailDrawerItem(null)}
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

              <div
                style={{
                  background: p.sub,
                  border: `1px solid ${p.border}`,
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <div style={{ fontSize: 11, color: p.muted }}>
                  REMAINING UNPAID BALANCE
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color:
                      detailDrawerItem.balance !== "₹0" ? "#DC2626" : "#16A34A",
                    marginTop: 2,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {detailDrawerItem.balance}
                </div>
                <div
                  style={{ fontSize: 11.5, color: p.secondary, marginTop: 4 }}
                >
                  Total Invoice Amount: {detailDrawerItem.amount} | Paid:{" "}
                  {detailDrawerItem.paid}
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
                  <span style={{ color: p.muted }}>Customer</span>
                  <b>{detailDrawerItem.customer}</b>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: p.muted }}>Customer GSTIN</span>
                  <b>{detailDrawerItem.gstin}</b>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: p.muted }}>Weighment Ticket</span>
                  <b style={{ color: p.primaryOrange }}>
                    {detailDrawerItem.ticket}
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
                  <span style={{ color: p.muted }}>Material & Net Weight</span>
                  <b>
                    {detailDrawerItem.material} ({detailDrawerItem.net})
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
                  <span style={{ color: p.muted }}>Payment Method</span>
                  <b>
                    {detailDrawerItem.method} (Ref: {detailDrawerItem.refNo})
                  </b>
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
              {detailDrawerItem.balance !== "₹0" && (
                <button
                  onClick={() => {
                    setRecordPaymentItem(detailDrawerItem);
                    setDetailDrawerItem(null);
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
                  Record Payment Received
                </button>
              )}
              <button
                onClick={() => setDetailDrawerItem(null)}
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {recordPaymentItem && (
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
              width: 440,
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
              Record Payment for {recordPaymentItem.invNo}
            </h3>
            <p
              style={{ fontSize: 13, color: p.secondary, margin: "0 0 16px 0" }}
            >
              Outstanding balance: <b>{recordPaymentItem.balance}</b>
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: p.secondary,
                    marginBottom: 4,
                  }}
                >
                  Payment Amount (₹) *
                </label>
                <input
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(e.target.value)}
                  placeholder="e.g. 29250"
                  style={{
                    width: "100%",
                    height: 42,
                    borderRadius: 8,
                    border: `1px solid ${p.border}`,
                    background: p.input,
                    color: p.text,
                    padding: "0 12px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: p.secondary,
                    marginBottom: 4,
                  }}
                >
                  Payment Mode
                </label>
                <select
                  style={{
                    width: "100%",
                    height: 42,
                    borderRadius: 8,
                    border: `1px solid ${p.border}`,
                    background: p.input,
                    color: p.text,
                    padding: "0 12px",
                    fontSize: 13,
                  }}
                >
                  <option>Bank Transfer / NEFT</option>
                  <option>UPI / QR</option>
                  <option>Cheque</option>
                  <option>Cash</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: p.secondary,
                    marginBottom: 4,
                  }}
                >
                  Reference Number
                </label>
                <input
                  placeholder="TXN or Cheque No"
                  style={{
                    width: "100%",
                    height: 42,
                    borderRadius: 8,
                    border: `1px solid ${p.border}`,
                    background: p.input,
                    color: p.text,
                    padding: "0 12px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setRecordPaymentItem(null);
                  alert("Payment recorded successfully.");
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
                Confirm Payment
              </button>
              <button
                onClick={() => setRecordPaymentItem(null)}
                style={{
                  flex: 1,
                  padding: "12px 0",
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
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {createInvoiceOpen && (
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
              width: 480,
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
              Generate New Invoice
            </h3>
            <p
              style={{ fontSize: 13, color: p.secondary, margin: "0 0 16px 0" }}
            >
              Select customer and unbilled weighment tickets.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: p.secondary,
                    marginBottom: 4,
                  }}
                >
                  Customer *
                </label>
                <select
                  style={{
                    width: "100%",
                    height: 42,
                    borderRadius: 8,
                    border: `1px solid ${p.border}`,
                    background: p.input,
                    color: p.text,
                    padding: "0 12px",
                    fontSize: 13,
                  }}
                >
                  <option>Viyan Construction</option>
                  <option>XYZ Logistics</option>
                  <option>Global Cement</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: p.secondary,
                    marginBottom: 4,
                  }}
                >
                  Unbilled Weighment Ticket
                </label>
                <select
                  style={{
                    width: "100%",
                    height: 42,
                    borderRadius: 8,
                    border: `1px solid ${p.border}`,
                    background: p.input,
                    color: p.text,
                    padding: "0 12px",
                    fontSize: 13,
                  }}
                >
                  <option>WB-2026-00458 (Gravel, 25,000 KG)</option>
                  <option>WB-2026-00457 (Sand, 27,700 KG)</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setCreateInvoiceOpen(false);
                  alert("Invoice INV-2026-00459 generated.");
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
                Generate Invoice
              </button>
              <button
                onClick={() => setCreateInvoiceOpen(false)}
                style={{
                  flex: 1,
                  padding: "12px 0",
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
        </div>
      )}
    </div>
  );
}
