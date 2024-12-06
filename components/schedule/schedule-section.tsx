"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { EditableSectionTitle } from "./editable-section-title";
import { ScheduleRow } from "./schedule-row";
import { EditableColumnHeader } from "./editable-column-header";
import { ScheduleSection as Section, ColumnHeader } from "@/lib/types/schedule";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface ScheduleSectionProps {
  section: Section;
  columns: ColumnHeader[];
  day: string;
  onAddRow: (sectionId: string) => void;
  onDeleteRow: (sectionId: string, rowIndex: number) => void;
}

export function ScheduleSection({ 
  section, 
  columns, 
  day,
  onAddRow,
  onDeleteRow,
}: ScheduleSectionProps) {
  const { updateColumn, addColumn, deleteColumn } = useScheduleStore();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <EditableSectionTitle section={section} />
        <Button
          onClick={() => onAddRow(section.id)}
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
                className="border p-2 bg-muted text-muted-foreground font-medium text-center relative group"
              >
                <div className="flex flex-col items-center">
                  <EditableColumnHeader
                    column={column}
                    onUpdate={(updatedColumn) => updateColumn(index, updatedColumn)}
                  />
                  {index !== 0 && (
                    <div className="flex gap-1 mt-1">
                      <Button
                        onClick={() => deleteColumn(index)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      {index === columns.length - 1 && (
                        <Button
                          onClick={addColumn}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: section.rows }).map((_, rowIndex) => (
            <ScheduleRow
              key={rowIndex}
              rowIndex={rowIndex}
              section={section}
              columns={columns}
              day={day}
              onDeleteRow={onDeleteRow}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}