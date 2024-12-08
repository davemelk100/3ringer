"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScheduleCell } from "./schedule-cell";
import { YesNoDropdown } from "./yes-no-dropdown";
import { ConfigurableDropdown } from "./configurable-dropdown";
import { DeleteConfirmation } from "./delete-confirmation";
import { AddressSearch } from "@/components/address/address-search";
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
  const { getYesNoValue, updateYesNoValue, getEventByDayAndTime, updateEvent } = useScheduleStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getColumnContent = (colIndex: number, column: ColumnHeader) => {
    if (column.id === 'address') {
      const event = getEventByDayAndTime(day, column.id, rowIndex, section.id);
      return (
        <div className="flex items-center justify-center">
          <AddressSearch
            value={event?.content}
            onSelect={(address) => {
              updateEvent({
                id: `${day}-${column.id}-${section.id}-${rowIndex}`,
                content: address.formattedAddress,
                day,
                columnId: column.id,
                rowIndex,
                section: section.id,
              });
            }}
            className="min-h-[2rem] bg-white"
            placeholder="Enter address..."
          />
        </div>
      );
    }

    if (column.type === 'dropdown') {
      return (
        <div className="flex items-center justify-center">
          <ConfigurableDropdown
            day={day}
            sectionId={section.id}
            rowIndex={rowIndex}
            columnId={column.id}
            dropdownId={column.id}
          />
        </div>
      );
    }

    if (colIndex === 5 || colIndex === 8 || colIndex === 12) {
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
      <tr className="group/row relative">
        {columns.map((column, colIndex) => (
          <td
            key={`${day}-${section.id}-${column.id}-${rowIndex}-${colIndex}`}
            className="border p-1 h-10 align-middle hover:bg-muted/50 transition-colors bg-white"
          >
            {getColumnContent(colIndex, column)}
          </td>
        ))}
        {canDeleteRow && (
          <td className="w-0 p-0 border-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-5 w-5 p-0 opacity-0 group-hover/row:opacity-100 transition-opacity bg-destructive hover:bg-destructive/90 text-destructive-foreground -ml-5"
            >
              <X className="h-3 w-3" />
            </Button>
          </td>
        )}
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