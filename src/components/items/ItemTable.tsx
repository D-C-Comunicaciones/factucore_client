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

  onToggleActive: (ids: number | number[], isActive?: boolean, entityType?: "item" | "variant") => void;

  onDelete: (id: number) => void;

  onNewItem?: () => void;

  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  emptyMessage?: string;
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
  columnFilters,
  setColumnFilters,
  emptyMessage,
}: ItemTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [selection, setSelection] =
    React.useState<SelectionState>({});

  const getRowUniqueId = React.useCallback(
    (item: ItemListResponse) => `${item.entity_type || "item"}-${item.id}`,
    []
  );

  const toggleSelection =
    React.useCallback((uniqueId: string) => {
      setSelection((prev) => {
        const next = { ...prev };

        if (next[uniqueId]) {
          delete next[uniqueId];
        } else {
          next[uniqueId] = true;
        }

        return next;
      });
    }, []);

  const toggleSelectAll = React.useCallback(
    (value: boolean) => {
      setSelection((prev) => {
        const next = { ...prev };
        if (value) {
          // Select all visible items
          items.forEach((item) => {
            next[getRowUniqueId(item)] = true;
          });
        } else {
          // Deselect all visible items
          items.forEach((item) => {
            delete next[getRowUniqueId(item)];
          });
        }
        return next;
      });
    },
    [items, getRowUniqueId]
  );

  // Adaptador: columns.tsx llama con un único id; aquí lo envolvemos en array
  // y lo forwarded hacia el onToggleActive de la prop (que acepta ids | ids[])
  const handleToggleActiveRow = React.useCallback(
    (id: number, isActive: boolean, entityType?: "item" | "variant") => {
      onToggleActive([id], isActive, entityType);
    },
    [onToggleActive]
  );

  const allSelected =
    items.length > 0 &&
    items.every((item) => selection[getRowUniqueId(item)] === true);

  const someSelected =
    items.length > 0 &&
    items.some((item) => selection[getRowUniqueId(item)] === true);

  const columns = React.useMemo(
    () =>
      getItemColumns(
        onView,
        onEdit,
        handleToggleActiveRow,
        onDelete,
        toggleSelection,
        toggleSelectAll,
        allSelected,
        someSelected
      ),
    [
      onView,
      onEdit,
      handleToggleActiveRow,
      onDelete,
      toggleSelection,
      toggleSelectAll,
      allSelected,
      someSelected,
    ]
  );

  const table =
    useReactTable<ItemListResponse>({
      data: items,

      columns,

      getRowId: (row) =>
        getRowUniqueId(row),

      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection: selection,
      },

      enableRowSelection: true,

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

  const selectedItemsArr = items.filter((item) => selection[getRowUniqueId(item)]);
  const canDeleteAll = selectedItemsArr.length > 0 && selectedItemsArr.every((item) => item.permissions?.can_delete !== false);
  const canEditAll = selectedItemsArr.length > 0 && selectedItemsArr.every((item) => item.permissions?.can_edit !== false);

  // is_active es el campo principal del API; active como fallback
  const allSelectedActive = selectedItemsArr.length > 0 && selectedItemsArr.every((item) => item.is_active ?? item.active);
  const allSelectedInactive = selectedItemsArr.length > 0 && selectedItemsArr.every((item) => !(item.is_active ?? item.active));

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
              disabled={!canEditAll || allSelectedActive}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                const itemIds = selectedItemsArr.filter((i) => (i.entity_type ?? "item") === "item").map((i) => i.id);
                const variantIds = selectedItemsArr.filter((i) => i.entity_type === "variant").map((i) => i.id);
                if (itemIds.length > 0) onToggleActive(itemIds, true, "item");
                if (variantIds.length > 0) onToggleActive(variantIds, true, "variant");
                setSelection({});
              }}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Activar
            </button>

            <button
              disabled={!canEditAll || allSelectedInactive}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                const itemIds = selectedItemsArr.filter((i) => (i.entity_type ?? "item") === "item").map((i) => i.id);
                const variantIds = selectedItemsArr.filter((i) => i.entity_type === "variant").map((i) => i.id);
                if (itemIds.length > 0) onToggleActive(itemIds, false, "item");
                if (variantIds.length > 0) onToggleActive(variantIds, false, "variant");
                setSelection({});
              }}
            >
              <LightbulbOff className="w-3.5 h-3.5" />
              Desactivar
            </button>

            <button
              disabled={!canDeleteAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                selectedItemsArr.forEach((item) => onDelete(item.id));
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
          emptyMessage={emptyMessage}
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