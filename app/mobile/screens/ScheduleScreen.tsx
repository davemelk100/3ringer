import { StackLayout, Label } from '@nativescript/core';
import { useScheduleStore } from '@/lib/store/schedule-store';

export function ScheduleScreen() {
  const { sections, columns } = useScheduleStore();

  return (
    <StackLayout>
      <Label text="Schedule" className="text-center text-2xl font-bold p-4" />
      {sections.map((section) => (
        <StackLayout key={section.id} className="p-4">
          <Label text={section.title} className="font-bold" />
          {/* Add mobile-specific schedule rendering here */}
        </StackLayout>
      ))}
    </StackLayout>
  );
}