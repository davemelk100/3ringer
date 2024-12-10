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
      className="h-8 flex items-center gap-1 text-[#0D324D] hover:bg-transparent px-2"
      title={isVisible ? "Hide table" : "Show table"}
    >
      {isVisible ? (
        <>
          <EyeOff className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Hide</span>
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Show</span>
        </>
      )}
    </Button>
  );
}