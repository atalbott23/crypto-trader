
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { AssetsList } from "@/components/dashboard/AssetsList";
import { Button } from "@/components/ui-custom/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="space-y-8">
      <WelcomeHeader />
      
      <PortfolioOverview />
      
      <PortfolioChart />
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Top Assets</h2>
        <Link to="/assets">
          <Button variant="ghost" size="sm">
            <span>View All</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <AssetsList limit={4} />
      
      <div className="border border-border/50 rounded-lg p-6 mt-8 bg-muted/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Set Up Auto Trading</h3>
            <p className="text-muted-foreground max-w-md">
              Connect your exchange API keys to enable automated trading strategies and maximize your returns.
            </p>
          </div>
          <Link to="/connect">
            <Button>
              Connect API
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
