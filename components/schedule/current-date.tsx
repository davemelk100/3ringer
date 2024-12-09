"use client";

import { format } from "date-fns";

export function CurrentDate() {
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy").toUpperCase();
  
  return (
    <div className="text-[24px] text-[#0D324D] font-medium text-center w-full whitespace-nowrap overflow-hidden text-ellipsis">
      <span className="font-[900] font-condensed">{currentDate}</span>
    </div>
  );
}