import { ScheduleTable } from "@/components/schedule/schedule-table";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-[1800px] mx-auto">
        <ScheduleTable />
      </div>
    </main>
  );
}