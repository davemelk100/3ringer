"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScheduleSection } from "@/lib/types/schedule";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface EditableSectionTitleProps {
  section: ScheduleSection;
}

export function EditableSectionTitle({ section }: EditableSectionTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(section.title);
  const updateSection = useScheduleStore((state) => state.updateSection);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateSection({ ...section, title: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="w-full flex items-center">
      {isEditing ? (
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-8 min-h-8 px-2 py-1 text-lg font-semibold"
          autoFocus
        />
      ) : (
        <h3 className="text-lg font-semibold">{value}</h3>
      )}
    </div>
  );
}