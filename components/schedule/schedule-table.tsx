"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getCurrentWeekDates } from "@/lib/utils/date";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { useColumns } from "./use-columns";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleSection } from "./schedule-section";
import { CollapsibleHeader } from "@/components/layout/collapsible-header";
import { startOfWeek } from "date-fns";

export function ScheduleTable() {
  const [selectedWeek, setSelectedWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const weekDays = getCurrentWeekDates(selectedWeek);
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

  useEffect(() => {
    setSelectedDay(weekDays[0]);
  }, [selectedWeek]);

  return (
    <div className="w-full max-w-[95vw] mx-auto print:max-w-none print:w-full print:mx-0">
      <CollapsibleHeader selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
      <Tabs 
        value={selectedDay.day}
        className="w-full"
        onValueChange={(value) => {
          const day = weekDays.find(d => d.day === value);
          if (day) setSelectedDay(day);
        }}
      >
        <div className="px-4 mt-4">
          <ScheduleHeader weekDays={weekDays} />
          <div className="w-full bg-[#A1C6EA] p-4 mb-0 print:bg-transparent print:border-b">
            <h2 className="text-2xl font-bold text-black uppercase text-left">
              {selectedDay.day} - {selectedDay.date}
            </h2>
          </div>
          {weekDays.map(({ day }) => (
            <TabsContent key={day} value={day} className="mt-0 print:block">
              <div className="overflow-x-auto p-4 print:p-0">
                {sections.map((section, index) => (
                  <ScheduleSection
                    key={section.id}
                    section={section}
                    columns={columns}
                    day={day}
                    onAddRow={addRow}
                    onDeleteRow={deleteRow}
                    className={index > 0 ? 'section-break' : ''}
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