"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ColumnHeader } from "@/lib/types/schedule";

interface EditableColumnHeaderProps {
  column: ColumnHeader;
  onUpdate: (column: ColumnHeader) => void;
}

export function EditableColumnHeader({ column, onUpdate }: EditableColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Always update with current value, even if empty
    onUpdate({ ...column, title: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setValue(column.title);
      setIsEditing(false);
    }
  };

  // Make the header always clickable, even when empty
  const displayValue = value || "(Click to edit)";

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div 
      onDoubleClick={handleDoubleClick} 
      className="w-full min-h-[24px] cursor-text"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-6 min-h-6 px-1 py-0 text-sm"
          placeholder="Enter header text"
          autoFocus
        />
      ) : (
        <span className={`text-sm font-medium ${!value ? 'text-muted-foreground italic' : ''}`}>
          {displayValue}
        </span>
      )}
    </div>
  );
}