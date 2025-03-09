
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui-custom/Button";
import { cn } from "@/lib/utils";

interface PortfolioChartProps {
  className?: string;
}

// Types for our chart data
interface ChartDataPoint {
  date: string;
  value: number;
}

// Sample data to simulate portfolio performance
const generateChartData = (days: number, trend: 'up' | 'down' | 'volatile') => {
  const data: ChartDataPoint[] = [];
  const baseValue = 24680.42;
  let currentValue = baseValue;
  
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  for (let i = 0; i <= days; i++) {
    const dayDate = new Date(date);
    dayDate.setDate(date.getDate() + i);
    
    // Generate value based on trend
    if (trend === 'up') {
      // Mostly upward trend with small fluctuations
      const change = (Math.random() * 2 - 0.5) * (baseValue * 0.01);
      currentValue += change + (baseValue * 0.005); // Small upward bias
    } else if (trend === 'down') {
      // Mostly downward trend with small fluctuations
      const change = (Math.random() * 2 - 0.5) * (baseValue * 0.01);
      currentValue += change - (baseValue * 0.005); // Small downward bias
    } else {
      // Volatile - larger random movements
      const change = (Math.random() * 6 - 3) * (baseValue * 0.01);
      currentValue += change;
    }
    
    // Ensure we don't go negative
    currentValue = Math.max(currentValue, baseValue * 0.7);
    
    data.push({
      date: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(currentValue.toFixed(2))
    });
  }
  
  return data;
};

const TimeFilterButton = ({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Button
    variant={active ? "primary" : "ghost"}
    size="sm"
    onClick={onClick}
    className={cn(
      "rounded-full px-4 text-xs font-medium",
      active ? "" : "text-muted-foreground"
    )}
  >
    {children}
  </Button>
);

const PortfolioChart = ({ className }: PortfolioChartProps) => {
  const [timeRange, setTimeRange] = useState<'1d' | '1w' | '1m' | '6m' | '1y'>('1m');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate data loading
    const timer = setTimeout(() => {
      let days = 0;
      let trend: 'up' | 'down' | 'volatile' = 'volatile';
      
      switch (timeRange) {
        case '1d':
          days = 1;
          trend = 'up';
          break;
        case '1w':
          days = 7;
          trend = 'volatile';
          break;
        case '1m':
          days = 30;
          trend = 'up';
          break;
        case '6m':
          days = 180;
          trend = 'volatile';
          break;
        case '1y':
          days = 365;
          trend = 'up';
          break;
      }
      
      setChartData(generateChartData(days, trend));
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeRange]);
  
  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-background/95 shadow-lg border border-border rounded-lg backdrop-blur-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-md font-bold text-primary">
            {formatTooltipValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("border-none", className)} glass>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <CardTitle>Portfolio Performance</CardTitle>
          <div className="flex space-x-1 overflow-auto pb-1">
            <TimeFilterButton 
              active={timeRange === '1d'} 
              onClick={() => setTimeRange('1d')}
            >
              1D
            </TimeFilterButton>
            <TimeFilterButton 
              active={timeRange === '1w'} 
              onClick={() => setTimeRange('1w')}
            >
              1W
            </TimeFilterButton>
            <TimeFilterButton 
              active={timeRange === '1m'} 
              onClick={() => setTimeRange('1m')}
            >
              1M
            </TimeFilterButton>
            <TimeFilterButton 
              active={timeRange === '6m'} 
              onClick={() => setTimeRange('6m')}
            >
              6M
            </TimeFilterButton>
            <TimeFilterButton 
              active={timeRange === '1y'} 
              onClick={() => setTimeRange('1y')}
            >
              1Y
            </TimeFilterButton>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  interval={'preserveStartEnd'}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatYAxis}
                  domain={['dataMin - 1000', 'dataMax + 1000']}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { PortfolioChart };
