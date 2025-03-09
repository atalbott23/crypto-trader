
import { Button } from "@/components/ui-custom/Button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, LineChart, Lock } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 py-16 md:py-24 lg:py-32 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-primary">Crypto</span> Trading, <br />
              Simplified.
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Track your crypto assets, analyze performance, and automate your trading strategies all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/profile")}
                className="rounded-full"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate("/profile")}
                className="rounded-full"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 flex items-center justify-center shadow-lg">
              <div className="text-5xl font-bold text-primary/80">
                <LineChart className="h-36 w-36 opacity-90" strokeWidth={1.5} />
              </div>
            </div>
            <div className="absolute -top-6 -right-6 p-4 bg-card rounded-xl shadow-lg border border-border/50">
              <div className="flex items-center gap-2 text-green-500 font-semibold">
                <span className="text-xl">+24.8%</span>
                <LineChart className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 p-4 bg-card rounded-xl shadow-lg border border-border/50">
              <div className="flex items-center text-primary font-semibold">
                <Zap className="h-5 w-5 mr-2" />
                <span>Auto Trading</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Portfolio Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your crypto holdings across multiple exchanges in one unified dashboard.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Automated Trading</h3>
              <p className="text-muted-foreground">
                Create and deploy algorithmic trading strategies without writing code.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure API Connection</h3>
              <p className="text-muted-foreground">
                Connect your exchange accounts securely with read-only API keys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to optimize your crypto trading?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of traders who have already improved their returns with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/profile")}
                className="rounded-full"
                leadingIcon={<Lock size={18} />}
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate("/profile")}
                className="rounded-full"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
