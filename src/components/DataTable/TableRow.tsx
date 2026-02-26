import { memo } from "react";
import { type Row } from "@tanstack/react-table";
import { cn } from "../../lib/utils";
import { TableCell } from "./TableCell";

interface TableRowProps<TData> {
  row: Row<TData>;
  className?: string;
}

const TableRowInner = <TData,>({ row, className }: TableRowProps<TData>) => {
  const cells = row.getVisibleCells();

  return (
    <tr
      className={cn(
        "border-b border-slate-100/80 bg-white transition-colors duration-150 hover:bg-indigo-50/40",
        className,
      )}
    >
      {cells.map((cell) => (
        <TableCell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
};

export const TableRow = memo(TableRowInner) as typeof TableRowInner;
