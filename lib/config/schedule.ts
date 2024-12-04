import { ScheduleSection } from "@/lib/types/schedule";

export const DEFAULT_START_HOUR = 8;
export const DEFAULT_END_HOUR = 21;
export const DEFAULT_INTERVAL_MINUTES = 60;

export const DEFAULT_SECTIONS: ScheduleSection[] = [
  { id: "type1", title: "Type 1", rows: 1 },
  { id: "type2", title: "Type 2", rows: 1 },
  { id: "type3", title: "Type 3", rows: 1 },
];

export const scheduleConfig = {
  startHour: DEFAULT_START_HOUR,
  endHour: DEFAULT_END_HOUR,
  intervalMinutes: DEFAULT_INTERVAL_MINUTES,
  defaultSections: DEFAULT_SECTIONS,
};