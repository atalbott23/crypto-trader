
import { ApiKeyForm } from "@/components/api/ApiKeyForm";

const Connect = () => {
  return (
    <div className="space-y-6 py-8">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Connect Your Exchange</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Connect your exchange API keys to unlock automated trading and real-time portfolio tracking.
        </p>
      </div>
      
      <ApiKeyForm />
      
      <div className="max-w-xl mx-auto mt-10 space-y-6">
        <div className="border-t border-border/50 pt-6">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Is it safe to provide my API keys?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Yes, we take security seriously. Your API keys are encrypted and we recommend using read-only keys whenever possible.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">How does auto trading work?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Our automated trading system executes trades based on predefined strategies. You can configure risk levels, asset allocation, and more.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Which exchanges are supported?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                We currently support Binance, Coinbase, Kraken, KuCoin, and FTX. More exchanges will be added soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
