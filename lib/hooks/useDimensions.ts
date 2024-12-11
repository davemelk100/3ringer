"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

export function useDimensions<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    
    const observer = new ResizeObserver(updateDimensions);
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [updateDimensions]);

  return { ref, dimensions, updateDimensions };
}