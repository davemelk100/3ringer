"use client";

import { useRef, useCallback } from 'react';

export function useFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  
  const focus = useCallback(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const blur = useCallback(() => {
    if (ref.current) {
      ref.current.blur();
    }
  }, []);

  return { ref, focus, blur };
}