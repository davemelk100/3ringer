"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ScheduleEvent, ScheduleState, TimeSlot, ScheduleSection } from "@/lib/types/schedule";
import { scheduleConfig } from "@/lib/config/schedule";

interface ScheduleStore extends ScheduleState {
  updateEvent: (event: ScheduleEvent) => void;
  deleteEvent: (eventId: string) => void;
  getEventByDayAndTime: (day: string, timeSlot: string, rowIndex: number, section: string) => ScheduleEvent | undefined;
  timeSlots: TimeSlot[];
  updateTimeSlot: (index: number, slot: TimeSlot) => void;
  addRow: (sectionId: string) => void;
  deleteRow: (sectionId: string, rowIndex: number) => void;
  updateSection: (section: ScheduleSection) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      events: {},
      sections: scheduleConfig.defaultSections,
      timeSlots: [],
      updateEvent: (event) => {
        set((state) => ({
          events: {
            ...state.events,
            [`${event.day}-${event.timeSlot}-${event.section}-${event.rowIndex}`]: event,
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
      getEventByDayAndTime: (day, timeSlot, rowIndex, section) => {
        return get().events[`${day}-${timeSlot}-${section}-${rowIndex}`];
      },
      updateTimeSlot: (index, slot) => {
        set((state) => {
          const newTimeSlots = [...state.timeSlots];
          newTimeSlots[index] = slot;
          return { timeSlots: newTimeSlots };
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

          // Delete events in the row and shift remaining ones
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
    }
  )
);