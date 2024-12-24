"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface ColumnActionsProps {
  columnId: string;
}

export function ColumnActions({ columnId }: ColumnActionsProps) {
  const scheduleStore = useScheduleStore();
  const columnsLength = useScheduleStore((state) => state.columns.length);

  const handleDelete = () => {
    if (scheduleStore) {
      scheduleStore.deleteColumn(parseInt(columnId, 10));
    }
  };

  return (
    <div className="flex gap-1 justify-center mt-1">
      <Button
        onClick={handleDelete}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0"
      >
        <Minus className="h-4 w-4" />
      </Button>
      {parseInt(columnId, 10) === columnsLength - 1 && (
        <Button
          onClick={() => scheduleStore.addColumn("New Column", "text")}
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
