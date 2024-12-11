"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableColumnHeader } from "../draggable-column-header";
import { ScheduleRow } from "../schedule-row";
import { ScheduleSection, ColumnHeader } from "@/lib/types/schedule";
import { cn } from "@/lib/utils";

interface SectionTableProps {
  section: ScheduleSection;
  columns: ColumnHeader[];
  day: string;
  onUpdateColumn: (index: number, column: ColumnHeader) => void;
  onDeleteColumn: (index: number) => void;
  onReorderColumns: (oldIndex: number, newIndex: number) => void;
  onDeleteRow: (sectionId: string, rowIndex: number) => void;
  sensors: any;
}

export function SectionTable({
  section,
  columns,
  day,
  onUpdateColumn,
  onDeleteColumn,
  onReorderColumns,
  onDeleteRow,
  sensors,
}: SectionTableProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && !section.isLocked) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      
      onReorderColumns(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <table className="w-full border-collapse mb-1">
        <thead className="sticky top-0 z-10">
          <tr>
            <SortableContext
              items={columns.map(col => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column, index) => (
                <DraggableColumnHeader
                  key={`${day}-${section.id}-header-${column.id}-${index}`}
                  column={column}
                  index={index}
                  onUpdate={(updatedColumn) => onUpdateColumn(index, updatedColumn)}
                  onDelete={() => onDeleteColumn(index)}
                  canDelete={columns.length > 1 && !section.isLocked}
                />
              ))}
            </SortableContext>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: section.rows }).map((_, rowIndex) => (
            <ScheduleRow
              key={`${day}-${section.id}-row-${rowIndex}`}
              rowIndex={rowIndex}
              section={section}
              columns={columns}
              day={day}
              onDeleteRow={onDeleteRow}
            />
          ))}
        </tbody>
      </table>
    </DndContext>
  );
}