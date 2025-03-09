
import { useState } from "react";
import { AssetsList } from "@/components/dashboard/AssetsList";
import { Button } from "@/components/ui-custom/Button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const Assets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Assets</h1>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button variant="outline" size="icon" onClick={handleRefresh} isLoading={isRefreshing}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <AssetsList />
      
      <div className="border border-border/50 rounded-lg p-6 mt-8 bg-muted/30">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-medium">No more assets to display</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect exchange APIs to automatically import your crypto holdings or add assets manually.
          </p>
          <div className="flex justify-center gap-3 mt-2">
            <Link to="/connect">
              <Button>Connect Exchange</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assets;
