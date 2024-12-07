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
          const newColumnId = `column-${state.columns.length + 1}`;
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
          if (index === 0) return state;

          const newColumns = [...state.columns];
          newColumns.splice(index, 1);

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
          const section = state.sections.find(s => s.id === sectionId);
          if (!section || section.rows <= 1) return state;

          // Create new state objects
          const newEvents = {};
          const newYesNoValues = {};
          const newDropdownValues = {};
          const newRowStatuses = {};

          // Helper function to process keys and values
          const processStateObject = (obj: Record<string, any>, newObj: Record<string, any>) => {
            Object.entries(obj).forEach(([key, value]) => {
              const parts = key.split('-');
              const day = parts[0];
              const section = parts[parts.length - 2];
              const row = parseInt(parts[parts.length - 1]);
              
              if (section === sectionId) {
                if (row === rowIndex) return; // Skip deleted row
                if (row > rowIndex) {
                  // Shift rows up
                  const newKey = parts.slice(0, -1).join('-') + '-' + (row - 1);
                  newObj[newKey] = value;
                } else {
                  newObj[key] = value;
                }
              } else {
                newObj[key] = value;
              }
            });
          };

          // Process each state object
          processStateObject(state.events, newEvents);
          processStateObject(state.yesNoValues, newYesNoValues);
          processStateObject(state.dropdownValues, newDropdownValues);

          // Process row statuses separately (different key structure)
          Object.entries(state.rowStatuses).forEach(([key, value]) => {
            const [day, section, row] = key.split('-');
            const currentRow = parseInt(row);
            if (section === sectionId) {
              if (currentRow === rowIndex) return;
              if (currentRow > rowIndex) {
                newRowStatuses[`${day}-${section}-${currentRow - 1}`] = value;
              } else {
                newRowStatuses[key] = value;
              }
            } else {
              newRowStatuses[key] = value;
            }
          });

          return {
            events: newEvents,
            rowStatuses: newRowStatuses,
            yesNoValues: newYesNoValues,
            dropdownValues: newDropdownValues,
            sections: state.sections.map(s =>
              s.id === sectionId
                ? { ...s, rows: s.rows - 1 }
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