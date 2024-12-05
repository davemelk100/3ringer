"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ColumnHeader } from "@/lib/types/schedule";

interface EditableColumnHeaderProps {
  column: ColumnHeader;
  onUpdate: (column: ColumnHeader) => void;
}

export function EditableColumnHeader({ column, onUpdate }: EditableColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(column.title);

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
    }
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="w-full">
      {isEditing ? (
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-6 min-h-6 px-1 py-0 text-sm"
          autoFocus
        />
      ) : (
        <span className="text-sm font-medium">{value}</span>
      )}
    </div>
  );
}