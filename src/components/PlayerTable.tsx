import { type Table } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { SearchInput } from "./SearchInput";
import type { Player } from "../types/player";

interface PlayerTableProps {
  table: Table<Player>;
  totalPlayers: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  rowClassName?: (row: Player) => string | undefined;
}

export const PlayerTable = ({
  table,
  totalPlayers,
  totalPages,
  currentPage,
  isLoading,
  searchTerm,
  onSearchChange,
  rowClassName,
}: PlayerTableProps) => (
  <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
    <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
      <h2 className="shrink-0 text-sm font-semibold text-slate-700">
        Leaderboard
      </h2>
      <div className="w-full max-w-xs">
        <SearchInput value={searchTerm} onChange={onSearchChange} />
      </div>
      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        {totalPlayers} players
      </span>
    </div>

    <DataTable
      table={table}
      isLoading={isLoading}
      totalPages={totalPages}
      currentPage={currentPage}
      rowClassName={rowClassName}
    />
  </div>
);
