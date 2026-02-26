import { useMemo } from "react";
import { type Table } from "@tanstack/react-table";
import { TableHeaderGroup } from "./TableHeaderGroup";
import { TableRow } from "./TableRow";

interface DataTableProps<TData> {
  table: Table<TData>;
  /** Derive a conditional CSS class from row data (must be memoized by caller) */
  rowClassName?: (row: TData) => string | undefined;
}

export const DataTable = <TData,>({
  table,
  rowClassName,
}: DataTableProps<TData>) => {
  const headerGroups = table.getHeaderGroups();
  const { rows } = table.getRowModel();

  // Pre-compute row classNames in one pass so TableRow receives a stable string
  const rowClassNames = useMemo(() => {
    if (!rowClassName) return undefined;
    return new Map(rows.map((row) => [row.id, rowClassName(row.original)]));
  }, [rows, rowClassName]);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg
          className="mb-3 h-12 w-12 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <p className="text-sm font-medium">No results found</p>
        <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-900/5">
      <div className="overflow-auto">
        <table className="w-full min-w-[520px] table-fixed border-collapse">
          <thead className="sticky top-0 z-10">
            {headerGroups.map((headerGroup) => (
              <TableHeaderGroup
                key={headerGroup.id}
                headerGroup={headerGroup}
              />
            ))}
          </thead>
          <tbody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                className={rowClassNames?.get(row.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
