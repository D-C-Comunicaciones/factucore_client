"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Table as TanTable, ColumnDef, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PurchaseOrderSummary } from "@/types/purchaseOrder";

interface PurchaseOrderTableBodyProps {
  table: TanTable<PurchaseOrderSummary>;
  columns: ColumnDef<PurchaseOrderSummary>[];
  loading?: boolean;
  showNoDataMessage?: boolean;
  isError?: boolean;
  basePath?: string;
}

export function PurchaseOrderTableBody({ table, columns, loading, showNoDataMessage = false, isError = false, basePath = "/purchase-orders" }: PurchaseOrderTableBodyProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-gray-50/50">
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => {
                  const isClickable = cell.column.id !== "actions";
                  return (
                    <TableCell
                      key={cell.id}
                      className={isClickable ? "cursor-pointer" : ""}
                      onClick={() => {
                        if (isClickable) {
                          router.push(`${basePath}/${row.original.id}`);
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : loading ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-64 bg-white" />
            </TableRow>
          ) : isError ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-64 bg-white text-center align-middle">
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="text-lg font-semibold text-red-500">Error al cargar las órdenes de compra</div>
                  <div className="text-sm text-gray-500 mt-1">Verifica tu conexión a internet e intenta de nuevo</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-64 bg-white text-center align-middle">
                {showNoDataMessage ? (
                  <div className="flex h-full flex-col items-center justify-center py-8">
                    <div className="text-center text-xl font-medium text-[#003B73]">¡Aún no tienes órdenes de compra!</div>
                    <div className="mt-2 mb-6 text-center text-sm text-gray-500 max-w-md">
                      {basePath === "/expenses/purchase-orders"
                        ? "Registra tu primera orden de compra a un proveedor."
                        : "Registra la primera orden de compra que te entregó un cliente."}
                    </div>
                    <button
                      type="button"
                      className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-[#003B73] hover:bg-gray-50 transition-colors shadow-sm"
                      onClick={() => router.push(`${basePath}/new`)}
                    >
                      Crear primera orden de compra
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
                    <div className="text-sm text-gray-500 mt-1">La búsqueda no arrojó órdenes de compra</div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
        </div>
      )}
    </div>
  );
}
