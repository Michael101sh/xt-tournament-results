import { memo, useMemo } from "react";
import {
  flexRender,
  type Table,
  type Header,
  type HeaderGroup,
  type Row,
  type Cell,
} from "@tanstack/react-table";
import { cn } from "../lib/utils";

// ── Cell ────────────────────────────────────────────────────────────────
// Smallest unit — only re-renders when its own cell context changes.

interface TableCellProps<TData> {
  cell: Cell<TData, unknown>;
}

const TableCellInner = <TData,>({ cell }: TableCellProps<TData>) => (
  <td className="px-4 py-3 text-slate-700">
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </td>
);

const TableCell = memo(TableCellInner) as typeof TableCellInner;

// ── Header Cell ─────────────────────────────────────────────────────────

interface TableHeaderCellProps<TData> {
  header: Header<TData, unknown>;
}

const TableHeaderCellInner = <TData,>({
  header,
}: TableHeaderCellProps<TData>) => (
  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">
    {header.isPlaceholder
      ? null
      : flexRender(header.column.columnDef.header, header.getContext())}
  </th>
);

const TableHeaderCell = memo(TableHeaderCellInner) as typeof TableHeaderCellInner;

// ── Row ─────────────────────────────────────────────────────────────────
// Memoized per-row: skips re-render unless the row object identity changes.

interface TableRowProps<TData> {
  row: Row<TData>;
  className?: string;
}

const TableRowInner = <TData,>({ row, className }: TableRowProps<TData>) => {
  const cells = row.getVisibleCells();

  return (
    <tr
      className={cn(
        "border-t border-slate-100 bg-white transition-colors hover:bg-slate-50",
        className,
      )}
    >
      {cells.map((cell) => (
        <TableCell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
};

const TableRow = memo(TableRowInner) as typeof TableRowInner;

// ── Header Group ────────────────────────────────────────────────────────

interface TableHeaderGroupProps<TData> {
  headerGroup: HeaderGroup<TData>;
}

const TableHeaderGroupInner = <TData,>({
  headerGroup,
}: TableHeaderGroupProps<TData>) => (
  <tr className="bg-slate-50">
    {headerGroup.headers.map((header) => (
      <TableHeaderCell key={header.id} header={header} />
    ))}
  </tr>
);

const TableHeaderGroup = memo(
  TableHeaderGroupInner,
) as typeof TableHeaderGroupInner;

// ── DataTable (public) ──────────────────────────────────────────────────

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
