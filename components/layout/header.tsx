"use client";

import { WeekSelector } from "@/components/schedule/week-selector";
import { Calendar, FileText, Printer } from "lucide-react";
import { UserProfile } from "@/components/user/user-profile";
import { PrintOptions } from "@/components/schedule/print-options";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  selectedWeek?: Date;
  onWeekChange?: (date: Date) => void;
}

export function Header({ selectedWeek, onWeekChange }: HeaderProps) {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  return (
    <div className="flex flex-row items-center gap-4 px-4 py-4 sm:h-16 bg-[#f1f5f9] print:hidden">
      <div className="hidden sm:flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F68E5F]">
          <Calendar className="h-7 w-7 text-white" />
        </div>
        <span className="text-2xl sm:text-3xl font-[900] text-[#0072A3] font-condensed lowercase">
          schedule
        </span>
      </div>

      <div className="flex-1 flex items-center justify-start sm:justify-center">
        {pathname === "/schedule" && selectedWeek && onWeekChange && (
          <WeekSelector
            selectedWeek={selectedWeek}
            onWeekChange={onWeekChange}
          />
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 justify-end">
        <PrintOptions />
        <Link
          href="/reports"
          className="flex items-center hover:text-[#005580] text-[#0072A3]"
          title="Reports"
        >
          <FileText className="h-5 w-5" />
        </Link>
        <UserProfile />
      </div>
    </div>
  );
}
