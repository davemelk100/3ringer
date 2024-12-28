"use client";

import { WeekDay } from "@/lib/types/schedule";
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getCurrentWeekDates } from "@/lib/utils/date";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { useColumns } from "./use-columns";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleSection } from "./schedule-section";
import { CollapsibleHeader } from "@/components/layout/collapsible-header";
import { startOfWeek, isToday, format } from "date-fns";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ScheduleTable() {
  const { weekDays, selectedWeek, sections } = useScheduleStore();
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = weekDays.find((day) => isToday(day.fullDate));
    return today || weekDays[0];
  });
  const { setActiveDay } = useScheduleStore();
  const columns = useColumns();

  useEffect(() => {
    const today = weekDays.find((day) => isToday(day.fullDate));
    setSelectedDay(today || weekDays[0]);
  }, [weekDays, selectedWeek]);

  return (
    <div className="space-y-4">
      <CollapsibleHeader
        selectedWeek={selectedWeek}
        onWeekChange={(week) => {
          // Your implementation here i gotta figure this
        }}
      />
      <div className="rounded-lg overflow-hidden">
        <Tabs
          defaultValue={selectedDay.fullDate.toISOString()}
          value={selectedDay.fullDate.toISOString()}
        >
          <TabsList className="grid grid-cols-7 h-14 border-b-2 border-[#c6e0f9]">
            {weekDays.map((day) => (
              <TabsTrigger
                key={day.fullDate.toISOString()}
                value={day.fullDate.toISOString()}
                onClick={() => setSelectedDay(day)}
                className="flex flex-col items-center justify-center border-none data-[state=active]:bg-[#c6e0f9] data-[state=active]:text-black"
              >
                <span className="text-sm font-medium">
                  {format(day.fullDate, "EEE")}
                </span>
                <span className="text-xs">{format(day.fullDate, "MMM d")}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="p-4 bg-[#c6e0f9]">
            {weekDays.map((day) => (
              <TabsContent
                key={day.fullDate.toISOString()}
                value={day.fullDate.toISOString()}
              >
                {sections.map((section) => (
                  <ScheduleSection
                    key={section.id}
                    section={section}
                    columns={columns}
                    selectedDay={day}
                  />
                ))}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
