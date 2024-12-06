"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface ScheduleCellProps {
  day: string;
  columnId: string;
  rowIndex: number;
  section: string;
}

export function ScheduleCell({ day, columnId, rowIndex, section }: ScheduleCellProps) {
  const { getEventByDayAndTime, updateEvent } = useScheduleStore();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const event = getEventByDayAndTime(day, columnId, rowIndex, section);
    if (event) {
      setContent(event.content);
    } else {
      setContent("");
    }
  }, [day, columnId, rowIndex, section, getEventByDayAndTime]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  return (
    <div
      ref={cellRef}
      className="min-h-[4rem] w-full h-full flex items-center justify-center"
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      onFocus={handleFocus}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className={cn(
            "w-full h-full min-h-[4rem] p-1 resize-none border rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            "bg-background text-foreground text-center"
          )}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="w-full h-full p-1 whitespace-pre-wrap text-center">
          {content}
        </div>
      )}
    </div>
  );
}