import { type ReactNode } from "react";
import { Button } from "./Button";

export interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  darkMode?: boolean;
  onToggleDark?: () => void;
  userRole?: string;
  userName?: string;
  weighbridgeId?: string;
  actions?: ReactNode;
}

export function Header({
  title,
  subtitle,
  breadcrumb = "Overview",
  darkMode = false,
  onToggleDark,
  userRole = "Administrator",
  userName = "System Operator",
  weighbridgeId,
  actions,
}: HeaderProps) {
  const bg = darkMode ? "bg-[#1F2937]" : "bg-white";
  const borderColor = darkMode ? "border-[#374151]" : "border-[#E5E7EB]";

  return (
    <header
      className={`h-[64px] min-h-[64px] px-6 border-b ${borderColor} ${bg} flex items-center justify-between sticky top-0 z-30 font-sans shadow-xs`}
    >
      {/* Title & Breadcrumb */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
          <span>Software</span>
          <span>/</span>
          <span className="text-[#F97316] font-semibold">{breadcrumb}</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className={`text-base font-bold tracking-tight ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
            {title}
          </h1>
          {subtitle && (
            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} hidden sm:inline`}>
              — {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {weighbridgeId && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-xs font-semibold text-[#F97316]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Active: {weighbridgeId}</span>
          </div>
        )}

        {actions}

        {onToggleDark && (
          <Button
            variant="icon"
            size="sm"
            onClick={onToggleDark}
            darkMode={darkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </Button>
        )}

        {/* User Info */}
        <div className={`flex items-center gap-2.5 pl-3 border-l ${borderColor}`}>
          <div className="w-8 h-8 rounded-full bg-[#C99A2E]/20 text-[#C99A2E] border border-[#C99A2E]/40 font-bold flex items-center justify-center text-xs">
            {userName.charAt(0)}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className={`text-xs font-bold leading-none ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
              {userName}
            </span>
            <span className="text-[10px] font-semibold text-[#F97316] mt-0.5 uppercase tracking-wide">
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
