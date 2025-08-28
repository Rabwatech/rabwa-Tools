"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface EnhancedSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const EnhancedSelect = React.forwardRef<HTMLDivElement, EnhancedSelectProps>(
  ({ 
    options, 
    value, 
    onChange, 
    placeholder = "Select option...", 
    label,
    className,
    disabled = false,
    size = 'md',
    variant = 'default'
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    
    const selectedOption = options.find(option => option.value === value);
    
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sizeClasses = {
      sm: 'py-1.5 px-3 text-sm',
      md: 'py-2 px-3 text-sm',
      lg: 'py-3 px-4 text-base'
    };

    const variantClasses = {
      default: 'bg-background border-border hover:bg-muted/50',
      outline: 'bg-transparent border-border hover:bg-muted/50',
      ghost: 'bg-transparent border-transparent hover:bg-muted/50'
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref && 'current' in ref && ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);

    const handleSelect = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    };

    return (
      <div className={cn("relative", className)} ref={ref}>
        {label && (
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
          </label>
        )}
        
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between rounded-lg border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sizeClasses[size],
            variantClasses[variant],
            isOpen && "ring-2 ring-primary border-transparent"
          )}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {selectedOption?.icon && (
              <selectedOption.icon className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <span className="truncate">
              {selectedOption ? (
                <div className="flex items-center gap-2">
                  <span>{selectedOption.label}</span>
                  {selectedOption.count !== undefined && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {selectedOption.count}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
          </div>
          <ChevronDown 
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0",
              isOpen && "rotate-180"
            )} 
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-border">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3",
                      value === option.value && "bg-primary/10 text-primary"
                    )}
                  >
                    {option.icon && (
                      <option.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {option.count !== undefined && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
                        {option.count}
                      </span>
                    )}
                    {value === option.value && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

EnhancedSelect.displayName = "EnhancedSelect";
