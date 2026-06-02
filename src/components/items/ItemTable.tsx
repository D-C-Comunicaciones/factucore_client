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

import {
  Trash2,
  X,
  Lightbulb,
  LightbulbOff,
} from "lucide-react";

import { getItemColumns } from "@/components/items/table/columns";

import { ItemTableToolbar } from "@/components/items/table/ItemTableToolbar";

import { ItemFilterChips } from "@/components/items/table/ItemFilterChips";

import { ItemTableBody } from "@/components/items/table/ItemTableBody";

import { ItemTablePagination } from "@/components/items/table/ItemTablePagination";

import type {
  ItemListResponse,
} from "@/types/items";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface ItemTableProps {
  items: ItemListResponse[];

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

  onView: (id: number) => void;

  onEdit: (id: number) => void;

  onToggleActive: (id: number) => void;

  onDelete: (id: number) => void;

  onNewItem?: () => void;
}

type SelectionState =
  Record<string, boolean>;

export function ItemTable({
  items,
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
  onView,
  onEdit,
  onToggleActive,
  onDelete,
  onNewItem,
}: ItemTableProps) {
  const [sorting, setSorting] =
    React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [selection, setSelection] =
    React.useState<SelectionState>({});

  const toggleSelection =
    React.useCallback((id: number) => {
      setSelection((prev) => {
        const key = String(id);

        const next = { ...prev };

        if (next[key]) {
          delete next[key];
        } else {
          next[key] = true;
        }

        return next;
      });
    }, []);

  const toggleSelectAll =
    React.useCallback(() => {
      setSelection((prev) => {
        const visibleIds = new Set(
          items.map((i) => String(i.id))
        );

        const areAllSelected =
          items.length > 0 &&
          items.every(
            (i) => prev[String(i.id)]
          );

        if (areAllSelected) {
          const next: SelectionState = {};

          Object.keys(prev).forEach((key) => {
            if (!visibleIds.has(key)) {
              next[key] = true;
            }
          });

          return next;
        }

        const next: SelectionState = {
          ...prev,
        };

        items.forEach((i) => {
          next[String(i.id)] = true;
        });

        return next;
      });
    }, [items]);

  const allSelected =
    items.length > 0 &&
    items.every(
      (item) =>
        selection[String(item.id)] === true
    );

  const someSelected =
    items.length > 0 &&
    items.some(
      (item) =>
        selection[String(item.id)] === true
    );

  const columns = React.useMemo(
    () =>
      getItemColumns(
        onView,
        onEdit,
        onToggleActive,
        onDelete,
        toggleSelection,
        toggleSelectAll,
        allSelected,
        someSelected,
        selection
      ),
    [
      onView,
      onEdit,
      onToggleActive,
      onDelete,
      toggleSelection,
      toggleSelectAll,
      allSelected,
      someSelected,
      selection,
    ]
  );

  const table =
    useReactTable<ItemListResponse>({
      data: items,

      columns,

      getRowId: (row) =>
        String(row.id),

      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection: selection,
      },

      onRowSelectionChange:
        setSelection,

      onSortingChange: setSorting,

      onColumnFiltersChange:
        setColumnFilters,

      onColumnVisibilityChange:
        setColumnVisibility,

      getCoreRowModel:
        getCoreRowModel(),

      getSortedRowModel:
        getSortedRowModel(),

      manualPagination: true,

      manualFiltering: true,

      rowCount: pagination.total,
    });

  function handleAddFilter(
    filterValue: string
  ) {
    setColumnFilters((prev) => {
      if (
        prev.some(
          (f) => f.id === filterValue
        )
      ) {
        return prev;
      }

      return [
        ...prev,
        {
          id: filterValue,
          value: "",
        },
      ];
    });
  }

  const selectedCount =
    Object.keys(selection).length;

  return (
    <div className="space-y-4">
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedCount > 0
            ? "max-h-32 opacity-100 translate-y-0 mb-4"
            : "max-h-0 opacity-0 -translate-y-4 mb-0 pointer-events-none"
          }`}
      >
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center shadow-sm">
          <div className="flex items-center gap-3 h-full">
            <span className="text-[13px] font-medium text-[#64748b]">
              {selectedCount} seleccionados
            </span>

            <div className="w-[1px] h-4 bg-gray-200" />
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg transition-colors"
              onClick={() =>
                console.log(
                  "Activar seleccionados"
                )
              }
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Activar
            </button>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg transition-colors shadow-sm"
              onClick={() =>
                console.log(
                  "Desactivar seleccionados"
                )
              }
            >
              <LightbulbOff className="w-3.5 h-3.5" />
              Desactivar
            </button>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg transition-colors shadow-sm"
              onClick={() => {
                Object.keys(selection).forEach(
                  (id) =>
                    onDelete(Number(id))
                );

                setSelection({});
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </button>
          </div>

          <button
            className="ml-auto p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() =>
              setSelection({})
            }
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <ItemTableToolbar
          table={table}
          search={search}
          setSearch={
            setSearch ?? (() => { })
          }
          onAddFilter={handleAddFilter}
        />

        <ItemFilterChips
          columnFilters={columnFilters}
          setColumnFilters={
            setColumnFilters
          }
          table={table}
          onAddFilter={handleAddFilter}
        />

        <ItemTableBody
          table={table}
          columns={columns}
          loading={loading}
          rowSelection={selection}
          onToggleSelection={
            toggleSelection
          }
          searchTerm={search}
          onNewItem={onNewItem}
        />

        <ItemTablePagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          pagination={pagination}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </div>
    </div>
  );
}