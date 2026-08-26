"use client";

import * as React from "react";
import { ReturnsTableToolbar } from "./ReturnsTableToolbar";
import { ReturnsFilterChips } from "./ReturnsFilterChips";
import { ReturnsTableBody } from "./ReturnsTableBody";
import { ReturnsTablePagination } from "./ReturnsTablePagination";
import { useTableSelection } from "@/hooks/use-table-selection";

interface ReturnsTableProps {
  search: string;
  setSearch: (v: string) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  items?: any[];
}

export function ReturnsTable({
  search,
  setSearch,
  activeFilters,
  setActiveFilters,
  page,
  setPage,
  perPage,
  setPerPage,
  pagination = { current_page: 1, per_page: 10, total: 0, last_page: 1, from: 0, to: 0 },
  loading = false,
  refreshing = false,
  onRefresh,
  items = [],
}: ReturnsTableProps) {
  const getRowUniqueId = React.useCallback(
    (item: any) => String(item.id),
    []
  );

  const {
    selection,
    toggle: toggleSelection,
    toggleAll: toggleSelectAll,
    allSelected,
    someSelected,
  } = useTableSelection(items, getRowUniqueId);

  const addFilter = (value: string) => {
    if (!activeFilters.includes(value)) {
      setActiveFilters([...activeFilters, value]);
    }
  };

  const removeFilter = (value: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== value));
  };

  const removeAllFilters = () => setActiveFilters([]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">

      {/* ── TOOLBAR ── */}
      <ReturnsTableToolbar
        search={search}
        onSearchChange={setSearch}
        activeFilters={activeFilters}
        onAddFilter={addFilter}
      />

      {/* ── FILTER CHIPS ── */}
      <ReturnsFilterChips
        activeFilters={activeFilters}
        onRemoveFilter={removeFilter}
        onAddFilter={addFilter}
        onRemoveAll={removeAllFilters}
      />

      {/* ── BODY / EMPTY STATE ── */}
      <ReturnsTableBody
        loading={loading}
        items={items}
        selection={selection}
        onToggleSelection={toggleSelection}
        allSelected={allSelected}
        someSelected={someSelected}
        onToggleSelectAll={toggleSelectAll}
      />

      {/* ── PAGINATION ── */}
      <ReturnsTablePagination
        page={page}
        lastPage={pagination.last_page}
        perPage={perPage}
        from={pagination.from}
        to={pagination.to}
        total={pagination.total}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />

    </div>
  );
}
