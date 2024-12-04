export interface ScheduleEvent {
  id: string;
  content: string;
  day: string;
  timeSlot: string;
  rowIndex: number;
  section: string;
}

export interface ScheduleSection {
  id: string;
  title: string;
  rows: number;
}

export interface ScheduleState {
  events: Record<string, ScheduleEvent>;
  sections: ScheduleSection[];
}

export interface TimeSlot {
  label: string;
  value: string;
  hour: number;
  minute: number;
}

export interface ScheduleConfig {
  startHour: number;
  endHour: number;
  intervalMinutes: number;
  defaultSections: ScheduleSection[];
}