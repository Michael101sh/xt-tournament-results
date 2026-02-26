import { memo } from "react";
import { type HeaderGroup } from "@tanstack/react-table";
import { TableHeaderCell } from "./TableHeaderCell";

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

export const TableHeaderGroup = memo(
  TableHeaderGroupInner,
) as typeof TableHeaderGroupInner;
