import { useMemo, useCallback } from "react";
import { cn } from "../lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SIBLINGS = 2;

// Builds the visible page range with ellipsis markers
const buildPageRange = (
  currentPage: number,
  totalPages: number,
): (number | "ellipsis-start" | "ellipsis-end")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

  const rangeStart = Math.max(1, currentPage - SIBLINGS);
  const rangeEnd = Math.min(totalPages - 2, currentPage + SIBLINGS);

  pages.push(0);

  if (rangeStart > 1) {
    pages.push("ellipsis-start");
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalPages - 2) {
    pages.push("ellipsis-end");
  }

  if (totalPages > 1) {
    pages.push(totalPages - 1);
  }

  return pages;
};

// ── Chevron icons ───────────────────────────────────────────────────────

const ChevronLeft = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const ChevronsLeft = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
  </svg>
);

const ChevronsRight = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
  </svg>
);

// ── Button primitive ────────────────────────────────────────────────────

interface PageButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

const PageButton = ({
  onClick,
  disabled,
  active,
  ariaLabel,
  children,
}: PageButtonProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        onClick();
      }
    },
    [disabled, onClick],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      tabIndex={0}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1",
        active && "bg-indigo-600 text-white shadow-md shadow-indigo-500/30",
        !active && !disabled && "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        disabled && "cursor-not-allowed text-slate-300",
      )}
    >
      {children}
    </button>
  );
};

// ── Pagination (public) ─────────────────────────────────────────────────

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages = useMemo(
    () => buildPageRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  return (
    <nav
      aria-label="Table pagination"
      className="flex items-center gap-1"
    >
      <PageButton
        onClick={() => onPageChange(0)}
        disabled={isFirst}
        ariaLabel="Go to first page"
      >
        <ChevronsLeft />
      </PageButton>

      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        ariaLabel="Go to previous page"
      >
        <ChevronLeft />
      </PageButton>

      <div className="flex items-center gap-0.5 px-1">
        {pages.map((page) => {
          if (typeof page === "string") {
            return (
              <span
                key={page}
                className="inline-flex h-9 w-9 items-center justify-center text-slate-400"
                aria-hidden="true"
              >
                &hellip;
              </span>
            );
          }

          return (
            <PageButton
              key={page}
              onClick={() => onPageChange(page)}
              active={page === currentPage}
              ariaLabel={`Go to page ${page + 1}`}
            >
              {page + 1}
            </PageButton>
          );
        })}
      </div>

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        ariaLabel="Go to next page"
      >
        <ChevronRight />
      </PageButton>

      <PageButton
        onClick={() => onPageChange(totalPages - 1)}
        disabled={isLast}
        ariaLabel="Go to last page"
      >
        <ChevronsRight />
      </PageButton>
    </nav>
  );
};
