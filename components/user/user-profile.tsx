"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { UserMenu } from "./user-menu";
import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";

export function UserProfile() {
  const { user } = useAuth0();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 hover:bg-transparent"
        >
          {user && (
            <>
              <Image
                src={user.picture || ""}
                alt={user.name || ""}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-[#0072A3] font-medium">{user.name}</span>
            </>
          )}
          <ChevronDown className="h-4 w-4 text-[#0072A3]" />
        </Button>
      </DropdownMenuTrigger>
      <UserMenu />
    </DropdownMenu>
  );
}
