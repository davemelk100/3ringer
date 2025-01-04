"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";

export function UserMenu() {
  const { logout, user } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <DropdownMenuContent align="end" className="w-56">
      {user && (
        <>
          <div className="flex items-center gap-2 p-2">
            <Image
              src={user.picture || ""}
              alt={user.name || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem>
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-red-600 cursor-pointer"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
