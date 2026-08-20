import { useState } from "react";

export type NavView =
  | "dashboard" | "monitoring" | "detail" | "transactions"
  | "transaction-detail" | "vehicles" | "employees" | "reports" | "settings";

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: NavView) => void;
}

function pal(dm: boolean) {
  return {
    bg: dm ? "#111827" : "#F8FAFC", s: dm ? "#1F2937" : "#FFFFFF",
    text: dm ? "#F9FAFB" : "#111827", sec: dm ? "#D1D5DB" : "#4B5563",
    muted: dm ? "#9CA3AF" : "#6B7280", border: dm ? "#374151" : "#E5E7EB",
    sub: dm ? "#374151" : "#F1F5F9", input: dm ? "#111827" : "#FFFFFF",
  };
}

const MAIN_NAV = [
  { key: "dashboard", label: "Dashboard", icon: "▦" },
  { key: "monitoring", label: "Weighbridges", icon: "⚖" },
  { key: "transactions", label: "Transactions", icon: "▤" },
  { key: "vehicles", label: "Vehicles", icon: "▱" },
  { key: "employees", label: "Employees", icon: "♙" },
  { key: "reports", label: "Reports", icon: "▥" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

const NAVIGABLE = new Set<string>(["dashboard", "monitoring", "transactions", "vehicles", "employees", "reports", "settings"]);

const EMPLOYEES = [
  { name: "Arun Kumar", id: "EMP001", primary: "WB-01", additional: "—", status: "Active", lastActive: "2 min ago", initials: "AK" },
  { name: "Kumar", id: "EMP002", primary: "WB-02", additional: "—", status: "Active", lastActive: "5 min ago", initials: "KM" },
  { name: "Ravi", id: "EMP003", primary: "WB-03", additional: "—", status: "Active", lastActive: "1 min ago", initials: "RV" },
  { name: "Suresh", id: "EMP004", primary: "WB-05", additional: "—", status: "Active", lastActive: "8 min ago", initials: "SU" },
];

const FORM_FIELDS = [
  { label: "Full Name", type: "text", ph: "Enter full name", span: true },
  { label: "Employee ID", type: "text", ph: "EMP005" },
  { label: "Phone", type: "text", ph: "+91 98765 43210" },
  { label: "Email", type: "email", ph: "employee@company.com" },
  { label: "Username", type: "text", ph: "arun.kumar" },
  { label: "Password", type: "password", ph: "••••••••" },
  { label: "Primary Weighbridge", type: "select", ph: "Select weighbridge" },
  { label: "Additional Weighbridges", type: "select", ph: "Select additional (optional)" },
  { label: "Status", type: "select", ph: "Active" },
];

export default function EmployeeManagementScreen({ darkMode: dm, onToggleDark, onLogout, onNavigate }: Props) {
  const c = pal(dm);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = EMPLOYEES.filter(
    e => e.name.toLowerCase().includes(query.toLowerCase()) || e.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: c.bg, color: c.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 248, minWidth: 248, height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column", background: dm ? "#1F2937" : "#FFFFFF", borderRight: `1px solid ${dm ? "#374151" : "#E5E7EB"}`, overflowY: "auto", zIndex: 40, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: `1px solid ${dm ? "#374151" : "#E5E7EB"}` }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3c0 1.5.83 2.8 2 3.46V10H7l-2 12h14L17 10h-4V8.46A3.5 3.5 0 0 0 15 5a3 3 0 0 0-3-3z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.13em", color: "#F97316", lineHeight: 1.2 }}>WEIGHBRIDGE</div>
            <div style={{ fontSize: 10.5, color: c.muted, marginTop: 2 }}>ABC Industries</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "10px 10px 0" }}>
          {MAIN_NAV.map(({ key, label, icon }) => {
            const active = key === "employees";
            const isNav = NAVIGABLE.has(key);
            return (
              <button key={key} onClick={() => isNav && onNavigate(key as NavView)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", marginBottom: 2, padding: "9px 12px", borderRadius: 8, border: "none", background: active ? "#FFF7ED" : "transparent", color: active ? "#F97316" : isNav ? (dm ? "#D1D5DB" : "#4B5563") : (dm ? "#6B7280" : "#9CA3AF"), fontWeight: active ? 600 : 400, fontSize: 13.5, cursor: isNav ? "pointer" : "default", textAlign: "left", opacity: !active && !isNav ? 0.55 : 1 }}>
                <span style={{ fontSize: 14, width: 16, textAlign: "center", flexShrink: 0 }}>{icon}</span>{label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "10px 10px 16px", borderTop: `1px solid ${dm ? "#374151" : "#E5E7EB"}`, marginTop: 8 }}>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: c.muted, fontSize: 13.5, cursor: "pointer", textAlign: "left" }}>↪&nbsp; Sign Out</button>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: c.s, borderBottom: `1px solid ${c.border}`, position: "sticky", top: 0, zIndex: 30 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: c.text, lineHeight: 1.25 }}>Employees</div>
            <div style={{ fontSize: 12, color: c.muted, marginTop: 1 }}>Manage operators and their weighbridge assignments.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={onToggleDark} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{dm ? "☼" : "◐"}</button>
            <div style={{ width: 1, height: 24, background: c.border, margin: "0 2px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px", borderRadius: 8, cursor: "pointer" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>A</div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: c.text, lineHeight: 1.2 }}>Admin</div><div style={{ fontSize: 11, color: c.muted }}>ABC Industries</div></div>
            </div>
          </div>
        </header>

        <main className="overflow-y-auto p-6 md:p-8" style={{ height: "calc(100vh - 60px)" }}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div />
            <button onClick={() => setOpen(true)} className="h-11 rounded-lg px-5 text-xs font-bold text-white" style={{ background: "#F97316", border: 0, cursor: "pointer" }}>
              ＋ Add Employee
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["4", "Total Employees", c.sec],
              ["4", "Active Now", "#16A34A"],
              ["0", "Off Duty", c.muted],
              ["5", "Weighbridges Covered", "#F97316"],
            ].map(([v, l, color]) => (
              <div key={l as string} className="rounded-xl px-5 py-4" style={{ background: c.s, border: `1px solid ${c.border}` }}>
                <div className="text-2xl font-bold tabular-nums" style={{ color: color as string }}>{v}</div>
                <div className="mt-1 text-xs" style={{ color: c.muted }}>{l}</div>
              </div>
            ))}
          </div>

          <div className="mb-5 grid gap-3 rounded-xl p-4 md:grid-cols-[minmax(220px,1fr)_repeat(3,180px)]" style={{ background: c.s, border: `1px solid ${c.border}` }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or employee ID"
              className="h-10 rounded-lg px-3 text-xs outline-none"
              style={{ background: c.input, color: c.text, border: `1px solid ${c.border}` }}
            />
            {["Role", "Weighbridge", "Status"].map(x => (
              <button key={x} className="flex h-10 items-center justify-between rounded-lg px-3 text-xs" style={{ background: c.input, color: c.sec, border: `1px solid ${c.border}`, cursor: "pointer" }}>
                {x}<span>⌄</span>
              </button>
            ))}
          </div>

          <section className="overflow-hidden rounded-xl" style={{ background: c.s, border: `1px solid ${c.border}` }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="sticky top-0" style={{ background: c.sub, color: c.muted }}>
                  <tr>
                    {["Employee", "Employee ID", "Role", "Primary Weighbridge", "Additional Weighbridges", "Status", "Last Active", "Actions"].map(x => (
                      <th key={x} className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold">{x}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr
                      key={emp.id}
                      className="transition-colors"
                      style={{ borderTop: `1px solid ${c.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = dm ? "#1E293B" : "#F8FAFC")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: "#F97316" }}>
                            {emp.initials}
                          </div>
                          <span className="text-[12px] font-semibold" style={{ color: c.text }}>{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] tabular-nums" style={{ color: c.sec }}>{emp.id}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-md px-2 py-1 text-[11px] font-semibold" style={{ background: dm ? "rgba(251, 146, 60, 0.15)" : "#FFF7ED", color: dm ? "#FB923C" : "#F97316" }}>
                          Operator
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[12px] font-semibold tabular-nums" style={{ color: c.text }}>{emp.primary}</td>
                      <td className="px-4 py-4 text-[12px]" style={{ color: c.muted }}>{emp.additional}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: dm ? "#052E16" : "#DCFCE7", color: "#16A34A" }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#16A34A" }} />
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[12px]" style={{ color: c.muted }}>{emp.lastActive}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-[11px] font-semibold text-[#F97316]" style={{ border: 0, background: "none", cursor: "pointer" }}>Edit</button>
                          <span style={{ color: c.border }}>|</span>
                          <button className="text-[11px] font-semibold" style={{ border: 0, background: "none", cursor: "pointer", color: c.muted }}>Assign</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
              <span className="text-[12px]" style={{ color: c.muted }}>
                Showing {filtered.length} of {EMPLOYEES.length} employees
              </span>
            </div>
          </section>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "rgba(15,23,42,.48)" }}>
          <div
            className="w-full max-w-[580px] overflow-y-auto rounded-xl p-6"
            style={{ background: c.s, border: `1px solid ${c.border}`, boxShadow: "0 12px 30px rgba(15,23,42,.18)", maxHeight: "90vh" }}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="m-0 text-lg font-semibold">Add Employee</h2>
                <p className="mt-1 text-[12px]" style={{ color: c.muted }}>Create a new operator account and assign weighbridges.</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ border: 0, background: "none", color: c.muted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FORM_FIELDS.map(f => (
                <label key={f.label} className={f.span ? "sm:col-span-2" : ""}>
                  <span className="mb-1.5 block text-[11px] font-semibold" style={{ color: c.sec }}>{f.label}</span>
                  {f.type === "select" ? (
                    <button className="flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-xs" style={{ background: c.input, color: c.muted, border: `1px solid ${c.border}`, cursor: "pointer" }}>
                      {f.ph}<span>⌄</span>
                    </button>
                  ) : (
                    <input
                      type={f.type}
                      placeholder={f.ph}
                      className="h-10 w-full rounded-lg px-3 text-xs outline-none"
                      style={{ background: c.input, color: c.text, border: `1px solid ${c.border}` }}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setOpen(false)} className="h-10 rounded-lg px-4 text-xs font-semibold" style={{ background: c.s, color: c.sec, border: `1px solid ${c.border}`, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={() => setOpen(false)} className="h-10 rounded-lg px-4 text-xs font-bold text-white" style={{ background: "#F97316", border: 0, cursor: "pointer" }}>
                Create Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
