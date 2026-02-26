import { type Table } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import type { Player } from "../types/player";

interface PlayerTableProps {
  table: Table<Player>;
  totalPlayers: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
}

export const PlayerTable = ({
  table,
  totalPlayers,
  totalPages,
  currentPage,
  isLoading,
}: PlayerTableProps) => (
  <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
    <div className="mb-4 flex shrink-0 items-center justify-between">
      <h2 className="text-sm font-semibold text-slate-700">Leaderboard</h2>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        {totalPlayers} players
      </span>
    </div>

    <DataTable
      table={table}
      isLoading={isLoading}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  </div>
);
