"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { getResolutionColumns } from "@/components/resolution/table/columns";
import { ResolutionTableToolbar } from "@/components/resolution/table/ResolutionTableToolbar";
import { ResolutionFilterChips } from "@/components/resolution/table/ResolutionFilterChips";
import { ResolutionTableBody } from "@/components/resolution/table/ResolutionTableBody";
import { ResolutionTablePagination } from "@/components/resolution/table/ResolutionTablePagination";
import type { Resolution } from "@/lib/resolutions";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface ResolutionTableProps {
  resolutions: Resolution[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  search?: string;
  setSearch?: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  pagination: ServerPagination;
  onEdit: (id: number) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  emptyMessage?: string;
}

export function ResolutionTable({
  resolutions,
  loading,
  refreshing = false,
  onRefresh,
  search = "",
  setSearch,
  page,
  setPage,
  perPage,
  setPerPage,
  pagination,
  onEdit,
  onToggleActive,
  onDelete,
  columnFilters,
  setColumnFilters,
  emptyMessage,
}: ResolutionTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});


  const columns = React.useMemo(
    () => getResolutionColumns(onEdit, onToggleActive, onDelete),
    [onEdit, onToggleActive, onDelete]
  );

  const table = useReactTable<Resolution>({
    data: resolutions,
    columns,
    getRowId: (row) => String(row.id),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
    manualFiltering: false,
  });

  function handleToggleFilters() {
    if (columnFilters.length > 0) {
      setColumnFilters([]);
    } else {
      setColumnFilters([
        { id: "name", value: "" },
        { id: "is_main", value: "" },
        { id: "is_electronic", value: "" },
        { id: "is_active", value: "" },
      ]);
    }
  }



  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="relative">
        <ResolutionTableToolbar
          table={table}
          search={search}
          setSearch={setSearch ?? (() => {})}
          onToggleFilter={handleToggleFilters}
          isFilterActive={columnFilters.length > 0}
        />

      </div>

      <ResolutionFilterChips
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        table={table}
      />

      <ResolutionTableBody
        table={table}
        columns={columns}
        loading={loading}
        searchTerm={search}
        emptyMessage={emptyMessage}
        isFilterActive={columnFilters.length > 0 || !!search}
      />

      <ResolutionTablePagination
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
