"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { EditableSectionTitle } from "./editable-section-title";
import { ScheduleRow } from "./schedule-row";
import { EditableColumnHeader } from "./editable-column-header";
import { DeleteConfirmation } from "./delete-confirmation";
import { ScheduleSection as Section, ColumnHeader } from "@/lib/types/schedule";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { cn } from "@/lib/utils";

interface ScheduleSectionProps {
  section: Section;
  columns: ColumnHeader[];
  day: string;
  onAddRow: (sectionId: string) => void;
  onDeleteRow: (sectionId: string, rowIndex: number) => void;
  className?: string;
}

export function ScheduleSection({ 
  section, 
  columns, 
  day,
  onAddRow,
  onDeleteRow,
  className
}: ScheduleSectionProps) {
  const { updateColumn, addColumn, deleteColumn } = useScheduleStore();
  const [deleteColumnIndex, setDeleteColumnIndex] = useState<number | null>(null);

  const canDeleteColumn = (index: number) => {
    return index !== 3;
  };

  return (
    <div className={cn("mb-8", className)}>
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
            {columns.map((column, index) => (
              <th
                key={`${day}-${section.id}-header-${column.id}-${index}`}
                className="border p-1 bg-muted text-muted-foreground font-medium text-center relative group h-12"
              >
                <div className="flex flex-col items-center">
                  <EditableColumnHeader
                    column={column}
                    onUpdate={(updatedColumn) => updateColumn(index, updatedColumn)}
                  />
                  <div className="flex gap-1">
                    {canDeleteColumn(index) && (
                      <Button
                        onClick={() => setDeleteColumnIndex(index)}
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    )}
                    {index === columns.length - 1 && (
                      <Button
                        onClick={addColumn}
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: section.rows }).map((_, rowIndex) => (
            <ScheduleRow
              key={`${day}-${section.id}-row-${rowIndex}`}
              rowIndex={rowIndex}
              section={section}
              columns={columns}
              day={day}
              onDeleteRow={onDeleteRow}
            />
          ))}
        </tbody>
      </table>

      <DeleteConfirmation
        isOpen={deleteColumnIndex !== null}
        onClose={() => setDeleteColumnIndex(null)}
        onConfirm={() => {
          if (deleteColumnIndex !== null && canDeleteColumn(deleteColumnIndex)) {
            deleteColumn(deleteColumnIndex);
            setDeleteColumnIndex(null);
          }
        }}
        title="Delete Column"
        description="Are you sure you want to delete this column? This action cannot be undone."
      />
    </div>
  );
}