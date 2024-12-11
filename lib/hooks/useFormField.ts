"use client";

import { useState, useCallback } from 'react';

interface UseFormFieldProps<T> {
  initialValue: T;
  onSave?: (value: T) => void;
}

export function useFormField<T>({ initialValue, onSave }: UseFormFieldProps<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
    onSave?.(value);
  }, [value, onSave]);

  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  return {
    value,
    isEditing,
    startEditing,
    stopEditing,
    handleChange,
  };
}