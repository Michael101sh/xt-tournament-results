import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the hook so App renders without a real QueryClient
vi.mock("./hooks/usePlayersTable", () => ({
  PAGE_SIZE_OPTIONS: [10, 20, 50],
  usePlayersTable: vi.fn(),
}));

import { usePlayersTable } from "./hooks/usePlayersTable";
const mockUsePlayersTable = vi.mocked(usePlayersTable);

// Minimal mock table that satisfies the component tree
const createMockTable = () => ({
  getHeaderGroups: () => [],
  getRowModel: () => ({ rows: [] }),
  setPageIndex: vi.fn(),
  getAllColumns: () => [],
  getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }),
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("App", () => {
  it("renders header and table when data loads successfully", () => {
    mockUsePlayersTable.mockReturnValue({
      table: createMockTable() as any,
      totalPlayers: 0,
      totalPages: 0,
      currentPage: 0,
      isLoading: false,
      isError: false,
      error: null,
      searchTerm: "",
      handleSearchChange: vi.fn(),
      pageSize: 10,
      handlePageSizeChange: vi.fn(),
      rowClassName: () => undefined,
      refetch: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText("XT tournament")).toBeInTheDocument();
    expect(screen.getByLabelText("Search players")).toBeInTheDocument();
  });

  it("renders error card when isError is true", () => {
    mockUsePlayersTable.mockReturnValue({
      table: createMockTable() as any,
      totalPlayers: 0,
      totalPages: 0,
      currentPage: 0,
      isLoading: false,
      isError: true,
      error: new Error("Server is down"),
      searchTerm: "",
      handleSearchChange: vi.fn(),
      pageSize: 10,
      handlePageSizeChange: vi.fn(),
      rowClassName: () => undefined,
      refetch: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText("Unable to load data")).toBeInTheDocument();
    expect(screen.getByText("Server is down")).toBeInTheDocument();
  });

  it("shows generic message for non-Error errors", () => {
    mockUsePlayersTable.mockReturnValue({
      table: createMockTable() as any,
      totalPlayers: 0,
      totalPages: 0,
      currentPage: 0,
      isLoading: false,
      isError: true,
      error: "string error" as unknown as Error,
      searchTerm: "",
      handleSearchChange: vi.fn(),
      pageSize: 10,
      handlePageSizeChange: vi.fn(),
      rowClassName: () => undefined,
      refetch: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });
});
