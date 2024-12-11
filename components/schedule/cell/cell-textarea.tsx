"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { isEnterKey } from "@/lib/utils/keyboard";

interface CellTextareaProps {
  content: string;
  onChange: (content: string) => void;
  onBlur: () => void;
  height?: number;
}

export function CellTextarea({ content, onChange, onBlur, height }: CellTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEnterKey(e) && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className={cn(
        "w-full h-full min-h-[1.5rem] p-0.5 resize-none border rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "bg-background text-foreground text-center text-sm",
        "flex items-center justify-center"
      )}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      style={{
        height: height ? `${height}px` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.2',
        paddingTop: '0.125rem'
      }}
    />
  );
}