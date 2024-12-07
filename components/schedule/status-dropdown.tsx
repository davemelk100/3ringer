"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { RowStatus } from "@/lib/types/schedule";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface StatusDropdownProps {
  sectionId: string;
  rowIndex: number;
  day: string;
}

export function StatusDropdown({ sectionId, rowIndex, day }: StatusDropdownProps) {
  const { getRowStatus, updateRowStatus } = useScheduleStore();
  const statusKey = `${day}-${sectionId}-${rowIndex}`;
  const currentStatus = getRowStatus(statusKey);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Select 
      value={currentStatus || "none"} 
      onValueChange={(value) => updateRowStatus(statusKey, value === "none" ? undefined : value as RowStatus)}
    >
      <SelectTrigger 
        ref={triggerRef} 
        className={cn(
          "w-24 h-8",
          currentStatus ? "border-0 shadow-none [&>svg]:hidden" : "",
          currentStatus ? "focus:ring-2 ring-offset-background" : "",
          "[&>span]:flex [&>span]:items-center [&>span]:justify-center",
          "data-[placeholder]:text-muted-foreground data-[placeholder]:italic",
          "bg-white"
        )}
      >
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {currentStatus && (
          <SelectItem value="none">
            <span className="text-muted-foreground">Clear selection</span>
          </SelectItem>
        )}
        <SelectItem value="Vacant">Vacant</SelectItem>
        <SelectItem value="Occupied">Occupied</SelectItem>
        <SelectItem value="New">New</SelectItem>
      </SelectContent>
    </Select>
  );
}