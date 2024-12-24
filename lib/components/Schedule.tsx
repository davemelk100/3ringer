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
  const [state, dispatch] = useReducer(scheduleReducer, initialState);
  const [dataUrl] = useState(
    "https://us-central1-formr-442619.cloudfunctions.net/Orders"
  );
  const [displayData, setDisplayData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(dataUrl);
      const data = await response.json();
      console.log("API Response:", {
        url: dataUrl,
        status: response.status,
        data,
      });
      setDisplayData(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OptimizedSchedule dataUrl={dataUrl} />
      <div className="mt-8">
        <button
          onClick={handleFetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show API Data
        </button>

        {isLoading && <div className="mt-4">Loading...</div>}

        {displayData && (
          <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(displayData, null, 2)}
          </pre>
        )}
      </div>
    </>
  );
}
