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
import { toast } from "sonner";

interface Column {
  name: string;
  type: string;
  isPrimary?: boolean;
}

interface InsertRowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Column[];
  onInsert: (row: Record<string, any>) => void;
}

const InsertRowDialog = ({ open, onOpenChange, columns, onInsert }: InsertRowDialogProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRow: Record<string, any> = {};
    columns.forEach(col => {
      if (col.isPrimary) {
        newRow[col.name] = Date.now(); // Auto-generate ID
      } else if (col.type === "timestamp") {
        newRow[col.name] = formData[col.name] || new Date().toISOString().replace("T", " ").slice(0, 19);
      } else {
        newRow[col.name] = formData[col.name] || "";
      }
    });

    onInsert(newRow);
    setFormData({});
    onOpenChange(false);
    toast.success("Row inserted successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert New Row</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {columns.filter(col => !col.isPrimary).map((col) => (
            <div key={col.name} className="space-y-2">
              <Label htmlFor={col.name} className="flex items-center gap-2">
                {col.name}
                <span className="text-xs text-muted-foreground">({col.type})</span>
              </Label>
              <Input
                id={col.name}
                type={col.type === "timestamp" ? "datetime-local" : "text"}
                placeholder={`Enter ${col.name}...`}
                value={formData[col.name] || ""}
                onChange={(e) => setFormData({ ...formData, [col.name]: e.target.value })}
              />
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Insert Row</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InsertRowDialog;
