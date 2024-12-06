"use client";

import { WeekSelector } from "@/components/schedule/week-selector";
import { Button } from "@/components/ui/button";
import { Calendar, Printer } from "lucide-react";

interface HeaderProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function Header({ selectedWeek, onWeekChange }: HeaderProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center justify-between px-4 h-16 bg-background border-b print:hidden">
      {/* Left side calendar icon with logo text */}
      <div className="flex-1 flex items-center gap-2">
        <Calendar className="h-18 w-18 text-muted-foreground" />
        <span className="text-xl font-semibold">Logo</span>
      </div>
      
      {/* Centered week selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="week-selector" className="text-sm font-medium whitespace-nowrap">
          Select a week:
        </label>
        <WeekSelector selectedWeek={selectedWeek} onWeekChange={onWeekChange} />
      </div>
      
      {/* Right-aligned print button */}
      <div className="flex-1 flex justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrint}
          title="Print Schedule"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}