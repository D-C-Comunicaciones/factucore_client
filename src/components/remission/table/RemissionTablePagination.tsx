"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface RemissionTablePaginationProps {
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  pagination: ServerPagination;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function RemissionTablePagination({
  page,
  setPage,
  perPage,
  setPerPage,
  pagination,
  onRefresh,
  refreshing = false,
}: RemissionTablePaginationProps) {
  const { total, last_page, from, to } = pagination;
  const safeLastPage = Math.max(1, last_page || 1);

  const [pageInput, setPageInput] = React.useState(String(page || 1));

  React.useEffect(() => {
    setPageInput(String(page || 1));
  }, [page]);

  const goToPage = React.useCallback(
    (requestedPage: number) => {
      const nextPage = Math.min(Math.max(1, requestedPage), safeLastPage);
      setPage(nextPage);
    },
    [safeLastPage, setPage],
  );

  const handlePageInputCommit = React.useCallback(() => {
    const numericPage = Number(pageInput);

    if (!Number.isFinite(numericPage) || numericPage < 1) {
      setPageInput(String(page || 1));
      return;
    }

    goToPage(Math.trunc(numericPage));
  }, [goToPage, page, pageInput]);

  const handlePrev = () => {
    if (page > 1) goToPage(page - 1);
  };

  const handleNext = () => {
    if (page < safeLastPage) goToPage(page + 1);
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  const rangeStart = total === 0 ? 0 : from;
  const rangeEnd = total === 0 ? 0 : to;

  return (
    <div className="flex min-h-12 flex-col gap-2 border-t border-gray-200 px-4 py-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 text-xs text-gray-700">
        <span>Pagina</span>
        <input
          type="text"
          inputMode="numeric"
          value={pageInput}
          onChange={(event) => setPageInput(event.target.value.replace(/[^0-9]/g, ""))}
          onBlur={handlePageInputCommit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handlePageInputCommit();
            }
          }}
          className="h-7 w-14 rounded-md border border-gray-300 px-2 text-center text-xs text-gray-800 outline-none focus:border-gray-400"
        />
        <span>De {safeLastPage}</span>

        <button
          type="button"
          onClick={handlePrev}
          disabled={page <= 1}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Pagina anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={page >= safeLastPage}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Pagina siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-700">
        <span>Remisiones por pagina:</span>
        <select
          value={perPage}
          onChange={(event) => {
            setPerPage(Number(event.target.value));
            setPage(1);
          }}
          className="h-7 rounded-md border border-gray-300 px-2 text-xs text-gray-800 outline-none focus:border-gray-400"
        >
          {[10, 20, 40, 60, 80, 100].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <span className="h-5 w-px bg-gray-200" aria-hidden="true" />
        <span>{rangeStart}-{rangeEnd} De {total}</span>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Actualizar"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

