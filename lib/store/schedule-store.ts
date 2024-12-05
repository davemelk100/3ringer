"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ScheduleEvent, ScheduleState, ColumnHeader, ScheduleSection } from "@/lib/types/schedule";
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
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      events: {},
      sections: scheduleConfig.defaultSections,
      columns: scheduleConfig.defaultColumns,
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
    }),
    {
      name: "schedule-storage",
      partialize: (state) => ({
        events: state.events,
        columns: state.columns,
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        sections: scheduleConfig.defaultSections,
      }),
    }
  )
);