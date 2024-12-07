"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScheduleCell } from "./schedule-cell";
import { StatusDropdown } from "./status-dropdown";
import { YesNoDropdown } from "./yes-no-dropdown";
import { ConfigurableDropdown } from "./configurable-dropdown";
import { DeleteConfirmation } from "./delete-confirmation";
import { ScheduleSection, ColumnHeader } from "@/lib/types/schedule";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { scheduleConfig } from "@/lib/config/schedule";

interface ScheduleRowProps {
  rowIndex: number;
  section: ScheduleSection;
  columns: ColumnHeader[];
  day: string;
  onDeleteRow: (sectionId: string, rowIndex: number) => void;
}

export function ScheduleRow({
  rowIndex,
  section,
  columns,
  day,
  onDeleteRow,
}: ScheduleRowProps) {
  const { getYesNoValue, updateYesNoValue } = useScheduleStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getColumnContent = (colIndex: number, column: ColumnHeader) => {
    if (colIndex === 0) {
      return (
        <div className="flex items-center justify-center">
          <StatusDropdown
            sectionId={section.id}
            rowIndex={rowIndex}
            day={day}
          />
        </div>
      );
    }

    const configurableDropdown = scheduleConfig.configurableDropdowns.find(
      (dropdown) => dropdown.columnIndex === colIndex
    );

    if (configurableDropdown) {
      return (
        <div className="flex items-center justify-center">
          <ConfigurableDropdown
            day={day}
            sectionId={section.id}
            rowIndex={rowIndex}
            columnId={column.id}
            dropdownId={configurableDropdown.id}
          />
        </div>
      );
    }

    if (colIndex === 6 || colIndex === 9 || colIndex === 13) {
      return (
        <div className="flex items-center justify-center">
          <YesNoDropdown
            value={getYesNoValue(`${day}-${section.id}-${rowIndex}-${column.id}`)}
            onChange={(value) => 
              updateYesNoValue(`${day}-${section.id}-${rowIndex}-${column.id}`, value)
            }
          />
        </div>
      );
    }

    return (
      <ScheduleCell
        day={day}
        columnId={column.id}
        rowIndex={rowIndex}
        section={section.id}
      />
    );
  };

  const canDeleteRow = section.rows > 1;

  return (
    <>
      <tr className="group/row">
        {columns.map((column, colIndex) => (
          <td
            key={`${day}-${section.id}-${column.id}-${rowIndex}-${colIndex}`}
            className="border p-1 h-12 align-middle hover:bg-muted/50 transition-colors relative"
          >
            {getColumnContent(colIndex, column)}
            {colIndex === 0 && canDeleteRow && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="absolute -left-2 top-1/2 -translate-y-1/2 h-5 w-5 p-0 opacity-0 group-hover/row:opacity-100 transition-opacity bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </td>
        ))}
      </tr>

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDeleteRow(section.id, rowIndex);
          setShowDeleteConfirm(false);
        }}
        title="Delete Row"
        description="Are you sure you want to delete this row? This action cannot be undone."
      />
    </>
  );
}