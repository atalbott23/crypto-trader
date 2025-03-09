
import { useState } from "react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui-custom/Button";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const AssetAllocation = () => {
  const { assets } = usePortfolio();
  const [allocations, setAllocations] = useState(() => {
    // Initialize with even distribution
    const initialAllocation = assets.length > 0 ? Math.floor(100 / assets.length) : 0;
    return assets.map((asset, index) => {
      // Give any remainder to the first asset
      if (index === 0) {
        return initialAllocation + (100 - (initialAllocation * assets.length));
      }
      return initialAllocation;
    });
  });

  const handleAllocationChange = (index: number, value: number) => {
    const newAllocations = [...allocations];
    
    // Calculate the difference
    const oldValue = newAllocations[index];
    const diff = value - oldValue;
    
    // Don't allow changes if we're at 0 and trying to decrease
    if (oldValue === 0 && diff < 0) return;
    
    // Update the changed allocation
    newAllocations[index] = value;
    
    // Calculate total and distribute the difference among other assets
    const total = newAllocations.reduce((sum, val) => sum + val, 0);
    
    if (total !== 100) {
      // Distribute the difference evenly among other allocations
      const otherIndices = [...Array(newAllocations.length).keys()].filter(i => i !== index);
      
      if (otherIndices.length > 0) {
        const nonZeroIndices = otherIndices.filter(i => newAllocations[i] > 0);
        
        if (nonZeroIndices.length > 0) {
          // If we need to decrease, only decrease non-zero allocations
          const indicesForAdjustment = diff > 0 ? nonZeroIndices : otherIndices;
          const adjustmentPerIndex = -diff / indicesForAdjustment.length;
          
          for (const i of indicesForAdjustment) {
            // Ensure we don't go below 0
            newAllocations[i] = Math.max(0, newAllocations[i] - adjustmentPerIndex);
          }
          
          // Fix any rounding issues to ensure total is exactly 100
          const newTotal = newAllocations.reduce((sum, val) => sum + val, 0);
          if (newTotal !== 100) {
            for (const i of indicesForAdjustment) {
              if (newAllocations[i] > 0) {
                newAllocations[i] += 100 - newTotal;
                break;
              }
            }
          }
        } else {
          // If all other allocations are 0, we can't distribute
          newAllocations[index] = oldValue;
        }
      }
    }
    
    // Round all values to ensure they're integers
    setAllocations(newAllocations.map(val => Math.round(val)));
  };

  const handleSaveAllocations = () => {
    // This would save the allocations to the backend
    toast.success("Portfolio allocation saved", {
      description: "Your target allocation has been updated"
    });
  };

  const totalAllocation = allocations.reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      {assets.length > 0 ? (
        <>
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <div key={asset.id} className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={asset.image} 
                      alt={asset.name} 
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="font-medium">{asset.name}</span>
                  </div>
                  <span 
                    className={`font-mono ${
                      allocations[index] > 0 ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {allocations[index]}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[allocations[index]]}
                  onValueChange={(values) => handleAllocationChange(index, values[0])}
                />
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Total Allocation:</span>
              <span 
                className={`font-mono font-medium ${
                  totalAllocation === 100 ? "text-green-500" : "text-red-500"
                }`}
              >
                {totalAllocation}%
              </span>
            </div>
            <Button 
              onClick={handleSaveAllocations} 
              disabled={totalAllocation !== 100}
              className="w-full" 
              leadingIcon={<Save size={16} />}
            >
              Save Allocation
            </Button>
            {totalAllocation !== 100 && (
              <p className="text-sm text-red-500 mt-2">
                Total allocation must equal 100%
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No assets available for allocation</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add assets to your portfolio first
          </p>
        </div>
      )}
    </div>
  );
};
