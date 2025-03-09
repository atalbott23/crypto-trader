
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-primary/20">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-2">Page not found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <a href="/" className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </a>
      </Button>
    </div>
  );
};

export default NotFound;
