"use client";

import { useState } from "react";
import { Header } from "./header";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CurrentDate } from "@/components/schedule/current-date";
import { CrewsOffToday } from "@/components/schedule/crews-off-today";

interface CollapsibleHeaderProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export function CollapsibleHeader({ selectedWeek, onWeekChange }: CollapsibleHeaderProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative print:hidden bg-[#f1f5f9]">
      <div className="sm:hidden">
        <CurrentDate showIcon={true} />
      </div>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen ? "h-auto sm:h-28" : "h-8"
        )}
      >
        <div className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "h-full opacity-100" : "h-0 opacity-0"
        )}>
          <Header selectedWeek={selectedWeek} onWeekChange={onWeekChange} />
          <div className="w-full bg-[#f1f5f9] flex flex-col sm:flex-row items-center justify-between px-4 py-2 sm:h-14 gap-2">
            <div className="flex-1 w-full sm:w-auto">
              <CrewsOffToday />
            </div>
            <div className="flex-1 w-full sm:w-auto hidden sm:block">
              <CurrentDate showIcon={false} />
            </div>
            <div className="flex-1 flex justify-end w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="h-5 w-5 rounded-full bg-background border shadow-sm p-0 hover:bg-muted/50 flex items-center justify-center"
                aria-label={isOpen ? "Collapse header" : "Expand header"}
                title={isOpen ? "Collapse header" : "Expand header"}
              >
                <ChevronUp 
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    !isOpen && "rotate-180"
                  )}
                />
                <span className="sr-only">{isOpen ? "Collapse header" : "Expand header"}</span>
              </Button>
            </div>
          </div>
        </div>
        {!isOpen && (
          <div className="absolute top-0 right-4 pt-1.5">
            <Button
              variant="outline"
              onClick={() => setIsOpen(true)}
              className="h-5 w-5 rounded-full bg-background border shadow-sm p-0 hover:bg-muted/50 flex items-center justify-center"
              aria-label="Expand header"
              title="Expand header"
            >
              <ChevronUp className="h-3 w-3 rotate-180" />
              <span className="sr-only">Expand header</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}