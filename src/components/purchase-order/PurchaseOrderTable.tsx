"use client";

import * as React from "react";
import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { getColumns } from "@/components/purchase-order/table/columns";
import { PurchaseOrderTableBody } from "@/components/purchase-order/table/PurchaseOrderTableBody";
import { PurchaseOrderTablePagination } from "@/components/purchase-order/table/PurchaseOrderTablePagination";
import type { PurchaseOrderSummary } from "@/types/purchaseOrder";

interface ServerPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrderSummary[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  search: string;
  setSearch: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  setPerPage: (n: number) => void;
  pagination: ServerPagination;
  isError?: boolean;
  variant?: "internal" | "external";
}

export function PurchaseOrderTable({
  purchaseOrders,
  loading,
  refreshing = false,
  onRefresh,
  search,
  setSearch,
  page,
  setPage,
  perPage,
  setPerPage,
  pagination,
  isError = false,
  variant = "external",
}: PurchaseOrderTableProps) {
  const columns = getColumns(variant);
  const basePath = variant === "internal" ? "/expenses/purchase-orders" : "/purchase-orders";

  const table = useReactTable({
    data: purchaseOrders,
    columns,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    rowCount: pagination.total,
  });

  const hasQueryContext = Boolean(search.trim());

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-72">
            <DebouncedInput
              placeholder={variant === "internal" ? "Buscar por proveedor o número" : "Buscar por cliente o número de orden"}
              value={search}
              onChange={setSearch}
            />
          </div>
        </div>
      </div>

      <PurchaseOrderTableBody
        table={table}
        columns={columns}
        loading={loading}
        showNoDataMessage={!hasQueryContext && !loading}
        isError={isError}
        basePath={basePath}
      />

      <PurchaseOrderTablePagination
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
