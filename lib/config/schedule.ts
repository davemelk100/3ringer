import { ScheduleSection, ColumnHeader } from "@/lib/types/schedule";

export const DEFAULT_SECTIONS: ScheduleSection[] = [
  { id: "carpet", title: "Carpet", rows: 1 },
  { id: "hardwood", title: "Hardwood", rows: 1 },
  { id: "cpu", title: "CPU", rows: 1 },
];

export const DEFAULT_COLUMNS: ColumnHeader[] = Array.from({ length: 14 }, (_, i) => ({
  id: `col-${i + 1}`,
  title: `Header ${i + 1}`,
}));

export const scheduleConfig = {
  defaultSections: DEFAULT_SECTIONS,
  defaultColumns: DEFAULT_COLUMNS,
};