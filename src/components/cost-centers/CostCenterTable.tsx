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

import { getColumns, CostCenter } from "@/components/cost-centers/table/columns";
import { CostCenterTableToolbar } from "@/components/cost-centers/table/CostCenterTableToolbar";
import { FilterChips, filterValueToColumnId } from "@/components/cost-centers/table/FilterChips";
import { CostCenterTableBody } from "@/components/cost-centers/table/CostCenterTableBody";
import { CostCenterTablePagination } from "@/components/cost-centers/table/CostCenterTablePagination";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface CostCenterTableProps {
  costCenters: CostCenter[];
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
  onEdit: (cc: CostCenter) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onNew?: () => void;
}

export function CostCenterTable({
  costCenters,
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
  onEdit,
  onDelete,
  onToggleStatus,
  onNew,
}: CostCenterTableProps) {
  const columns = getColumns({ onEdit, onDelete, onToggleStatus });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const effectiveFilters = columnFilters ?? internalColumnFilters;
  const hasActiveFilters = React.useMemo(
    () =>
      effectiveFilters.some((f) => {
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
    data: costCenters,
    columns,
    getRowId: (row) => String(row.id),
    state: { sorting, columnFilters: effectiveFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setEffectiveFilters as any,
    onColumnVisibilityChange: setColumnVisibility,
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
      <CostCenterTableToolbar
        table={table}
        search={search}
        setSearch={setSearch ?? (() => { })}
        onAddFilter={handleAddFilter}
      />

      <FilterChips
        columnFilters={effectiveFilters}
        setColumnFilters={setEffectiveFilters as any}
        onAddFilter={handleAddFilter}
      />

      <CostCenterTableBody
        table={table}
        columns={columns}
        loading={loading}
        showNoDataMessage={!hasQueryContext && !loading}
        isError={isError}
        onNew={onNew}
      />

      <CostCenterTablePagination
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
