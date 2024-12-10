"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

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
      className="flex items-center gap-1 text-[#0D324D] hover:bg-transparent"
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