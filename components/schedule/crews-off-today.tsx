"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function CrewsOffToday() {
  const [isEditing, setIsEditing] = useState(false);
  const [crewNote, setCrewNote] = useState("");
  const inputId = "crews-off-input";

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
      <span 
        className="text-sm font-medium text-[#0D324D] whitespace-nowrap"
        id="crews-off-label"
      >
        Crews off today:
      </span>
      <div 
        onClick={handleClick} 
        className="w-32 cursor-text"
      >
        {isEditing ? (
          <Input
            id={inputId}
            type="text"
            value={crewNote}
            onChange={(e) => setCrewNote(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-8 min-h-8 px-2 py-1"
            autoFocus
            aria-labelledby="crews-off-label"
          />
        ) : (
          <div 
            className="text-sm text-muted-foreground h-8 flex items-center border-b border-dashed border-muted-foreground"
            role="textbox"
            aria-labelledby="crews-off-label"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClick();
              }
            }}
          >
            {crewNote}
          </div>
        )}
      </div>
    </div>
  );
}