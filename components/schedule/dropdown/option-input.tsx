"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isEnterKey, isEscapeKey } from "@/lib/utils/keyboard";
import { useFocus } from "@/lib/hooks/useFocus";

interface OptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function OptionInput({ value, onChange, onAdd, onCancel }: OptionInputProps) {
  const { ref, focus } = useFocus<HTMLInputElement>();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEnterKey(e)) {
      onAdd();
    } else if (isEscapeKey(e)) {
      onCancel();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-6"
        placeholder="New option"
        aria-label="Add new option"
        autoFocus
      />
      <Button
        onClick={onAdd}
        className="px-2 py-1 text-sm bg-[#0081A7] hover:bg-[#0081A7]/90 text-white"
      >
        Add
      </Button>
    </div>
  );
}