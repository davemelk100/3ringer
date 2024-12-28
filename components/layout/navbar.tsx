import { UserAvatar } from "@/components/auth/user-avatar";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* ... other navbar items ... */}
        <div className="ml-auto">
          <UserAvatar />
        </div>
      </div>
    </nav>
  );
}
