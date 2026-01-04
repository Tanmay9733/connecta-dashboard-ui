import { useState, useMemo } from "react";
import { 
  MoreHorizontal, 
  Plus, 
  Download, 
  Filter, 
  RefreshCw,
  Edit,
  Trash2,
  Copy,
  Loader2,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import InsertRowDialog from "./InsertRowDialog";
import FilterDialog from "./FilterDialog";

interface Column {
  name: string;
  type: string;
  isPrimary?: boolean;
}

interface Row {
  id: number | string;
  [key: string]: any;
}

interface FilterCondition {
  column: string;
  operator: string;
  value: string;
}

const mockColumns: Column[] = [
  { name: "id", type: "int4", isPrimary: true },
  { name: "name", type: "varchar" },
  { name: "email", type: "varchar" },
  { name: "role", type: "varchar" },
  { name: "created_at", type: "timestamp" },
  { name: "updated_at", type: "timestamp" },
];

const initialMockRows: Row[] = [
  { id: 1, name: "Alice Chen", email: "alice@example.com", role: "Admin", created_at: "2024-01-15 09:24:00", updated_at: "2024-01-15 09:24:00" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", created_at: "2024-01-14 14:32:00", updated_at: "2024-01-15 08:15:00" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", role: "Editor", created_at: "2024-01-13 11:45:00", updated_at: "2024-01-14 16:20:00" },
  { id: 4, name: "David Wilson", email: "david@example.com", role: "User", created_at: "2024-01-12 08:30:00", updated_at: "2024-01-12 08:30:00" },
  { id: 5, name: "Emma Brown", email: "emma@example.com", role: "Admin", created_at: "2024-01-11 17:22:00", updated_at: "2024-01-13 10:45:00" },
  { id: 6, name: "Frank Miller", email: "frank@example.com", role: "User", created_at: "2024-01-10 13:15:00", updated_at: "2024-01-10 13:15:00" },
];

interface DataTableProps {
  tableName: string;
}

const DataTable = ({ tableName }: DataTableProps) => {
  const [rows, setRows] = useState<Row[]>(initialMockRows);
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Apply filters and search
  const filteredRows = useMemo(() => {
    let result = [...rows];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    // Apply filters
    filters.forEach(filter => {
      result = result.filter(row => {
        const value = String(row[filter.column] || "").toLowerCase();
        const filterValue = filter.value.toLowerCase();

        switch (filter.operator) {
          case "equals":
            return value === filterValue;
          case "contains":
            return value.includes(filterValue);
          case "startsWith":
            return value.startsWith(filterValue);
          case "endsWith":
            return value.endsWith(filterValue);
          case "gt":
            return parseFloat(value) > parseFloat(filterValue);
          case "lt":
            return parseFloat(value) < parseFloat(filterValue);
          default:
            return true;
        }
      });
    });

    return result;
  }, [rows, searchQuery, filters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRefreshing(false);
    toast.success("Data refreshed!");
  };

  const handleExport = () => {
    const data = JSON.stringify(filteredRows, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName.split("-").pop()}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const handleInsertRow = (newRow: Record<string, any>) => {
    setRows([newRow as Row, ...rows]);
  };

  const handleDeleteRow = (id: number | string) => {
    setRows(rows.filter(r => r.id !== id));
    selectedRows.delete(id);
    setSelectedRows(new Set(selectedRows));
    toast.success("Row deleted!");
  };

  const handleCopyRow = (row: Row) => {
    navigator.clipboard.writeText(JSON.stringify(row, null, 2));
    toast.success("Copied to clipboard!");
  };

  const toggleRowSelection = (id: number | string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredRows.map(r => r.id)));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "int4":
      case "int8":
        return "text-blue-400";
      case "varchar":
      case "text":
        return "text-green-400";
      case "timestamp":
      case "date":
        return "text-amber-400";
      case "boolean":
        return "text-purple-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">{tableName.split("-").pop()}</h2>
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
            {filteredRows.length} rows
          </span>
          {filters.length > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-xs font-medium">
              {filters.length} filter{filters.length > 1 ? "s" : ""} active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-48"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {filters.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                {filters.length}
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm" onClick={() => setInsertDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Insert Row
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={filteredRows.length > 0 && selectedRows.size === filteredRows.length}
                  onChange={toggleAllRows}
                  className="rounded border-border"
                />
              </th>
              {mockColumns.map((col) => (
                <th 
                  key={col.name} 
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <span>{col.name}</span>
                    {col.isPrimary && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold">
                        PK
                      </span>
                    )}
                    <span className={cn("text-xs", getTypeColor(col.type))}>
                      {col.type}
                    </span>
                  </div>
                </th>
              ))}
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr 
                key={row.id}
                className={cn(
                  "border-t border-border transition-colors",
                  selectedRows.has(row.id) ? "bg-primary/5" : "hover:bg-muted/30"
                )}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => toggleRowSelection(row.id)}
                    className="rounded border-border"
                  />
                </td>
                {mockColumns.map((col) => (
                  <td key={col.name} className="px-4 py-3">
                    {col.isPrimary ? (
                      <span className="font-mono text-primary">{row[col.name]}</span>
                    ) : col.type === "timestamp" ? (
                      <span className="text-muted-foreground font-mono text-xs">
                        {row[col.name]}
                      </span>
                    ) : (
                      <span>{row[col.name]}</span>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn(
                        "p-1 rounded hover:bg-muted transition-opacity",
                        hoveredRow === row.id ? "opacity-100" : "opacity-0"
                      )}>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Row
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyRow(row)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy as JSON
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Row
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredRows.length} of {rows.length} rows</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <InsertRowDialog
        open={insertDialogOpen}
        onOpenChange={setInsertDialogOpen}
        columns={mockColumns}
        onInsert={handleInsertRow}
      />
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        columns={mockColumns}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
};

export default DataTable;
