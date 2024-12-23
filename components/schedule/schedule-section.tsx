"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table2, Lock, Unlock } from "lucide-react";
import { EditableSectionTitle } from "./editable-section-title";
import { ScheduleRow } from "./schedule-row";
import { DeleteConfirmation } from "./delete-confirmation";
import { AddColumnDialog } from "./add-column-dialog";
import { TableVisibilityToggle } from "./table-visibility-toggle";
import {
  ScheduleSection as Section,
  ColumnHeader,
  WeekDay,
} from "@/lib/types/schedule";
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
  selectedDay: WeekDay;
}

export function ScheduleSection({
  section,
  columns,
  selectedDay,
}: ScheduleSectionProps) {
  const {
    updateColumn,
    addColumn,
    deleteColumn,
    reorderColumns,
    toggleSectionLock,
    addRow,
    deleteRow,
    updateSection,
  } = useScheduleStore();
  const [deleteColumnIndex, setDeleteColumnIndex] = useState<number | null>(
    null
  );
  const [isTableVisible, setIsTableVisible] = useState(true);

  useEffect(() => {
    console.log("ScheduleSection render:", {
      section,
      columns,
      selectedDay,
    });
  }, [section, columns, selectedDay]);

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

  const handleAddColumn = (title: string, type: "text" | "dropdown") => {
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
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <EditableSectionTitle
          section={section}
          onUpdate={(newTitle) => {
            updateSection({
              ...section,
              title: newTitle,
            });
          }}
        />
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
            onClick={() => addRow(section.id)}
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
      <div
        className={cn(
          "relative transition-all duration-300",
          isTableVisible ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        )}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full border-collapse mb-1">
            <thead className="sticky top-0 z-10">
              <tr>
                <SortableContext
                  items={columns.map((col) => col.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {columns.map((column, index) => (
                    <DraggableColumnHeader
                      key={`${String(selectedDay)}-${section.id}-header-${
                        column.id
                      }-${index}`}
                      column={column}
                      index={index}
                      onUpdate={(updatedColumn) =>
                        updateColumn(index, updatedColumn)
                      }
                      onDelete={
                        canDeleteColumn(index)
                          ? () => setDeleteColumnIndex(index)
                          : undefined
                      }
                      canDelete={canDeleteColumn(index)}
                    />
                  ))}
                </SortableContext>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: section.rows }).map((_, rowIndex) => (
                <ScheduleRow
                  key={`${String(selectedDay)}-${section.id}-row-${rowIndex}`}
                  rowIndex={rowIndex}
                  section={section}
                  columns={columns}
                  day={String(selectedDay)}
                  onDeleteRow={() => deleteRow(section.id, rowIndex)}
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
          if (
            deleteColumnIndex !== null &&
            canDeleteColumn(deleteColumnIndex)
          ) {
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
