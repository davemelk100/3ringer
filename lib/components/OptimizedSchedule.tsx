import { Suspense, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

// Direct imports instead of lazy loading
import ScheduleSection from "./ScheduleSection";

// Implement virtual scrolling for large schedules
export function OptimizedSchedule({ dataUrl }: { dataUrl: string }) {
  const [sections, setSections] = useState<{ id: string }[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(dataUrl);
        const data = await response.json();

        // Assuming the JSON structure matches your needs
        setSections(data.sections || []);
        setColumns(data.columns || []);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dataUrl]);

  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  // Progressive loading of sections
  useEffect(() => {
    if (inView) {
      const sectionIds = sections.slice(0, 5).map((s) => s.id);
      setVisibleSections(sectionIds);

      // Load remaining sections progressively
      setTimeout(() => {
        setVisibleSections(sections.map((s) => s.id));
      }, 100);
    }
  }, [inView, sections]);

  return (
    <div ref={ref}>
      <Suspense fallback={<ScheduleSkeleton />}>
        {visibleSections.map((sectionId) => (
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
