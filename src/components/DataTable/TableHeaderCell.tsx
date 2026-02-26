import { memo } from "react";
import { flexRender, type Header } from "@tanstack/react-table";

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

export const TableHeaderCell = memo(
  TableHeaderCellInner,
) as typeof TableHeaderCellInner;
