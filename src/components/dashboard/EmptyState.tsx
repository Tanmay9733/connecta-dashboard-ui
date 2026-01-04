import { Database, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
          <Database className="h-12 w-12 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3">
          Select a Table to View Data
        </h2>
        
        <p className="text-muted-foreground mb-6">
          Choose a table from the sidebar to view and manage your data, 
          or connect a new database to get started.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            Connect Database
          </Button>
          <Button variant="outline">
            View Documentation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="mt-10 text-left">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Quick Tips</h4>
          <div className="space-y-2">
            {[
              "Press ⌘K to open the command palette",
              "Right-click rows for quick actions",
              "Use filters to narrow down your data",
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
