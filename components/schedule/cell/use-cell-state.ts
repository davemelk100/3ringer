"use client";

import { useState, useEffect } from "react";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { trackScheduleAction } from "@/lib/actions/track-schedule-action";

interface UseCellStateProps {
  day: string;
  columnId: string;
  rowIndex: number;
  section: string;
}

export function useCellState({
  day,
  columnId,
  rowIndex,
  section,
}: UseCellStateProps) {
  const { getEventByDayAndTime, updateEvent } = useScheduleStore();
  const [content, setContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");

  useEffect(() => {
    const event = getEventByDayAndTime(day, columnId, rowIndex, section);
    const eventContent = event?.content || "";
    setContent(eventContent);
    setPreviousContent(eventContent);
  }, [day, columnId, rowIndex, section, getEventByDayAndTime]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = () => {
    if (content.trim()) {
      const cellId = `${day}-${columnId}-${section}-${rowIndex}`;

      // Track the change
      trackScheduleAction({
        type: "CELL_UPDATE",
        changes: [
          {
            before: previousContent,
            after: content,
            field: "content",
            cellId: cellId,
          },
        ],
      });

      // Update the store
      updateEvent({
        id: cellId,
        content,
        day,
        columnId,
        rowIndex,
        section,
      });

      // Update previous content for next change
      setPreviousContent(content);
    }
  };

  return {
    content,
    handleContentChange,
    handleSave,
  };
}
