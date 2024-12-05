export interface ScheduleEvent {
  id: string;
  content: string;
  day: string;
  columnId: string;
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

export interface ColumnHeader {
  id: string;
  title: string;
}

export interface ScheduleConfig {
  defaultSections: ScheduleSection[];
  defaultColumns: ColumnHeader[];
}