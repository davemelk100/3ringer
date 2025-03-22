"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ScheduleState,
  ScheduleEvent,
  ColumnHeader,
  ScheduleSection,
} from "@/lib/types/schedule";
import { scheduleConfig } from "@/lib/config/schedule";
import { scheduleReducer } from "./schedule-reducer";
import { loadScheduleSections } from "../actions/server-schedule-actions";
import { Auth0ContextInterface } from "@auth0/auth0-react";

type GetAccessTokenSilentlyType = Auth0ContextInterface['getAccessTokenSilently']

interface ScheduleStore extends ScheduleState {
  setActiveDay: (date: Date) => void;
  updateEvent: (event: ScheduleEvent) => void;
  deleteEvent: (eventId: string) => void;
  getEventByDayAndTime: (
    day: string,
    columnId: string,
    rowIndex: number,
    section: string
  ) => ScheduleEvent | undefined;
  columns: ColumnHeader[];
  updateColumn: (index: number, column: ColumnHeader) => void;
  addColumn: (title: string, type: "text" | "dropdown") => void;
  deleteColumn: (index: number) => void;
  reorderColumns: (oldIndex: number, newIndex: number) => void;
  addRow: (sectionId: string) => void;
  deleteRow: (sectionId: string, rowIndex: number) => void;
  saveDay: () => void;
  updateSection: (section: ScheduleSection) => void;
  initializeColumns: () => void;
  initializeSections: () => void;
  updateDropdownValue: (key: string, value: string) => void;
  getDropdownValue: (key: string) => string;
  addDropdownOption: (dropdownId: string, option: string) => void;
  deleteDropdownOption: (dropdownId: string, option: string) => void;
  getDropdownOptions: (dropdownId: string) => string[];
  getColumnDropdownId: (columnId: string) => string;
  toggleSectionLock: (sectionId: string) => void;
  setGetAccessToken: (getAccessTokenSilently: GetAccessTokenSilentlyType) => void;
  getAccessTokenSilently?: GetAccessTokenSilentlyType;
  lastUpdated: number | null;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      events: {},
      sections: [],
      columns: [],
      dropdownValues: {},
      dropdownOptions: {},
      activeDay: null,
      loading: false,
      setActiveDay: (date) => {
        set((state) => {
          if (state.activeDay != date) {
            loadScheduleSections(state.getAccessTokenSilently, date).then(({ sections, events }) => {
              set((state) =>
                scheduleReducer(state, { type: "SCHEDULE_DAY_LOADED", payload: {
                  sections: sections!,
                  events: events!,
                  date
                }})
              )
            })
            return { activeDay: date, loading: true }
          }

          return state
        })
      },
      updateEvent: (event) =>
        set((state) =>
          scheduleReducer(state, { type: "UPDATE_EVENT", payload: event })
        ),
      deleteEvent: (eventId) =>
        set((state) =>
          scheduleReducer(state, { type: "DELETE_EVENT", payload: eventId })
        ),
      getEventByDayAndTime: (day, columnId, rowIndex, section) => {
        return get().events[`${day}-${columnId}-${section}-${rowIndex}`];
      },
      updateColumn: (index, column) =>
        set((state) =>
          scheduleReducer(state, {
            type: "UPDATE_COLUMN",
            payload: { index, column },
          })
        ),
      addColumn: (title, type) =>
        set((state) =>
          scheduleReducer(state, {
            type: "ADD_COLUMN",
            payload: { title, type },
          })
        ),
      deleteColumn: (index) =>
        set((state) =>
          scheduleReducer(state, {
            type: "DELETE_COLUMN",
            payload: index,
          })
        ),
      reorderColumns: (oldIndex, newIndex) =>
        set((state) =>
          scheduleReducer(state, {
            type: "REORDER_COLUMNS",
            payload: { oldIndex, newIndex },
          })
        ),
      addRow: (sectionId) =>
        set((state) =>
          scheduleReducer(state, {
            type: "ADD_ROW",
            payload: sectionId,
          })
          // POST new state data to endpoint
        ),
      deleteRow: (sectionId, rowIndex) =>
        set((state) =>
          scheduleReducer(state, {
            type: "DELETE_ROW",
            payload: { sectionId, rowIndex },
          })
          // POST new state data to endpoint
        ),
      updateSection: (section) =>
        set((state) =>
          scheduleReducer(state, {
            type: "UPDATE_SECTION",
            payload: section,
          })
          // POST new state data to endpoint
        ),
      initializeColumns: () =>
        set((state) =>
          scheduleReducer(state, {
            type: "INITIALIZE_COLUMNS",
            payload: scheduleConfig.defaultColumns,
          })
        ),
      initializeSections: () =>
        set((state) =>
          scheduleReducer(state, {
            type: "INITIALIZE_SECTIONS",
            payload: scheduleConfig.defaultSections,
          })
        ),
      updateDropdownValue: (key, value) =>
        set((state) => ({
          ...scheduleReducer(state, {
            type: "UPDATE_DROPDOWN_VALUE",
            payload: { key, value },
          }),
          lastUpdated: Date.now(),
        })),
      getDropdownValue: (key) => get().dropdownValues[key] || "",
      addDropdownOption: (dropdownId, option) =>
        set((state) =>
          scheduleReducer(state, {
            type: "ADD_DROPDOWN_OPTION",
            payload: { dropdownId, option },
          })
        ),
      deleteDropdownOption: (dropdownId, option) =>
        set((state) =>
          scheduleReducer(state, {
            type: "DELETE_DROPDOWN_OPTION",
            payload: { dropdownId, option },
          })
        ),
      getDropdownOptions: (dropdownId) =>
        get().dropdownOptions[dropdownId] || [],
      getColumnDropdownId: (columnId) => columnId,
      toggleSectionLock: (sectionId) =>
        set((state) =>
          scheduleReducer(state, {
            type: "TOGGLE_SECTION_LOCK",
            payload: sectionId,
          })
        ),
      saveDay: () =>
        set((state) =>
          scheduleReducer(state, {
            type: "SAVE_DAY",
            payload: {
              sections: state.sections,
              getAccessTokenSilently: state.getAccessTokenSilently,
            }
          })
        ),
      lastUpdated: null,
      setGetAccessToken: (getAccessTokenSilently: GetAccessTokenSilentlyType) =>
        set((state) => ({ ...state, getAccessTokenSilently })),
    }),
    {
      name: "schedule-storage",
      partialize: (state) => ({
        events: state.events,
        sections: state.sections,
        columns: state.columns,
        dropdownValues: state.dropdownValues,
        dropdownOptions: state.dropdownOptions,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
