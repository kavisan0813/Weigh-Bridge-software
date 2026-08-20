import MasterSidebar, { type SidebarProps as MasterSidebarProps } from "../Sidebar";

export interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface SidebarProps {
  items?: NavItem[];
  activeKey?: string;
  activeView?: string;
  onNavigate: (key: any) => void;
  darkMode?: boolean;
  userRole?: "admin" | "operator" | "maintenance" | "manager";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
}

export function Sidebar(props: SidebarProps) {
  const activeView = props.activeView || props.activeKey || "dashboard";
  return (
    <MasterSidebar
      activeView={activeView}
      userRole={props.userRole || "admin"}
      darkMode={props.darkMode}
      collapsed={props.collapsed}
      onToggleCollapse={props.onToggleCollapse}
      onNavigate={props.onNavigate}
    />
  );
}

export default Sidebar;
