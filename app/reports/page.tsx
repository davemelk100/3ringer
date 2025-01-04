"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ReportsPage: FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://us-central1-formr-442619.cloudfunctions.net/Orders"
        );

        if (response.status === 204) {
          setOrders([]);
          setError(null);
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch orders");

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main id="main-content" className="min-h-screen p-2 bg-[#f1f5f9]">
      <div className="max-w-[1800px] mx-auto">
        <Link
          href="/schedule"
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#0072A3] text-white rounded-md hover:bg-[#005580]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schedule
        </Link>

        <div>
          {loading && <p>Loading orders...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && orders.length === 0 && (
            <p className="text-gray-600">No orders found in the system</p>
          )}
          {orders.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(orders, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ReportsPage;
