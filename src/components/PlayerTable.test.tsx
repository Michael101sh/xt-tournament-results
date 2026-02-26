import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { PlayerTable } from "./PlayerTable";

interface TestRow {
  id: number;
  name: string;
  level: "rookie" | "amateur" | "pro";
  score: number;
}

const testData: TestRow[] = [
  { id: 1, name: "alice", level: "rookie", score: 80 },
];

const columnHelper = createColumnHelper<TestRow>();
const testColumns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
];

// Wrapper that creates a real table instance
const PlayerTableHarness = (
  overrides: Partial<React.ComponentProps<typeof PlayerTable>> = {},
) => {
  const table = useReactTable({
    data: testData,
    columns: testColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const defaults: React.ComponentProps<typeof PlayerTable> = {
    table: table as any,
    totalPlayers: 50,
    totalPages: 5,
    currentPage: 0,
    isLoading: false,
    searchTerm: "",
    onSearchChange: vi.fn(),
    rowClassName: () => undefined,
    onRefresh: vi.fn(),
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
    onPageSizeChange: vi.fn(),
  };

  return <PlayerTable {...defaults} {...overrides} />;
};

describe("PlayerTable", () => {
  it("renders the player count badge", () => {
    render(<PlayerTableHarness totalPlayers={123} />);

    expect(screen.getByText("123 players")).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(<PlayerTableHarness />);

    expect(screen.getByLabelText("Search players")).toBeInTheDocument();
  });

  it("renders the refresh button with accessible label", () => {
    render(<PlayerTableHarness />);

    expect(screen.getByLabelText("Refresh data")).toBeInTheDocument();
  });

  it("shows spinner on refresh button when loading", () => {
    render(<PlayerTableHarness isLoading />);

    const svg = screen.getByLabelText("Refresh data").querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("animate-spin");
  });

  it("calls onRefresh when refresh button is clicked", async () => {
    const user = userEvent.setup();
    const handleRefresh = vi.fn();

    render(<PlayerTableHarness onRefresh={handleRefresh} />);
    await user.click(screen.getByLabelText("Refresh data"));

    expect(handleRefresh).toHaveBeenCalledOnce();
  });
});
