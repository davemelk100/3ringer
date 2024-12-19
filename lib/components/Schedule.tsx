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
  sections: { id: string }[];
  columns: { id: string }[];
};

const initialState: ScheduleState = {
  sections: [],
  columns: [],
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

  const [dataUrl] = useState(
    "https://us-central1-formr-442619.cloudfunctions.net/Orders"
  );
  const [fetchedData, setFetchedData] = useState<any>(null);

  const handleFetchData = async () => {
    try {
      const response = await fetch(dataUrl);
      const data = await response.json();
      setFetchedData(data);
      console.log(data); // Prints to console
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  return (
    <>
      <OptimizedSchedule dataUrl={dataUrl} />
      <button
        onClick={handleFetchData}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Fetch Data
      </button>
      {fetchedData && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(fetchedData, null, 2)}
        </pre>
      )}
    </>
  );
}
