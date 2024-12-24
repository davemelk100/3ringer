import { Suspense, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

// Direct imports instead of lazy loading
import ScheduleSection from "./ScheduleSection";

interface ApiResponse {
  sections?: { id: string }[];
  columns?: any[];
  message?: string;
}

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
      setIsLoading(true);
      try {
        const response = await fetch(dataUrl);

        switch (response.status) {
          case 200:
          case 201:
            const data: ApiResponse = await response.json();
            setSections(data.sections || []);
            setColumns(data.columns || []);
            break;

          case 204:
            // No content
            setSections([]);
            setColumns([]);
            break;

          case 404:
            console.error("Resource not found");
            setSections([]);
            setColumns([]);
            break;

          default:
            throw new Error(`Unexpected status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
        setSections([]);
        setColumns([]);
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
    <div className="p-4">
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
