import { memo } from "react";
import { flexRender, type Cell } from "@tanstack/react-table";

interface TableCellProps<TData> {
  cell: Cell<TData, unknown>;
}

const TableCellInner = <TData,>({ cell }: TableCellProps<TData>) => (
  <td
    className="px-5 py-3.5 text-sm text-slate-700"
    style={{ width: cell.column.getSize() }}
  >
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </td>
);

export const TableCell = memo(TableCellInner) as typeof TableCellInner;
