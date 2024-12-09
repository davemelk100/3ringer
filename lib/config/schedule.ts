import { ScheduleSection, ColumnHeader, DropdownConfig } from "@/lib/types/schedule";

export const DEFAULT_SECTIONS: ScheduleSection[] = [
  { id: "carpet", title: "Carpet", rows: 1 },
  { id: "hardwood", title: "Hardwood", rows: 1 },
  { id: "cpu", title: "CPU", rows: 1 },
];

export const DEFAULT_COLUMNS: ColumnHeader[] = [
  { id: "name", title: "Name", type: "text" },
  { id: "phone", title: "Phone", type: "text" },
  { id: "type", title: "Type", type: "dropdown" },
  { id: "size", title: "Size", type: "text" },
  { id: "price", title: "Price", type: "text" },
  { id: "paid", title: "Paid", type: "dropdown" },
  { id: "notes", title: "Notes", type: "text" },
  { id: "time", title: "Time", type: "text" },
  { id: "confirmed", title: "Confirmed", type: "dropdown" },
  { id: "city", title: "City", type: "text" },
  { id: "email", title: "Email", type: "text" },
  { id: "complete", title: "Complete", type: "dropdown" },
];

export const CONFIGURABLE_DROPDOWNS: DropdownConfig[] = [
  {
    id: "custom-dropdown-1",
    columnIndex: 2,
    options: [],
  },
];

export const scheduleConfig = {
  defaultSections: DEFAULT_SECTIONS,
  defaultColumns: DEFAULT_COLUMNS,
  configurableDropdowns: CONFIGURABLE_DROPDOWNS,
};