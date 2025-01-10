"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { Button } from "@/components/ui/button";

interface ScheduleRow {
  [key: string]: any;
}

interface ScheduleRecord {
  Title: string;
  Rows: ScheduleRow[]
}

export default function ReportsPage() {
  const { sections, columns } = useScheduleStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedView, setSelectedView] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<ScheduleRecord[]>([]);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://us-central1-formr-442619.cloudfunctions.net/Orders?date=${selectedDate}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": "Bearer {something}"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      if(response.status == 204) {
        // there is no data for the date so there is nothing to show but because
        // the backend is unstructured it is up to the UI to show whatever configured screen
        // the user should see to represent "new".
        //
        // there is no 'get multiple'. to show a week, ask for 7 days one at a time using ?date=YYYY-MM-DD
        //
        // submit something and ask for it back to see what the response looks like once it's saved.  it should be identical to whatever payload you provided to the POST.
        setRecords([]);
        return;
      }

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      // Handle error appropriately - could show a toast/alert to user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedDate, refreshKey]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
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

            <Button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-green-600 hover:bg-green-700 whitespace-nowrap w-[180px]"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Loading..." : "Refresh Data"}
            </Button>

            <select
              value={selectedView}
              onChange={(e) =>
                setSelectedView(e.target.value as "day" | "week")
              }
              className="h-10 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap w-[180px] text-center"
            >
              <option value="day">Daily View</option>
              <option value="week">Weekly View</option>
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap w-[180px] text-center"
            />
          </div>
        </div>

        {records.map((record) => (
          <div key={record.Title} className="mb-8">
            <h2 className="text-lg font-bold mb-4">{record.Title}</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                  <tr>
                      {Object.keys(record.Rows[0]).map((fieldName) => (
                        <th
                          key={fieldName}
                          className="border p-2 bg-gray-50"
                        >
                          {fieldName} 
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {record.Rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.keys(row).map((fieldName) => (
                          <th
                            key={fieldName}
                            className="border p-2 bg-gray-50"
                          >
                            {row[fieldName]} 
                          </th>
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
