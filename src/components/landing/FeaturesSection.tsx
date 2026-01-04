import { 
  Database, 
  Link, 
  Table, 
  Code, 
  Shield, 
  Zap,
  Cloud,
  GitBranch
} from "lucide-react";

const features = [
  {
    icon: Link,
    title: "One URL Connection",
    description: "Simply paste your database connection string and you're ready to go. No complex setup required.",
    gradient: "from-primary to-cyan-400",
  },
  {
    icon: Table,
    title: "Auto Schema Detection",
    description: "Automatically discovers tables, collections, and relationships across all your databases.",
    gradient: "from-accent to-purple-400",
  },
  {
    icon: Code,
    title: "Built-in API Generator",
    description: "Generate REST APIs for your data instantly. Perfect for quick prototypes and integrations.",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "End-to-end encryption, role-based access, and audit logs keep your data protected.",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "See changes as they happen with live data synchronization across all connected databases.",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    icon: Cloud,
    title: "Cloud & Self-hosted",
    description: "Deploy on our cloud or self-host on your infrastructure. Your data, your rules.",
    gradient: "from-blue-500 to-indigo-400",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Manage Data</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete toolkit for developers who work with multiple database systems
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group card-elevated rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
