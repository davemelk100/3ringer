"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditableColumnHeader } from "./editable-column-header";
import { ColumnHeader } from "@/lib/types/schedule";
import { GripVertical } from "lucide-react";

interface DraggableColumnHeaderProps {
  column: ColumnHeader;
  index: number;
  onUpdate: (column: ColumnHeader) => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function DraggableColumnHeader({
  column,
  index,
  onUpdate,
  onDelete,
  canDelete = true,
}: DraggableColumnHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="border p-1 bg-muted text-muted-foreground font-medium relative group h-10 print:!text-center"
    >
      <div className="flex items-center justify-center h-full relative">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 px-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden z-10"
          {...attributes}
          {...listeners}
        >
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <EditableColumnHeader
            column={column}
            onUpdate={onUpdate}
            onDelete={onDelete}
            canDelete={canDelete}
          />
        </div>
      </div>
    </th>
  );
}