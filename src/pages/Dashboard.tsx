import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import EmptyState from "@/components/dashboard/EmptyState";
import AddConnectionDialog from "@/components/dashboard/AddConnectionDialog";
import CreateTableDialog from "@/components/dashboard/CreateTableDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [addConnectionOpen, setAddConnectionOpen] = useState(false);
  const [createTableOpen, setCreateTableOpen] = useState(false);

  const handleAddConnection = (connection: { name: string; type: string; url: string }) => {
    console.log("New connection:", connection);
  };

  const handleCreateTable = (tableName: string, columns: { name: string; type: string; nullable: boolean }[]) => {
    console.log("Create table:", tableName, columns);
    // In a real app, this would create the table in the database
  };

  const getTableDisplayName = () => {
    if (!selectedTable) return null;
    const parts = selectedTable.split("-");
    return parts.length > 1 ? parts[1] : selectedTable;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          onAddConnection={() => setAddConnectionOpen(true)}
          onCreateTable={() => setCreateTableOpen(true)}
        />

        <SidebarInset className="flex flex-col flex-1">
          {/* Header with breadcrumb */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {selectedTable && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{getTableDisplayName()}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {selectedTable ? (
              <DataTable tableName={selectedTable} />
            ) : (
              <EmptyState onAddConnection={() => setAddConnectionOpen(true)} />
            )}
          </main>
        </SidebarInset>
      </div>

      <AddConnectionDialog
        open={addConnectionOpen}
        onOpenChange={setAddConnectionOpen}
        onAdd={handleAddConnection}
      />

      <CreateTableDialog
        open={createTableOpen}
        onOpenChange={setCreateTableOpen}
        onCreate={handleCreateTable}
      />
    </SidebarProvider>
  );
};

export default Dashboard;
