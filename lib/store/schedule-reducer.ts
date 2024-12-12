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
  | { type: 'INITIALIZE_SECTIONS'; payload: ScheduleSection[] };

export function scheduleReducer(state: ScheduleState, action: ScheduleAction): ScheduleState {
  switch (action.type) {
    case 'UPDATE_EVENT':
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

    case 'DELETE_ROW':
      const { sectionId, rowIndex } = action.payload;
      const section = state.sections.find(s => s.id === sectionId);
      
      if (!section || section.rows <= 1 || section.isLocked) return state;

      const processStateObject = (obj: Record<string, any>) => {
        const newObj = {};
        Object.entries(obj).forEach(([key, value]) => {
          const [day, columnId, section, row] = key.split('-');
          const currentRow = parseInt(row);
          
          if (section === sectionId) {
            if (currentRow === rowIndex) return;
            if (currentRow > rowIndex) {
              newObj[`${day}-${columnId}-${section}-${currentRow - 1}`] = value;
            } else {
              newObj[key] = value;
            }
          } else {
            newObj[key] = value;
          }
        });
        return newObj;
      };

      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === sectionId
            ? { ...s, rows: s.rows - 1 }
            : s
        ),
        events: processStateObject(state.events),
        dropdownValues: processStateObject(state.dropdownValues),
      };

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

    default:
      return state;
  }
}