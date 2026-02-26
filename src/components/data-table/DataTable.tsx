import { type ReactNode, useId, useMemo } from "react";
import { type Table } from "@tanstack/react-table";
import { TableHeaderGroup } from "./TableHeaderGroup";
import { TableRow } from "./TableRow";
import { Pagination } from "./Pagination";
import { LoadingOverlay } from "../LoadingOverlay";
import { EmptyState } from "./EmptyState";
import { useDeferredLoading } from "../../hooks/useDeferredLoading";

interface DataTableProps<TData> {
  table: Table<TData>;
  rowClassName?: (row: TData) => string | undefined;
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  totalRows?: number;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  onPageSizeChange?: (size: number) => void;
  emptyState?: ReactNode;
}

// Generic, reusable data table with deferred loading overlay, pagination footer,
// page-jump dropdown, and rows-per-page selector.
export const DataTable = <TData,>({
  table,
  rowClassName,
  isLoading = false,
  totalPages = 0,
  currentPage = 0,
  totalRows,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  emptyState,
}: DataTableProps<TData>) => {
  const instanceId = useId();
  const pageJumpId = `${instanceId}-page-jump`;
  const pageSizeId = `${instanceId}-page-size`;
  const headerGroups = table.getHeaderGroups();
  const { rows } = table.getRowModel();

  // Pre-compute row class names into a Map so rendering doesn't call the
  // callback per-row on every render — only recomputed when rows change.
  const rowClassNames = useMemo(() => {
    if (!rowClassName) return undefined;
    return new Map(rows.map((row) => [row.id, rowClassName(row.original)]));
  }, [rows, rowClassName]);

  const showPagination = totalPages > 1;
  const showOverlay = useDeferredLoading(isLoading);

  if (rows.length === 0 && !isLoading) {
    return <>{emptyState ?? <EmptyState />}</>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        {showOverlay && <LoadingOverlay />}
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
        <div className="mt-4 grid shrink-0 grid-cols-3 items-center gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <label htmlFor={pageJumpId} className="whitespace-nowrap">
                Page
              </label>
              <select
                id={pageJumpId}
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
              <span className="font-semibold text-slate-800">of {totalPages}</span>
            </div>
            {pageSizeOptions && onPageSizeChange && (
              <div className="flex items-center gap-2">
                <label htmlFor={pageSizeId} className="whitespace-nowrap">
                  Rows
                </label>
                <select
                  id={pageSizeId}
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
          {totalRows != null ? (
            <span className="text-center text-xs font-semibold text-slate-800">
              {rows.length} of {totalRows.toLocaleString()}
            </span>
          ) : <span />}
          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => table.setPageIndex(page)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
