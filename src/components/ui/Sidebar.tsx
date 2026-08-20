import { type ReactNode } from "react";

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
}

export interface SidebarProps {
  items: NavItem[];
  activeKey: string;
  onNavigate: (key: any) => void;
  darkMode?: boolean;
  onLogout?: () => void;
}

export function Sidebar({ items, activeKey, onNavigate, darkMode = false, onLogout }: SidebarProps) {
  const sidebarBg = darkMode ? "bg-[#111827]" : "bg-white";
  const borderColor = darkMode ? "border-[#374151]" : "border-[#E5E7EB]";

  return (
    <aside
      className={`w-[248px] min-w-[248px] h-screen sticky top-0 flex flex-col ${sidebarBg} border-r ${borderColor} overflow-y-auto z-40 shrink-0 font-sans`}
    >
      {/* Brand Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${borderColor}`}>
        <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-md font-bold flex-shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.5.83 2.8 2 3.46V10H7l-2 12h14L17 10h-4V8.46A3.5 3.5 0 0 0 15 5a3 3 0 0 0-3-3z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-widest text-[#F97316] leading-none uppercase">
            WEIGHBRIDGE
          </span>
          <span className="text-[11px] text-gray-500 font-medium mt-0.5">
            Management Suite
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2.5 space-y-1">
        {items.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? darkMode
                    ? "bg-[#FB923C]/15 text-[#FB923C] border border-[#FB923C]/30 font-bold"
                    : "bg-[#F97316] text-white shadow-sm font-bold"
                  : darkMode
                  ? "text-gray-300 hover:bg-[#273449] hover:text-white"
                  : "text-gray-700 hover:bg-[#FFF7ED] hover:text-[#F97316]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 flex items-center justify-center ${isActive ? (darkMode ? "text-[#FB923C]" : "text-white") : (darkMode ? "text-[#D4A83A]" : "text-[#C99A2E]")}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-white text-[#F97316]" : "bg-[#C99A2E]/20 text-[#C99A2E]"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      {onLogout && (
        <div className={`p-3 border-t ${borderColor}`}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
