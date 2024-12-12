import { useEffect, useReducer } from "react";
import { ScheduleCacheManager } from "../utils/cacheManager";
import { OptimizedSchedule } from "./OptimizedSchedule";

// Add type for your action
type ScheduleAction = {
  type: "RESTORE_STATE";
  payload: any; // Replace 'any' with your state type
};

// Add state type definition
type ScheduleState = {
  // Add your state properties here
  sections?: any[];
  columns?: any[];
  // ... other state properties
};

const scheduleReducer = (
  state: ScheduleState,
  action: ScheduleAction
): ScheduleState => {
  switch (action.type) {
    case "RESTORE_STATE":
      return action.payload;
    default:
      return state;
  }
};

export function Schedule() {
  const [state, dispatch] = useReducer<
    React.Reducer<ScheduleState, ScheduleAction>
  >(scheduleReducer, initialState);

  useEffect(() => {
    // Handle back/forward cache
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        const cachedState = ScheduleCacheManager.loadState();
        if (cachedState) {
          dispatch({ type: "RESTORE_STATE", payload: cachedState });
        }
      }
    });

    return () => {
      // Save state before unload
      ScheduleCacheManager.saveState(state);
    };
  }, [state]);

  return <OptimizedSchedule sections={state.sections} columns={state.columns} />;
}
