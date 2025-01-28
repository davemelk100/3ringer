import { ScheduleState, ScheduleEvent, ColumnHeader, ScheduleSection } from "@/lib/types/schedule";
import { moveItem, removeItem } from "@/lib/utils/array";

export type ScheduleAction = 
  | { type: 'UPDATE_EVENT'; payload: ScheduleEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'UPDATE_COLUMN'; payload: { index: number; column: ColumnHeader } }
  | { type: 'ADD_COLUMN'; payload: { title: string; type: 'text' | 'dropdown' } }
  | { type: 'DELETE_COLUMN'; payload: number }
  | { type: 'REORDER_COLUMNS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'ADD_ROW'; payload: string }
  | { type: 'DELETE_ROW'; payload: { sectionId: string; rowIndex: number } }
  | { type: 'UPDATE_SECTION'; payload: ScheduleSection }
  | { type: 'TOGGLE_SECTION_LOCK'; payload: string }
  | { type: 'UPDATE_DROPDOWN_VALUE'; payload: { key: string; value: string } }
  | { type: 'ADD_DROPDOWN_OPTION'; payload: { dropdownId: string; option: string } }
  | { type: 'DELETE_DROPDOWN_OPTION'; payload: { dropdownId: string; option: string } }
  | { type: 'INITIALIZE_COLUMNS'; payload: ColumnHeader[] }
  | { type: 'INITIALIZE_SECTIONS'; payload: ScheduleSection[] }
  | { type: 'SAVE_DAY'; payload: ScheduleSection[] };

// Change from const to let
let stateCache = new WeakMap();

// Optimize the reducer with better data structures and memoization
export function scheduleReducer(state: ScheduleState, action: ScheduleAction): ScheduleState {
  // Cache check for identical operations
  const cacheKey = JSON.stringify(action);
  const cached = stateCache.get(state)?.[cacheKey];
  if (cached) return cached;

  let newState: ScheduleState;

  switch (action.type) {
    case 'UPDATE_EVENT':

      console.log("UPDATE EVENT", state, action);
      // If you want to save immediately upon change of a cell, do the same thing as saveDay here. Just save the entire day again, don't worry about figuring out what changed.

      return {
        ...state,
        events: {
          ...state.events,
          [`${action.payload.day}-${action.payload.columnId}-${action.payload.section}-${action.payload.rowIndex}`]: action.payload,
        },
      };

    case 'DELETE_EVENT':
      const { [action.payload]: deletedEvent, ...remainingEvents } = state.events;
      return {
        ...state,
        events: remainingEvents,
      };

    case 'UPDATE_COLUMN':
      return {
        ...state,
        columns: state.columns.map((column, index) =>
          index === action.payload.index ? action.payload.column : column
        ),
      };

    case 'ADD_COLUMN':
      const newColumnId = `column-${state.columns.length + 1}`;
      const newColumn = { id: newColumnId, ...action.payload };
      
      return {
        ...state,
        columns: [...state.columns, newColumn],
        ...(action.payload.type === 'dropdown' && {
          dropdownOptions: {
            ...state.dropdownOptions,
            [newColumnId]: []
          }
        }),
      };

    case 'DELETE_COLUMN':
      const deletedColumn = state.columns[action.payload];
      const newEvents = { ...state.events };
      const newDropdownValues = { ...state.dropdownValues };
      const newDropdownOptions = { ...state.dropdownOptions };

      // Clean up related data
      Object.keys(newEvents).forEach(key => {
        if (key.includes(deletedColumn.id)) delete newEvents[key];
      });

      Object.keys(newDropdownValues).forEach(key => {
        if (key.includes(deletedColumn.id)) delete newDropdownValues[key];
      });

      if (deletedColumn.type === 'dropdown') {
        delete newDropdownOptions[deletedColumn.id];
      }

      console.log("DELETE COLUMN", state);
      // If you want to save immediately upon removal of a column, do the same thing as saveDay here. Just save the entire day again, don't worry about figuring out what changed.

      return {
        ...state,
        columns: removeItem(state.columns, action.payload),
        events: newEvents,
        dropdownValues: newDropdownValues,
        dropdownOptions: newDropdownOptions,
      };

    case 'REORDER_COLUMNS':
      return {
        ...state,
        columns: moveItem(state.columns, action.payload.oldIndex, action.payload.newIndex),
      };

    case 'ADD_ROW':
      return {
        ...state,
        sections: state.sections.map(section =>
          section.id === action.payload && !section.isLocked
            ? { ...section, rows: section.rows + 1 }
            : section
        ),
      };

    case 'DELETE_ROW': {
      const { sectionId, rowIndex } = action.payload;
      
      // Use Set for faster lookups
      const keysToDelete = new Set<string>();
      const updates = new Map<string, ScheduleEvent>();
      const dropdownUpdates = new Map<string, string>();

      // Single pass through events
      for (const [key, event] of Object.entries(state.events)) {
        if (event.section === sectionId) {
          if (event.rowIndex === rowIndex) {
            keysToDelete.add(key);
          } else if (event.rowIndex > rowIndex) {
            const newKey = key.replace(
              `-${event.rowIndex}`,
              `-${event.rowIndex - 1}`
            );
            
            updates.set(newKey, {
              ...event,
              rowIndex: event.rowIndex - 1
            });
            
            if (state.dropdownValues[key]) {
              dropdownUpdates.set(newKey, state.dropdownValues[key]);
            }
            
            keysToDelete.add(key);
          }
        }
      }

      // Batch updates
      const newEvents = { ...state.events };
      const newDropdownValues = { ...state.dropdownValues };

      // Apply deletions
      keysToDelete.forEach(key => {
        delete newEvents[key];
        delete newDropdownValues[key];
      });

      // Apply updates
      updates.forEach((event, key) => {
        newEvents[key] = event;
      });
      
      dropdownUpdates.forEach((value, key) => {
        newDropdownValues[key] = value;
      });

      newState = {
        ...state,
        events: newEvents,
        dropdownValues: newDropdownValues,
        sections: state.sections.map(section =>
          section.id === sectionId
            ? { ...section, rows: section.rows - 1 }
            : section
        ),
      };

      console.log("DELETE ROW", state, action);
      // If you want to save immediately upon removal of a row, do the same thing as saveDay here. Just save the entire day again, don't worry about figuring out what changed.
      
      break;
    }

    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map(section =>
          section.id === action.payload.id ? action.payload : section
        ),
      };

    case 'TOGGLE_SECTION_LOCK':
      return {
        ...state,
        sections: state.sections.map(section =>
          section.id === action.payload
            ? { ...section, isLocked: !section.isLocked }
            : section
        ),
      };

    case 'UPDATE_DROPDOWN_VALUE':
      const { key, value } = action.payload;
      return {
        ...state,
        dropdownValues: value
          ? { ...state.dropdownValues, [key]: value }
          : Object.fromEntries(
              Object.entries(state.dropdownValues).filter(([k]) => k !== key)
            ),
      };

    case 'ADD_DROPDOWN_OPTION':
      return {
        ...state,
        dropdownOptions: {
          ...state.dropdownOptions,
          [action.payload.dropdownId]: [
            ...(state.dropdownOptions[action.payload.dropdownId] || []),
            action.payload.option,
          ],
        },
      };

    case 'DELETE_DROPDOWN_OPTION':
      const { dropdownId, option } = action.payload;
      return {
        ...state,
        dropdownOptions: {
          ...state.dropdownOptions,
          [dropdownId]: (state.dropdownOptions[dropdownId] || []).filter(o => o !== option),
        },
        dropdownValues: Object.fromEntries(
          Object.entries(state.dropdownValues).filter(([_, value]) => value !== option)
        ),
      };

    case 'INITIALIZE_COLUMNS':
      return {
        ...state,
        columns: action.payload,
      };

    case 'INITIALIZE_SECTIONS':
      return {
        ...state,
        sections: action.payload,
      };

    case 'SAVE_DAY':
      console.log("SAVE DAY REDUCER", state, action);
      // If you want a save button, you'd take state.events here which looks like this:
      // {"something": {
      //   columnId: "name",
      //   content: "value in cell",
      //   day: "Monday",
      //   id: "Monday-name-carpet-0",
      //   rowIndex: 0,
      //   section: "carpet"
      // }, ...}
      //
      // and piece together the appropriate data structure that the web service wants which looks like this:
      // [{
      //   title: "carpet",
      //   rows: [{
      //        propertyType: "Vacant", // Occupied, New
      //        customer: "Something",
      //        installer: "Something",
      //        salesperson: "Something",
      //        city: "Something",
      //        steps: true,
      //        material: ["Something", "else"],
      //        floorStock: true,
      //        yardageFootage: "Something",
      //        takeup: true,
      //        jobNumber: "Something",
      //        lotNumber: "Something",
      //        address: "Something",
      //        cod: true,
      //        notes: "Something"
      //   }, {
      //        propertyType: "Vacant", // Occupied, New
      //        customer: "Something",
      //        installer: "Something",
      //        salesperson: "Something",
      //        city: "Something",
      //        steps: true,
      //        material: ["Something", "else"],
      //        floorStock: true,
      //        yardageFootage: "Something",
      //        takeup: true,
      //        jobNumber: "Something",
      //        lotNumber: "Something",
      //        address: "Something",
      //        cod: true,
      //        notes: "Something"
      //   }]
      // }, {
      //   title: "cpu",
      //   rows: [{
      //        propertyType: "Vacant", // Occupied, New
      //        customer: "Something",
      //        installer: "Something",
      //        salesperson: "Something",
      //        city: "Something",
      //        steps: true,
      //        material: ["Something", "else"],
      //        floorStock: true,
      //        yardageFootage: "Something",
      //        takeup: true,
      //        jobNumber: "Something",
      //        lotNumber: "Something",
      //        address: "Something",
      //        cod: true,
      //        notes: "Something"
      //   }, {
      //        propertyType: "Vacant", // Occupied, New
      //        customer: "Something",
      //        installer: "Something",
      //        salesperson: "Something",
      //        city: "Something",
      //        steps: true,
      //        material: ["Something", "else"],
      //        floorStock: true,
      //        yardageFootage: "Something",
      //        takeup: true,
      //        jobNumber: "Something",
      //        lotNumber: "Something",
      //        address: "Something",
      //        cod: true,
      //        notes: "Something"
      //   }]
      // }]
      return {
        ...state,
      }

    default:
      newState = state;
  }

  // Cache the result
  if (!stateCache.has(state)) {
    stateCache.set(state, {});
  }
  stateCache.get(state)[cacheKey] = newState;

  return newState;
}

// Add cleanup function to prevent memory leaks
export function clearStateCache() {
  stateCache = new WeakMap();
}