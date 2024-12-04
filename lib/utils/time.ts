import { format, setHours, setMinutes } from "date-fns";
import { TimeSlot } from "@/lib/types/schedule";
import { scheduleConfig } from "@/lib/config/schedule";

export function generateTimeSlots(
  startHour = scheduleConfig.startHour,
  endHour = scheduleConfig.endHour,
  intervalMinutes = scheduleConfig.intervalMinutes
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const totalMinutes = (endHour - startHour) * 60;
  const intervals = Math.floor(totalMinutes / intervalMinutes);

  for (let i = 0; i <= intervals; i++) {
    const totalMinutesFromStart = i * intervalMinutes;
    const hour = Math.floor(totalMinutesFromStart / 60) + startHour;
    const minute = totalMinutesFromStart % 60;

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    slots.push({
      label: format(date, "h:mm a"),
      value: format(date, "HH:mm"),
      hour,
      minute,
    });
  }

  return slots;
}

export function formatTimeSlot(hour: number, minute: number): string {
  const date = new Date();
  return format(setMinutes(setHours(date, hour), minute), "h:mm a");
}