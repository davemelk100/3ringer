"use client";

import { forwardRef } from "react";
import { SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DropdownTriggerProps {
  value: string;
  isActive: boolean;
  onBlur: () => void;
}

export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ value, isActive, onBlur }, ref) => {
    return (
      <SelectTrigger 
        ref={ref}
        className={cn(
          "w-full h-6 min-h-[1.5rem] px-1",
          "flex items-center justify-center",
          value ? "border-0 shadow-none [&>svg]:hidden" : "border-transparent",
          value ? "focus:ring-2 ring-offset-background" : "",
          "[&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:w-full",
          "data-[placeholder]:text-muted-foreground data-[placeholder]:italic",
          "bg-white text-sm",
          isActive && "ring-2 ring-primary ring-offset-background"
        )}
        onBlur={onBlur}
      />
    );
  }
);

DropdownTrigger.displayName = "DropdownTrigger";