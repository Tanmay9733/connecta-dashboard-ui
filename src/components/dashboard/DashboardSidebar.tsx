import { useState } from "react";
import { 
  Database, 
  Table, 
  Settings, 
  Plus, 
  ChevronRight,
  ChevronDown,
  Search,
  Folder
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TableItem {
  name: string;
  rowCount: number;
}

interface Project {
  id: string;
  name: string;
  type: "postgresql" | "mongodb" | "supabase" | "neondb" | "firebase";
  tables: TableItem[];
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Production DB",
    type: "postgresql",
    tables: [
      { name: "users", rowCount: 15420 },
      { name: "products", rowCount: 3891 },
      { name: "orders", rowCount: 28543 },
      { name: "sessions", rowCount: 102847 },
      { name: "analytics", rowCount: 584729 },
    ],
  },
  {
    id: "2",
    name: "Analytics Store",
    type: "mongodb",
    tables: [
      { name: "events", rowCount: 1284729 },
      { name: "metrics", rowCount: 48291 },
    ],
  },
];

const dbTypeColors: Record<string, string> = {
  postgresql: "bg-blue-500",
  mongodb: "bg-green-500",
  supabase: "bg-emerald-500",
  neondb: "bg-cyan-500",
  firebase: "bg-orange-500",
};

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  selectedTable: string | null;
  onSelectTable: (table: string) => void;
}

const DashboardSidebar = ({ 
  isCollapsed, 
  onToggle, 
  selectedTable, 
  onSelectTable 
}: DashboardSidebarProps) => {
  const [expandedProjects, setExpandedProjects] = useState<string[]>(["1"]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const formatRowCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <aside 
      className={cn(
        "h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-sidebar-primary" />
              <span className="font-semibold text-sm">Databases</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              !isCollapsed && "rotate-180"
            )} />
          </button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sidebar-accent rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
            />
          </div>
        </div>
      )}

      {/* Projects & Tables */}
      <div className="flex-1 overflow-y-auto py-2">
        {mockProjects.map((project) => (
          <div key={project.id} className="mb-2">
            {/* Project Header */}
            <button
              onClick={() => toggleProject(project.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-sidebar-accent transition-colors",
                isCollapsed && "justify-center"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full", dbTypeColors[project.type])} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate font-medium">
                    {project.name}
                  </span>
                  {expandedProjects.includes(project.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </>
              )}
            </button>

            {/* Tables */}
            {!isCollapsed && expandedProjects.includes(project.id) && (
              <div className="ml-4 border-l border-sidebar-border">
                {project.tables
                  .filter(table => 
                    table.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((table) => (
                    <button
                      key={table.name}
                      onClick={() => onSelectTable(`${project.id}-${table.name}`)}
                      className={cn(
                        "w-full flex items-center gap-2 pl-4 pr-3 py-2 text-sm transition-colors",
                        selectedTable === `${project.id}-${table.name}`
                          ? "bg-sidebar-primary/10 text-sidebar-primary border-l-2 border-sidebar-primary -ml-px"
                          : "hover:bg-sidebar-accent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Table className="h-3.5 w-3.5" />
                      <span className="flex-1 text-left truncate">{table.name}</span>
                      <span className="text-xs opacity-60">{formatRowCount(table.rowCount)}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Connection Button */}
      {!isCollapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-sm font-medium">
            <Plus className="h-4 w-4" />
            Add Connection
          </button>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
