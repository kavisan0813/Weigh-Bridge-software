import { useState, useEffect } from "react";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import { type AdminView } from "./screens/AdminOperations";
import AdminOperations from "./components/admin/AdminOps";
import OperatorScreens, { type OperatorView } from "./screens/OperatorScreens";
import AccessDeniedScreen from "./screens/AccessDeniedScreen";
import { authService, type UserSession } from "./services/authService";

type Screen = "login" | "dashboard" | "access-denied" | AdminView | OperatorView;

// Set of Admin-only views that Operators cannot access
const ADMIN_ONLY_VIEWS = new Set([
  "dashboard",
  "monitoring",
  "detail",
  "weighbridges",
  "device-monitoring",
  "indicators",
  "cameras",
  "printers",
  "calibration",
  "billing",
  "employees",
  "auditlogs",
  "settings",
  "suppliers",
  "supplier-detail",
  "supplier-add",
  "supplier-edit",
]);

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => authService.getSession());
  const [screen, setScreen] = useState<Screen>(() => {
    const s = authService.getSession();
    if (s && s.isAuthenticated) {
      return s.role === "operator" ? "operator-dashboard" : "dashboard";
    }
    return "login";
  });
  const [darkMode, setDarkMode] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "operator" | "maintenance" | "manager">("admin");

  // Sync state if session changes
  useEffect(() => {
    const active = authService.getSession();
    setSession(active);
    if (!active || !active.isAuthenticated) {
      setScreen("login");
    } else {
      setUserRole(active.role);
    }
  }, [screen]);

  // Handle successful login from LoginScreen
  const handleLogin = (role: "admin" | "operator") => {
    const activeSession = authService.getSession();
    setSession(activeSession);
    setUserRole(activeSession?.role || role);
    setScreen(activeSession?.role === "operator" ? "operator-dashboard" : "dashboard");
  };

  // Handle Logout
  const handleLogout = () => {
    authService.clearSession();
    setSession(null);
    setUserRole("admin");
    setScreen("login");
  };

  // Handle protected navigation
  const handleNavigate = (view: string) => {
    const activeSession = authService.getSession();
    if (!activeSession || !activeSession.isAuthenticated) {
      setScreen("login");
      return;
    }
    setScreen(view as Screen);
  };

  // 1. Unauthenticated users always see LoginScreen
  if (!session || !session.isAuthenticated || screen === "login") {
    return (
      <div style={{ width: "100%", height: "100%", minHeight: "100vh" }}>
        <LoginScreen
          onLogin={handleLogin}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
        />
      </div>
    );
  }

  // 2. Role-based Protected Route enforcement for Operator
  const isOperator = userRole === "operator";
  const isAttemptingAdminOnlyRoute = isOperator && ADMIN_ONLY_VIEWS.has(screen);

  if (isAttemptingAdminOnlyRoute || screen === "access-denied") {
    return (
      <div style={{ width: "100%", height: "100%", minHeight: "100vh" }}>
        <AccessDeniedScreen
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      </div>
    );
  }

  // 3. Screen Routing
  const isOperatorScreen =
    screen === "operator-dashboard" ||
    screen === "vehicle-entry" ||
    screen === "live-weighment" ||
    screen === "second-weighment" ||
    screen === "ticket-preview" ||
    screen === "pending-weighments";

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "100vh" }}>
      {screen === "dashboard" ? (
        <DashboardScreen
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      ) : isOperatorScreen ? (
        <OperatorScreens
          view={screen as OperatorView}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          onLogout={() => setScreen("login")}
          onNavigate={(view) => setScreen(view as Screen)}
        />
      ) : (
        <AdminOperations
          view={screen as AdminView}
          userRole={userRole}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          onLogout={() => setScreen("login")}
          onNavigate={(view) => setScreen(view as Screen)}
        />
      )}
    </div>
  );
}
