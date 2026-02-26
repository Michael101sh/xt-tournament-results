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

export const TableRow = memo(TableRowInner) as typeof TableRowInner;
