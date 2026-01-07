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
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Save
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
  { name: "questionList", type: "json" },
  { name: "created_at", type: "timestamp" },
];

// Question list data as shown in user's example
const questionListData = [
  {
    question: "What are the key differences between `==` and `===` in JavaScript?",
    type: "Technical"
  },
  {
    question: "Explain the concept of 'closures' in JavaScript and provide a simple example.",
    type: "Technical"
  },
  {
    question: "Describe your experience with React.js. What are some of the key features you've utilized, and what are some common challenges you've faced?",
    type: "Experience"
  },
  {
    question: "Briefly explain how Express.js middleware works and give an example of a custom middleware you've created or used.",
    type: "Technical"
  },
  {
    question: "In a situation where a React component is not re-rendering as expected, what debugging steps would you take?",
    type: "Problem Solving"
  }
];

const initialMockRows: Row[] = [
  { id: 1, questionList: questionListData, created_at: "2024-01-15 09:24:00" },
  { id: 2, questionList: questionListData.slice(0, 3), created_at: "2024-01-14 14:32:00" },
  { id: 3, questionList: questionListData.slice(2, 5), created_at: "2024-01-13 11:45:00" },
];

interface DataTableProps {
  tableName: string;
}

const ROWS_PER_PAGE = 10;

const DataTable = ({ tableName }: DataTableProps) => {
  const [rows, setRows] = useState<Row[]>(initialMockRows);
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

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

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredRows.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredRows, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const toggleCellExpanded = (rowId: number | string, colName: string) => {
    const key = `${rowId}-${colName}`;
    const newExpanded = new Set(expandedCells);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCells(newExpanded);
  };

  const renderCellValue = (row: Row, col: Column) => {
    const value = row[col.name];
    const isExpanded = expandedCells.has(`${row.id}-${col.name}`);
    
    // Handle JSON/Array data
    if (col.type === "json" || Array.isArray(value) || (typeof value === "object" && value !== null)) {
      const jsonString = JSON.stringify(value);
      const isLongContent = jsonString.length > 50;
      
      return (
        <div className="relative">
          <button
            onClick={() => toggleCellExpanded(row.id, col.name)}
            className="flex items-start gap-1 text-left w-full group"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
            )}
            <span className="font-mono text-xs text-cyan-400">{col.name}</span>
            <span className="text-muted-foreground ml-1">json</span>
          </button>
          
          {isExpanded ? (
            <div className="mt-2 rounded-lg bg-[#1a1f2e] border border-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
                <span className="font-mono text-xs text-muted-foreground">{col.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(JSON.stringify(value, null, 2));
                      toast.success("Copied to clipboard!");
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save changes
                  </Button>
                </div>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto max-h-80 overflow-y-auto">
                <code className="text-foreground">
                  {JSON.stringify(value, null, 2).split('\n').map((line, i) => (
                    <div key={i} className="leading-relaxed">
                      <span className="text-muted-foreground select-none mr-4 inline-block w-4 text-right">{i + 1}</span>
                      {line.split(/(".*?":)|(".*?")|(\d+)|(\[|\]|\{|\}|,)/g).map((part, j) => {
                        if (!part) return null;
                        if (part.match(/^".*":$/)) {
                          return <span key={j} className="text-purple-400">{part}</span>;
                        }
                        if (part.match(/^".*"$/)) {
                          return <span key={j} className="text-green-400">{part}</span>;
                        }
                        if (part.match(/^\d+$/)) {
                          return <span key={j} className="text-amber-400">{part}</span>;
                        }
                        if (part.match(/[\[\]\{\},]/)) {
                          return <span key={j} className="text-muted-foreground">{part}</span>;
                        }
                        return <span key={j}>{part}</span>;
                      })}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          ) : (
            <div 
              className="mt-1 ml-5 font-mono text-xs text-amber-400/80 truncate max-w-md cursor-pointer hover:text-amber-400"
              onClick={() => toggleCellExpanded(row.id, col.name)}
            >
              {isLongContent ? jsonString.slice(0, 60) + "..." : jsonString}
            </div>
          )}
        </div>
      );
    }
    
    // Regular values
    if (col.isPrimary) {
      return <span className="font-mono text-primary">{value}</span>;
    }
    if (col.type === "timestamp") {
      return <span className="text-muted-foreground font-mono text-xs">{value}</span>;
    }
    return <span>{value}</span>;
  };

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
            {paginatedRows.map((row) => (
              <tr 
                key={row.id}
                className={cn(
                  "border-t border-border transition-colors align-top",
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
                    {renderCellValue(row, col)}
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

      {/* Footer with Pagination */}
      <div className="px-6 py-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1} to {Math.min(currentPage * ROWS_PER_PAGE, filteredRows.length)} of {filteredRows.length} rows
        </span>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-md text-xs font-medium transition-colors",
                    currentPage === pageNum
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
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
