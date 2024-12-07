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
    <Select value={value || "none"} onValueChange={(val) => onChange(val === "none" ? "" : val)}>
      <SelectTrigger 
        ref={triggerRef} 
        className={cn(
          "w-20 h-8",
          value ? "border-0 shadow-none [&>svg]:hidden" : "",
          value ? "focus:ring-2 ring-offset-background" : "",
          "[&>span]:flex [&>span]:items-center [&>span]:justify-center",
          "data-[placeholder]:text-muted-foreground data-[placeholder]:italic"
        )}
      >
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        {value && (
          <SelectItem value="none">
            <span className="text-muted-foreground">Clear</span>
          </SelectItem>
        )}
        <SelectItem value="yes">Yes</SelectItem>
        <SelectItem value="no">No</SelectItem>
      </SelectContent>
    </Select>
  );
}