"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface EditableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onAddOption: (option: string) => void;
  onDeleteOption?: (option: string) => void;
}

export function EditableDropdown({ 
  value, 
  onChange, 
  options, 
  onAddOption,
  onDeleteOption 
}: EditableDropdownProps) {
  const [newOption, setNewOption] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddOption = () => {
    if (newOption.trim()) {
      onAddOption(newOption.trim());
      setNewOption("");
      setIsAdding(false);
    }
  };

  const handleDeleteOption = (option: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteOption) {
      onDeleteOption(option);
      if (value === option) {
        onChange('');
      }
    }
  };

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-32 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option} className="flex justify-between group">
              <span>{option}</span>
              {onDeleteOption && (
                <button
                  onClick={(e) => handleDeleteOption(option, e)}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-destructive hover:text-destructive-foreground rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </SelectItem>
          ))}
          <div className="px-2 py-1">
            {isAdding ? (
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
                onClick={() => setIsAdding(true)}
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