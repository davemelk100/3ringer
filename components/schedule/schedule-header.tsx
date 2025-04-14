"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeekDay } from "@/lib/types/schedule";

interface ScheduleHeaderProps {
  weekDays: { day: string; date: string; fullDate: Date }[];
  className?: string;
}

export function ScheduleHeader({
  weekDays,
  className = "",
}: ScheduleHeaderProps) {
  return (
    <div className={className}>
      <TabsList className="w-full mb-0 grid grid-cols-7 gap-0 h-auto bg-transparent p-0">
        {weekDays.map(({ day, date }, index) => (
          <TabsTrigger
            key={day}
            value={day}
            className={`
              h-12 px-2 py-1 text-foreground dark:text-foreground 
              data-[state=active]:border-r data-[state=active]:border-t data-[state=active]:border-[#c6e0f9]
              data-[state=active]:border-b-0
              data-[state=active]:bg-[#c6e0f9] data-[state=active]:!text-black 
              dark:data-[state=active]:!text-black flex flex-col items-center justify-center 
              rounded-none transition-colors duration-200
              hover:bg-[#c6e0f9] hover:text-black
              data-[state=active]:hover:bg-[#c6e0f9]
              bg-[#f1f5f9]
            `}
          >
            <span className="font-medium text-sm truncate w-full text-center">
              {day}
            </span>
            <span className="text-xs opacity-70">{date}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
