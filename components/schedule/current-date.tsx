"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { Calendar } from "lucide-react";

interface CurrentDateProps {
  showIcon?: boolean;
}

export function CurrentDate({ showIcon = false }: CurrentDateProps) {
  const [currentDate, setCurrentDate] = useState("");
  const activeDay = useScheduleStore((state) => state.activeDay);
  
  useEffect(() => {
    if (activeDay) {
      const formattedDate = format(activeDay, "EEEE, MMMM d, yyyy").toUpperCase();
      setCurrentDate(formattedDate);
    }
  }, [activeDay]);
  
  return (
    <div className="flex items-center gap-3 text-[20px] sm:text-[24px] text-[#0D324D] w-full whitespace-nowrap overflow-hidden text-ellipsis px-4 py-2 sm:p-0">
      {showIcon && (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F68E5F] flex-shrink-0">
          <Calendar className="h-7 w-7 text-white" />
        </div>
      )}
      <span className="font-[900] font-condensed">{currentDate}</span>
    </div>
  );
}