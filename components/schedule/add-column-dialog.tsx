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
import { Columns, Plus } from "lucide-react";

interface AddColumnDialogProps {
  onAddColumn: (title: string, type: 'text' | 'dropdown') => void;
}

export function AddColumnDialog({ onAddColumn }: AddColumnDialogProps) {
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
          size="sm"
          variant="outline"
          className="flex items-center gap-1 border-[#F68E5F] text-[#0D324D] hover:bg-[#F68E5F] hover:text-white bg-transparent group"
        >
          <Columns className="h-4 w-4 text-[#F68E5F] group-hover:text-white transition-colors" />
          <Plus className="h-4 w-4 text-[#F68E5F] group-hover:text-white transition-colors" />
          <span className="hidden sm:inline">Add Column</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Column Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title"
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