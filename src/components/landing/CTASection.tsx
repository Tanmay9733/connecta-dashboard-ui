import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 mb-8">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">Start for free, upgrade when ready</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            Ready to Simplify Your{" "}
            <span className="gradient-text-accent">Database Workflow</span>?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of developers who've already streamlined their data management with Connecta.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl">
              Schedule a Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free tier available forever
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
