"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { ScheduleCell } from "./schedule-cell";
import { EditableColumnHeader } from "./editable-column-header";
import { EditableSectionTitle } from "./editable-section-title";
import { getCurrentWeekDates } from "@/lib/utils/date";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { useColumns } from "./use-columns";

export function ScheduleTable() {
  const weekDays = getCurrentWeekDates();
  const { updateColumn, sections, addRow, deleteRow, initializeSections } =
    useScheduleStore();
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
          const day = weekDays.find((d) => d.day === value);
          if (day) setSelectedDay(day);
        }}
      >
        <TabsList className="w-full mb-0 grid grid-cols-7 gap-[5px] h-auto bg-transparent p-0">
          {weekDays.map(({ day, date }) => (
            <TabsTrigger
              key={day}
              value={day}
              className="min-h-[3.5rem] px-2 py-2 border-[#A1C6EA] border data-[state=active]:border-0 data-[state=active]:bg-[#A1C6EA] data-[state=active]:text-black flex flex-col items-center justify-center rounded-none"
            >
              <span className="font-medium text-sm truncate w-full text-center">
                {day}
              </span>
              <span className="text-xs opacity-70">{date}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="w-full bg-[#A1C6EA] p-4 mb-4">
          <h2 className="text-2xl font-bold text-black uppercase">
            {selectedDay.day} - {selectedDay.date}
          </h2>
        </div>
        {weekDays.map(({ day }) => (
          <TabsContent key={day} value={day}>
            <div className="overflow-x-auto">
              {sections.map((section) => (
                <div key={section.id} className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <EditableSectionTitle section={section} />
                    <Button
                      onClick={() => addRow(section.id)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Row
                    </Button>
                  </div>
                  <table className="w-full border-collapse mb-4">
                    <thead>
                      <tr>
                        <th className="w-8 p-2"></th>
                        {columns.map((column, index) => (
                          <th
                            key={column.id}
                            className="border p-2 bg-muted text-muted-foreground font-medium"
                          >
                            <EditableColumnHeader
                              column={column}
                              onUpdate={(updatedColumn) =>
                                updateColumn(index, updatedColumn)
                              }
                            />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: section.rows }).map(
                        (_, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="w-8 p-2">
                              {section.rows > 1 && (
                                <Button
                                  onClick={() =>
                                    deleteRow(section.id, rowIndex)
                                  }
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </td>
                            {columns.map((column) => (
                              <td
                                key={`${column.id}-${rowIndex}`}
                                className="border p-2 h-24 align-top hover:bg-muted/50 transition-colors"
                              >
                                <ScheduleCell
                                  day={day}
                                  columnId={column.id}
                                  rowIndex={rowIndex}
                                  section={section.id}
                                />
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
