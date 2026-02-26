import { memo } from "react";
import { type HeaderGroup } from "@tanstack/react-table";
import { TableHeaderCell } from "./TableHeaderCell";

interface TableHeaderGroupProps<TData> {
  headerGroup: HeaderGroup<TData>;
}

const TableHeaderGroupInner = <TData,>({
  headerGroup,
}: TableHeaderGroupProps<TData>) => (
  <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
    {headerGroup.headers.map((header) => (
      <TableHeaderCell key={header.id} header={header} />
    ))}
  </tr>
);

export const TableHeaderGroup = memo(
  TableHeaderGroupInner,
) as typeof TableHeaderGroupInner;
