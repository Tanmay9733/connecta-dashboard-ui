import { Check } from "lucide-react";

const databases = [
  {
    name: "PostgreSQL",
    type: "SQL",
    color: "from-blue-500 to-blue-600",
    features: ["Full CRUD", "Relations", "Migrations"],
  },
  {
    name: "MongoDB",
    type: "NoSQL",
    color: "from-green-500 to-green-600",
    features: ["Documents", "Aggregation", "Indexes"],
  },
  {
    name: "Supabase",
    type: "Postgres",
    color: "from-emerald-500 to-emerald-600",
    features: ["Auth", "Realtime", "Storage"],
  },
  {
    name: "NeonDB",
    type: "Serverless",
    color: "from-cyan-500 to-cyan-600",
    features: ["Branching", "Autoscale", "Edge"],
  },
  {
    name: "Firebase",
    type: "NoSQL",
    color: "from-orange-500 to-orange-600",
    features: ["Firestore", "Realtime", "Rules"],
  },
];

const DatabasesSection = () => {
  return (
    <section id="databases" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            One Tool for{" "}
            <span className="gradient-text-accent">All Databases</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            SQL or NoSQL, cloud or self-hosted — Connecta speaks them all
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {databases.map((db, index) => (
            <div
              key={db.name}
              className="group glass rounded-2xl p-5 hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon/Badge */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${db.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-white font-bold text-lg">
                  {db.name.charAt(0)}
                </span>
              </div>

              <h3 className="font-semibold mb-1">{db.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{db.type}</p>

              <div className="space-y-1.5">
                {db.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Connection Demo */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="card-elevated rounded-2xl p-6 glow-primary">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Try connecting to any database</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="postgresql://user:pass@host:5432/database"
                className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                Connect Database
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Supports: postgres://, mongodb://, mongodb+srv://, and more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatabasesSection;
