"use client";

import { useState } from "react";
import { WeekSelector } from "@/components/schedule/week-selector";
import { Calendar, FileText, Printer, Database, Save } from "lucide-react";
import { UserProfile } from "@/components/user/user-profile";
import { PrintOptions } from "@/components/schedule/print-options";
import { usePathname } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";

interface HeaderProps {
  selectedWeek?: Date;
  onWeekChange?: (date: Date) => void;
}

export function Header({ selectedWeek, onWeekChange }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const pathname = usePathname();
  const { getAccessTokenSilently } = useAuth0();

  const showLocalStorageData = () => {
    const data = Object.keys(localStorage).reduce((acc, key) => {
      try {
        return {
          ...acc,
          [key]: JSON.parse(localStorage.getItem(key) || "{}"),
        };
      } catch (e) {
        return acc;
      }
    }, {});
    setLocalStorageData(JSON.stringify(data, null, 2));
    setIsModalOpen(true);
  };

  const handleSaveAndPost = async () => {
    try {
      setIsSaving(true);
      const token = await getAccessTokenSilently();

      const response = await fetch(
        "https://us-central1-formr-442619.cloudfunctions.net/Orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: localStorageData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      alert("Data saved successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center gap-4 px-4 py-4 sm:h-16 bg-[#f1f5f9] print:hidden">
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F68E5F]">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl sm:text-3xl font-[900] text-[#0072A3] font-condensed lowercase">
            schedule
          </span>
        </div>

        <div className="flex-1 flex items-center justify-start sm:justify-center">
          {pathname === "/schedule" && selectedWeek && onWeekChange && (
            <WeekSelector
              selectedWeek={selectedWeek}
              onWeekChange={onWeekChange}
            />
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 justify-end">
          <button
            onClick={showLocalStorageData}
            className="flex items-center hover:text-[#005580] text-[#0072A3]"
            title="View State"
          >
            <Database className="h-5 w-5" />
          </button>
          <PrintOptions />
          <Link
            href="/reports"
            className="flex items-center hover:text-[#005580] text-[#0072A3]"
            title="Reports"
          >
            <FileText className="h-5 w-5" />
          </Link>
          <UserProfile />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Local Storage Data</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(80vh-8rem)]">
              <pre className="bg-gray-50 p-4 rounded text-sm">
                {localStorageData}
              </pre>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={handleSaveAndPost}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save & Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
