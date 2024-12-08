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
    <div className="flex items-center justify-between px-4 h-16 bg-[#f1f5f9] print:hidden">
      {/* Left side calendar icon with logo text */}
      <div className="flex-1 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F68E5F]">
          <Calendar className="h-7 w-7 text-white" />
        </div>
        <span className="text-3xl font-bold uppercase text-[#0D324D]">Schedule</span>
      </div>
      
      {/* Centered week selector */}
      <div className="flex items-center gap-2">
        <WeekSelector selectedWeek={selectedWeek} onWeekChange={onWeekChange} />
      </div>
      
      {/* Right-aligned print button */}
      <div className="flex-1 flex justify-end bg-transparent">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrint}
          title="Print Schedule"
          className="border-[#F68E5F] group hover:bg-[#F68E5F] hover:text-white shadow-none hover:shadow-none focus:shadow-none focus-visible:shadow-none bg-transparent"
        >
          <Printer className="h-4 w-4 text-[#F68E5F] group-hover:text-white transition-colors" />
        </Button>
      </div>
    </div>
  );
}