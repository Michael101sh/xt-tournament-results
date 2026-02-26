// Shown when a search or filter returns zero matching players
export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
    <svg
      className="mb-3 h-12 w-12 text-slate-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
    <p className="text-sm font-medium">No results found</p>
    <p className="mt-1 text-xs text-slate-400">
      Try adjusting your search or filters.
    </p>
  </div>
);
