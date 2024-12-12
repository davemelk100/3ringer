import { Suspense, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// Direct imports instead of lazy loading
import ScheduleSection from './ScheduleSection';

// Implement virtual scrolling for large schedules
export function OptimizedSchedule({ sections, columns }: { sections: { id: string }[], columns: any[] }) {
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Progressive loading of sections
  useEffect(() => {
    if (inView) {
      const sectionIds = sections.slice(0, 5).map(s => s.id);
      setVisibleSections(sectionIds);
      
      // Load remaining sections progressively
      setTimeout(() => {
        setVisibleSections(sections.map(s => s.id));
      }, 100);
    }
  }, [inView, sections]);

  return (
    <div ref={ref}>
      <Suspense fallback={<ScheduleSkeleton />}>
        {visibleSections.map(sectionId => (
          <ScheduleSection 
            key={sectionId}
            sectionId={sectionId}
            columns={columns}
          />
        ))}
      </Suspense>
    </div>
  );
}

// Lightweight skeleton component
function ScheduleSkeleton() {
  return <div className="animate-pulse bg-gray-200 h-40" />;
} 