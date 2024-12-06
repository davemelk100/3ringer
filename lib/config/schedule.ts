import { ScheduleSection, ColumnHeader, DropdownConfig } from "@/lib/types/schedule";

export const DEFAULT_SECTIONS: ScheduleSection[] = [
  { id: "carpet", title: "Carpet", rows: 8 },
  { id: "hardwood", title: "Hardwood", rows: 8 },
  { id: "cpu", title: "CPU", rows: 8 },
];

export const DEFAULT_COLUMNS: ColumnHeader[] = [
  { id: "col-1", title: "Status" },
  { id: "col-2", title: "Name" },
  { id: "col-3", title: "Phone" },
  { id: "col-4", title: "Type" },
  { id: "col-5", title: "Size" },
  { id: "col-6", title: "Price" },
  { id: "col-7", title: "Paid" },
  { id: "col-8", title: "Notes" },
  { id: "col-9", title: "Time" },
  { id: "col-10", title: "Confirmed" },
  { id: "col-11", title: "Address" },
  { id: "col-12", title: "City" },
  { id: "col-13", title: "Email" },
  { id: "col-14", title: "Complete" },
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