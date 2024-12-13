import { describe, expect, test } from "vitest";
import { scheduleReducer } from "../schedule-reducer";
import { ScheduleState, ColumnHeader } from "@/lib/types/schedule";

describe("scheduleReducer", () => {
  const initialState: ScheduleState = {
    events: {},
    sections: [],
    columns: [],
    dropdownValues: {},
    dropdownOptions: {},
  };

  describe("UPDATE_EVENT", () => {
    test("should add a new event", () => {
      const event = {
        id: "event-1",
        content: "Test Event",
        day: "Monday",
        columnId: "col-1",
        rowIndex: 0,
        section: "section-1",
      };

      const newState = scheduleReducer(initialState, {
        type: "UPDATE_EVENT",
        payload: event,
      });

      expect(newState.events["Monday-col-1-section-1-0"]).toEqual(event);
    });

    test("should update an existing event", () => {
      const existingState = {
        ...initialState,
        events: {
          "Monday-col-1-section-1-0": {
            id: "event-1",
            content: "Old Content",
            day: "Monday",
            columnId: "col-1",
            rowIndex: 0,
            section: "section-1",
          },
        },
      };

      const updatedEvent = {
        id: "event-1",
        content: "Updated Content",
        day: "Monday",
        columnId: "col-1",
        rowIndex: 0,
        section: "section-1",
      };

      const newState = scheduleReducer(existingState, {
        type: "UPDATE_EVENT",
        payload: updatedEvent,
      });

      expect(newState.events["Monday-col-1-section-1-0"].content).toBe(
        "Updated Content"
      );
    });
  });

  describe("DELETE_EVENT", () => {
    test("should remove an event", () => {
      const existingState = {
        ...initialState,
        events: {
          "event-1": {
            id: "event-1",
            content: "Test Event",
            day: "Monday",
            columnId: "col-1",
            rowIndex: 0,
            section: "section-1",
          },
        },
      };

      const newState = scheduleReducer(existingState, {
        type: "DELETE_EVENT",
        payload: "event-1",
      });

      expect(newState.events["event-1"]).toBeUndefined();
    });
  });

  describe("UPDATE_COLUMN", () => {
    test("should update a column", () => {
      const existingState = {
        ...initialState,
        columns: [{ id: "col-1", title: "Old Title", type: "text" as const }],
      };

      const newState = scheduleReducer(existingState, {
        type: "UPDATE_COLUMN",
        payload: {
          index: 0,
          column: { id: "col-1", title: "New Title", type: "text" as const },
        },
      });

      expect(newState.columns[0].title).toBe("New Title");
    });
  });

  describe("ADD_COLUMN", () => {
    test("should add a text column", () => {
      const newState = scheduleReducer(initialState, {
        type: "ADD_COLUMN",
        payload: { title: "New Column", type: "text" },
      });

      expect(newState.columns).toHaveLength(1);
      expect(newState.columns[0].title).toBe("New Column");
      expect(newState.columns[0].type).toBe("text");
    });

    test("should add a dropdown column with empty options", () => {
      const newState = scheduleReducer(initialState, {
        type: "ADD_COLUMN",
        payload: { title: "New Dropdown", type: "dropdown" },
      });

      const columnId = newState.columns[0].id;
      expect(newState.columns).toHaveLength(1);
      expect(newState.columns[0].type).toBe("dropdown");
      expect(newState.dropdownOptions[columnId]).toEqual([]);
    });
  });

  describe("DELETE_COLUMN", () => {
    test("should delete a column and clean up related data", () => {
      const existingState = {
        ...initialState,
        columns: [
          { id: "col-1", title: "Column 1", type: "dropdown" as const },
        ],
        events: {
          "Monday-col-1-section-1-0": {
            id: "event-1",
            content: "Test",
            day: "Monday",
            columnId: "col-1",
            rowIndex: 0,
            section: "section-1",
          },
        },
        dropdownValues: {
          "Monday-col-1-section-1-0": "Option 1",
        },
        dropdownOptions: {
          "col-1": ["Option 1", "Option 2"],
        },
      };

      const newState = scheduleReducer(existingState, {
        type: "DELETE_COLUMN",
        payload: 0,
      });

      expect(newState.columns).toHaveLength(0);
      expect(newState.events["Monday-col-1-section-1-0"]).toBeUndefined();
      expect(
        newState.dropdownValues["Monday-col-1-section-1-0"]
      ).toBeUndefined();
      expect(newState.dropdownOptions["col-1"]).toBeUndefined();
    });
  });

  describe("REORDER_COLUMNS", () => {
    test("should reorder columns", () => {
      const existingState = {
        ...initialState,
        columns: [
          { id: "col-1", title: "Column 1", type: "text" as const },
          { id: "col-2", title: "Column 2", type: "text" as const },
        ],
      };

      const newState = scheduleReducer(existingState, {
        type: "REORDER_COLUMNS",
        payload: { oldIndex: 0, newIndex: 1 },
      });

      expect(newState.columns[0].id).toBe("col-2");
      expect(newState.columns[1].id).toBe("col-1");
    });
  });

  describe("ADD_ROW", () => {
    test("should add a row to unlocked section", () => {
      const existingState = {
        ...initialState,
        sections: [
          { id: "section-1", title: "Section 1", rows: 1, isLocked: false },
        ],
      };

      const newState = scheduleReducer(existingState, {
        type: "ADD_ROW",
        payload: "section-1",
      });

      expect(newState.sections[0].rows).toBe(2);
    });

    test("should not add row to locked section", () => {
      const existingState = {
        ...initialState,
        sections: [
          { id: "section-1", title: "Section 1", rows: 1, isLocked: true },
        ],
      };

      const newState = scheduleReducer(existingState, {
        type: "ADD_ROW",
        payload: "section-1",
      });

      expect(newState.sections[0].rows).toBe(1);
    });
  });

  describe("DELETE_ROW", () => {
    test("should delete a row and update related data", () => {
      const existingState = {
        ...initialState,
        sections: [
          { id: "section-1", title: "Section 1", rows: 2, isLocked: false },
        ],
        events: {
          "Monday-col-1-section-1-0": {
            id: "event-1",
            content: "Row 0",
            day: "Monday",
            columnId: "col-1",
            rowIndex: 0,
            section: "section-1",
          },
          "Monday-col-1-section-1-1": {
            id: "event-2",
            content: "Row 1",
            day: "Monday",
            columnId: "col-1",
            rowIndex: 1,
            section: "section-1",
          },
          "Monday-col-1-section-1-2": {
            id: "event-3",
            content: "Row 2",
            day: "Monday",
            columnId: "col-1",
            rowIndex: 2,
            section: "section-1",
          },
        },
        dropdownValues: {
          "Monday-col-1-section-1-0": "Value 0",
          "Monday-col-1-section-1-1": "Value 1",
          "Monday-col-1-section-1-2": "Value 2",
        },
      };

      const newState = scheduleReducer(existingState, {
        type: "DELETE_ROW",
        payload: { sectionId: "section-1", rowIndex: 1 },
      });

      expect(newState.sections[0].rows).toBe(1);
      expect(newState.events["Monday-col-1-section-1-0"]).toEqual(
        existingState.events["Monday-col-1-section-1-0"]
      );
      expect(newState.events["Monday-col-1-section-1-1"]).toEqual({
        ...existingState.events["Monday-col-1-section-1-2"],
        rowIndex: 1,
      });
      expect(newState.events["Monday-col-1-section-1-2"]).toBeUndefined();
    });
  });

  describe("TOGGLE_SECTION_LOCK", () => {
    test("should toggle section lock state", () => {
      const existingState = {
        ...initialState,
        sections: [
          { id: "section-1", title: "Section 1", rows: 1, isLocked: false },
        ],
      };

      const newState = scheduleReducer(existingState, {
        type: "TOGGLE_SECTION_LOCK",
        payload: "section-1",
      });

      expect(newState.sections[0].isLocked).toBe(true);
    });
  });

  describe("UPDATE_DROPDOWN_VALUE", () => {
    test("should update dropdown value", () => {
      const newState = scheduleReducer(initialState, {
        type: "UPDATE_DROPDOWN_VALUE",
        payload: { key: "dropdown-1", value: "Option 1" },
      });

      expect(newState.dropdownValues["dropdown-1"]).toBe("Option 1");
    });

    test("should remove dropdown value when empty", () => {
      const existingState = {
        ...initialState,
        dropdownValues: { "dropdown-1": "Option 1" },
      };

      const newState = scheduleReducer(existingState, {
        type: "UPDATE_DROPDOWN_VALUE",
        payload: { key: "dropdown-1", value: "" },
      });

      expect(newState.dropdownValues["dropdown-1"]).toBeUndefined();
    });
  });

  describe("ADD_DROPDOWN_OPTION", () => {
    test("should add option to existing dropdown", () => {
      const existingState = {
        ...initialState,
        dropdownOptions: { "dropdown-1": ["Option 1"] },
      };

      const newState = scheduleReducer(existingState, {
        type: "ADD_DROPDOWN_OPTION",
        payload: { dropdownId: "dropdown-1", option: "Option 2" },
      });

      expect(newState.dropdownOptions["dropdown-1"]).toContain("Option 2");
    });

    test("should create new dropdown options array", () => {
      const newState = scheduleReducer(initialState, {
        type: "ADD_DROPDOWN_OPTION",
        payload: { dropdownId: "dropdown-1", option: "Option 1" },
      });

      expect(newState.dropdownOptions["dropdown-1"]).toEqual(["Option 1"]);
    });
  });

  describe("DELETE_DROPDOWN_OPTION", () => {
    test("should delete option and clean up related values", () => {
      const existingState = {
        ...initialState,
        dropdownOptions: {
          "dropdown-1": ["Option 1", "Option 2"],
        },
        dropdownValues: {
          "key-1": "Option 1",
          "key-2": "Option 2",
        },
      };

      const newState = scheduleReducer(existingState, {
        type: "DELETE_DROPDOWN_OPTION",
        payload: { dropdownId: "dropdown-1", option: "Option 1" },
      });

      expect(newState.dropdownOptions["dropdown-1"]).not.toContain("Option 1");
      expect(newState.dropdownValues["key-1"]).toBeUndefined();
      expect(newState.dropdownValues["key-2"]).toBe("Option 2");
    });
  });

  describe("INITIALIZE_COLUMNS", () => {
    test("should initialize columns", () => {
      const columns: ColumnHeader[] = [
        {
          id: "some-id",
          title: "Some Title",
          type: "text",
        },
      ];

      const newState = scheduleReducer(initialState, {
        type: "INITIALIZE_COLUMNS",
        payload: columns,
      });

      expect(newState.columns).toEqual(columns);
    });
  });

  describe("INITIALIZE_SECTIONS", () => {
    test("should initialize sections", () => {
      const sections = [
        { id: "section-1", title: "Section 1", rows: 1 },
        { id: "section-2", title: "Section 2", rows: 2 },
      ];

      const newState = scheduleReducer(initialState, {
        type: "INITIALIZE_SECTIONS",
        payload: sections,
      });

      expect(newState.sections).toEqual(sections);
    });
  });
});
