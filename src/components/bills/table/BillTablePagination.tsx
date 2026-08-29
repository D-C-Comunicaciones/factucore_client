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

interface BillTablePaginationProps {
    page: number;
    setPage: (p: number) => void;
    perPage: number;
    setPerPage: (n: number) => void;
    pagination: ServerPagination;
    onRefresh?: () => void;
    refreshing?: boolean;
}

export function BillTablePagination({
    page,
    setPage,
    perPage,
    setPerPage,
    pagination,
    onRefresh,
    refreshing = false,
}: BillTablePaginationProps) {
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
        [safeLastPage, setPage]
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

    const rangeStart = total === 0 ? 0 : (from || 1);
    const rangeEnd = total === 0 ? 0 : (to || total);

    return (
        <div className="flex min-h-12 flex-col gap-2 border-t border-gray-200 px-4 py-2 md:flex-row md:items-center md:justify-between bg-white rounded-b-xl">
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
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    aria-label="Pagina anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={page >= safeLastPage}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    aria-label="Pagina siguiente"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-700">
                <span>Facturas por pagina:</span>
                <select
                    value={perPage}
                    onChange={(event) => {
                        setPerPage(Number(event.target.value));
                        setPage(1);
                    }}
                    className="h-7 rounded-md border border-gray-300 px-2 text-xs text-gray-800 outline-none focus:border-gray-400 cursor-pointer"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>

                <span>
                    {rangeStart}-{rangeEnd} De {total}
                </span>

                {onRefresh && (
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                        aria-label="Refrescar tabla"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
                    </button>
                )}
            </div>
        </div>
    );
}
