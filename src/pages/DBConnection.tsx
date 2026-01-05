import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Database, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const databases = [
  { value: "postgresql", label: "PostgreSQL", placeholder: "postgresql://user:password@host:5432/database" },
  { value: "mongodb", label: "MongoDB", placeholder: "mongodb+srv://user:password@cluster.mongodb.net/database" },
  { value: "supabase", label: "Supabase", placeholder: "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" },
  { value: "neondb", label: "NeonDB", placeholder: "postgresql://user:password@ep-xxx.region.aws.neon.tech/database" },
  { value: "firebase", label: "Firebase Firestore", placeholder: "Enter your Firebase Project ID" },
];

const DBConnection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dbType, setDbType] = useState("");
  const [connectionString, setConnectionString] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");

  const selectedDb = databases.find((db) => db.value === dbType);

  const handleConnect = async () => {
    if (!dbType || !connectionString || !projectName) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    setConnectionStatus("idle");

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success (90% success rate for demo)
    const success = Math.random() > 0.1;

    if (success) {
      setConnectionStatus("success");
      toast({
        title: "Connection Successful!",
        description: `Connected to ${selectedDb?.label} database.`,
      });

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      setConnectionStatus("error");
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: "Unable to connect. Please check your connection string.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />

      <div className="container relative z-10 px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass border border-primary/30 mb-6">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Connect Your <span className="gradient-text">Database</span>
            </h1>
            <p className="text-muted-foreground">
              Enter your database connection details to get started
            </p>
          </div>

          {/* Connection Form */}
          <div className="card-elevated rounded-2xl p-8 glow-primary">
            <div className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="My Awesome Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              {/* Database Type */}
              <div className="space-y-2">
                <Label>Database Type</Label>
                <Select value={dbType} onValueChange={setDbType}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select your database" />
                  </SelectTrigger>
                  <SelectContent>
                    {databases.map((db) => (
                      <SelectItem key={db.value} value={db.value}>
                        {db.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Connection String */}
              <div className="space-y-2">
                <Label htmlFor="connectionString">Connection String</Label>
                <Input
                  id="connectionString"
                  type="password"
                  placeholder={selectedDb?.placeholder || "Enter your connection string"}
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  className="bg-background/50 font-mono text-sm"
                />
                {dbType && (
                  <p className="text-xs text-muted-foreground">
                    Example: {selectedDb?.placeholder}
                  </p>
                )}
              </div>

              {/* Connection Status */}
              {connectionStatus === "success" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-500 text-sm">Connection successful! Redirecting...</span>
                </div>
              )}

              {connectionStatus === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="text-destructive text-sm">Connection failed. Please check your details.</span>
                </div>
              )}

              {/* Connect Button */}
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleConnect}
                disabled={isConnecting || connectionStatus === "success"}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Testing Connection...
                  </>
                ) : connectionStatus === "success" ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Connected!
                  </>
                ) : (
                  "Connect Database"
                )}
              </Button>

              {/* Help Text */}
              <p className="text-center text-xs text-muted-foreground">
                Your connection string is encrypted and securely stored.
              </p>
            </div>
          </div>

          {/* Supported Databases */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">Supported Databases</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {databases.map((db) => (
                <div
                  key={db.value}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    dbType === db.value
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {db.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBConnection;
