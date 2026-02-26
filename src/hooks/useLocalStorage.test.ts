import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

beforeEach(() => localStorage.clear());

describe("useLocalStorage", () => {
  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("reads an existing value from localStorage", () => {
    localStorage.setItem("key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    expect(result.current[0]).toBe("stored");
  });

  it("writes the value to localStorage on update", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    act(() => result.current[1]("updated"));

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("key")!)).toBe("updated");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => result.current[1]((prev) => prev + 1));
    act(() => result.current[1]((prev) => prev + 1));

    expect(result.current[0]).toBe(2);
    expect(JSON.parse(localStorage.getItem("counter")!)).toBe(2);
  });

  it("falls back to initial value when stored JSON is corrupted", () => {
    localStorage.setItem("key", "not-valid-json");
    const { result } = renderHook(() => useLocalStorage("key", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });

  it("handles complex objects", () => {
    const initial = { pageIndex: 0, pageSize: 10 };
    const { result } = renderHook(() => useLocalStorage("pagination", initial));

    act(() => result.current[1]({ pageIndex: 2, pageSize: 20 }));

    expect(result.current[0]).toEqual({ pageIndex: 2, pageSize: 20 });
  });
});
