
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    isLoading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled, 
    type = "button", 
    ...props 
  }, ref) => {
    const baseStyles = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 inline-flex items-center justify-center";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
      secondary: "bg-secondary text-foreground hover:bg-secondary/80",
      outline: "border border-input bg-transparent hover:bg-secondary",
      ghost: "hover:bg-secondary text-foreground",
      link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
    };
    
    const sizes = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
      icon: "p-2",
    };

    return (
      <button
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "opacity-70 pointer-events-none",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
