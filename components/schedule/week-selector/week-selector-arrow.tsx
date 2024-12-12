"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekSelectorArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export function WeekSelectorArrow({ direction, onClick }: WeekSelectorArrowProps) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="hidden sm:flex h-10 w-10 text-[#0072A3]"
      aria-label={direction === 'left' ? "Previous week" : "Next week"}
      title={direction === 'left' ? "Go to previous week" : "Go to next week"}
    >
      <Icon className="h-7 w-7 stroke-[2.5]" />
      <span className="sr-only">
        {direction === 'left' ? "Previous week" : "Next week"}
      </span>
    </Button>
  );
}