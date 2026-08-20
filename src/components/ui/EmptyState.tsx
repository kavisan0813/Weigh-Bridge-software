import { type ReactNode } from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  darkMode?: boolean;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  darkMode = false,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center mb-4 border border-[#F97316]/20">
        {icon || (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className={`text-base font-bold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
        {title}
      </h3>
      {description && (
        <p className={`text-xs max-w-sm mt-1 mb-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} darkMode={darkMode}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
