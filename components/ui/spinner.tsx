import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "white" | "black";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", variant = "primary", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-10 w-10",
    };

    const variantClasses = {
      primary: "text-primary",
      secondary: "text-secondary",
      white: "text-white",
      black: "text-black",
    };

    return (
      <div ref={ref} className={cn("animate-spin", className)} {...props}>
        <Loader2 className={cn(variantClasses[variant], sizeClasses[size])} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
