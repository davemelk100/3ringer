"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PrintOptions() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const handlePrint = (newOrientation: 'portrait' | 'landscape') => {
    setOrientation(newOrientation);
    document.documentElement.style.setProperty('--print-orientation', newOrientation);
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Print Schedule"
          className="h-9 w-9 border-none hover:bg-black/10 shadow-none hover:shadow-none focus:shadow-none focus-visible:shadow-none bg-transparent"
        >
          <Printer className="h-5 w-5 text-[#0D324D]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handlePrint('portrait')}>
          Print Portrait
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePrint('landscape')}>
          Print Landscape
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}