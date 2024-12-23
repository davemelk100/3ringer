"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { getDaysInMonth, format, isFuture } from "date-fns";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const currentDate = new Date();
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [day, setDay] = useState(selectedDate.getDate());

  const maxYear = currentDate.getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => maxYear - 9 + i).filter(
    (y) => y <= maxYear
  );

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2000, i), "MMMM"),
  })).filter((m) => {
    if (year < maxYear) return true;
    return m.value <= currentDate.getMonth();
  });

  const days = Array.from(
    { length: getDaysInMonth(new Date(year, month)) },
    (_, i) => i + 1
  ).filter((d) => {
    const date = new Date(year, month, d);
    return !isFuture(date);
  });

  useEffect(() => {
    const newDate = new Date(year, month, day);
    if (!isFuture(newDate) && newDate.getTime() !== selectedDate.getTime()) {
      onDateChange(newDate);
    }
  }, [year, month, day, onDateChange, selectedDate]);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="month-selector" className="text-sm font-medium">
        Select a day:
      </label>
      <Select
        value={month.toString()}
        onValueChange={(value) => setMonth(parseInt(value))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value.toString()}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={day.toString()}
        onValueChange={(value) => setDay(parseInt(value))}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={d.toString()}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year.toString()}
        onValueChange={(value) => setYear(parseInt(value))}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
