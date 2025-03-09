
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

// Types for our portfolio data
interface PortfolioContextType {
  isLoading: boolean;
  portfolioValue: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  assets: any[];
  refreshPortfolio: () => void;
  apiEndpoint: string;
}

// Create context with default values
const PortfolioContext = createContext<PortfolioContextType>({
  isLoading: true,
  portfolioValue: 0,
  dailyChange: 0,
  weeklyChange: 0,
  monthlyChange: 0,
  assets: [],
  refreshPortfolio: () => {},
  apiEndpoint: "http://localhost:8000", // Default FastAPI endpoint
});

// Sample data for the portfolio
const sampleAssets = [
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

// Provider component
export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);
  const [portfolioStats, setPortfolioStats] = useState({
    portfolioValue: 0,
    dailyChange: 0,
    weeklyChange: 0, 
    monthlyChange: 0
  });
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8000");

  // Calculate portfolio statistics from assets
  const calculatePortfolioStats = (assets: any[]) => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    // Simulate daily/weekly/monthly changes
    const dailyChangePercent = assets.reduce((sum, asset) => sum + (asset.change24h * asset.value), 0) / totalValue;
    const weeklyChange = dailyChangePercent * 2.5; // Just a mock multiplier for simulation
    const monthlyChange = dailyChangePercent * 6.2; // Just a mock multiplier for simulation
    
    return {
      portfolioValue: totalValue,
      dailyChange: dailyChangePercent,
      weeklyChange,
      monthlyChange
    };
  };

  // Function to refresh portfolio data
  const refreshPortfolio = () => {
    setIsLoading(true);
    
    // In the future, this would fetch from the FastAPI backend
    // For now, we'll continue with the mock data
    setTimeout(() => {
      setAssets(sampleAssets);
      setPortfolioStats(calculatePortfolioStats(sampleAssets));
      setIsLoading(false);
    }, 1500);
  };

  // Load initial data
  useEffect(() => {
    console.log("Loading initial portfolio data");
    refreshPortfolio();
  }, []);

  // Create memoized context value
  const contextValue = useMemo(() => ({
    isLoading,
    portfolioValue: portfolioStats.portfolioValue,
    dailyChange: portfolioStats.dailyChange,
    weeklyChange: portfolioStats.weeklyChange,
    monthlyChange: portfolioStats.monthlyChange,
    assets,
    refreshPortfolio,
    apiEndpoint,
  }), [isLoading, assets, portfolioStats, apiEndpoint]);

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Custom hook to use the portfolio context
export const usePortfolio = () => useContext(PortfolioContext);
