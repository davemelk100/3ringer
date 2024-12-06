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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div 
      onDoubleClick={handleDoubleClick} 
      className="w-full min-h-[20px] cursor-text flex items-center justify-center"
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-5 min-h-5 px-1 py-0 text-sm text-center"
          autoFocus
        />
      ) : (
        <span className="text-sm font-medium">
          {value || "(Click to edit)"}
        </span>
      )}
    </div>
  );
}