
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className,
  duration = 300,
}) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation, duration]);

  return (
    <div
      className={cn(
        "transition-opacity duration-300 ease-in-out",
        transitionStage === "fadeIn" ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

export { PageTransition };
