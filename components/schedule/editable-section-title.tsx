"use client";

import { useState, useEffect } from "react";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { ScheduleSection } from "@/lib/types/schedule";

interface EditableSectionTitleProps {
  section: ScheduleSection;
  onUpdate: (newTitle: string) => void;
}

export function EditableSectionTitle({
  section,
  onUpdate,
}: EditableSectionTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);

  // Reset local state when section changes
  useEffect(() => {
    setTitle(section.title);
  }, [section.title]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    if (title !== section.title) {
      onUpdate(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div
      className="flex items-center h-8 gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-32">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-lg font-[700] text-[#0D324D] font-condensed leading-8 outline-none w-full"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3
            onClick={handleClick}
            className="text-lg font-[700] text-[#0D324D] font-condensed leading-8 cursor-text"
          >
            {section.title}
          </h3>
        )}
      </div>
    </div>
  );
}
