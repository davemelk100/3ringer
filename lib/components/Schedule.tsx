import { useEffect, useReducer, useState } from "react";
import { ScheduleCacheManager } from "../utils/cacheManager";
import { OptimizedSchedule } from "./OptimizedSchedule";

// Add type for your action
type ScheduleAction = {
  type: "RESTORE_STATE";
  payload: any; // Replace 'any' with your state type
};

// Add state type definition
type ScheduleState = {
  sections: { id: string; }[];
  columns: { id: string; }[];
};

const initialState: ScheduleState = {
  sections: [],
  columns: []
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

  const [dataUrl] = useState("your-api-url-here");

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

  return <OptimizedSchedule dataUrl={dataUrl} />;
}
