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
  onRefresh: () => void;
  pageSize: number;
  pageSizeOptions: readonly number[];
  onPageSizeChange: (size: number) => void;
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
  onRefresh,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: PlayerTableProps) => (
  <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
    <div className="mb-4 flex shrink-0 flex-wrap items-center gap-3">
      <div className="w-full max-w-xs">
        <SearchInput value={searchTerm} onChange={onSearchChange} />
      </div>
       <div className="ml-auto flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {totalPlayers} players
        </span>
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh data"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
        >
          <svg
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          </svg>
        </button>
      </div>
    </div>

    <DataTable
      table={table}
      isLoading={isLoading}
      totalPages={totalPages}
      currentPage={currentPage}
      rowClassName={rowClassName}
      totalRows={totalPlayers}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={onPageSizeChange}
    />
  </div>
);
