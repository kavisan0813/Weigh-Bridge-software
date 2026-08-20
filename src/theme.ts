/**
 * Master Design System — Final Version Tokens
 * Weighbridge Management Software
 */

export interface ThemePalette {
  bg: string;
  surface: string;
  elevated: string;
  text: string;
  secondaryText: string;
  mutedText: string;
  border: string;
  divider: string;
  inputBg: string;
  disabledBg: string;

  // Primary — Soft Orange
  primaryOrange: string;
  primaryOrangeHover: string;
  primaryOrangePressed: string;
  primaryOrangeSoft: string;
  primaryOrangeLight: string;

  // Secondary — Gold & Deep Navy
  secondaryGold: string;
  secondaryGoldDark: string;
  secondaryGoldHover: string;
  secondaryGoldSoft: string;
  secondaryGoldLight: string;

  // Sidebar
  sidebarBg: string;
  sidebarText: string;
  sidebarBorder: string;

  // Status Colors (Icon + Text + Color)
  statusSuccess: string;
  statusWarning: string;
  statusError: string;
  statusInfo: string;
  statusProcessing: string;
  statusNeutral: string;
}

export function getPalette(darkMode: boolean): ThemePalette {
  if (darkMode) {
    return {
      bg: "#111827",
      surface: "#1F2937",
      elevated: "#273449",
      text: "#F9FAFB",
      secondaryText: "#D1D5DB",
      mutedText: "#9CA3AF",
      border: "#374151",
      divider: "#374151",
      inputBg: "#111827",
      disabledBg: "#1F2937",

      primaryOrange: "#FB923C",
      primaryOrangeHover: "#F97316",
      primaryOrangePressed: "#EA580C",
      primaryOrangeSoft: "#273449",
      primaryOrangeLight: "#FFF7ED",

      secondaryGold: "#D4A83A",
      secondaryGoldDark: "#8C6415",
      secondaryGoldHover: "#C99A2E",
      secondaryGoldSoft: "#422F0A",
      secondaryGoldLight: "#5A430E",

      sidebarBg: "#1F2937",
      sidebarText: "#F9FAFB",
      sidebarBorder: "#374151",

      statusSuccess: "#16A34A",
      statusWarning: "#F59E0B",
      statusError: "#DC2626",
      statusInfo: "#2563EB",
      statusProcessing: "#8B5CF6",
      statusNeutral: "#64748B",
    };
  }

  return {
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    elevated: "#FFFFFF",
    text: "#111827",
    secondaryText: "#4B5563",
    mutedText: "#6B7280",
    border: "#E5E7EB",
    divider: "#F1F5F9",
    inputBg: "#FFFFFF",
    disabledBg: "#F1F5F9",

    primaryOrange: "#F97316",
    primaryOrangeHover: "#EA580C",
    primaryOrangePressed: "#C2410C",
    primaryOrangeSoft: "#FFF7ED",
    primaryOrangeLight: "#FFEDD5",

    secondaryGold: "#C99A2E",
    secondaryGoldDark: "#8C6415",
    secondaryGoldHover: "#A97C1F",
    secondaryGoldSoft: "#FFFBEB",
    secondaryGoldLight: "#FEF3C7",

    sidebarBg: "#FFFFFF",
    sidebarText: "#111827",
    sidebarBorder: "#E5E7EB",

    statusSuccess: "#16A34A",
    statusWarning: "#F59E0B",
    statusError: "#DC2626",
    statusInfo: "#2563EB",
    statusProcessing: "#8B5CF6",
    statusNeutral: "#64748B",
  };
}
