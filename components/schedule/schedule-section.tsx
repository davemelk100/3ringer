"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table2, Lock, Unlock } from "lucide-react";
import { EditableSectionTitle } from "./editable-section-title";
import { ScheduleRow } from "./schedule-row";
import { DeleteConfirmation } from "./delete-confirmation";
import { AddColumnDialog } from "./add-column-dialog";
import { TableVisibilityToggle } from "./table-visibility-toggle";
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
  const { updateColumn, addColumn, deleteColumn, reorderColumns, toggleSectionLock } = useScheduleStore();
  const [deleteColumnIndex, setDeleteColumnIndex] = useState<number | null>(null);
  const [isTableVisible, setIsTableVisible] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const canDeleteColumn = (index: number) => {
    return columns.length > 1 && !section.isLocked;
  };

  const handleAddColumn = (title: string, type: 'text' | 'dropdown') => {
    if (!section.isLocked) {
      addColumn(title, type);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && !section.isLocked) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      
      reorderColumns(oldIndex, newIndex);
    }
  };

  return (
    <div className={cn("mb-2", className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="w-32">
          <h3 className="text-lg font-[900] text-[#0D324D] font-condensed leading-8">
            {section.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 print-hide">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSectionLock(section.id)}
            className="h-8 flex items-center gap-1 text-[#0D324D] hover:bg-transparent px-2"
            title={section.isLocked ? "Unlock table" : "Lock table"}
          >
            {section.isLocked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
            <span className="hidden sm:inline text-sm">
              {section.isLocked ? "Unlock" : "Lock"}
            </span>
          </Button>
          <AddColumnDialog 
            onAddColumn={handleAddColumn} 
            disabled={section.isLocked}
          />
          <Button
            onClick={() => onAddRow(section.id)}
            variant="ghost"
            size="sm"
            disabled={section.isLocked}
            className={cn(
              "h-8 flex items-center gap-1 text-[#0D324D] hover:bg-transparent px-2",
              section.isLocked && "opacity-50 cursor-not-allowed"
            )}
            title="Add row"
          >
            <Table2 className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Add Row</span>
          </Button>
          <TableVisibilityToggle 
            isVisible={isTableVisible} 
            onToggle={setIsTableVisible}
          />
        </div>
      </div>
      <div className={cn("relative transition-all duration-300", 
        isTableVisible ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      )}>
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