import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import { type AdminView } from "./screens/AdminOperations";
import AdminOperations from "./components/admin/AdminOps";
import OperatorScreens, { type OperatorView } from "./screens/OperatorScreens";

type Screen = "login" | "dashboard" | AdminView | OperatorView;

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [darkMode, setDarkMode] = useState(false);
  const [userRole, setUserRole] = useState<
    "admin" | "operator" | "maintenance" | "manager"
  >("admin");

  const isOperatorScreen =
    screen === "operator-dashboard" ||
    screen === "vehicle-entry" ||
    screen === "live-weighment" ||
    screen === "second-weighment" ||
    screen === "ticket-preview" ||
    screen === "pending-weighments";

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "100vh" }}>
      {screen === "login" ? (
        <LoginScreen
          onLogin={(role) => {
            setUserRole(role);
            setScreen(role === "operator" ? "operator-dashboard" : "dashboard");
          }}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
        />
      ) : screen === "dashboard" ? (
        <DashboardScreen
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          onLogout={() => setScreen("login")}
          onNavigate={(view) => setScreen(view as Screen)}
        />
      ) : isOperatorScreen ? (
        <OperatorScreens
          view={screen as OperatorView}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          onLogout={() => setScreen("login")}
          onNavigate={(view: string) => setScreen(view as Screen)}
        />
      ) : (
        <AdminOperations
          view={screen as AdminView}
          userRole={userRole}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          onLogout={() => setScreen("login")}
          onNavigate={(view: string) => setScreen(view as Screen)}
        />
      )}
    </div>
  );
}
