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
  const [crewNote, setCrewNote] = useState("");
  const [isCrewNoteEditing, setIsCrewNoteEditing] = useState(false);
  const updateSection = useScheduleStore((state) => state.updateSection);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleCrewNoteDoubleClick = () => {
    setIsCrewNoteEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateSection({ ...section, title: value });
  };

  const handleCrewNoteBlur = () => {
    setIsCrewNoteEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div onDoubleClick={handleDoubleClick} className="w-32">
        {isEditing ? (
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-8 min-h-8 px-2 py-1 text-lg font-semibold text-[#0D324D]"
            autoFocus
          />
        ) : (
          <h3 className="text-lg font-semibold text-[#0D324D]">{value}</h3>
        )}
      </div>
      {section.id === "carpet" && (
        <div 
          onDoubleClick={handleCrewNoteDoubleClick} 
          className="w-32 border-b border-dashed border-muted-foreground/50 cursor-text"
        >
          {isCrewNoteEditing ? (
            <Input
              type="text"
              value={crewNote}
              onChange={(e) => setCrewNote(e.target.value)}
              onBlur={handleCrewNoteBlur}
              onKeyDown={handleKeyDown}
              className="h-8 min-h-8 px-2 py-1"
              placeholder="Crews off today"
              autoFocus
            />
          ) : (
            <p className="text-sm text-muted-foreground h-8 flex items-center">
              {crewNote || "Crews off today"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}