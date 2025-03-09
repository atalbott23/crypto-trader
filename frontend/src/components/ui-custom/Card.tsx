
import * as React from "react";
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  spotify?: boolean;
  hover?: boolean;
  gradient?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, spotify, hover, gradient, children, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-200",
          "shadow-card border-border/50",
          glass && "glass-card",
          spotify && "spotify-glass",
          gradient && "bg-gradient-to-br from-primary/10 to-primary/5",
          hover && "hover:shadow-lg hover:translate-y-[-2px]",
          className
        )}
        {...props}
      >
        {children}
      </ShadcnCard>
    );
  }
);

Card.displayName = "Card";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };