"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ManageOptionsDialogProps {
  options: string[];
  onAddOption: (option: string) => void;
  onDeleteOption: (option: string) => void;
}

export function ManageOptionsDialog({
  options,
  onAddOption,
  onDeleteOption,
}: ManageOptionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (newOption.trim()) {
      onAddOption(newOption.trim());
      setNewOption("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1 hover:bg-transparent"
        >
          <Settings className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">Manage options</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[5%] sm:top-[10%] translate-y-0">
        <DialogHeader>
          <DialogTitle>Manage Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex gap-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add new option"
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddOption();
                }
              }}
            />
            <Button
              onClick={handleAddOption}
              size="sm"
              className="h-8 bg-[#0081A7] hover:bg-[#0081A7]/90"
              disabled={!newOption.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center justify-between bg-muted/50 p-2 rounded-md group"
              >
                <span>{option}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteOption(option)}
                  className={cn(
                    "h-6 w-6 p-0 opacity-0 group-hover:opacity-100",
                    "transition-opacity bg-destructive hover:bg-destructive/90",
                    "text-destructive-foreground"
                  )}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Delete {option}</span>
                </Button>
              </div>
            ))}
            {options.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No options added yet
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => setIsOpen(false)}
            size="sm"
            className="w-full mt-4 h-8 bg-[#0081A7] hover:bg-[#0081A7]/90"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}