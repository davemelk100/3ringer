import { ScheduleSection, ColumnHeader, DropdownConfig } from "@/lib/types/schedule";

export const DEFAULT_SECTIONS: ScheduleSection[] = [
  { id: "carpet", title: "Carpet", rows: 8 },
  { id: "hardwood", title: "Hardwood", rows: 8 },
  { id: "cpu", title: "CPU", rows: 8 },
];

export const DEFAULT_COLUMNS: ColumnHeader[] = [
  { id: "status", title: "Status" },
  { id: "name", title: "Name" },
  { id: "phone", title: "Phone" },
  { id: "type", title: "Type" },
  { id: "size", title: "Size" },
  { id: "price", title: "Price" },
  { id: "paid", title: "Paid" },
  { id: "notes", title: "Notes" },
  { id: "time", title: "Time" },
  { id: "confirmed", title: "Confirmed" },
  { id: "address", title: "Address" },
  { id: "city", title: "City" },
  { id: "email", title: "Email" },
  { id: "complete", title: "Complete" },
];

export const CONFIGURABLE_DROPDOWNS: DropdownConfig[] = [
  {
    id: "custom-dropdown-1",
    columnIndex: 3,
    options: [],
  },
];

export const scheduleConfig = {
  defaultSections: DEFAULT_SECTIONS,
  defaultColumns: DEFAULT_COLUMNS,
  configurableDropdowns: CONFIGURABLE_DROPDOWNS,
};