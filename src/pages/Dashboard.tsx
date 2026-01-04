import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DataTable from "@/components/dashboard/DataTable";
import EmptyState from "@/components/dashboard/EmptyState";

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <DashboardSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedTable ? (
            <DataTable tableName={selectedTable} />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
