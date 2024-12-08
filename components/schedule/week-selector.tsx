"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addWeeks, format, startOfWeek, endOfWeek, addMonths } from "date-fns";

interface WeekSelectorProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function WeekSelector({ selectedWeek, onWeekChange }: WeekSelectorProps) {
  // Generate weeks from 6 months ago to 6 months in the future
  const startDate = addMonths(new Date(), -6);
  const endDate = addMonths(new Date(), 6);
  
  const weeks = [];
  let currentDate = startDate;
  
  while (currentDate <= endDate) {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    
    weeks.push({
      value: format(start, "yyyy-MM-dd"),
      label: `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`,
      date: start,
      isPast: start < new Date(),
      isFuture: start > new Date(),
      isCurrent: format(start, "yyyy-MM-dd") === format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
    });
    
    currentDate = addWeeks(currentDate, 1);
  }

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
      <SelectTrigger className="w-[300px] border-[#A1C6EA] focus:ring-[#A1C6EA] focus-visible:ring-[#A1C6EA] bg-transparent">
        <SelectValue>
          {weeks.find(w => w.value === selectedValue)?.label || "Select a week"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="max-h-[300px] overflow-y-auto">
          {weeks.map((week) => (
            <SelectItem 
              key={week.value} 
              value={week.value}
              className={`
                ${week.isPast ? "text-muted-foreground" : ""}
                ${week.isFuture ? "text-blue-600 dark:text-blue-400" : ""}
                ${week.isCurrent ? "font-bold" : ""}
              `}
            >
              {week.label}
              {week.isCurrent && " (Current)"}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}