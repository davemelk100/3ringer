"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScheduleStore } from "@/lib/store/schedule-store";
import { RowStatus } from "@/lib/types/schedule";

interface StatusDropdownProps {
  sectionId: string;
  rowIndex: number;
  day: string;
}

export function StatusDropdown({ sectionId, rowIndex, day }: StatusDropdownProps) {
  const { getRowStatus, updateRowStatus } = useScheduleStore();
  const statusKey = `${day}-${sectionId}-${rowIndex}`;
  const currentStatus = getRowStatus(statusKey);

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
    <div className="flex flex-col gap-2">
      <Select value={currentStatus} onValueChange={(value) => updateRowStatus(statusKey, value as RowStatus)}>
        <SelectTrigger className={`w-24 h-8 ${currentStatus ? getStatusColor(currentStatus as RowStatus) : ''}`}>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Vacant" className="text-green-600">Vacant</SelectItem>
          <SelectItem value="Occupied" className="text-red-600">Occupied</SelectItem>
          <SelectItem value="New" className="text-blue-600">New</SelectItem>
        </SelectContent>
      </Select>
      {currentStatus && (
        <div className={`text-sm font-medium ${getStatusColor(currentStatus as RowStatus)}`}>
          {currentStatus}
        </div>
      )}
    </div>
  );
}