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
  addColumn: (title: string, type: 'text' | 'dropdown') => void;
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
  getColumnDropdownId: (columnId: string) => string;
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
      addColumn: (title: string, type: 'text' | 'dropdown') => {
        set((state) => {
          const newColumnId = `column-${state.columns.length + 1}`;
          const newColumn = { id: newColumnId, title, type };
          
          if (type === 'dropdown') {
            return {
              columns: [...state.columns, newColumn],
              dropdownOptions: {
                ...state.dropdownOptions,
                [newColumnId]: []
              }
            };
          }
          
          return {
            columns: [...state.columns, newColumn]
          };
        });
      },
      deleteColumn: (index) => {
        set((state) => {
          if (state.columns.length <= 1) return state;

          const newColumns = [...state.columns];
          const deletedColumn = newColumns[index];
          newColumns.splice(index, 1);

          // Clean up all related data
          const newEvents = { ...state.events };
          const newYesNoValues = { ...state.yesNoValues };
          const newDropdownValues = { ...state.dropdownValues };
          const newDropdownOptions = { ...state.dropdownOptions };

          // Remove events for the deleted column
          Object.keys(newEvents).forEach(key => {
            if (key.includes(deletedColumn.id)) {
              delete newEvents[key];
            }
          });

          // Remove yes/no values for the deleted column
          Object.keys(newYesNoValues).forEach(key => {
            if (key.includes(deletedColumn.id)) {
              delete newYesNoValues[key];
            }
          });

          // Remove dropdown values for the deleted column
          Object.keys(newDropdownValues).forEach(key => {
            if (key.includes(deletedColumn.id)) {
              delete newDropdownValues[key];
            }
          });

          // Remove dropdown options if it was a dropdown column
          if (deletedColumn.type === 'dropdown') {
            delete newDropdownOptions[deletedColumn.id];
          }

          return {
            columns: newColumns,
            events: newEvents,
            yesNoValues: newYesNoValues,
            dropdownValues: newDropdownValues,
            dropdownOptions: newDropdownOptions
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

          const newEvents = {};
          const newYesNoValues = {};
          const newDropdownValues = {};
          const newRowStatuses = {};

          const processStateObject = (obj: Record<string, any>, newObj: Record<string, any>) => {
            Object.entries(obj).forEach(([key, value]) => {
              const parts = key.split('-');
              const day = parts[0];
              const section = parts[parts.length - 2];
              const row = parseInt(parts[parts.length - 1]);
              
              if (section === sectionId) {
                if (row === rowIndex) return;
                if (row > rowIndex) {
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

          processStateObject(state.events, newEvents);
          processStateObject(state.yesNoValues, newYesNoValues);
          processStateObject(state.dropdownValues, newDropdownValues);

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
      updateRowStatus: (key: string, status: RowStatus | undefined) => {
        set((state) => {
          const newRowStatuses = { ...state.rowStatuses };
          if (status === undefined) {
            delete newRowStatuses[key];
          } else {
            newRowStatuses[key] = status;
          }
          return { rowStatuses: newRowStatuses };
        });
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
        set((state) => {
          const newDropdownValues = { ...state.dropdownValues };
          if (value === '') {
            delete newDropdownValues[key];
          } else {
            newDropdownValues[key] = value;
          }
          return { dropdownValues: newDropdownValues };
        });
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
      getColumnDropdownId: (columnId: string) => {
        return columnId;
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