"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ColumnHeader } from "@/lib/types/schedule";

interface EditableColumnHeaderProps {
  column: ColumnHeader;
  onUpdate: (column: ColumnHeader) => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function EditableColumnHeader({ 
  column, 
  onUpdate,
  onDelete,
  canDelete = true
}: EditableColumnHeaderProps) {
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
    <div className="relative group h-full flex items-center justify-center w-full">
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
            className="h-5 min-h-5 px-1 py-0 text-sm text-center text-[#0D324D]"
            autoFocus
          />
        ) : (
          <span className="text-sm font-medium text-[#0D324D] text-center w-full">
            {value || "(Click to edit)"}
          </span>
        )}
      </div>
      {canDelete && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="absolute -top-[1px] -right-[1px] h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-none"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}