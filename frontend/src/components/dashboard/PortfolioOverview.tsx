
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PortfolioOverviewProps {
  className?: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

const StatCard = ({ title, value, percentageChange, trend, isLoading }: {
  title: string;
  value: string;
  percentageChange: string;
  trend: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}) => {
  const trendColor = trend === 'up' ? 'text-crypto-green' : trend === 'down' ? 'text-crypto-red' : 'text-muted-foreground';
  const trendIcon = trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : trend === 'down' ? <ArrowDownRight className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />;

  return (
    <Card className="overflow-hidden border-none" glass hover>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <div className="w-24 h-7 rounded shimmer mb-2" />
            <div className="w-20 h-5 rounded shimmer" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <div className={cn("flex items-center text-sm", trendColor)}>
              {trendIcon}
              <span className="ml-1">{percentageChange}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const PortfolioOverview = ({ className }: PortfolioOverviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    totalValue: 0,
    dayChange: 0,
    weekChange: 0,
    monthChange: 0
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData({
        totalValue: 24680.42,
        dayChange: 2.34,
        weekChange: -1.23,
        monthChange: 8.76
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <StatCard
        title="Total Value"
        value={formatCurrency(data.totalValue)}
        percentageChange=""
        trend="neutral"
        isLoading={isLoading}
      />
      <StatCard
        title="24h Change"
        value={formatCurrency(data.totalValue * data.dayChange / 100)}
        percentageChange={formatPercentage(data.dayChange)}
        trend={data.dayChange >= 0 ? 'up' : 'down'}
        isLoading={isLoading}
      />
      <StatCard
        title="7d Change"
        value={formatCurrency(data.totalValue * data.weekChange / 100)}
        percentageChange={formatPercentage(data.weekChange)}
        trend={data.weekChange >= 0 ? 'up' : 'down'}
        isLoading={isLoading}
      />
      <StatCard
        title="30d Change"
        value={formatCurrency(data.totalValue * data.monthChange / 100)}
        percentageChange={formatPercentage(data.monthChange)}
        trend={data.monthChange >= 0 ? 'up' : 'down'}
        isLoading={isLoading}
      />
    </div>
  );
};

export { PortfolioOverview };
