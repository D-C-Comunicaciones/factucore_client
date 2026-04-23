"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface InvoiceTablePaginationProps {
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  pagination: ServerPagination;
}

export function InvoiceTablePagination({
  page,
  setPage,
  perPage,
  pagination,
}: InvoiceTablePaginationProps) {
  const { total, last_page, from, to } = pagination;

  const maxVisible = 3;

  const visiblePages = React.useMemo(() => {
    if (last_page <= maxVisible) {
      return Array.from({ length: last_page }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = page - half;
    let end = page + half;

    if (start < 1) {
      start = 1;
      end = maxVisible;
    }
    if (end > last_page) {
      end = last_page;
      start = last_page - maxVisible + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, last_page]);

  const showLeftEllipsis = visiblePages[0] > 1;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < last_page;

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < last_page) setPage(page + 1);
  };

  if (total === 0) {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-t border-gray-200 gap-2">
        <div className="text-xs text-gray-600">0 de 0 seleccionados.</div>
        <div className="text-xs text-gray-600">No hay registros para mostrar</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-t border-gray-200 gap-2">
      <div className="text-xs text-gray-600">
        Mostrando {from}-{to} de {total} registros
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={page <= 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {showLeftEllipsis && (
          <span className="px-2 text-xs text-gray-500">...</span>
        )}

        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`min-w-[32px] h-8 px-2 text-xs rounded-md border transition ${
              p === page
                ? "bg-[#00bba7] text-white border-[#00bba7] font-medium"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}

        {showRightEllipsis && (
          <span className="px-2 text-xs text-gray-500">...</span>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={page >= last_page}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
