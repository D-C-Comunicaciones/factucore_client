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
import { Printer, X, FileText } from "lucide-react";
import { getPaymentColumns } from "@/components/payments/table/columns";
import { PaymentTableToolbar } from "@/components/payments/table/PaymentTableToolbar";
import { PaymentFilterChips } from "@/components/payments/table/PaymentFilterChips";
import { PaymentTableBody } from "@/components/payments/table/PaymentTableBody";
import { PaymentTablePagination } from "@/components/payments/table/PaymentTablePagination";
import type { Payment, PaymentListResponse } from "@/types/payments";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface PaymentTableProps {
  payments: Payment[];
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
  onDelete: (id: number) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

type SelectionState = Record<string, boolean>;

export function PaymentTable({
  payments,
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
  onDelete,
  columnFilters,
  setColumnFilters,
}: PaymentTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [selection, setSelection] = React.useState<SelectionState>({});

  const getRowUniqueId = React.useCallback(
    (payment: Payment) => payment.id.toString(),
    []
  );

  const toggleSelection = React.useCallback((uniqueId: string) => {
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
          payments.forEach((payment) => {
            next[getRowUniqueId(payment)] = true;
          });
        } else {
          payments.forEach((payment) => {
            delete next[getRowUniqueId(payment)];
          });
        }
        return next;
      });
    },
    [payments, getRowUniqueId]
  );

  const allSelected =
    payments.length > 0 &&
    payments.every((payment) => selection[getRowUniqueId(payment)] === true);

  const someSelected =
    payments.length > 0 &&
    payments.some((payment) => selection[getRowUniqueId(payment)] === true);

  const columns = React.useMemo(
    () =>
      getPaymentColumns(
        onView,
        onEdit,
        onDelete,
        toggleSelection,
        toggleSelectAll,
        allSelected,
        someSelected
      ),
    [
      onView,
      onEdit,
      onDelete,
      toggleSelection,
      toggleSelectAll,
      allSelected,
      someSelected,
    ]
  );

  const table = useReactTable<Payment>({
    data: payments,
    columns,
    getRowId: (row) => getRowUniqueId(row),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    rowCount: pagination.total,
  });

  function handleAddFilter(filterValue: string) {
    setColumnFilters((prev) => {
      if (prev.some((f) => f.id === filterValue)) {
        return prev;
      }
      return [...prev, { id: filterValue, value: "" }];
    });
  }

  const selectedCount = Object.keys(selection).length;
  const selectedItemsArr = payments.filter((payment) => selection[getRowUniqueId(payment)]);

  return (
    <div className="space-y-4">
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${selectedCount > 0
          ? "max-h-32 opacity-100 translate-y-0 mb-0"
          : "max-h-0 opacity-0 -translate-y-4 mb-0 pointer-events-none"
          }`}
      >
        <div className="bg-primary rounded-t-xl px-4 py-4 flex items-center justify-between text-white shadow-sm -mb-[1px] relative z-10">
          <div className="flex items-center gap-3 font-semibold text-[15px]">
            {selectedCount} Pagos seleccionados
          </div>

          <div className="flex items-center gap-6">
            <button
              className="flex items-center gap-2 text-[14px] font-medium hover:text-white/80 transition-colors"
              onClick={() => {
                // Action to print
              }}
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              className="flex items-center gap-2 text-[14px] font-medium hover:text-white/80 transition-colors"
              onClick={() => {
                // Action to download PDF
              }}
            >
              <FileText className="w-4 h-4" />
              Descargar PDF
            </button>
            <button
              className="text-[14px] font-medium hover:text-white/80 transition-colors"
              onClick={() => setSelection({})}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div className={`bg-white border border-gray-200 overflow-hidden shadow-sm ${selectedCount > 0 ? "rounded-b-xl rounded-t-none" : "rounded-xl"}`}>
        <PaymentTableToolbar
          table={table}
          search={search}
          setSearch={setSearch ?? (() => {})}
          onAddFilter={handleAddFilter}
        />

        <PaymentFilterChips
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          table={table}
          onAddFilter={handleAddFilter}
        />

        <PaymentTableBody
          table={table}
          columns={columns}
          loading={loading}
          rowSelection={selection}
          onToggleSelection={toggleSelection}
          searchTerm={search}
        />

        <PaymentTablePagination
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
