
import * as React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  Omit<VariantProps<typeof ShadcnButton>, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'spotify' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  glass?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading, leadingIcon, trailingIcon, glass, children, ...props }, ref) => {
    // Map our custom variants to shadcn variants
    const variantMap = {
      primary: 'default',
      secondary: 'secondary',
      outline: 'outline',
      ghost: 'ghost',
      link: 'link',
      spotify: 'default',
      gradient: 'default',
    };
    
    return (
      <ShadcnButton
        ref={ref}
        variant={variantMap[variant] as any}
        size={size}
        className={cn(
          "font-medium transition-all duration-200 ease-out active:scale-[0.98]",
          "shadow-button hover:shadow-none",
          "disabled:opacity-60 disabled:pointer-events-none",
          variant === 'spotify' && "bg-spotify-green hover:bg-spotify-darkgreen text-white font-bold",
          variant === 'gradient' && "bg-gradient-to-br from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60 text-white",
          glass && "backdrop-blur-lg bg-white/10 dark:bg-black/20 border border-white/10",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leadingIcon ? (
          <span className="mr-2">{leadingIcon}</span>
        ) : null}
        
        {children}
        
        {trailingIcon && !isLoading && (
          <span className="ml-2">{trailingIcon}</span>
        )}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export { Button };