
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { RefreshCw, Save, Sliders, Percent, Timer } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StrategySelector } from "@/components/trading/StrategySelector";
import { AssetAllocation } from "@/components/trading/AssetAllocation";

const AutoTrading = () => {
  const { assets } = usePortfolio();
  const [isActive, setIsActive] = useState(false);
  const [rebalanceType, setRebalanceType] = useState<"time" | "threshold">("time");
  const [timeFrequency, setTimeFrequency] = useState("daily");
  const [thresholdPercent, setThresholdPercent] = useState(5);
  
  const handleToggleActive = () => {
    setIsActive(!isActive);
    toast(isActive ? "Auto trading deactivated" : "Auto trading activated", {
      description: isActive 
        ? "Your auto trading bot has been paused" 
        : "Your portfolio will be automatically managed according to your strategy",
    });
  };

  const handleSaveSettings = () => {
    toast.success("Strategy settings saved", {
      description: "Your auto trading preferences have been updated"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auto Trading Bot</h1>
          <p className="text-muted-foreground">Configure your automated trading strategies</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Bot Status:</span>
          <div className="flex items-center gap-2">
            <Switch 
              checked={isActive} 
              onCheckedChange={handleToggleActive} 
              className="data-[state=checked]:bg-green-500"
            />
            <span className={`text-sm ${isActive ? "text-green-500 font-medium" : "text-muted-foreground"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rebalancing Strategy</CardTitle>
              <CardDescription>
                Set up how your portfolio should be automatically rebalanced
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <StrategySelector />
              
              <div className="space-y-4">
                <div>
                  <Label>Rebalance Trigger</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${rebalanceType === 'time' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                      onClick={() => setRebalanceType('time')}
                    >
                      <div className="flex items-center mb-2">
                        <Timer className="mr-2 h-4 w-4" />
                        <span className="font-medium">Time-Based</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Rebalance at regular time intervals</p>
                    </div>
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${rebalanceType === 'threshold' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                      onClick={() => setRebalanceType('threshold')}
                    >
                      <div className="flex items-center mb-2">
                        <Percent className="mr-2 h-4 w-4" />
                        <span className="font-medium">Threshold-Based</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Rebalance when allocations drift beyond a threshold</p>
                    </div>
                  </div>
                </div>
                
                {rebalanceType === 'time' ? (
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Rebalance Frequency</Label>
                    <Select value={timeFrequency} onValueChange={setTimeFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="threshold">Drift Threshold (%)</Label>
                      <span className="text-sm">{thresholdPercent}%</span>
                    </div>
                    <Slider
                      id="threshold"
                      min={1}
                      max={20}
                      step={1}
                      value={[thresholdPercent]}
                      onValueChange={(values) => setThresholdPercent(values[0])}
                      className="py-4"
                    />
                    <p className="text-sm text-muted-foreground">
                      Rebalance when any asset allocation drifts by {thresholdPercent}% or more from target
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveSettings} className="w-full sm:w-auto" leadingIcon={<Save size={16} />}>
                  Save Strategy Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>
                Define target percentage for each asset in your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssetAllocation />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-72 flex items-center justify-center border-2 border-dashed border-muted rounded-md">
              <div className="text-center">
                <p className="text-muted-foreground">Performance metrics will appear here once your strategy is active</p>
                <Button variant="outline" size="sm" className="mt-4" leadingIcon={<RefreshCw size={14} />}>
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent trading activities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutoTrading;
