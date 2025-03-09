
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui-custom/Card";

export const StrategySelector = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("rebalancing");
  
  const strategies = [
    {
      id: "rebalancing",
      name: "Portfolio Rebalancing",
      description: "Maintains your target asset allocation by buying and selling assets"
    },
    {
      id: "dca",
      name: "Dollar Cost Averaging",
      description: "Regularly purchases assets regardless of price",
      disabled: true
    },
    {
      id: "grid",
      name: "Grid Trading",
      description: "Buys at lower price levels and sells at higher levels",
      disabled: true
    }
  ];
  
  return (
    <Card glass className="p-4">
      <div className="space-y-2">
        <Label className="text-base font-medium">Trading Strategy</Label>
        <RadioGroup
          value={selectedStrategy}
          onValueChange={setSelectedStrategy}
          className="grid gap-3 mt-3"
        >
          {strategies.map((strategy) => (
            <div 
              key={strategy.id} 
              className={cn(
                "flex items-start space-x-3 p-3 rounded-lg transition-all duration-200",
                selectedStrategy === strategy.id 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-muted/50",
                strategy.disabled && "opacity-60"
              )}
            >
              <RadioGroupItem
                value={strategy.id}
                id={strategy.id}
                disabled={strategy.disabled}
                className={cn(
                  "mt-1",
                  selectedStrategy === strategy.id && "border-spotify-green text-spotify-green"
                )}
              />
              <div className="grid gap-1">
                <label
                  htmlFor={strategy.id}
                  className={cn(
                    "font-medium cursor-pointer",
                    strategy.disabled ? "text-muted-foreground" : "",
                    selectedStrategy === strategy.id && !strategy.disabled && "text-spotify-green"
                  )}
                >
                  {strategy.name}
                  {strategy.disabled && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Coming Soon
                    </span>
                  )}
                </label>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
};

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
