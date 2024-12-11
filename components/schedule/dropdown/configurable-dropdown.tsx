"use client";

import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useDropdownState } from "./use-dropdown-state";
import { DropdownTrigger } from "./dropdown-trigger";
import { OptionInput } from "./option-input";
import { ManageOptionsDialog } from "../manage-options-dialog";

interface ConfigurableDropdownProps {
  day: string;
  sectionId: string;
  rowIndex: number;
  columnId: string;
  dropdownId: string;
}

export function ConfigurableDropdown({
  day,
  sectionId,
  rowIndex,
  columnId,
  dropdownId,
}: ConfigurableDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const {
    value,
    options,
    isAddingOption,
    newOption,
    isActive,
    setIsAddingOption,
    setNewOption,
    setIsActive,
    handleAddOption,
    handleDeleteOption,
    handleValueChange,
  } = useDropdownState({
    day,
    sectionId,
    rowIndex,
    columnId,
    dropdownId,
  });

  const selectId = `dropdown-${day}-${sectionId}-${rowIndex}-${columnId}`;

  return (
    <div className="w-full h-full relative group">
      <div className="absolute right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <ManageOptionsDialog
          options={options}
          onAddOption={(option) => {
            handleAddOption();
            setIsActive(true);
            triggerRef.current?.focus();
          }}
          onDeleteOption={handleDeleteOption}
        />
      </div>
      <Select 
        value={value || "none"} 
        onValueChange={handleValueChange}
        onOpenChange={(open) => !open && setIsActive(false)}
      >
        <DropdownTrigger
          ref={triggerRef}
          value={value}
          isActive={isActive}
          onBlur={() => setIsActive(false)}
        />
        <SelectContent className="bg-white">
          {value && (
            <SelectItem value="none" className="text-center">
              <span className="text-muted-foreground">Clear selection</span>
            </SelectItem>
          )}
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-center">
              {option}
            </SelectItem>
          ))}
          <div className="px-2 py-1">
            {isAddingOption ? (
              <OptionInput
                value={newOption}
                onChange={setNewOption}
                onAdd={handleAddOption}
                onCancel={() => {
                  setIsAddingOption(false);
                  triggerRef.current?.focus();
                }}
              />
            ) : (
              <button
                onClick={() => setIsAddingOption(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full justify-center"
              >
                <Plus className="h-4 w-4" />
                Add option
              </button>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}