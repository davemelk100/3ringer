"use client";

import { useState } from "react";
import { useScheduleStore } from "@/lib/store/schedule-store";

interface UseDropdownStateProps {
  day: string;
  sectionId: string;
  rowIndex: number;
  columnId: string;
  dropdownId: string;
}

export function useDropdownState({
  day,
  sectionId,
  rowIndex,
  columnId,
  dropdownId,
}: UseDropdownStateProps) {
  const {
    getDropdownValue,
    updateDropdownValue,
    getDropdownOptions,
    addDropdownOption,
    deleteDropdownOption,
  } = useScheduleStore();

  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [isActive, setIsActive] = useState(false);

  const value = getDropdownValue(`${day}-${sectionId}-${rowIndex}-${columnId}`);
  const options = getDropdownOptions(dropdownId);

  const handleAddOption = () => {
    if (newOption.trim()) {
      addDropdownOption(dropdownId, newOption.trim());
      setNewOption("");
      setIsAddingOption(false);
      setIsActive(true);
    }
  };

  const handleDeleteOption = (option: string) => {
    deleteDropdownOption(dropdownId, option);
    setIsActive(true);
  };

  const handleValueChange = (newValue: string) => {
    updateDropdownValue(
      `${day}-${sectionId}-${rowIndex}-${columnId}`,
      newValue === "none" ? "" : newValue
    );
    setIsActive(false);
  };

  return {
    value,
    options,
    isAddingOption,
    newOption,
    isActive,
    setIsAddingOption,
    setNewOption,
    setIsActive,
    handleAddOption,
    handleDeleteOption,
    handleValueChange,
  };
}