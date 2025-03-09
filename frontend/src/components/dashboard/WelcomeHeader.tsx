
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/contexts/PortfolioContext";

interface WelcomeHeaderProps {
  className?: string;
}

const WelcomeHeader = ({ className }: WelcomeHeaderProps) => {
  const [greeting, setGreeting] = useState("");
  const { portfolioValue } = usePortfolio();
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className={cn("space-y-1", className)}>
      <h2 className="text-lg font-medium text-muted-foreground">
        {greeting}
      </h2>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        Your Portfolio
      </h1>
      <p className="text-muted-foreground">
        Connecting to FastAPI backend for advanced analytics
      </p>
    </div>
  );
};

export { WelcomeHeader };
