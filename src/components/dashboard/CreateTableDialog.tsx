import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

interface CreateTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (tableName: string, columns: Column[]) => void;
}

const columnTypes = [
  "TEXT",
  "INTEGER",
  "BOOLEAN",
  "TIMESTAMP",
  "UUID",
  "JSON",
  "FLOAT",
  "DATE",
];

const CreateTableDialog = ({ open, onOpenChange, onCreate }: CreateTableDialogProps) => {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<Column[]>([
    { name: "id", type: "UUID", nullable: false },
    { name: "created_at", type: "TIMESTAMP", nullable: false },
  ]);

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "TEXT", nullable: true }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof Column, value: string | boolean) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], [field]: value };
    setColumns(updated);
  };

  const handleCreate = () => {
    if (tableName.trim() && columns.length > 0) {
      onCreate(tableName, columns);
      setTableName("");
      setColumns([
        { name: "id", type: "UUID", nullable: false },
        { name: "created_at", type: "TIMESTAMP", nullable: false },
      ]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
          <DialogDescription>
            Define your table name and columns. Click create when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              placeholder="e.g., users, products, orders"
              value={tableName}
              onChange={(e) => setTableName(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Columns</Label>
              <Button variant="outline" size="sm" onClick={addColumn}>
                <Plus className="h-4 w-4 mr-1" />
                Add Column
              </Button>
            </div>

            <div className="space-y-2">
              {columns.map((column, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Input
                    placeholder="Column name"
                    value={column.name}
                    onChange={(e) => updateColumn(index, "name", e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                    className="flex-1"
                  />
                  <Select
                    value={column.type}
                    onValueChange={(value) => updateColumn(index, "type", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColumn(index)}
                    disabled={columns.length <= 1}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!tableName.trim()}>
            Create Table
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTableDialog;
