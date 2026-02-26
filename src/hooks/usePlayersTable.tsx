import { useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type PaginationState,
} from "@tanstack/react-table";
import { usePlayersQuery } from "./usePlayersQuery";
import { useSuspectsQuery } from "./useSuspectsQuery";
import { useDebounce } from "./useDebounce";
import { useLocalStorage } from "./useLocalStorage";
import { Tooltip } from "../components/ui/Tooltip";
import { LevelFilter } from "../components/LevelFilter";
import { capitalize, cn } from "../lib/utils";
import type { Player, PlayerLevel } from "../types/player";

// Central hook that wires together data fetching, suspect detection, column
// definitions, pagination, filtering, and search — keeping the UI component thin.

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

const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500] as const;
const columnHelper = createColumnHelper<Player>();

export const usePlayersTable = () => {
  const [pagination, setPagination] = useLocalStorage<PaginationState>("xt-pagination", {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [levelFilter, setLevelFilter] = useLocalStorage<PlayerLevel | undefined>("xt-level-filter", undefined);
  const [searchTerm, setSearchTerm] = useLocalStorage("xt-search", "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleLevelChange = useCallback(
    (level: PlayerLevel | undefined) => {
      setLevelFilter(level);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPagination({ pageIndex: 0, pageSize: size });
    },
    [],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = usePlayersQuery(
    pagination.pageIndex,
    pagination.pageSize,
    levelFilter,
    debouncedSearch,
  );
  const { data: suspectIds } = useSuspectsQuery();

  const players = data?.players ?? [];
  const totalPlayers = data?.total ?? 0;
  const totalPages = Math.ceil(totalPlayers / pagination.pageSize);

  // Set for O(1) suspect lookups when rendering each row
  const suspectSet = useMemo(
    () => new Set(suspectIds ?? []),
    [suspectIds],
  );

  const rowClassName = useCallback(
    (player: Player) =>
      suspectSet.has(player.id) ? "!bg-red-50 hover:!bg-red-100/80" : undefined,
    [suspectSet],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        size: 70,
        cell: (info) => (
          <Tooltip content={`Player ID: ${info.getValue()}`}>
            <span className="font-mono text-xs text-slate-400">
              #{info.getValue()}
            </span>
          </Tooltip>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Player",
        size: 180,
        cell: (info) => (
          <Tooltip content={capitalize(info.getValue())}>
            <span className="block truncate font-medium text-slate-900">
              {capitalize(info.getValue())}
            </span>
          </Tooltip>
        ),
      }),
      columnHelper.accessor("level", {
        header: () => (
          <LevelFilter value={levelFilter} onChange={handleLevelChange} />
        ),
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
        size: 150,
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
      columnHelper.display({
        id: "status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
          const isSuspect = suspectSet.has(row.original.id);
          if (!isSuspect) return null;
          return (
            <Tooltip content="This player is suspected of cheating">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                Suspect
              </span>
            </Tooltip>
          );
        },
      }),
    ],
    [levelFilter, handleLevelChange, suspectSet],
  );

  // manualPagination: true — server handles page slicing, we only track page state
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
    isLoading: isLoading || isFetching,
    isError,
    error,
    searchTerm,
    handleSearchChange,
    pageSize: pagination.pageSize,
    handlePageSizeChange,
    rowClassName,
    refetch,
  };
};
