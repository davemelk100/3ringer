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
import { useState, useRef, useEffect } from "react";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { cn } from "@/lib/utils";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
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
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (isAddingOption && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingOption]);

  return (
    <div className="flex flex-col gap-2">
      <Select 
        value={value || "none"} 
        onValueChange={(newValue) => 
          updateDropdownValue(`${day}-${sectionId}-${rowIndex}-${columnId}`, newValue === "none" ? "" : newValue)
        }
      >
        <SelectTrigger 
          ref={triggerRef} 
          className={cn(
            "w-full h-8",
            value ? "border-0 shadow-none [&>svg]:hidden" : "",
            value ? "focus:ring-2 ring-offset-background" : "",
            "[&>span]:flex [&>span]:items-center [&>span]:justify-center",
            "data-[placeholder]:text-muted-foreground data-[placeholder]:italic",
            "bg-white"
          )}
        >
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {value && (
            <SelectItem value="none">
              <span className="text-muted-foreground">Clear selection</span>
            </SelectItem>
          )}
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <div className="px-2 py-1">
            {isAddingOption ? (
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddOption();
                    if (e.key === "Escape") {
                      setIsAddingOption(false);
                      if (triggerRef.current) {
                        triggerRef.current.focus();
                      }
                    }
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
    </div>
  );
}