"use client";

import { useDimensions } from "@/lib/hooks/useDimensions";
import { useFormField } from "@/lib/hooks/useFormField";
import { CellTextarea } from "./cell-textarea";
import { useCellState } from "./use-cell-state";
import { KeyboardEvent } from "react";

interface ScheduleCellProps {
  day: string;
  columnId: string;
  rowIndex: number;
  section: string;
}

export function ScheduleCell({
  day,
  columnId,
  rowIndex,
  section,
}: ScheduleCellProps) {
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

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Tab") {
      // Default tab behavior will work
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      // Find next input and focus it
      const inputs = Array.from(document.querySelectorAll("input, textarea"));
      const currentIndex = inputs.indexOf(e.target as HTMLElement);
      const nextInput = inputs[currentIndex + 1];

      if (nextInput) {
        (nextInput as HTMLElement).focus();
      }
    }
  };

  return (
    <div
      ref={cellRef}
      className="h-full w-full flex items-center justify-center min-h-[1.5rem]"
      onDoubleClick={startEditing}
      tabIndex={0}
      onFocus={startEditing}
      style={
        dimensions.height ? { height: `${dimensions.height}px` } : undefined
      }
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
