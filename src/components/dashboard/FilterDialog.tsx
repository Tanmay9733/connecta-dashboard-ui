import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface Column {
  name: string;
  type: string;
}

interface FilterCondition {
  column: string;
  operator: string;
  value: string;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Column[];
  onApplyFilters: (filters: FilterCondition[]) => void;
  currentFilters: FilterCondition[];
}

const operators = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "startsWith", label: "Starts with" },
  { value: "endsWith", label: "Ends with" },
  { value: "gt", label: "Greater than" },
  { value: "lt", label: "Less than" },
];

const FilterDialog = ({ open, onOpenChange, columns, onApplyFilters, currentFilters }: FilterDialogProps) => {
  const [filters, setFilters] = useState<FilterCondition[]>(
    currentFilters.length > 0 ? currentFilters : [{ column: columns[0]?.name || "", operator: "contains", value: "" }]
  );

  const addFilter = () => {
    setFilters([...filters, { column: columns[0]?.name || "", operator: "contains", value: "" }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof FilterCondition, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleApply = () => {
    const validFilters = filters.filter(f => f.value.trim() !== "");
    onApplyFilters(validFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setFilters([{ column: columns[0]?.name || "", operator: "contains", value: "" }]);
    onApplyFilters([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Filter Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label>Column</Label>
                <Select value={filter.column} onValueChange={(v) => updateFilter(index, "column", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.name} value={col.name}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>Operator</Label>
                <Select value={filter.operator} onValueChange={(v) => updateFilter(index, "operator", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>Value</Label>
                <Input
                  value={filter.value}
                  onChange={(e) => updateFilter(index, "value", e.target.value)}
                  placeholder="Enter value..."
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFilter(index)}
                disabled={filters.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addFilter}>
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={handleClear}>
            Clear All
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
