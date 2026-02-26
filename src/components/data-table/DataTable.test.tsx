import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { DataTable } from "./DataTable";

// Stub the deferred loading hook so the overlay appears immediately in tests
vi.mock("../../hooks/useDeferredLoading", () => ({
  useDeferredLoading: (isLoading: boolean) => isLoading,
}));

interface TestRow {
  id: number;
  name: string;
}

const columnHelper = createColumnHelper<TestRow>();
const testColumns = [
  columnHelper.accessor("id", { header: "ID", size: 80 }),
  columnHelper.accessor("name", { header: "Name", size: 200 }),
];

const testData: TestRow[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// Wrapper that creates a real TanStack Table instance and passes it to DataTable
const DataTableHarness = ({
  data = testData,
  ...rest
}: { data?: TestRow[] } & Partial<React.ComponentProps<typeof DataTable<TestRow>>>) => {
  const table = useReactTable({
    data,
    columns: testColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} {...rest} />;
};

describe("DataTable", () => {
  it("renders table headers from column definitions", () => {
    render(<DataTableHarness />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("renders table rows from data", () => {
    render(<DataTableHarness />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("shows empty state when data is empty and not loading", () => {
    render(<DataTableHarness data={[]} />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("shows custom empty state when provided", () => {
    render(
      <DataTableHarness data={[]} emptyState={<div>Custom empty</div>} />,
    );

    expect(screen.getByText("Custom empty")).toBeInTheDocument();
  });

  it("shows loading overlay when isLoading is true", () => {
    render(<DataTableHarness isLoading />);

    expect(screen.getByText("Loading players…")).toBeInTheDocument();
  });

  it("hides pagination when totalPages <= 1", () => {
    render(<DataTableHarness totalPages={1} currentPage={0} />);

    expect(screen.queryByLabelText("Jump to page")).not.toBeInTheDocument();
  });

  it("shows pagination controls when totalPages > 1", () => {
    render(<DataTableHarness totalPages={3} currentPage={0} />);

    expect(screen.getByLabelText("Jump to page")).toBeInTheDocument();
  });

  it("shows total rows counter when totalRows is provided", () => {
    render(
      <DataTableHarness totalPages={2} currentPage={0} totalRows={100} />,
    );

    expect(screen.getByText(/of 100/)).toBeInTheDocument();
  });
});
