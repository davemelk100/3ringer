"use client";

import { WeekSelector } from "@/components/schedule/week-selector";
import { Calendar } from "lucide-react";
import { UserProfile } from "@/components/user/user-profile";
import { PrintOptions } from "@/components/schedule/print-options";

interface HeaderProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function Header({ selectedWeek, onWeekChange }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 px-4 py-4 sm:h-16 bg-[#f1f5f9] print:hidden">
      {/* Left side calendar icon with logo text */}
      <div className="flex-1 flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F68E5F]">
          <Calendar className="h-7 w-7 text-white" />
        </div>
        <span className="text-2xl sm:text-3xl font-bold uppercase text-[#0D324D]">Schedule</span>
      </div>
      
      {/* Centered week selector */}
      <div className="flex items-center w-full sm:w-auto justify-center">
        <WeekSelector selectedWeek={selectedWeek} onWeekChange={onWeekChange} />
      </div>
      
      {/* Right-aligned user profile */}
      <div className="flex-1 flex justify-center sm:justify-end items-center gap-4 bg-transparent w-full sm:w-auto">
        <PrintOptions />
        <UserProfile />
      </div>
    </div>
  );
}