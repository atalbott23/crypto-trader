
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApiKeyFormProps {
  className?: string;
}

const exchanges = [
  { id: "binance", name: "Binance" },
  { id: "coinbase", name: "Coinbase" },
  { id: "kraken", name: "Kraken" },
  { id: "kucoin", name: "KuCoin" },
  { id: "ftx", name: "FTX" },
];

const ApiKeyForm = ({ className }: ApiKeyFormProps) => {
  const { toast } = useToast();
  const [exchange, setExchange] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [testnet, setTestnet] = useState(false);

  const handleCopyExample = () => {
    const exampleKey = "3fGs72hD9klM5pQ6rXzWbYcVnTvE8iJa";
    navigator.clipboard.writeText(exampleKey);
    
    toast({
      title: "Copied to clipboard",
      description: "Example API key copied to clipboard",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exchange) {
      toast({
        title: "Missing exchange",
        description: "Please select an exchange first",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey || !apiSecret) {
      toast({
        title: "Missing credentials",
        description: "API key and secret are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "API connected successfully",
        description: `Your ${exchanges.find(e => e.id === exchange)?.name} account has been connected`,
        variant: "default",
      });
      
      // Reset form
      setApiKey("");
      setApiSecret("");
      setPassphrase("");
      setTestnet(false);
    }, 2000);
  };

  return (
    <Card className={cn("border-none max-w-xl w-full mx-auto", className)} glass>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Connect Exchange API</CardTitle>
          <CardDescription>
            Connect your exchange API to enable automated trading and real-time portfolio tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="exchange">Exchange</Label>
            <Select value={exchange} onValueChange={setExchange}>
              <SelectTrigger id="exchange">
                <SelectValue placeholder="Select exchange" />
              </SelectTrigger>
              <SelectContent>
                {exchanges.map((exchange) => (
                  <SelectItem key={exchange.id} value={exchange.id}>
                    {exchange.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 text-muted-foreground"
                onClick={handleCopyExample}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The API key from your exchange account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              placeholder="Enter your API secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              The API secret from your exchange account
            </p>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex items-center text-sm font-medium text-muted-foreground px-0"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="mr-1 h-4 w-4" />
                  Hide advanced settings
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-4 w-4" />
                  Show advanced settings
                </>
              )}
            </Button>

            {showAdvanced && (
              <div className="space-y-4 pt-2 pl-2 border-l-2 border-border/50">
                <div className="space-y-2">
                  <Label htmlFor="passphrase">API Passphrase (if required)</Label>
                  <Input
                    id="passphrase"
                    type="password"
                    placeholder="Enter passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Some exchanges like KuCoin require an additional passphrase
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="testnet"
                    checked={testnet}
                    onChange={(e) => setTestnet(e.target.checked)}
                    className="rounded border-muted-foreground/20 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="testnet" className="text-sm font-normal cursor-pointer">
                    Use testnet (for testing without real funds)
                  </Label>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start p-4 border border-border rounded-lg bg-muted/50">
            <AlertCircle className="flex-shrink-0 w-5 h-5 text-muted-foreground mt-0.5 mr-3" />
            <div className="text-sm text-muted-foreground">
              <p className="mb-1 font-medium">Important Security Information</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use read-only API keys when possible</li>
                <li>Only enable trading permissions if you intend to use the auto trading feature</li>
                <li>Never share your API keys or secrets with anyone</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Connect Exchange
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export { ApiKeyForm };
