"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeekDay } from "@/lib/types/schedule";

interface ScheduleHeaderProps {
  weekDays: WeekDay[];
}

export function ScheduleHeader({ weekDays }: ScheduleHeaderProps) {
  return (
    <TabsList className="w-full mb-0 grid grid-cols-7 gap-[5px] h-auto bg-transparent p-0">
      {weekDays.map(({ day, date }) => (
        <TabsTrigger 
          key={day} 
          value={day} 
          className="h-12 px-2 py-1 text-foreground dark:text-foreground border-[#A1C6EA] border 
            data-[state=active]:border-0 data-[state=active]:bg-[#A1C6EA] data-[state=active]:!text-black 
            dark:data-[state=active]:!text-black flex flex-col items-center justify-center rounded-none
            hover:bg-[#A1C6EA]/20 transition-colors duration-200
            data-[state=active]:hover:bg-[#A1C6EA]"
        >
          <span className="font-medium text-sm truncate w-full text-center">
            {day}
          </span>
          <span className="text-xs opacity-70">
            {date}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}