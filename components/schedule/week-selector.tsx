"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addWeeks, format, startOfWeek, endOfWeek, addMonths, subWeeks } from "date-fns";

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

  const selectedValue = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), "yyyy-MM-dd");

  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(selectedWeek, 1));
  };

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousWeek}
        className="h-10 w-10 text-[#0D324D]"
        aria-label="Previous week"
        title="Go to previous week"
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous week</span>
      </Button>
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
        <SelectTrigger className="w-[280px] border-[#F68E5F] focus:ring-[#F68E5F] focus-visible:ring-[#F68E5F] bg-transparent text-[#0D324D] whitespace-nowrap" aria-label="Select week">
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
                  text-[#0D324D] whitespace-nowrap
                  ${week.value === selectedValue ? '' : ''}
                  ${week.isPast ? "text-muted-foreground" : ""}
                  ${week.isFuture ? "text-blue-600 dark:text-blue-400" : ""}
                  ${week.isCurrent ? "" : ""}
                `}
              >
                {week.label}
                {week.isCurrent && " (Current)"}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextWeek}
        className="h-10 w-10 text-[#0D324D]"
        aria-label="Next week"
        title="Go to next week"
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next week</span>
      </Button>
    </div>
  );
}