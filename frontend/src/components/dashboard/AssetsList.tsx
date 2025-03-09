import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AssetListProps {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
}

// Types for crypto asset data
interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  change24h: number;
  value: number;
  amount: number;
}

// Sample data for top crypto assets
const sampleAssets: CryptoAsset[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    price: 65421.34,
    change24h: 2.34,
    value: 13084.27,
    amount: 0.2
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    price: 3521.78,
    change24h: -1.23,
    value: 7043.56,
    amount: 2
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png",
    price: 138.92,
    change24h: 5.67,
    value: 2778.40,
    amount: 20
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    image: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    price: 0.65,
    change24h: -0.89,
    value: 650.00,
    amount: 1000
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
    price: 7.82,
    change24h: 3.21,
    value: 782.00,
    amount: 100
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    image: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    price: 17.56,
    change24h: 1.76,
    value: 351.20,
    amount: 20
  }
];

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

const AssetsList = ({ className, limit = Infinity, showViewAll = false }: AssetListProps) => {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setAssets(sampleAssets);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const displayedAssets = assets.slice(0, limit);

  const renderSkeleton = () => (
    <>
      {[...Array(limit ? Math.min(limit, 3) : 3)].map((_, index) => (
        <tr key={`skeleton-${index}`} className="animate-pulse">
          <td className="px-4 py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-muted rounded-full mr-3" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-3 bg-muted rounded w-10" />
              </div>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="h-4 bg-muted rounded w-24" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 bg-muted rounded w-16" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 bg-muted rounded w-20" />
          </td>
          <td className="px-4 py-4 text-right">
            <div className="h-4 bg-muted rounded ml-auto w-24" />
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <Card className={cn("border-none", className)} glass>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Assets</CardTitle>
        {showViewAll && (
          <Link to="/assets">
            <Button variant="ghost" size="sm">
              <span>View All</span>
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left font-medium text-muted-foreground px-6 py-3 text-sm">Asset</th>
                <th className="text-left font-medium text-muted-foreground px-6 py-3 text-sm">Price</th>
                <th className="text-left font-medium text-muted-foreground px-6 py-3 text-sm">24h</th>
                <th className="text-left font-medium text-muted-foreground px-6 py-3 text-sm">Holdings</th>
                <th className="text-right font-medium text-muted-foreground px-6 py-3 text-sm">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading
                ? renderSkeleton()
                : displayedAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="w-8 h-8 rounded-full bg-muted p-1 mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                            }}
                          />
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {formatCurrency(asset.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "flex items-center",
                          asset.change24h >= 0 ? "text-crypto-green" : "text-crypto-red"
                        )}>
                          {asset.change24h >= 0 
                            ? <ArrowUpRight className="h-4 w-4 mr-1" /> 
                            : <ArrowDownRight className="h-4 w-4 mr-1" />
                          }
                          {formatPercentage(asset.change24h)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{asset.amount}</div>
                        <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {formatCurrency(asset.value)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export { AssetsList };
