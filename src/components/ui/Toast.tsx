export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
  darkMode?: boolean;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  let colors = "bg-blue-600 text-white";
  let icon = (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4m0-4h.01" />
    </svg>
  );

  if (type === "success") {
    colors = "bg-[#16A34A] text-white";
    icon = (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    );
  } else if (type === "error") {
    colors = "bg-[#DC2626] text-white";
    icon = (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  } else if (type === "warning") {
    colors = "bg-[#F59E0B] text-white";
    icon = (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl transition-all ${colors}`}
    >
      {icon}
      <span className="text-sm font-semibold">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
