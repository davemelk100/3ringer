"use client";

import { Button } from "@/components/ui/button";
import { Table2, Lock, Unlock } from "lucide-react";
import { AddColumnDialog } from "../add-column-dialog";
import { TableVisibilityToggle } from "../table-visibility-toggle";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  isLocked: boolean;
  onAddColumn: (title: string, type: "text" | "dropdown") => void;
  onAddRow: () => void;
  onToggleLock: () => void;
  onToggleVisibility: (visible: boolean) => void;
  isTableVisible: boolean;
}

export function SectionHeader({
  title,
  isLocked,
  onAddColumn,
  onAddRow,
  onToggleLock,
  onToggleVisibility,
  isTableVisible,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-1">
      <div className="w-32">
        <h3 className="text-lg font-[700] text-[#0D324D] font-condensed leading-8">
          {title}
        </h3>
      </div>
      <div className="flex items-center gap-1 print-hide">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLock}
          className="h-8 flex items-center gap-1 text-[#0D324D] hover:bg-transparent px-2"
          title={isLocked ? "Unlock table" : "Lock table"}
        >
          {isLocked ? (
            <Lock className="h-4 w-4" />
          ) : (
            <Unlock className="h-4 w-4" />
          )}
          <span className="hidden sm:inline text-sm">
            {isLocked ? "Unlock" : "Lock"}
          </span>
        </Button>
        <AddColumnDialog onAddColumn={onAddColumn} disabled={isLocked} />
        <Button
          onClick={onAddRow}
          variant="ghost"
          size="sm"
          disabled={isLocked}
          className={cn(
            "h-8 flex items-center gap-1 text-[#0D324D] hover:bg-transparent px-2",
            isLocked && "opacity-50 cursor-not-allowed"
          )}
          title="Add row"
        >
          <Table2 className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Add Row</span>
        </Button>
        <TableVisibilityToggle
          isVisible={isTableVisible}
          onToggle={onToggleVisibility}
        />
      </div>
    </div>
  );
}
