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
      <div className="py-16 text-center text-slate-400">
        No data found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          {headerGroups.map((headerGroup) => (
            <TableHeaderGroup key={headerGroup.id} headerGroup={headerGroup} />
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
  );
};
