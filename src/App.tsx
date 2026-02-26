import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type PaginationState,
} from "@tanstack/react-table";
import { DataTable } from "./components/DataTable";
import { Pagination } from "./components/Pagination";
import { usePlayersQuery } from "./hooks/usePlayersQuery";
import { capitalize, cn } from "./lib/utils";
import type { Player } from "./types/player";

const LEVEL_STYLES: Record<Player["level"], string> = {
  rookie: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amateur: "bg-sky-50 text-sky-700 ring-sky-600/20",
  pro: "bg-violet-50 text-violet-700 ring-violet-600/20",
};

const PAGE_SIZE = 10;
const columnHelper = createColumnHelper<Player>();

const App = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const { data, isLoading, isError, error } = usePlayersQuery(
    pagination.pageIndex,
    pagination.pageSize,
  );

  const players = data?.players ?? [];
  const totalPlayers = data?.total ?? 0;
  const totalPages = Math.ceil(totalPlayers / pagination.pageSize);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        size: 80,
        cell: (info) => (
          <span className="font-mono text-xs text-slate-400">
            #{String(info.getValue()).padStart(3, "0")}
          </span>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Player",
        size: 200,
        cell: (info) => (
          <span className="font-medium text-slate-900">
            {capitalize(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("level", {
        header: "Level",
        size: 120,
        cell: (info) => {
          const level = info.getValue();
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                LEVEL_STYLES[level],
              )}
            >
              {capitalize(level)}
            </span>
          );
        },
      }),
      columnHelper.accessor("score", {
        header: "Score",
        size: 160,
        cell: (info) => {
          const score = info.getValue();
          return (
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  style={{ width: `${Math.min((score / 200) * 100, 100)}%` }}
                />
              </div>
              <span className="min-w-[2ch] font-semibold tabular-nums text-slate-800">
                {score}
              </span>
            </div>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: players,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const currentPage = pagination.pageIndex;

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="mx-4 max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Unable to load data</h2>
          <p className="mt-2 text-sm text-slate-500">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228M18.75 4.236V2.721M7.73 9.728a6.726 6.726 0 002.748 1.35m3.044 0a6.726 6.726 0 002.749-1.35m0 0a6.772 6.772 0 01-3.044.611 6.772 6.772 0 01-3.044-.611"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                XT tournament
              </h1>
              <p className="text-sm font-medium text-slate-500">Final results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            Leaderboard
          </h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {totalPlayers} players
          </span>
        </div>

        <div className="relative min-h-0 flex-1">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <svg className="h-5 w-5 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading players…
              </div>
            </div>
          )}
          <DataTable table={table} />
        </div>

        {/* Pagination bar */}
        <div className="mt-4 flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <label htmlFor="page-jump" className="whitespace-nowrap">
              Page
            </label>
            <select
              id="page-jump"
              value={currentPage}
              onChange={(e) => table.setPageIndex(Number(e.target.value))}
              aria-label="Jump to page"
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i} value={i}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="text-slate-400">of {totalPages}</span>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => table.setPageIndex(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
