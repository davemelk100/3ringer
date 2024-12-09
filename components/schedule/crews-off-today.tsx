"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CrewsOffToday() {
  const [isEditing, setIsEditing] = useState(false);
  const [crewNote, setCrewNote] = useState("");

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label 
        htmlFor="crews-off" 
        className="text-sm font-medium text-[#0D324D] whitespace-nowrap"
      >
        Crews off today:
      </Label>
      <div 
        onClick={handleClick} 
        className="w-32 cursor-text"
      >
        {isEditing ? (
          <Input
            id="crews-off"
            type="text"
            value={crewNote}
            onChange={(e) => setCrewNote(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-8 min-h-8 px-2 py-1"
            autoFocus
          />
        ) : (
          <div className="text-sm text-muted-foreground h-8 flex items-center border-b border-dashed border-muted-foreground">
            {crewNote}
          </div>
        )}
      </div>
    </div>
  );
}