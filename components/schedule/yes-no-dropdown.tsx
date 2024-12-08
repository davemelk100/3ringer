"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface YesNoDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function YesNoDropdown({ value, onChange }: YesNoDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full h-full">
      <Select 
        value={value || "none"} 
        onValueChange={(val) => onChange(val === "none" ? "" : val)}
      >
        <SelectTrigger 
          ref={triggerRef} 
          className={cn(
            "w-full h-full min-h-[2.5rem]",
            "flex items-center justify-center",
            value ? "border-0 shadow-none [&>svg]:hidden" : "border-transparent",
            value ? "focus:ring-2 ring-offset-background" : "",
            "[&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:w-full",
            "data-[placeholder]:text-muted-foreground data-[placeholder]:italic",
            "bg-white text-sm"
          )}
        >
          <SelectValue placeholder="" className="text-center" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {value && (
            <SelectItem value="none" className="text-center">
              <span className="text-muted-foreground">Clear selection</span>
            </SelectItem>
          )}
          <SelectItem value="yes" className="text-center">Yes</SelectItem>
          <SelectItem value="no" className="text-center">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}