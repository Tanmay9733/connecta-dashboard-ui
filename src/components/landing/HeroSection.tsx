import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-30" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-slow delay-500" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Universal Database Management</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in delay-100">
            Connect to{" "}
            <span className="gradient-text">Any Database</span>
            <br />
            Using Just a URL
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in delay-200 text-balance">
            One unified interface for PostgreSQL, MongoDB, Supabase, NeonDB, and Firebase. 
            Visualize, query, and manage all your data in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in delay-300">
            <Link to="/dbconnection">
              <Button variant="hero" size="xl" className="group">
                Start Building Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="heroOutline" size="xl">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in delay-400">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">5+</div>
              <div className="text-sm text-muted-foreground">Databases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">10K+</div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">1M+</div>
              <div className="text-sm text-muted-foreground">Queries</div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mt-20 max-w-5xl mx-auto animate-fade-in delay-500">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur-3xl" />
          <div className="relative card-elevated rounded-2xl p-2 glow-primary">
            <div className="bg-background rounded-xl overflow-hidden">
              {/* Mock Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-muted rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono max-w-md mx-auto">
                    connecta.dev/dashboard
                  </div>
                </div>
              </div>
              
              {/* Mock Dashboard */}
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-56 bg-sidebar border-r border-border p-4 hidden sm:block">
                  <div className="flex items-center gap-2 mb-6">
                    <Database className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm">My Project</span>
                  </div>
                  <div className="space-y-1">
                    {["users", "products", "orders", "sessions", "analytics"].map((table, i) => (
                      <div
                        key={table}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                        {table}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">users</h3>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        PostgreSQL
                      </div>
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  {/* Table Preview */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">id</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">name</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">email</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">created_at</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 1, name: "Alice Chen", email: "alice@example.com", date: "2024-01-15" },
                          { id: 2, name: "Bob Smith", email: "bob@example.com", date: "2024-01-14" },
                          { id: 3, name: "Carol Davis", email: "carol@example.com", date: "2024-01-13" },
                        ].map((row) => (
                          <tr key={row.id} className="border-t border-border hover:bg-muted/30">
                            <td className="px-4 py-3 font-mono text-primary">{row.id}</td>
                            <td className="px-4 py-3">{row.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                            <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
