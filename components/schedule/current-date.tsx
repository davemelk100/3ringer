"use client";

import { format } from "date-fns";

export function CurrentDate() {
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy").toUpperCase();
  
  return (
    <div className="text-base sm:text-[20px] text-[#0D324D] font-medium text-center w-full">
      {currentDate}
    </div>
  );
}