import { useState } from "react";
import {
  Database,
  Table,
  Plus,
  ChevronRight,
  Search,
  Settings2,
  LifeBuoy,
  Send,
  Command,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface AppSidebarProps {
  selectedTable: string | null;
  onSelectTable: (table: string) => void;
  onAddConnection: () => void;
  onCreateTable: () => void;
}

export function AppSidebar({
  selectedTable,
  onSelectTable,
  onAddConnection,
  onCreateTable,
}: AppSidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<string[]>(["1"]);
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const formatRowCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">DBConnect</span>
                  <span className="truncate text-xs text-muted-foreground">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Create Table Button - Above sidebar content */}
        {!isCollapsed && (
          <Button
            onClick={onCreateTable}
            className="w-full mt-2 gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Create Table
          </Button>
        )}
        {isCollapsed && (
          <Button
            onClick={onCreateTable}
            size="icon"
            variant="outline"
            className="w-full mt-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 bg-sidebar-accent border-0"
              />
            </div>
          </div>
        )}

        {/* Databases Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Databases</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockProjects.map((project) => (
                <Collapsible
                  key={project.id}
                  open={expandedProjects.includes(project.id)}
                  onOpenChange={() => toggleProject(project.id)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={project.name}>
                        <div className={cn("w-2 h-2 rounded-full shrink-0", dbTypeColors[project.type])} />
                        <span className="truncate">{project.name}</span>
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenu className="ml-4 border-l border-sidebar-border pl-2">
                        {project.tables
                          .filter((table) =>
                            table.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((table) => (
                            <SidebarMenuItem key={table.name}>
                              <SidebarMenuButton
                                onClick={() => onSelectTable(`${project.id}-${table.name}`)}
                                isActive={selectedTable === `${project.id}-${table.name}`}
                                tooltip={table.name}
                              >
                                <Table className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{table.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {formatRowCount(table.rowCount)}
                                </span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Nav */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <a href="#">
                    <Settings2 className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Support">
                  <a href="#">
                    <LifeBuoy className="h-4 w-4" />
                    <span>Support</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Feedback">
                  <a href="#">
                    <Send className="h-4 w-4" />
                    <span>Feedback</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Add Connection */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onAddConnection} tooltip="Add Connection">
              <Plus className="h-4 w-4" />
              <span>Add Connection</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
