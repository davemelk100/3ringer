"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useScheduleStore } from "@/lib/store/schedule-store";

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
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOption, setNewOption] = useState("");
  
  const {
    getDropdownValue,
    updateDropdownValue,
    getDropdownOptions,
    addDropdownOption,
  } = useScheduleStore();

  const value = getDropdownValue(`${day}-${sectionId}-${rowIndex}-${columnId}`);
  const options = getDropdownOptions(dropdownId);

  const handleAddOption = () => {
    if (newOption.trim()) {
      addDropdownOption(dropdownId, newOption.trim());
      setNewOption("");
      setIsAddingOption(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Select 
        value={value} 
        onValueChange={(newValue) => 
          updateDropdownValue(`${day}-${sectionId}-${rowIndex}-${columnId}`, newValue)
        }
      >
        <SelectTrigger className="w-full h-8">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <div className="px-2 py-1">
            {isAddingOption ? (
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddOption();
                  }}
                  className="h-8"
                  placeholder="New option"
                />
                <button
                  onClick={handleAddOption}
                  className="px-2 py-1 text-sm bg-primary text-primary-foreground rounded"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingOption(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Add option
              </button>
            )}
          </div>
        </SelectContent>
      </Select>
      {value && (
        <div className="text-sm font-medium text-foreground">
          {value}
        </div>
      )}
    </div>
  );
}