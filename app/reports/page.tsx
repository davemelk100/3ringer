"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

interface ScheduleRecord {
  Title: string;
  Rows: any[];
  Date?: string;
}

export default function ReportsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<ScheduleRecord[]>([]);
  const { getAccessTokenSilently } = useAuth0();
  const [previewData, setPreviewData] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<{
    [key: string]: any;
  }>({});

  // Function to get dates for the week
  const getWeekDates = (startDate: string): string[] => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently();
      const weekDates = getWeekDates(selectedDate);

      // Fetch data for each day in parallel
      const responses = await Promise.all(
        weekDates.map((date) =>
          fetch(
            `https://us-central1-formr-442619.cloudfunctions.net/Orders?date=${date}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      // Process responses
      const allRecords = await Promise.all(
        responses.map(async (response, index) => {
          if (response.status === 204) {
            return {
              date: weekDates[index],
              records: [],
            };
          }
          if (!response.ok) {
            throw new Error(`Failed to fetch records for ${weekDates[index]}`);
          }
          const data = await response.json();
          return {
            date: weekDates[index],
            records: data,
          };
        })
      );

      // Combine all records with their dates
      setRecords(
        allRecords.flatMap(({ date, records }) =>
          records.map((record: ScheduleRecord) => ({
            ...record,
            Date: date,
          }))
        )
      );
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedDate, refreshKey]);

  const handlePreviewData = () => {
    // Get all data from localStorage and shape it consistently
    const data = Object.keys(localStorage).reduce((acc, key) => {
      try {
        const value = JSON.parse(localStorage.getItem(key) || "{}");
        return {
          ...acc,
          [key]: {
            type: value.type || "schedule_update",
            date: selectedDate,
            changes: value.changes || value,
            timestamp: value.timestamp || new Date().toISOString(),
          },
        };
      } catch (e) {
        return acc;
      }
    }, {});

    setLocalStorageData(data);
    setShowPreview(true);
  };

  const handleSubmitData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently();

      // Format payload to match expected shape
      const payload = {
        type: "bulk_submit",
        date: selectedDate,
        data: localStorageData,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        "https://us-central1-formr-442619.cloudfunctions.net/Orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.status}`);
      }

      // Show the response data which 
      // should match our payload shape
      const result = await response.json();
      setLocalStorageData(result.data || {});
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-2 bg-[#f1f5f9]">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-2">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 bg-[#0072A3] text-white rounded-md hover:bg-[#005580] whitespace-nowrap w-[180px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Schedule
            </Link>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap w-[180px] text-center"
            />
            <button
              onClick={handlePreviewData}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md whitespace-nowrap w-[180px]"
            >
              Preview Data
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="mb-8 bg-white rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Local Storage Data</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50 text-left">Key</th>
                    <th className="border p-2 bg-gray-50 text-left">Type</th>
                    <th className="border p-2 bg-gray-50 text-left">Value</th>
                    <th className="border p-2 bg-gray-50 text-left">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(localStorageData).map(([key, value]) => (
                    <tr key={key}>
                      <td className="border p-2 font-mono text-sm">{key}</td>
                      <td className="border p-2">{value.type || "N/A"}</td>
                      <td className="border p-2 font-mono text-sm">
                        <div className="max-h-20 overflow-y-auto">
                          {JSON.stringify(value, null, 2)}
                        </div>
                      </td>
                      <td className="border p-2">
                        {value.timestamp
                          ? new Date(value.timestamp).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmitData}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit Data"}
              </button>
            </div>
          </div>
        )}

        {records.map((record, index) => (
          <div key={`${record.Title}-${index}`} className="mb-8">
            <h2 className="text-lg font-bold mb-4">
              {record.Title} - {record.Date}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {record.Rows[0] &&
                      Object.keys(record.Rows[0]).map((fieldName) => (
                        <th key={fieldName} className="border p-2 bg-gray-50">
                          {fieldName}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {record.Rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(row).map((fieldName) => (
                        <td key={fieldName} className="border p-2">
                          {row[fieldName]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
