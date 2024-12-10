"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableVisibilityToggleProps {
  isVisible: boolean;
  onToggle: (visible: boolean) => void;
}

export function TableVisibilityToggle({ isVisible, onToggle }: TableVisibilityToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle(!isVisible)}
      className={cn(
        "flex items-center gap-1 text-[#0D324D] hover:bg-transparent",
        "hover:font-bold transition-all duration-200"
      )}
    >
      {isVisible ? (
        <>
          <EyeOff className="h-4 w-4" />
          <span className="text-sm">Hide</span>
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          <span className="text-sm">Show</span>
        </>
      )}
    </Button>
  );
}