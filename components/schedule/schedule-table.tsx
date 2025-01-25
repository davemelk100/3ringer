"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getCurrentWeekDates } from "@/lib/utils/date";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { useColumns } from "./use-columns";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleSection } from "./schedule-section";
import { CollapsibleHeader } from "@/components/layout/collapsible-header";
import { startOfWeek, isToday } from "date-fns";

export function ScheduleTable() {
  const [selectedWeek, setSelectedWeek] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const weekDays = getCurrentWeekDates(selectedWeek);
  const { sections, addRow, deleteRow, initializeSections, setActiveDay } =
    useScheduleStore();
  const columns = useColumns();
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = weekDays.find((day) => isToday(day.fullDate));
    return today || weekDays[0];
  });

  useEffect(() => {
    initializeSections();
  }, [initializeSections]);

  useEffect(() => {
    const today = weekDays.find((day) => isToday(day.fullDate));
    setSelectedDay(today || weekDays[0]);
  }, [selectedWeek]);

  useEffect(() => {
    setActiveDay(selectedDay.fullDate);
  }, [selectedDay, setActiveDay]);

  return (
    <div className="w-full">
      <CollapsibleHeader
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
      />
      <Tabs
        value={selectedDay.day}
        className="w-full mt-2 sm:mt-4"
        onValueChange={(value) => {
          const day = weekDays.find((d) => d.day === value);
          if (day) {
            setSelectedDay(day);
            setActiveDay(day.fullDate);
          }
        }}
      >
        <div className="mt-0 bg-white rounded-[8px] shadow-xl shadow-gray-200/80 overflow-hidden border border-gray-200">
          <div className="sticky top-0 z-20 bg-white">
            <ScheduleHeader
              weekDays={weekDays}
              className="border-b border-gray-200"
            />
          </div>
          {weekDays.map(({ day }) => (
            <TabsContent
              key={day}
              value={day}
              className="mt-0 print:block bg-[#c6e0f9] p-4 sm:p-6"
            >
              <div className="overflow-x-auto">
                {sections?.map((section, index) => (
                  <ScheduleSection
                    key={section.id}
                    section={section}
                    columns={columns}
                    day={day}
                    onAddRow={addRow}
                    onDeleteRow={deleteRow}
                    className={index > 0 ? "section-break" : ""}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
