import React from 'react';

interface ScheduleSectionProps {
  sectionId: string;
  columns: any[];
}

export default function ScheduleSection({ sectionId, columns }: ScheduleSectionProps) {
  return (
    <div>
      {columns.map((column, index) => (
        <div key={index}>{/* Column content */}</div>
      ))}
    </div>
  );
}
