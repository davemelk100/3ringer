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
      className="border p-1 bg-[#e2e8f0] text-muted-foreground font-medium relative group h-10 print:!text-center"
    >
      <div className="flex items-center justify-center h-full">
        <div className="flex-1 flex items-center justify-center w-full">
          <EditableColumnHeader
            column={column}
            onUpdate={onUpdate}
            onDelete={onDelete}
            canDelete={canDelete}
          />
        </div>
        <div 
          className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-black hover:text-gray-600 transition-colors" />
          <span className="sr-only">Drag to reorder {column.title} column</span>
        </div>
      </div>
    </th>
  );
}