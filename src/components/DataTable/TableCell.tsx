import { memo } from "react";
import { flexRender, type Cell } from "@tanstack/react-table";

interface TableCellProps<TData> {
  cell: Cell<TData, unknown>;
}

const TableCellInner = <TData,>({ cell }: TableCellProps<TData>) => (
  <td className="px-4 py-3 text-slate-700">
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </td>
);

export const TableCell = memo(TableCellInner) as typeof TableCellInner;
