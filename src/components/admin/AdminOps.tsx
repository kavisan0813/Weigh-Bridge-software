import TransactionDetailScreen from "@/screens/TransactionDetailScreen";
import WeighbridgeDetailScreen from "@/screens/WeighbridgeDetailScreen";
import TransactionsScreen from "@/screens/TransactionsScreen";
import VehicleManagementScreen from "@/screens/VehicleManagementScreen";
import VehicleDetailScreen from "@/screens/VehicleDetailScreen";
import VehicleFormScreen from "@/screens/VehicleFormScreen";
import DriverManagementScreen from "@/screens/DriverManagementScreen";
import DriverFormScreen from "@/screens/DriverFormScreen";
import DriverDetailScreen from "@/screens/DriverDetailScreen";
import CustomerDetailScreen from "@/screens/CustomerDetailScreen";
import CustomerFormScreen from "@/screens/CustomerFormScreen";
import CustomerManagementScreen from "@/screens/CustomerManagementScreen";
import MaterialDetailScreen from "@/screens/MaterialDetailScreen";
import MaterialFormScreen from "@/screens/MaterialFormScreen";
import MaterialManagementScreen from "@/screens/MaterialManagementScreen";
import SupplierDetailScreen from "@/screens/SupplierDetailScreen";
import SupplierFormScreen from "@/screens/SupplierFormScreen";
import SupplierManagementScreen from "@/screens/SupplierManagementScreen";
import TicketDetailScreen from "@/screens/TicketDetailScreen";
import TicketManagementScreen from "@/screens/TicketManagementScreen";
import AlertsCenterScreen from "@/screens/AlertsCenterScreen";
import BillingScreen from "@/screens/BillingScreen";
import EmployeeManagementScreen from "@/screens/EmployeeManagementScreen";
import ReportsScreen from "@/screens/ReportsScreen";
import AuditLogsScreen from "@/screens/AuditLogsScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import {
  AdminOperationsProps,
  Monitoring,
  Shell,
} from "@/screens/AdminOperations";

export default function AdminOperations(props: AdminOperationsProps) {
  const renderContent = () => {
    if (props.view === "monitoring") return <Monitoring {...props} />;
    if (props.view === "detail")
      return (
        <WeighbridgeDetailScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "transaction-detail")
      return (
        <TransactionDetailScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "vehicle-detail")
      return (
        <VehicleDetailScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "vehicle-add")
      return (
        <VehicleFormScreen
          mode="add"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "vehicle-edit")
      return (
        <VehicleFormScreen
          mode="edit"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "vehicles")
      return (
        <VehicleManagementScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "drivers")
      return (
        <DriverManagementScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "driver-detail")
      return (
        <DriverDetailScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "driver-add")
      return (
        <DriverFormScreen
          mode="add"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "driver-edit")
      return (
        <DriverFormScreen
          mode="edit"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "customers")
      return (
        <CustomerManagementScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "customer-detail")
      return (
        <CustomerDetailScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "customer-add")
      return (
        <CustomerFormScreen
          mode="add"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "customer-edit")
      return (
        <CustomerFormScreen
          mode="edit"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "suppliers")
      return (
        <SupplierManagementScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "supplier-detail")
      return (
        <SupplierDetailScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "supplier-add")
      return (
        <SupplierFormScreen
          mode="add"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "supplier-edit")
      return (
        <SupplierFormScreen
          mode="edit"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "materials")
      return (
        <MaterialManagementScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "material-detail")
      return (
        <MaterialDetailScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "material-add")
      return (
        <MaterialFormScreen
          mode="add"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "material-edit")
      return (
        <MaterialFormScreen
          mode="edit"
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "tickets")
      return (
        <TicketManagementScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "ticket-detail")
      return (
        <TicketDetailScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "alerts")
      return (
        <AlertsCenterScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "billing")
      return (
        <BillingScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "employees")
      return (
        <EmployeeManagementScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "reports")
      return (
        <ReportsScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "auditlogs")
      return (
        <AuditLogsScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    if (props.view === "settings")
      return (
        <SettingsScreen
          darkMode={props.darkMode}
          onToggleDark={props.onToggleDark}
          onLogout={props.onLogout}
          onNavigate={props.onNavigate}
        />
      );
    return (
      <TransactionsScreen
        darkMode={props.darkMode}
        onToggleDark={props.onToggleDark}
        onLogout={props.onLogout}
        onNavigate={props.onNavigate}
      />
    );
  };

  // If view is monitoring, Monitoring component already contains its own internal layout structure if needed,
  // but wrapping all views in Shell guarantees persistent AppShell.
  if (props.view === "monitoring")
    return <Shell {...props}>{renderContent()}</Shell>;

  return <Shell {...props}>{renderContent()}</Shell>;
}
