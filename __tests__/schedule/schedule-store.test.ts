import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScheduleStore } from "@/lib/store/schedule-store";

describe("Schedule Store", () => {
  it("updates row status", async () => {
    const { result } = renderHook(() => useScheduleStore());

    await vi.waitFor(() => {
      result.current.updateRowStatus("test-key", "Occupied");
    });

    expect(result.current.getRowStatus("test-key")).toBe("Occupied");
  });

  it("adds and deletes columns", async () => {
    const { result } = renderHook(() => useScheduleStore());

    await vi.waitFor(() => {
      result.current.addColumn("New Column", "text");
    });

    expect(result.current.columns.length).toBe(1);

    await vi.waitFor(() => {
      result.current.deleteColumn(0);
    });

    expect(result.current.columns.length).toBe(0);
  });
});
