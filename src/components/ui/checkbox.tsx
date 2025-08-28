"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  id?: string;
}

export const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ 
    checked, 
    onChange, 
    label, 
    description,
    disabled = false,
    size = 'md',
    variant = 'default',
    className,
    id
  }, ref) => {
    const checkboxId = id || React.useId();

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const variantClasses = {
      default: 'bg-background border-border hover:bg-muted/50',
      outline: 'bg-transparent border-border hover:bg-muted/50',
      ghost: 'bg-transparent border-transparent hover:bg-muted/50'
    };

    const handleChange = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    return (
      <div className={cn("flex items-start gap-3", className)} ref={ref}>
        <div className="flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
          />
          <button
            type="button"
            onClick={handleChange}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center rounded border transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              variantClasses[variant],
              checked && "bg-primary border-primary text-primary-foreground",
              !checked && "hover:bg-muted/50"
            )}
          >
            {checked && <Check className="w-3 h-3" />}
          </button>
        </div>
        
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label 
                htmlFor={checkboxId}
                className={cn(
                  "block text-sm font-medium cursor-pointer",
                  disabled ? "text-muted-foreground cursor-not-allowed" : "text-foreground hover:text-primary transition-colors"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(
                "text-sm mt-1",
                disabled ? "text-muted-foreground" : "text-muted-foreground"
              )}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
