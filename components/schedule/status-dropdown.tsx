"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RowStatus } from "@/lib/types/schedule";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface StatusDropdownProps {
  sectionId: string;
  rowIndex: number;
  day: string;
}

export function StatusDropdown({ sectionId, rowIndex, day }: StatusDropdownProps) {
  const { getRowStatus, updateRowStatus } = useScheduleStore();
  const statusKey = `${day}-${sectionId}-${rowIndex}`;
  const currentStatus = getRowStatus(statusKey) || 'Vacant';

  const handleStatusChange = (value: string) => {
    updateRowStatus(statusKey, value as RowStatus);
  };

  const getStatusColor = (status: RowStatus) => {
    switch (status) {
      case 'Vacant':
        return 'text-green-600';
      case 'Occupied':
        return 'text-red-600';
      case 'New':
        return 'text-blue-600';
      default:
        return '';
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className={`w-24 h-8 ${getStatusColor(currentStatus as RowStatus)}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Vacant" className="text-green-600">Vacant</SelectItem>
        <SelectItem value="Occupied" className="text-red-600">Occupied</SelectItem>
        <SelectItem value="New" className="text-blue-600">New</SelectItem>
      </SelectContent>
    </Select>
  );
}