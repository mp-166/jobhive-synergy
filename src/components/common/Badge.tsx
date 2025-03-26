
import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

const Badge = ({ 
  className, 
  variant = "default", 
  size = "md", 
  children, 
  ...props 
}: BadgeProps) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-secondary text-foreground border border-transparent",
    outline: "bg-transparent border",
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border border-transparent",
    success: "bg-green-100 text-green-700 border border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    danger: "bg-red-100 text-red-700 border border-red-200",
  };
  
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;
