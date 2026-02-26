import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeferredLoading } from "./useDeferredLoading";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useDeferredLoading", () => {
  it("returns false initially even when isLoading is true", () => {
    const { result } = renderHook(() => useDeferredLoading(true, 500));
    expect(result.current).toBe(false);
  });

  it("returns true after the delay when isLoading stays true", () => {
    const { result } = renderHook(() => useDeferredLoading(true, 500));

    act(() => vi.advanceTimersByTime(500));

    expect(result.current).toBe(true);
  });

  it("resets to false immediately when isLoading becomes false", () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useDeferredLoading(loading, 500),
      { initialProps: { loading: true } },
    );

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe(true);

    rerender({ loading: false });
    expect(result.current).toBe(false);
  });

  it("does not show if loading finishes before the delay", () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useDeferredLoading(loading, 500),
      { initialProps: { loading: true } },
    );

    act(() => vi.advanceTimersByTime(300));
    rerender({ loading: false });

    expect(result.current).toBe(false);
  });
});
