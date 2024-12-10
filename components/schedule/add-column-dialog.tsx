"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Columns } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddColumnDialogProps {
  onAddColumn: (title: string, type: 'text' | 'dropdown') => void;
  disabled?: boolean;
}

export function AddColumnDialog({ onAddColumn, disabled }: AddColumnDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<'text' | 'dropdown'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddColumn(title.trim(), type);
      setTitle("");
      setType('text');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-8 flex items-center gap-1 text-[#0D324D] hover:bg-transparent px-2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Add new column"
          title="Add new column"
        >
          <Columns className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Add Column</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[10%] translate-y-0">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">Column Title</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title"
              aria-label="Column title"
            />
          </div>
          <div className="space-y-2">
            <Label>Column Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as 'text' | 'dropdown')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text Field</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dropdown" id="dropdown" />
                <Label htmlFor="dropdown">Dropdown</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Column</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}