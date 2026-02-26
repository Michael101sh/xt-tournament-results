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

// 30 rows so pagination is clearly visible across multiple pages
const SAMPLE_PLAYERS: Player[] = [
  { id: 1, name: "alice", level: "rookie", score: 84 },
  { id: 2, name: "bob", level: "pro", score: 136 },
  { id: 3, name: "charlie", level: "amateur", score: 102 },
  { id: 4, name: "diana", level: "pro", score: 158 },
  { id: 5, name: "eve", level: "rookie", score: 47 },
  { id: 6, name: "frank", level: "amateur", score: 119 },
  { id: 7, name: "grace", level: "pro", score: 145 },
  { id: 8, name: "hank", level: "rookie", score: 63 },
  { id: 9, name: "ivy", level: "amateur", score: 91 },
  { id: 10, name: "jake", level: "pro", score: 172 },
  { id: 11, name: "karen", level: "rookie", score: 55 },
  { id: 12, name: "leo", level: "amateur", score: 128 },
  { id: 13, name: "mia", level: "pro", score: 164 },
  { id: 14, name: "noah", level: "rookie", score: 39 },
  { id: 15, name: "olivia", level: "amateur", score: 110 },
  { id: 16, name: "pete", level: "pro", score: 149 },
  { id: 17, name: "quinn", level: "rookie", score: 72 },
  { id: 18, name: "rita", level: "amateur", score: 97 },
  { id: 19, name: "sam", level: "pro", score: 181 },
  { id: 20, name: "tina", level: "rookie", score: 68 },
  { id: 21, name: "ursula", level: "amateur", score: 114 },
  { id: 22, name: "victor", level: "pro", score: 155 },
  { id: 23, name: "wendy", level: "rookie", score: 42 },
  { id: 24, name: "xavier", level: "amateur", score: 105 },
  { id: 25, name: "yara", level: "pro", score: 169 },
  { id: 26, name: "zach", level: "rookie", score: 58 },
  { id: 27, name: "amber", level: "amateur", score: 122 },
  { id: 28, name: "blake", level: "pro", score: 143 },
  { id: 29, name: "cora", level: "rookie", score: 76 },
  { id: 30, name: "derek", level: "amateur", score: 99 },
];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            Leaderboard
          </h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {SAMPLE_PLAYERS.length} players
          </span>
        </div>

        <DataTable table={table} />

        {/* Pagination bar */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {currentPage + 1} of {totalPages}
          </p>
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
