"use client";

import { useEffect } from 'react';
import { useScheduleStore } from '@/lib/store/schedule-store';
// import { scheduleConfig } from '@/lib/config/schedule';

export function useColumns() {
  const { columns, initializeColumns } = useScheduleStore();

  useEffect(() => {
    const storedColumns = localStorage.getItem('schedule-storage');
    const hasColumns = storedColumns && JSON.parse(storedColumns).state.columns?.length > 0;
    
    if (!hasColumns) {
      initializeColumns();
    }
  }, [initializeColumns]);

  return columns;
}