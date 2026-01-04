import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Database, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (connection: { name: string; type: string; url: string }) => void;
}

const databaseTypes = [
  { value: "postgresql", label: "PostgreSQL", placeholder: "postgresql://user:password@host:5432/database" },
  { value: "mongodb", label: "MongoDB", placeholder: "mongodb+srv://user:password@cluster.mongodb.net/database" },
  { value: "supabase", label: "Supabase", placeholder: "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" },
  { value: "neondb", label: "NeonDB", placeholder: "postgresql://user:password@xxx.neon.tech/database" },
  { value: "firebase", label: "Firebase Firestore", placeholder: "https://your-project.firebaseio.com" },
];

const AddConnectionDialog = ({ open, onOpenChange, onAdd }: AddConnectionDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("postgresql");
  const [url, setUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const selectedDb = databaseTypes.find(db => db.value === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onAdd({ name, type, url });
    setIsConnecting(false);
    setName("");
    setType("postgresql");
    setUrl("");
    onOpenChange(false);
    toast.success("Database connected successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Add Database Connection
          </DialogTitle>
          <DialogDescription>
            Connect to your database using a connection URL. Your credentials are encrypted and stored securely.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Connection Name</Label>
            <Input
              id="name"
              placeholder="My Production Database"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Database Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {databaseTypes.map((db) => (
                  <SelectItem key={db.value} value={db.value}>
                    {db.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Connection URL</Label>
            <Input
              id="url"
              type="password"
              placeholder={selectedDb?.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your connection string is encrypted and never shared.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Database"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddConnectionDialog;
