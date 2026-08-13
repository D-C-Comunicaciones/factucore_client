"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface ReturnsTablePaginationProps {
  page?: number;
  lastPage?: number;
  perPage?: number;
  from?: number;
  to?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function ReturnsTablePagination({
  page = 1,
  lastPage = 1,
  perPage = 10,
  from = 0,
  to = 0,
  total = 0,
  onPageChange,
  onPerPageChange,
  onRefresh,
  refreshing = false,
}: ReturnsTablePaginationProps) {
  const safeLastPage = Math.max(1, lastPage);
  const [pageInput, setPageInput] = React.useState(String(page));

  React.useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const goToPage = (requested: number) => {
    const next = Math.min(Math.max(1, requested), safeLastPage);
    onPageChange?.(next);
  };

  const handlePageInputCommit = () => {
    const num = Number(pageInput);
    if (!Number.isFinite(num) || num < 1) {
      setPageInput(String(page));
      return;
    }
    goToPage(Math.trunc(num));
  };

  return (
    <div className="flex min-h-12 flex-col gap-2 border-t border-gray-200 px-4 py-2 md:flex-row md:items-center md:justify-between">
      {/* Izquierda: navegación de página */}
      <div className="flex items-center gap-2 text-xs text-gray-700">
        <span>Página</span>
        <input
          type="text"
          inputMode="numeric"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={handlePageInputCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlePageInputCommit();
            }
          }}
          className="h-7 w-14 rounded-md border border-gray-300 px-2 text-center text-xs text-gray-800 outline-none focus:border-gray-400 bg-white"
        />
        <span>De {safeLastPage}</span>

        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page >= safeLastPage}
          className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Derecha: items por página + rango + refresh */}
      <div className="flex items-center gap-3 text-xs text-gray-700">
        <span>Ítems por página:</span>
        <select
          value={perPage}
          onChange={(e) => {
            onPerPageChange?.(Number(e.target.value));
            onPageChange?.(1);
          }}
          className="cursor-pointer h-7 rounded-md border border-gray-300 px-2 text-xs text-gray-800 outline-none focus:border-gray-400 bg-white"
        >
          {[10, 20, 40, 60, 80, 100].map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <span className="h-5 w-px bg-gray-200" aria-hidden="true" />
        <span>{from}-{to} De {total}</span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Actualizar"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}
