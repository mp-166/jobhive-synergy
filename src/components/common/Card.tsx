
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered" | "elevated";
  as?: React.ElementType;
  hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", as: Component = "div", hoverEffect = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-card text-card-foreground",
      glass: "glass",
      bordered: "border bg-card text-card-foreground",
      elevated: "bg-card text-card-foreground shadow-md",
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-lg transition-all duration-300 p-6",
          variants[variant],
          hoverEffect && "hover:shadow-md hover:translate-y-[-2px]",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

export default Card;
