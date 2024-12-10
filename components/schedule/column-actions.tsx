"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface ColumnActionsProps {
  columnIndex: number;
}

export function ColumnActions({ columnIndex }: ColumnActionsProps) {
  const { addColumn, deleteColumn } = useScheduleStore();

  if (columnIndex === 0) {
    return null;
  }

  return (
    <div className="flex gap-1 justify-center mt-1">
      <Button
        onClick={() => deleteColumn(columnIndex)}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0"
      >
        <Minus className="h-4 w-4" />
      </Button>
      {columnIndex === useScheduleStore((state) => state.columns.length - 1) && (
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
  );
}