"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getCurrentWeekDates } from "@/lib/utils/date";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { useColumns } from "./use-columns";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleSection } from "./schedule-section";
import { CollapsibleHeader } from "@/components/layout/collapsible-header";
import { startOfWeek, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      <CollapsibleHeader selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
      <Tabs 
        value={selectedDay.day}
        className="w-full"
        onValueChange={(value) => {
          const day = weekDays.find(d => d.day === value);
          if (day) setSelectedDay(day);
        }}
      >
        <div className="mt-4">
          <div className="sticky top-0 z-20 bg-white">
            <ScheduleHeader weekDays={weekDays} />
            <div className="w-full bg-[#A1C6EA] px-4 py-2 mb-0 print:bg-transparent print:border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-black uppercase text-left">
                {selectedDay.day} - {selectedDay.date}, {format(selectedDay.fullDate, "yyyy")}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrint}
                title="Print Schedule"
                className="border-black group hover:bg-black hover:text-white shadow-none hover:shadow-none focus:shadow-none focus-visible:shadow-none bg-transparent print:hidden"
              >
                <Printer className="h-4 w-4 text-black group-hover:text-white transition-colors" />
              </Button>
            </div>
          </div>
          {weekDays.map(({ day }) => (
            <TabsContent key={day} value={day} className="mt-0 print:block bg-white p-4">
              <div className="overflow-x-auto">
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