"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { ScheduleSection } from "@/lib/types/schedule";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface EditableSectionTitleProps {
  section: ScheduleSection;
}

export function EditableSectionTitle({ section }: EditableSectionTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(section.title);
  const { updateSection, toggleSectionLock } = useScheduleStore();

  const handleDoubleClick = () => {
    if (!section.isLocked) {
      setIsEditing(true);
    }
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
    <div className="flex items-center h-8 gap-2">
      <div onDoubleClick={handleDoubleClick} className="w-32">
        {isEditing ? (
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-8 min-h-8 px-2 py-1 text-lg font-[900] text-[#0D324D] font-condensed"
            autoFocus
          />
        ) : (
          <h3 className="text-lg font-[900] text-[#0D324D] font-condensed leading-8">
            {value}
          </h3>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => toggleSectionLock(section.id)}
        className="h-8 w-8 p-0"
        title={section.isLocked ? "Unlock table" : "Lock table"}
      >
        {section.isLocked ? (
          <Lock className="h-4 w-4 text-[#0D324D]" />
        ) : (
          <Unlock className="h-4 w-4 text-[#0D324D]" />
        )}
        <span className="sr-only">
          {section.isLocked ? "Unlock table" : "Lock table"}
        </span>
      </Button>
    </div>
  );
}