"use client";

import { useState, useEffect } from "react";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface UseCellStateProps {
  day: string;
  columnId: string;
  rowIndex: number;
  section: string;
}

export function useCellState({ day, columnId, rowIndex, section }: UseCellStateProps) {
  const { getEventByDayAndTime, updateEvent } = useScheduleStore();
  const [content, setContent] = useState("");

  useEffect(() => {
    const event = getEventByDayAndTime(day, columnId, rowIndex, section);
    setContent(event?.content || "");
  }, [day, columnId, rowIndex, section, getEventByDayAndTime]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = () => {
    if (content.trim()) {
      updateEvent({
        id: `${day}-${columnId}-${section}-${rowIndex}`,
        content,
        day,
        columnId,
        rowIndex,
        section,
      });
    }
  };

  return {
    content,
    handleContentChange,
    handleSave,
  };
}