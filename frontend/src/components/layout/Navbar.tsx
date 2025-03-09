
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutGrid, LineChart, Wallet, Link2, Menu, X, Bot, User } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { useIsMobile } from "@/hooks/use-mobile";

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink to={to} className="w-full">
      <div
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
          "hover:bg-secondary/80",
          isActive 
            ? "bg-primary text-primary-foreground font-medium" 
            : "text-muted-foreground"
        )}
      >
        <div className="flex-shrink-0">{icon}</div>
        <span>{label}</span>
      </div>
    </NavLink>
  );
};

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { to: "/", icon: <LayoutGrid size={20} />, label: "Dashboard" },
    { to: "/assets", icon: <Wallet size={20} />, label: "Assets" },
    { to: "/performance", icon: <LineChart size={20} />, label: "Performance" },
    { to: "/auto-trading", icon: <Bot size={20} />, label: "Auto Trading" },
    { to: "/connect", icon: <Link2 size={20} />, label: "Connect API" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="font-semibold text-xl flex items-center gap-2">
            <span className="text-primary">Crypto</span>
            <span>Tracker</span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  )
                }
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
          </nav>
        )}

        {/* User Profile Button (both mobile and desktop) */}
        <NavLink to="/profile" className={({ isActive }) => 
          cn("ml-auto md:ml-0", 
            isActive && !isMobile && "bg-primary text-primary-foreground rounded-lg"
          )
        }>
          <Button 
            variant={isMobile ? "ghost" : "outline"} 
            size={isMobile ? "icon" : "default"}
            className={cn(!isMobile && "rounded-lg")}
          >
            {isMobile ? (
              <User size={24} />
            ) : (
              <>
                <User size={16} className="mr-2" />
                <span>Profile</span>
              </>
            )}
          </Button>
        </NavLink>

        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="ml-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background animate-fade-in">
          <nav className="container flex flex-col space-y-2 p-4">
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export { Navbar };
