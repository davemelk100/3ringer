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
  yesNoValues: Record<string, string>;
  dropdownValues: Record<string, string>;
  dropdownOptions: Record<string, string[]>;
}

export interface ColumnHeader {
  id: string;
  title: string;
  type: 'text' | 'dropdown';
}

export interface ScheduleConfig {
  defaultSections: ScheduleSection[];
  defaultColumns: ColumnHeader[];
  configurableDropdowns: DropdownConfig[];
}

export interface DropdownConfig {
  id: string;
  columnIndex: number;
  options: string[];
}

export interface WeekDay {
  day: string;
  date: string;
  fullDate: Date;
}