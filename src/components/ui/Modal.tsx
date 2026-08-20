import { type ReactNode, useEffect } from "react";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  darkMode?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  darkMode = false,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let widthClass = "max-w-md";
  if (size === "sm") widthClass = "max-w-sm";
  if (size === "lg") widthClass = "max-w-2xl";
  if (size === "xl") widthClass = "max-w-4xl";
  if (size === "full") widthClass = "max-w-6xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${widthClass} rounded-2xl border shadow-xl transition-all z-10 flex flex-col max-h-[90vh] ${
          darkMode
            ? "bg-wb-dark-surface border-wb-dark-border"
            : "bg-white border-wb-border"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-wb-dark-border" : "border-wb-border"}`}
        >
          <h2
            className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}
          >
            {title}
          </h2>
          <Button
            variant="icon"
            size="sm"
            onClick={onClose}
            darkMode={darkMode}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${darkMode ? "border-wb-dark-border bg-[#111827]/50" : "border-wb-border bg-gray-50/70"}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  darkMode?: boolean;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  darkMode = false,
}: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md flex flex-col border-l shadow-2xl z-10 ${
            darkMode
              ? "bg-wb-dark-surface border-wb-dark-border"
              : "bg-white border-wb-border"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-wb-dark-border" : "border-wb-border"}`}
          >
            <h2
              className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}
            >
              {title}
            </h2>
            <Button
              variant="icon"
              size="sm"
              onClick={onClose}
              darkMode={darkMode}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div
              className={`p-4 border-t flex items-center justify-end gap-2 ${darkMode ? "border-wb-dark-border bg-[#111827]/50" : "border-wb-border bg-gray-50"}`}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  darkMode?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  darkMode = false,
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative w-full rounded-t-2xl border-t p-5 max-h-[85vh] overflow-y-auto z-10 shadow-2xl ${
          darkMode
            ? "bg-wb-dark-surface border-wb-dark-border"
            : "bg-white border-wb-border"
        }`}
      >
        <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4" />
        {title && (
          <div
            className={`text-base font-bold mb-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}
          >
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
