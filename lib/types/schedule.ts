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
  isLocked?: boolean;
}

export interface ScheduleState {
  columns: ColumnHeader[];
  events: Record<string, ScheduleEvent>;
  sections: ScheduleSection[];
  dropdownValues: Record<string, string>;
  dropdownOptions: Record<string, string[]>;
}

export interface ColumnHeader {
  id: string;
  title: string;
  type: "text" | "dropdown";
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

export type RowStatus = "Vacant" | "Occupied" | "New";
