import { memo } from "react";
import { flexRender, type Header } from "@tanstack/react-table";

interface TableHeaderCellProps<TData> {
  header: Header<TData, unknown>;
}

const TableHeaderCellInner = <TData,>({
  header,
}: TableHeaderCellProps<TData>) => (
  <th
    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap"
    style={{ width: header.getSize() }}
  >
    {header.isPlaceholder
      ? null
      : flexRender(header.column.columnDef.header, header.getContext())}
  </th>
);

export const TableHeaderCell = memo(
  TableHeaderCellInner,
) as typeof TableHeaderCellInner;
