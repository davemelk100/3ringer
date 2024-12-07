"use client";

import { useState } from "react";
import { Header } from "./header";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleHeaderProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function CollapsibleHeader({ selectedWeek, onWeekChange }: CollapsibleHeaderProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative print:hidden border-b mb-8 bg-[#f5f5f5]">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "h-16" : "h-0"
        )}
      >
        <Header selectedWeek={selectedWeek} onWeekChange={onWeekChange} />
      </div>
      <div className="h-4"></div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -bottom-2.5 left-4 z-10 h-5 w-8 rounded-none bg-background border shadow-sm p-0 hover:bg-muted/50"
      >
        <ChevronUp 
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            !isOpen && "rotate-180"
          )}
        />
      </Button>
    </div>
  );
}