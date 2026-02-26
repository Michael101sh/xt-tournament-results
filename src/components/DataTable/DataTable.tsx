import { type ReactNode, useMemo } from "react";
import { type Table } from "@tanstack/react-table";
import { TableHeaderGroup } from "./TableHeaderGroup";
import { TableRow } from "./TableRow";
import { LoadingOverlay } from "../LoadingOverlay";
import { Pagination } from "../Pagination";
import { EmptyState } from "./EmptyState";

interface DataTableProps<TData> {
  table: Table<TData>;
  rowClassName?: (row: TData) => string | undefined;
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  onPageSizeChange?: (size: number) => void;
  emptyState?: ReactNode;
}

export const DataTable = <TData,>({
  table,
  rowClassName,
  isLoading = false,
  totalPages = 0,
  currentPage = 0,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  emptyState,
}: DataTableProps<TData>) => {
  const headerGroups = table.getHeaderGroups();
  const { rows } = table.getRowModel();

  const rowClassNames = useMemo(() => {
    if (!rowClassName) return undefined;
    return new Map(rows.map((row) => [row.id, rowClassName(row.original)]));
  }, [rows, rowClassName]);

  const showPagination = totalPages > 1;

  if (rows.length === 0 && !isLoading) {
    return <>{emptyState ?? <EmptyState />}</>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        {isLoading && <LoadingOverlay />}
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-900/5">
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[640px] table-fixed border-collapse">
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
      </div>

      {showPagination && (
        <div className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <label htmlFor="page-jump" className="whitespace-nowrap">
                Page
              </label>
              <select
                id="page-jump"
                value={currentPage}
                onChange={(e) => table.setPageIndex(Number(e.target.value))}
                aria-label="Jump to page"
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="text-slate-400">of {totalPages}</span>
            </div>
            {pageSizeOptions && onPageSizeChange && (
              <div className="flex items-center gap-2">
                <label htmlFor="page-size" className="whitespace-nowrap">
                  Rows
                </label>
                <select
                  id="page-size"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  aria-label="Rows per page"
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => table.setPageIndex(page)}
          />
        </div>
      )}
    </div>
  );
};
