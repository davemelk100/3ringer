import { ScheduleSection, ColumnHeader, DropdownConfig } from "@/lib/types/schedule";

export const DEFAULT_SECTIONS: ScheduleSection[] = [
  { id: "carpet", title: "Carpet", rows: 1 },
  { id: "hardwood", title: "Hardwood", rows: 1 },
  { id: "cpu", title: "CPU", rows: 1 },
];

export const DEFAULT_COLUMNS: ColumnHeader[] = Array.from({ length: 14 }, (_, i) => ({
  id: `col-${i + 1}`,
  title: `Header ${i + 1}`,
}));

export const CONFIGURABLE_DROPDOWNS: DropdownConfig[] = [
  {
    id: "custom-dropdown-1",
    columnIndex: 3, // Fourth column (0-based index)
    options: [],
  },
];

export const scheduleConfig = {
  defaultSections: DEFAULT_SECTIONS,
  defaultColumns: DEFAULT_COLUMNS,
  configurableDropdowns: CONFIGURABLE_DROPDOWNS,
};