import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { DataTable } from "./components/DataTable";
import { capitalize } from "./lib/utils";
import type { Player } from "./types/player";

// Hardcoded sample data to verify the table infra works
const SAMPLE_PLAYERS: Player[] = [
  { id: 1, name: "alice", level: "rookie", score: 84 },
  { id: 2, name: "bob", level: "pro", score: 136 },
  { id: 3, name: "charlie", level: "amateur", score: 102 },
  { id: 4, name: "diana", level: "pro", score: 158 },
  { id: 5, name: "eve", level: "rookie", score: 47 },
];

const columnHelper = createColumnHelper<Player>();

const App = () => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => capitalize(info.getValue()),
      }),
      columnHelper.accessor("level", {
        header: "Level",
        cell: (info) => capitalize(info.getValue()),
      }),
      columnHelper.accessor("score", {
        header: "Score",
        cell: (info) => info.getValue(),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: SAMPLE_PLAYERS,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          XT tournament - Final results
        </h1>

        <div className="mt-8">
          <DataTable table={table} />
        </div>
      </div>
    </div>
  );
};

export default App;
