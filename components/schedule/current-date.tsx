"use client";

import { format } from "date-fns";

export function CurrentDate() {
  return (
    <div className="text-[20px] text-[#0D324D] font-medium uppercase">
      {format(new Date(), "EEEE, MMMM d, yyyy")}
    </div>
  );
}