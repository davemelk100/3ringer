"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getCurrentWeekDates } from "@/lib/utils/date";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { useColumns } from "./use-columns";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleSection } from "./schedule-section";

export function ScheduleTable() {
  const weekDays = getCurrentWeekDates();
  const { 
    sections, 
    addRow, 
    deleteRow, 
    initializeSections,
  } = useScheduleStore();
  const columns = useColumns();
  const [selectedDay, setSelectedDay] = useState(weekDays[0]);

  useEffect(() => {
    initializeSections();
  }, [initializeSections]);

  return (
    <div className="w-full max-w-[95vw] mx-auto p-4">
      <Tabs 
        defaultValue={weekDays[0].day} 
        className="w-full"
        onValueChange={(value) => {
          const day = weekDays.find(d => d.day === value);
          if (day) setSelectedDay(day);
        }}
      >
        <ScheduleHeader weekDays={weekDays} />
        <div className="w-full bg-[#A1C6EA] p-4 mb-0">
          <h2 className="text-2xl font-bold text-black uppercase text-left">
            {selectedDay.day} - {selectedDay.date}
          </h2>
        </div>
        {weekDays.map(({ day }) => (
          <TabsContent key={day} value={day} className="mt-0">
            <div className="overflow-x-auto p-4">
              {sections.map((section) => (
                <ScheduleSection
                  key={section.id}
                  section={section}
                  columns={columns}
                  day={day}
                  onAddRow={addRow}
                  onDeleteRow={deleteRow}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}