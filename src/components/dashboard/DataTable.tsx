import { useState } from "react";
import { 
  MoreHorizontal, 
  Plus, 
  Download, 
  Filter, 
  RefreshCw,
  Edit,
  Trash2,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Column {
  name: string;
  type: string;
  isPrimary?: boolean;
}

interface Row {
  id: number | string;
  [key: string]: any;
}

const mockColumns: Column[] = [
  { name: "id", type: "int4", isPrimary: true },
  { name: "name", type: "varchar" },
  { name: "email", type: "varchar" },
  { name: "role", type: "varchar" },
  { name: "created_at", type: "timestamp" },
  { name: "updated_at", type: "timestamp" },
];

const mockRows: Row[] = [
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
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | string | null>(null);

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
    if (selectedRows.size === mockRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(mockRows.map(r => r.id)));
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
            {mockRows.length} rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm">
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
                  checked={selectedRows.size === mockRows.length}
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
            {mockRows.map((row) => (
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
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy as JSON
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
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
        <span>Showing {mockRows.length} of {mockRows.length} rows</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
