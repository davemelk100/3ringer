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

export function ScheduleCell({
  day,
  columnId,
  rowIndex,
  section,
}: ScheduleCellProps) {
  const { getEventByDayAndTime, updateEvent } = useScheduleStore();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const [cellHeight, setCellHeight] = useState<number>();

  useEffect(() => {
    const event = getEventByDayAndTime(day, columnId, rowIndex, section);
    if (event) {
      setContent(event.content);
    } else {
      setContent("");
    }
  }, [day, columnId, rowIndex, section, getEventByDayAndTime]);

  const handleDoubleClick = () => {
    if (cellRef.current) {
      setCellHeight(cellRef.current.offsetHeight);
    }
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
      (e.currentTarget as HTMLElement).blur();
    }
  };

  const handleFocus = () => {
    if (cellRef.current) {
      setCellHeight(cellRef.current.offsetHeight);
    }
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
      className="h-full w-full flex items-center justify-center min-h-[1.5rem]"
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      onFocus={handleFocus}
      style={cellHeight ? { height: `${cellHeight}px` } : undefined}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className={cn(
            "w-full h-full min-h-[1.5rem] p-0.5 resize-none border rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            "bg-background text-foreground text-center text-sm",
            "flex items-center justify-center"
          )}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            height: cellHeight ? `${cellHeight}px` : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1.2",
            paddingTop: "0.125rem",
          }}
        />
      ) : (
        <div className="w-full h-full p-0.5 whitespace-pre-wrap text-center flex items-center justify-center text-sm">
          {content}
        </div>
      )}
    </div>
  );
}
