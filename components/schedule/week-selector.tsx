"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addWeeks, format, startOfWeek, endOfWeek, isFuture } from "date-fns";

interface WeekSelectorProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  // Generate weeks (only past weeks up to current week)
  const weeks = Array.from({ length: 52 }, (_, i) => {
    const date = addWeeks(new Date(), -i);
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return {
      value: format(start, "yyyy-MM-dd"),
      label: `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`,
      date: start,
    };
  }).filter(week => !isFuture(week.date));

  // Format the selected week to match the value format used in the options
  const selectedValue = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), "yyyy-MM-dd");

  return (
    <Select
      id="week-selector"
      value={selectedValue}
      onValueChange={(value) => {
        const week = weeks.find((w) => w.value === value);
        if (week) {
          onWeekChange(week.date);
        }
      }}
    >
      <SelectTrigger className="w-[300px]">
        <SelectValue>
          {weeks.find(w => w.value === selectedValue)?.label || "Select a week"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {weeks.map((week) => (
          <SelectItem key={week.value} value={week.value}>
            {week.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}