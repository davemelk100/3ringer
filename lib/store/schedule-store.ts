"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ScheduleEvent, ScheduleState, ColumnHeader, ScheduleSection, RowStatus } from "@/lib/types/schedule";
import { scheduleConfig } from "@/lib/config/schedule";

interface ScheduleStore extends ScheduleState {
  updateEvent: (event: ScheduleEvent) => void;
  deleteEvent: (eventId: string) => void;
  getEventByDayAndTime: (day: string, columnId: string, rowIndex: number, section: string) => ScheduleEvent | undefined;
  columns: ColumnHeader[];
  updateColumn: (index: number, column: ColumnHeader) => void;
  addColumn: () => void;
  deleteColumn: (index: number) => void;
  addRow: (sectionId: string) => void;
  deleteRow: (sectionId: string, rowIndex: number) => void;
  updateSection: (section: ScheduleSection) => void;
  initializeColumns: () => void;
  initializeSections: () => void;
  updateRowStatus: (key: string, status: RowStatus) => void;
  getRowStatus: (key: string) => RowStatus | undefined;
  updateYesNoValue: (key: string, value: string) => void;
  getYesNoValue: (key: string) => string;
  updateDropdownValue: (key: string, value: string) => void;
  getDropdownValue: (key: string) => string;
  addDropdownOption: (dropdownId: string, option: string) => void;
  getDropdownOptions: (dropdownId: string) => string[];
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      events: {},
      sections: [],
      columns: [],
      rowStatuses: {},
      yesNoValues: {},
      dropdownValues: {},
      dropdownOptions: {},
      updateEvent: (event) => {
        set((state) => ({
          events: {
            ...state.events,
            [`${event.day}-${event.columnId}-${event.section}-${event.rowIndex}`]: event,
          },
        }));
      },
      deleteEvent: (eventId) => {
        set((state) => {
          const newEvents = { ...state.events };
          delete newEvents[eventId];
          return { events: newEvents };
        });
      },
      getEventByDayAndTime: (day, columnId, rowIndex, section) => {
        return get().events[`${day}-${columnId}-${section}-${rowIndex}`];
      },
      updateColumn: (index, column) => {
        set((state) => {
          const newColumns = [...state.columns];
          newColumns[index] = column;
          return { columns: newColumns };
        });
      },
      addColumn: () => {
        set((state) => {
          const newColumnId = `col-${state.columns.length + 1}`;
          return {
            columns: [
              ...state.columns,
              { id: newColumnId, title: `Header ${state.columns.length + 1}` }
            ]
          };
        });
      },
      deleteColumn: (index) => {
        set((state) => {
          // Don't allow deleting the Status column
          if (index === 0) return state;

          const newColumns = [...state.columns];
          newColumns.splice(index, 1);

          // Clean up related data
          const newEvents = { ...state.events };
          const deletedColumnId = state.columns[index].id;
          
          Object.keys(newEvents).forEach(key => {
            if (key.includes(deletedColumnId)) {
              delete newEvents[key];
            }
          });

          const newYesNoValues = { ...state.yesNoValues };
          Object.keys(newYesNoValues).forEach(key => {
            if (key.includes(deletedColumnId)) {
              delete newYesNoValues[key];
            }
          });

          const newDropdownValues = { ...state.dropdownValues };
          Object.keys(newDropdownValues).forEach(key => {
            if (key.includes(deletedColumnId)) {
              delete newDropdownValues[key];
            }
          });

          return {
            columns: newColumns,
            events: newEvents,
            yesNoValues: newYesNoValues,
            dropdownValues: newDropdownValues
          };
        });
      },
      addRow: (sectionId) => {
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === sectionId
              ? { ...section, rows: section.rows + 1 }
              : section
          ),
        }));
      },
      deleteRow: (sectionId, rowIndex) => {
        set((state) => {
          const newEvents = { ...state.events };
          const newRowStatuses = { ...state.rowStatuses };
          const newYesNoValues = { ...state.yesNoValues };
          const newDropdownValues = { ...state.dropdownValues };
          const section = state.sections.find((s) => s.id === sectionId);
          
          if (!section || section.rows <= 1) return state;

          // Helper function to update keys for a specific store object
          const updateKeys = (obj: Record<string, any>, pattern: RegExp) => {
            const newObj: Record<string, any> = {};
            Object.entries(obj).forEach(([key, value]) => {
              const match = key.match(pattern);
              if (match) {
                const [_, day, section, row, rest] = match;
                const currentRow = parseInt(row);
                if (section === sectionId) {
                  if (currentRow === rowIndex) {
                    // Skip this key as we're deleting this row
                    return;
                  } else if (currentRow > rowIndex) {
                    // Shift the row index down by 1
                    newObj[`${day}-${section}-${currentRow - 1}-${rest}`] = value;
                  } else {
                    // Keep rows below the deleted row as is
                    newObj[key] = value;
                  }
                } else {
                  // Keep other sections as is
                  newObj[key] = value;
                }
              } else {
                // Keep other keys as is
                newObj[key] = value;
              }
            });
            return newObj;
          };

          // Update all stores with the correct pattern
          const updatedEvents = updateKeys(newEvents, /^(.+)-(.+)-(\d+)-(.+)$/);
          const updatedRowStatuses = updateKeys(newRowStatuses, /^(.+)-(.+)-(\d+)$/);
          const updatedYesNoValues = updateKeys(newYesNoValues, /^(.+)-(.+)-(\d+)-(.+)$/);
          const updatedDropdownValues = updateKeys(newDropdownValues, /^(.+)-(.+)-(\d+)-(.+)$/);

          return {
            events: updatedEvents,
            rowStatuses: updatedRowStatuses,
            yesNoValues: updatedYesNoValues,
            dropdownValues: updatedDropdownValues,
            sections: state.sections.map((s) =>
              s.id === sectionId
                ? { ...s, rows: Math.max(1, s.rows - 1) }
                : s
            ),
          };
        });
      },
      updateSection: (section) => {
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === section.id ? section : s
          ),
        }));
      },
      initializeColumns: () => {
        set({ columns: scheduleConfig.defaultColumns });
      },
      initializeSections: () => {
        set((state) => ({
          sections: state.sections.length === 0 ? scheduleConfig.defaultSections : state.sections
        }));
      },
      updateRowStatus: (key: string, status: RowStatus) => {
        set((state) => ({
          rowStatuses: {
            ...state.rowStatuses,
            [key]: status,
          },
        }));
      },
      getRowStatus: (key: string) => {
        return get().rowStatuses[key];
      },
      updateYesNoValue: (key: string, value: string) => {
        set((state) => ({
          yesNoValues: {
            ...state.yesNoValues,
            [key]: value,
          },
        }));
      },
      getYesNoValue: (key: string) => {
        return get().yesNoValues[key] || '';
      },
      updateDropdownValue: (key: string, value: string) => {
        set((state) => ({
          dropdownValues: {
            ...state.dropdownValues,
            [key]: value,
          },
        }));
      },
      getDropdownValue: (key: string) => {
        return get().dropdownValues[key] || '';
      },
      addDropdownOption: (dropdownId: string, option: string) => {
        set((state) => ({
          dropdownOptions: {
            ...state.dropdownOptions,
            [dropdownId]: [...(state.dropdownOptions[dropdownId] || []), option],
          },
        }));
      },
      getDropdownOptions: (dropdownId: string) => {
        return get().dropdownOptions[dropdownId] || [];
      },
    }),
    {
      name: "schedule-storage",
      partialize: (state) => ({
        events: state.events,
        sections: state.sections,
        columns: state.columns,
        rowStatuses: state.rowStatuses,
        yesNoValues: state.yesNoValues,
        dropdownValues: state.dropdownValues,
        dropdownOptions: state.dropdownOptions,
      }),
    }
  )
);