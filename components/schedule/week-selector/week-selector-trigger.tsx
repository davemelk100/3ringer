"use client";

import { SelectTrigger } from "@/components/ui/select";

interface WeekSelectorTriggerProps {
  label: string;
}

export function WeekSelectorTrigger({ label }: WeekSelectorTriggerProps) {
  return (
    <SelectTrigger 
      className="w-[220px] sm:w-[280px] border-[#F68E5F] focus:ring-[#F68E5F] focus-visible:ring-[#F68E5F] bg-transparent text-[#0072A3] whitespace-nowrap text-sm h-8 sm:h-10" 
      aria-label="Select week"
    >
      <span className="text-center text-sm">
        {label}
      </span>
    </SelectTrigger>
  );
}