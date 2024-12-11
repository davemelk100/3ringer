"use client";

import { useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { ColumnHeader } from "@/lib/types/schedule";

export function useSectionState() {
  const { 
    updateColumn, 
    addColumn, 
    deleteColumn, 
    reorderColumns,
    toggleSectionLock 
  } = useScheduleStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleUpdateColumn = (index: number, column: ColumnHeader) => {
    updateColumn(index, column);
  };

  const handleAddColumn = (title: string, type: 'text' | 'dropdown') => {
    addColumn(title, type);
  };

  const handleDeleteColumn = (index: number) => {
    deleteColumn(index);
  };

  const handleReorderColumns = (oldIndex: number, newIndex: number) => {
    reorderColumns(oldIndex, newIndex);
  };

  const handleToggleLock = (sectionId: string) => {
    toggleSectionLock(sectionId);
  };

  return {
    sensors,
    handleUpdateColumn,
    handleAddColumn,
    handleDeleteColumn,
    handleReorderColumns,
    handleToggleLock,
  };
}