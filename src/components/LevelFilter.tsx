import type { PlayerLevel } from "../types/player";
import { capitalize } from "../lib/utils";

// Rendered inside the table's "Level" column header for inline filtering
const LEVELS: PlayerLevel[] = ["rookie", "amateur", "pro"];

interface LevelFilterProps {
  value: PlayerLevel | undefined;
  onChange: (level: PlayerLevel | undefined) => void;
}

export const LevelFilter = ({ value, onChange }: LevelFilterProps) => (
  <div className="flex items-center gap-2">
    <span>Level</span>
    <select
      id="level-filter"
      value={value ?? ""}
      onChange={(e) =>
        onChange((e.target.value || undefined) as PlayerLevel | undefined)
      }
      aria-label="Filter by level"
      // Prevent click from triggering column sort or other header interactions
      onClick={(e) => e.stopPropagation()}
      className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-xs font-medium normal-case tracking-normal text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
    >
      <option value="">All</option>
      {LEVELS.map((level) => (
        <option key={level} value={level}>
          {capitalize(level)}
        </option>
      ))}
    </select>
  </div>
);
