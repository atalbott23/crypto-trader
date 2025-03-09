
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Button } from "@/components/ui-custom/Button";
import { cn } from "@/lib/utils";

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

// Generate mock area chart data
const generateAreaData = (days: number, trend: 'up' | 'down' | 'volatile') => {
  const data = [];
  const baseValue = 24680.42;
  let currentValue = baseValue;
  
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  for (let i = 0; i <= days; i++) {
    const dayDate = new Date(date);
    dayDate.setDate(date.getDate() + i);
    
    // Generate value based on trend
    if (trend === 'up') {
      const change = (Math.random() * 2 - 0.5) * (baseValue * 0.01);
      currentValue += change + (baseValue * 0.005);
    } else if (trend === 'down') {
      const change = (Math.random() * 2 - 0.5) * (baseValue * 0.01);
      currentValue += change - (baseValue * 0.005);
    } else {
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

// Generate mock pie chart data
const generatePieData = () => {
  return [
    { name: 'Bitcoin', value: 13084.27 },
    { name: 'Ethereum', value: 7043.56 },
    { name: 'Solana', value: 2778.40 },
    { name: 'Cardano', value: 650.00 },
    { name: 'Polkadot', value: 782.00 },
    { name: 'Others', value: 351.20 }
  ];
};

const Performance = () => {
  const [timeRange, setTimeRange] = useState<'1w' | '1m' | '3m' | '6m' | '1y'>('1m');
  const [areaData, setAreaData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load chart data
  useState(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      let days = 0;
      let trend: 'up' | 'down' | 'volatile' = 'volatile';
      
      switch (timeRange) {
        case '1w': days = 7; trend = 'volatile'; break;
        case '1m': days = 30; trend = 'up'; break;
        case '3m': days = 90; trend = 'volatile'; break;
        case '6m': days = 180; trend = 'up'; break;
        case '1y': days = 365; trend = 'volatile'; break;
      }
      
      setAreaData(generateAreaData(days, trend));
      setPieData(generatePieData());
      setIsLoading(false);
    }, 1000);
  });
  
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
  
  const TimeFilterButton = ({ label, value }: { label: string; value: '1w' | '1m' | '3m' | '6m' | '1y' }) => (
    <Button
      variant={timeRange === value ? "primary" : "ghost"}
      size="sm"
      onClick={() => setTimeRange(value)}
      className={cn(
        "rounded-full px-4 text-xs font-medium",
        timeRange === value ? "" : "text-muted-foreground"
      )}
    >
      {label}
    </Button>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
      
      <Card className="border-none" glass>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <CardTitle>Portfolio Growth</CardTitle>
          <div className="flex space-x-1 overflow-auto pb-1">
            <TimeFilterButton label="1W" value="1w" />
            <TimeFilterButton label="1M" value="1m" />
            <TimeFilterButton label="3M" value="3m" />
            <TimeFilterButton label="6M" value="6m" />
            <TimeFilterButton label="1Y" value="1y" />
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
                  data={areaData}
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none" glass>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatTooltipValue(Number(value))}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none" glass>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Return</p>
                <p className="text-2xl font-bold text-crypto-green">+32.6%</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Annual Return</p>
                <p className="text-2xl font-bold text-crypto-green">+21.4%</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Volatility</p>
                <p className="text-2xl font-bold">18.9%</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
                <p className="text-2xl font-bold">1.13</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Max Drawdown</p>
                <p className="text-2xl font-bold text-crypto-red">-24.8%</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                <p className="text-2xl font-bold">62.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Performance;
