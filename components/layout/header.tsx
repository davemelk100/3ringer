"use client";

import { WeekSelector } from "@/components/schedule/week-selector";
import { DatePicker } from "@/components/schedule/date-picker";

interface HeaderProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function Header({ selectedWeek, onWeekChange }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 h-16 bg-background border-b">
      <div className="text-2xl font-bold">Logo</div>
      <div className="flex-1 flex justify-center items-center gap-2">
        <label htmlFor="week-selector" className="text-sm font-medium">
          Select a week:
        </label>
        <WeekSelector selectedWeek={selectedWeek} onWeekChange={onWeekChange} />
      </div>
      <DatePicker selectedDate={selectedWeek} onDateChange={onWeekChange} />
    </div>
  );
}