import { startOfWeek, addDays, format } from "date-fns";

export function getCurrentWeekDates() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      day: format(date, "EEEE"),
      date: format(date, "MMM d"),
      fullDate: date,
    };
  });
}