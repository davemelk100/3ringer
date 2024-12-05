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
          const section = state.sections.find((s) => s.id === sectionId);
          
          if (!section || section.rows <= 1) return state;

          Object.keys(newEvents).forEach((key) => {
            const event = newEvents[key];
            if (event.section === sectionId) {
              if (event.rowIndex === rowIndex) {
                delete newEvents[key];
              } else if (event.rowIndex > rowIndex) {
                newEvents[key] = {
                  ...event,
                  rowIndex: event.rowIndex - 1,
                };
              }
            }
          });

          return {
            events: newEvents,
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