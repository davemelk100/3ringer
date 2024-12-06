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
    <div className="flex flex-col gap-2">
      <Select value="" onValueChange={(value) => updateRowStatus(statusKey, value as RowStatus)}>
        <SelectTrigger ref={triggerRef} className="w-24 h-8">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Vacant">Vacant</SelectItem>
          <SelectItem value="Occupied">Occupied</SelectItem>
          <SelectItem value="New">New</SelectItem>
        </SelectContent>
      </Select>
      {currentStatus && (
        <div className="text-sm font-medium text-foreground">
          {currentStatus}
        </div>
      )}
    </div>
  );
}