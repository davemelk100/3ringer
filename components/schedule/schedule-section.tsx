"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table2, Plus } from "lucide-react";
import { EditableSectionTitle } from "./editable-section-title";
import { ScheduleRow } from "./schedule-row";
import { DeleteConfirmation } from "./delete-confirmation";
import { AddColumnDialog } from "./add-column-dialog";
import { ScheduleSection as Section, ColumnHeader } from "@/lib/types/schedule";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableColumnHeader } from "./draggable-column-header";

interface ScheduleSectionProps {
  section: Section;
  columns: ColumnHeader[];
  day: string;
  onAddRow: (sectionId: string) => void;
  onDeleteRow: (sectionId: string, rowIndex: number) => void;
  className?: string;
}

export function ScheduleSection({ 
  section, 
  columns, 
  day,
  onAddRow,
  onDeleteRow,
  className
}: ScheduleSectionProps) {
  const { updateColumn, addColumn, deleteColumn, reorderColumns } = useScheduleStore();
  const [deleteColumnIndex, setDeleteColumnIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const canDeleteColumn = (index: number) => {
    return columns.length > 1;
  };

  const handleAddColumn = (title: string, type: 'text' | 'dropdown') => {
    addColumn(title, type);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      
      reorderColumns(oldIndex, newIndex);
    }
  };

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <EditableSectionTitle section={section} />
        <div className="flex items-center gap-2 print-hide">
          <AddColumnDialog onAddColumn={handleAddColumn} />
          <Button
            onClick={() => onAddRow(section.id)}
            size="sm"
            variant="outline"
            className="flex items-center gap-1 bg-[#F68E5F] text-[#0D324D] hover:bg-transparent hover:text-[#0D324D] border-[#F68E5F] group"
          >
            <Table2 className="h-4 w-4 text-[#0D324D] transition-colors" />
            <Plus className="h-4 w-4 text-[#0D324D] transition-colors" />
            <span className="hidden sm:inline">Add Row</span>
          </Button>
        </div>
      </div>
      <div className="relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full border-collapse mb-4">
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
                      onUpdate={(updatedColumn) => updateColumn(index, updatedColumn)}
                      onDelete={canDeleteColumn(index) ? () => setDeleteColumnIndex(index) : undefined}
                      canDelete={canDeleteColumn(index)}
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
      </div>

      <DeleteConfirmation
        isOpen={deleteColumnIndex !== null}
        onClose={() => setDeleteColumnIndex(null)}
        onConfirm={() => {
          if (deleteColumnIndex !== null && canDeleteColumn(deleteColumnIndex)) {
            deleteColumn(deleteColumnIndex);
            setDeleteColumnIndex(null);
          }
        }}
        title="Delete Column"
        description="Are you sure you want to delete this column? This action cannot be undone."
      />
    </div>
  );
}