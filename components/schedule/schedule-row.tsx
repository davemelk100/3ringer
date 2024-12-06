"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { ScheduleCell } from "./schedule-cell";
import { StatusDropdown } from "./status-dropdown";
import { YesNoDropdown } from "./yes-no-dropdown";
import { ConfigurableDropdown } from "./configurable-dropdown";
import { DeleteConfirmation } from "./delete-confirmation";
import { scheduleConfig } from "@/lib/config/schedule";
import { ScheduleSection, ColumnHeader } from "@/lib/types/schedule";
import { useScheduleStore } from "@/lib/store/schedule-store";

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

  const getColumnContent = (colIndex: number, columnId: string) => {
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
            columnId={columnId}
            dropdownId={configurableDropdown.id}
          />
        </div>
      );
    }

    if (colIndex === 6 || colIndex === 9 || colIndex === 13) {
      return (
        <div className="flex items-center justify-center">
          <YesNoDropdown
            value={getYesNoValue(`${day}-${section.id}-${rowIndex}-${columnId}`)}
            onChange={(value) => 
              updateYesNoValue(`${day}-${section.id}-${rowIndex}-${columnId}`, value)
            }
          />
        </div>
      );
    }

    return (
      <ScheduleCell
        day={day}
        columnId={columnId}
        rowIndex={rowIndex}
        section={section.id}
      />
    );
  };

  return (
    <>
      <tr>
        <td className="w-8 p-2">
          {section.rows > 1 && (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
        </td>
        {columns.map((column, colIndex) => (
          <td
            key={`${column.id}-${rowIndex}`}
            className="border p-2 h-16 align-middle hover:bg-muted/50 transition-colors"
          >
            {getColumnContent(colIndex, column.id)}
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