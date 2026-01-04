import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DataTable from "@/components/dashboard/DataTable";
import EmptyState from "@/components/dashboard/EmptyState";
import AddConnectionDialog from "@/components/dashboard/AddConnectionDialog";

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [addConnectionOpen, setAddConnectionOpen] = useState(false);

  const handleAddConnection = (connection: { name: string; type: string; url: string }) => {
    console.log("New connection:", connection);
    // In a real app, this would save to backend
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <DashboardSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          onAddConnection={() => setAddConnectionOpen(true)}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedTable ? (
            <DataTable tableName={selectedTable} />
          ) : (
            <EmptyState onAddConnection={() => setAddConnectionOpen(true)} />
          )}
        </main>
      </div>

      <AddConnectionDialog
        open={addConnectionOpen}
        onOpenChange={setAddConnectionOpen}
        onAdd={handleAddConnection}
      />
    </div>
  );
};

export default Dashboard;
