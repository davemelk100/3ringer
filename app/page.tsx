import { ScheduleTable } from "@/components/schedule/schedule-table";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen p-4 bg-[#f1f5f9]">
      <div className="max-w-[1800px] mx-auto">
        <ScheduleTable />
      </div>
    </main>
  );
}