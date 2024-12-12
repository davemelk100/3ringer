"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { UserMenu } from "./user-menu";

export function UserProfile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-2 hover:bg-transparent"
        >
          <span className="text-[#0072A3] font-medium">John Doe</span>
          <ChevronDown className="h-4 w-4 text-[#0072A3]" />
        </Button>
      </DropdownMenuTrigger>
      <UserMenu />
    </DropdownMenu>
  );
}