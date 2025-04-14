"use client";

import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ApiClient } from "@/lib/api/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const apiClient = new ApiClient(getAccessTokenSilently);
        const result = await apiClient.getOrders(new Date(selectedDate));
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, getAccessTokenSilently]);

  return (
    <main className="min-h-screen p-2 bg-[#f1f5f9]">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 bg-primary rounded-md hover:bg-primary-hover whitespace-nowrap w-[180px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Schedule
            </Link>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 px-4 py-2 border rounded-md bg-card hover:bg-card-foreground/5 cursor-pointer whitespace-nowrap w-[180px] text-center"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : data ? (
          <div className="bg-white rounded-lg shadow p-4">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No data available for this date
          </div>
        )}
      </div>
    </main>
  );
}
