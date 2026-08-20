import LiveWeighmentScreen from "./LiveWeighmentScreen";
import PendingWeighmentsScreen from "./PendingWeighmentsScreen";
import OperatorCompletionScreens from "./OperatorCompletionScreens";
import OperatorDashboardScreen from "./OperatorDashboardScreen";
import VehicleEntryScreen from "./VehicleEntryScreen";
import AppShell from "../components/AppShell";

export type OperatorView =
  | "operator-dashboard"
  | "vehicle-entry"
  | "live-weighment"
  | "second-weighment"
  | "ticket-preview"
  | "pending-weighments";

interface Props {
  view: OperatorView;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onNavigate: (view: OperatorView) => void;
}

export default function OperatorScreens(props: Props) {
  const renderScreen = () => {
    if (props.view === "operator-dashboard") {
      return (
        <OperatorDashboardScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    }

    if (props.view === "vehicle-entry") {
      return (
        <VehicleEntryScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    }

    if (props.view === "live-weighment") {
      return (
        <LiveWeighmentScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    }

    if (props.view === "pending-weighments") {
      return (
        <PendingWeighmentsScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    }

    return (
      <OperatorCompletionScreens
        view={props.view as any}
        darkMode={props.darkMode}
        onToggleDark={props.onToggleDark}
        onLogout={props.onLogout}
        onNavigate={props.onNavigate}
      />
    );
  };

  return (
    <AppShell
      activeView={props.view}
      userRole="operator"
      darkMode={props.darkMode}
      onToggleDark={props.onToggleDark}
      onLogout={props.onLogout}
      onNavigate={props.onNavigate as any}
    >
      {renderScreen()}
    </AppShell>
  );
}
