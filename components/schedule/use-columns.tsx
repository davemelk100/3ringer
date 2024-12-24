import { useState, useCallback } from "react";

interface ColumnHeader {
  id: string;
  label: string;
  width: number;
}

export function useColumns() {
  const [columns, setColumns] = useState<ColumnHeader[]>([
    { id: "time", label: "Time", width: 100 },
    { id: "activity", label: "Activity", width: 200 },
    { id: "location", label: "Location", width: 150 },
    { id: "notes", label: "Notes", width: 200 },
  ]);

  const handleResize = useCallback((columnId: string, newWidth: number) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, width: Math.max(50, newWidth) } : col
      )
    );
  }, []);

  return columns.map((col) => ({
    ...col,
    onResize: (newWidth: number) => handleResize(col.id, newWidth),
  }));
}
