import { startOfWeek as dateFnsStartOfWeek, addDays, format } from "date-fns";
import { WeekDay } from "@/lib/types/schedule";

export const startOfWeek = (date: Date) => {
  return dateFnsStartOfWeek(date, { weekStartsOn: 0 });
};

export const getCurrentWeekDates = (date: Date): WeekDay[] => {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => {
    const fullDate = addDays(start, i);
    return {
      fullDate,
      day: format(fullDate, "EEEE"),
      date: format(fullDate, "d"),
      dayName: format(fullDate, "EEEE"),
      shortName: format(fullDate, "EEE"),
      dayOfMonth: format(fullDate, "d"),
    };
  });
};
