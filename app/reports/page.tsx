"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { Button } from "@/components/ui/button";

interface ScheduleRecord {
  date: string;
  sections: any[];
  lastUpdated: number;
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
      const response = await fetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          view: selectedView,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      const data = await response.json();
      setRecords(data.records);
    } catch (error) {
      // Handle error appropriately - could show a toast/alert to user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedDate, selectedView, refreshKey]);

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
          <div key={record.date} className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                {new Date(record.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="text-sm text-gray-600">
                Last updated: {formatDate(record.lastUpdated)}
              </div>
            </div>

            <div className="space-y-8">
              {record.sections.map((section) => (
                <section
                  key={`${section.id}-${record.date}`}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <h3 className="text-lg font-bold mb-4">{section.title}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {columns.map((column) => (
                            <th
                              key={column.id}
                              className="border p-2 bg-gray-50"
                            >
                              {column.title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.rows.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex}>
                            {columns.map((column) => (
                              <td key={column.id} className="border p-2">
                                {row[column.id] || ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
