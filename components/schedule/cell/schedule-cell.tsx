"use client";

import { useDimensions } from "@/lib/hooks/useDimensions";
import { useFormField } from "@/lib/hooks/useFormField";
import { CellTextarea } from "./cell-textarea";
import { useCellState } from "./use-cell-state";

interface ScheduleCellProps {
  day: string;
  columnId: string;
  rowIndex: number;
  section: string;
}

export function ScheduleCell({ day, columnId, rowIndex, section }: ScheduleCellProps) {
  const { content, handleContentChange, handleSave } = useCellState({
    day,
    columnId,
    rowIndex,
    section,
  });

  const { ref: cellRef, dimensions } = useDimensions<HTMLDivElement>();
  const { isEditing, startEditing, stopEditing } = useFormField({
    initialValue: content,
    onSave: handleSave,
  });

  return (
    <div
      ref={cellRef}
      className="h-full w-full flex items-center justify-center min-h-[1.5rem]"
      onDoubleClick={startEditing}
      tabIndex={0}
      onFocus={startEditing}
      style={dimensions.height ? { height: `${dimensions.height}px` } : undefined}
    >
      {isEditing ? (
        <CellTextarea
          content={content}
          onChange={handleContentChange}
          onBlur={stopEditing}
          height={dimensions.height}
        />
      ) : (
        <div className="w-full h-full p-0.5 whitespace-pre-wrap text-center flex items-center justify-center text-sm">
          {content}
        </div>
      )}
    </div>
  );
}