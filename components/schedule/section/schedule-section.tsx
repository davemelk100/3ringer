"use client";

import { useState } from "react";
import { useSectionState } from "./use-section-state";
import { SectionHeader } from "./section-header";
import { SectionTable } from "./section-table";
import { ScheduleSection as Section, ColumnHeader } from "@/lib/types/schedule";
import { cn } from "@/lib/utils";

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
  const [isTableVisible, setIsTableVisible] = useState(true);
  const {
    sensors,
    handleUpdateColumn,
    handleAddColumn,
    handleDeleteColumn,
    handleReorderColumns,
    handleToggleLock,
  } = useSectionState();

  return (
    <div className={cn("mb-2", className)}>
      <SectionHeader
        title={section.title}
        isLocked={section.isLocked || false}
        onAddColumn={handleAddColumn}
        onAddRow={() => onAddRow(section.id)}
        onToggleLock={() => handleToggleLock(section.id)}
        onToggleVisibility={setIsTableVisible}
        isTableVisible={isTableVisible}
      />
      <div className={cn(
        "relative transition-all duration-300", 
        isTableVisible ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      )}>
        <SectionTable
          section={section}
          columns={columns}
          day={day}
          onUpdateColumn={handleUpdateColumn}
          onDeleteColumn={handleDeleteColumn}
          onReorderColumns={handleReorderColumns}
          onDeleteRow={onDeleteRow}
          sensors={sensors}
        />
      </div>
    </div>
  );
}