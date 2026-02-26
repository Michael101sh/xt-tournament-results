import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type PaginationState,
} from "@tanstack/react-table";
import { DataTable } from "./components/DataTable";
import { Pagination } from "./components/Pagination";
import { capitalize, cn } from "./lib/utils";
import type { Player } from "./types/player";

// Generate 150 sample players to demo pagination with many pages
const NAMES = [
  "alice", "bob", "charlie", "diana", "eve", "frank", "grace", "hank", "ivy",
  "jake", "karen", "leo", "mia", "noah", "olivia", "pete", "quinn", "rita",
  "sam", "tina", "ursula", "victor", "wendy", "xavier", "yara", "zach",
  "amber", "blake", "cora", "derek",
];
const LEVELS: Player["level"][] = ["rookie", "amateur", "pro"];

const SAMPLE_PLAYERS: Player[] = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  name: NAMES[i % NAMES.length],
  level: LEVELS[i % LEVELS.length],
  score: 30 + Math.round(Math.sin(i * 0.7) * 60 + 80),
}));

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

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <span className="font-mono text-xs text-slate-400">
            #{String(info.getValue()).padStart(3, "0")}
          </span>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Player",
        cell: (info) => (
          <span className="font-medium text-slate-900">
            {capitalize(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("level", {
        header: "Level",
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
        cell: (info) => {
          const score = info.getValue();
          return (
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
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
    data: SAMPLE_PLAYERS,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalPages = table.getPageCount();
  const currentPage = pagination.pageIndex;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header — fixed at top */}
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

      {/* Content — fills remaining space, internal flex layout */}
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            Leaderboard
          </h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {SAMPLE_PLAYERS.length} players
          </span>
        </div>

        {/* Table — takes remaining height, scrolls internally */}
        <div className="min-h-0 flex-1">
          <DataTable table={table} />
        </div>

        {/* Pagination bar — stays below the table */}
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
