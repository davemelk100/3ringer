"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YesNoDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function YesNoDropdown({ value, onChange }: YesNoDropdownProps) {
  return (
    <div className="flex flex-col gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-20 h-8">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>
      {value && (
        <div className="text-sm font-medium text-foreground">
          {value === 'yes' ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
}