import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlayersTable, PAGE_SIZE_OPTIONS } from "./usePlayersTable";
import { createQueryWrapper } from "../test/utils";

// Mock query hooks to isolate table logic from network
vi.mock("./usePlayersQuery", () => ({
  usePlayersQuery: vi.fn(() => ({
    data: {
      players: [
        { id: 1, name: "alice", level: "rookie", score: 80 },
        { id: 2, name: "bob", level: "pro", score: 150 },
      ],
      total: 2,
    },
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock("./useSuspectsQuery", () => ({
  useSuspectsQuery: vi.fn(() => ({
    data: [2],
  })),
}));

vi.mock("./useDebounce", () => ({
  useDebounce: vi.fn((value: unknown) => value),
}));

// Minimal stubs — column cells render JSX with these
vi.mock("../components/ui/Tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("../components/LevelFilter", () => ({
  LevelFilter: () => <span data-testid="level-filter" />,
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("usePlayersTable", () => {
  it("returns initial state with defaults", () => {
    const { result } = renderHook(() => usePlayersTable(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.currentPage).toBe(0);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.totalPlayers).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("exposes page size options", () => {
    expect(PAGE_SIZE_OPTIONS).toEqual([10, 20, 50, 100, 500]);
  });

  it("handleSearchChange updates search and resets page to 0", () => {
    const { result } = renderHook(() => usePlayersTable(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handleSearchChange("test"));

    expect(result.current.searchTerm).toBe("test");
    expect(result.current.currentPage).toBe(0);
  });

  it("handlePageSizeChange updates page size and resets page to 0", () => {
    const { result } = renderHook(() => usePlayersTable(), {
      wrapper: createQueryWrapper(),
    });

    act(() => result.current.handlePageSizeChange(50));

    expect(result.current.pageSize).toBe(50);
    expect(result.current.currentPage).toBe(0);
  });

  it("rowClassName returns red class for suspects", () => {
    const { result } = renderHook(() => usePlayersTable(), {
      wrapper: createQueryWrapper(),
    });

    // Player ID 2 is a suspect (from mock)
    expect(result.current.rowClassName({ id: 2, name: "bob", level: "pro", score: 150 }))
      .toBe("!bg-red-50 hover:!bg-red-100/80");
  });

  it("rowClassName returns undefined for non-suspects", () => {
    const { result } = renderHook(() => usePlayersTable(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.rowClassName({ id: 1, name: "alice", level: "rookie", score: 80 }))
      .toBeUndefined();
  });

  it("creates a table with correct column count", () => {
    const { result } = renderHook(() => usePlayersTable(), {
      wrapper: createQueryWrapper(),
    });

    const columns = result.current.table.getAllColumns();
    expect(columns).toHaveLength(5); // id, name, level, score, status
  });
});
