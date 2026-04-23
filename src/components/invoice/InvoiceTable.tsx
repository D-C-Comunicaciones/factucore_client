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

import { getColumns } from "@/components/invoice/table/columns";
import { InvoiceTableToolbar } from "@/components/invoice/table/InvoiceTableToolbar";
import { FilterChips, filterValueToColumnId } from "@/components/invoice/table/FilterChips";
import { InvoiceTableBody } from "@/components/invoice/table/InvoiceTableBody";
import { InvoiceTablePagination } from "@/components/invoice/table/InvoiceTablePagination";

import type { InvoiceSummary } from "@/types/invoice";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface InvoiceTableProps {
  invoices: InvoiceSummary[];
  loading?: boolean;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: (filters: ColumnFiltersState) => void;
  search?: string;
  setSearch?: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  pagination: ServerPagination;
}

export function InvoiceTable({
  invoices,
  loading,
  columnFilters,
  setColumnFilters,
  search = "",
  setSearch,
  page,
  setPage,
  perPage,
  setPerPage,
  pagination,
}: InvoiceTableProps) {
  const router = useRouter();
  const columns = React.useMemo(() => getColumns(router), [router]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  // Reset rowSelection when invoices data changes to avoid inconsistencies
  React.useEffect(() => {
    setRowSelection({});
  }, [invoices]);

  const effectiveFilters = columnFilters ?? internalColumnFilters;

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
    data: invoices,
    columns,
    getRowId: (row) => String(row.id), // Use actual invoice ID, not array index
    state: { sorting, columnFilters: effectiveFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setEffectiveFilters as any,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
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
      <InvoiceTableToolbar
        table={table}
        search={search}
        setSearch={setSearch ?? (() => {})}
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

      <InvoiceTableBody table={table} columns={columns} loading={loading} />

      <InvoiceTablePagination
        page={page}
        setPage={setPage}
        perPage={perPage}
        pagination={pagination}
      />
    </div>
  );
}
