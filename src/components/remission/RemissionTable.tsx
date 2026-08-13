"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useRowSelection } from "@/hooks/use-row-selection";

import { getColumns } from "@/components/remission/table/columns";
import { RemissionTableToolbar } from "@/components/remission/table/RemissionTableToolbar";
import { FilterChips, filterValueToColumnId } from "@/components/remission/table/FilterChips";
import { RemissionTableBody } from "@/components/remission/table/RemissionTableBody";
import { RemissionTablePagination } from "@/components/remission/table/RemissionTablePagination";

import type { RemissionSummary } from "@/types/remission";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface RemissionTableProps {
  remissions: RemissionSummary[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: (filters: ColumnFiltersState) => void;
  search?: string;
  setSearch?: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  pagination: ServerPagination;
  isError?: boolean;
}

export function RemissionTable({
  remissions,
  loading,
  refreshing = false,
  onRefresh,
  columnFilters,
  setColumnFilters,
  search = "",
  setSearch,
  page,
  setPage,
  perPage,
  setPerPage,
  pagination,
  isError = false,
}: RemissionTableProps) {
  const router = useRouter();

  const columns = getColumns(router);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  // âœ… Hook de selecciÃ³n centralizado
  const selection = useRowSelection();
  const { rowSelection, onRowSelectionChange, selectedIds } = selection;

  const effectiveFilters = columnFilters ?? internalColumnFilters;
  const hasActiveFilters = React.useMemo(
    () =>
      effectiveFilters.some((f) => {
        if (f.id === "overdue") {
          return Boolean(f.value);
        }

        if (Array.isArray(f.value)) {
          return f.value.length > 0;
        }

        if (typeof f.value === "string") {
          return f.value.trim() !== "";
        }

        return f.value !== undefined && f.value !== null && f.value !== "";
      }),
    [effectiveFilters],
  );

  const hasQueryContext = Boolean(search.trim()) || hasActiveFilters;

  const setEffectiveFilters = React.useCallback(
    (updaterOrValue: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => {
      const resolve = (prev: ColumnFiltersState) =>
        typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

      if (setColumnFilters) {
        setColumnFilters(resolve(effectiveFilters));
      } else {
        setInternalColumnFilters((prev) => resolve(prev));
      }
    },
    [setColumnFilters, effectiveFilters],
  );

  const table = useReactTable({
    data: remissions,
    columns,
    getRowId: (row) => String(row.id), // IDs reales como fuente de verdad
    enableRowSelection: true,
    state: { sorting, columnFilters: effectiveFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setEffectiveFilters as any,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    rowCount: pagination.total,
  });

  function handleAddFilter(filterValue: string) {
    const columnId = filterValueToColumnId[filterValue];
    if (!columnId) return;
    if (effectiveFilters.some((f) => f.id === columnId)) return;
    setEffectiveFilters([...effectiveFilters, { id: columnId, value: "" }]);
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <RemissionTableToolbar
        table={table}
        search={search}
        setSearch={setSearch ?? (() => { })}
        onAddFilter={handleAddFilter}
        perPage={perPage}
        setPerPage={setPerPage}
      />

      <FilterChips
        columnFilters={effectiveFilters}
        setColumnFilters={setEffectiveFilters as any}
        table={table}
        onAddFilter={handleAddFilter}
      />

      <RemissionTableBody
        table={table}
        columns={columns}
        loading={loading}
        showNoDataMessage={!hasQueryContext && !loading}
        isError={isError}
      />

      <RemissionTablePagination
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        pagination={pagination}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </div>
  );
}

