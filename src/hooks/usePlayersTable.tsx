import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type PaginationState,
} from "@tanstack/react-table";
import { usePlayersQuery } from "./usePlayersQuery";
import { Tooltip } from "../components/Tooltip";
import { capitalize, cn } from "../lib/utils";
import type { Player } from "../types/player";

const LEVEL_DESCRIPTIONS: Record<Player["level"], string> = {
  rookie: "Entry-level competitor",
  amateur: "Intermediate competitor",
  pro: "Top-tier competitor",
};

const LEVEL_STYLES: Record<Player["level"], string> = {
  rookie: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amateur: "bg-sky-50 text-sky-700 ring-sky-600/20",
  pro: "bg-violet-50 text-violet-700 ring-violet-600/20",
};

const PAGE_SIZE = 10;
const columnHelper = createColumnHelper<Player>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    size: 80,
    cell: (info) => (
      <Tooltip content={`Player ID: ${info.getValue()}`}>
        <span className="font-mono text-xs text-slate-400">
          #{String(info.getValue()).padStart(3, "0")}
        </span>
      </Tooltip>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Player",
    size: 200,
    cell: (info) => (
      <Tooltip content={capitalize(info.getValue())}>
        <span className="block truncate font-medium text-slate-900">
          {capitalize(info.getValue())}
        </span>
      </Tooltip>
    ),
  }),
  columnHelper.accessor("level", {
    header: "Level",
    size: 120,
    cell: (info) => {
      const level = info.getValue();
      return (
        <Tooltip content={LEVEL_DESCRIPTIONS[level]}>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
              LEVEL_STYLES[level],
            )}
          >
            {capitalize(level)}
          </span>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor("score", {
    header: "Score",
    size: 160,
    cell: (info) => {
      const score = info.getValue();
      const pct = Math.min((score / 200) * 100, 100);
      return (
        <Tooltip content={`Score: ${score} / 200 (${pct.toFixed(0)}%)`} className="block">
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="min-w-[2ch] font-semibold tabular-nums text-slate-800">
              {score}
            </span>
          </div>
        </Tooltip>
      );
    },
  }),
];

export const usePlayersTable = () => {
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

  const table = useReactTable({
    data: players,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return {
    table,
    totalPlayers,
    totalPages,
    currentPage: pagination.pageIndex,
    isLoading,
    isError,
    error,
  };
};
