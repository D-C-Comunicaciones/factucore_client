"use client";

import * as React from "react";
import { Plus } from "lucide-react";
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
import type { QuoteSummary } from "@/types/quote";

interface QuoteTableBodyProps {
  table: TanTable<QuoteSummary>;
  columns: ColumnDef<QuoteSummary>[];
  loading?: boolean;
  showNoDataMessage?: boolean;
  isError?: boolean;
}

export function QuoteTableBody({ table, columns, loading, showNoDataMessage = false, isError = false }: QuoteTableBodyProps) {
  const router = useRouter();
  const sortableIds = ["number", "created_at", "payment_due_date"];

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-gray-50/50">
              {hg.headers.map((header, idx) => {
                const isActions = header.column.id === "actions";
                const isSortable = sortableIds.includes(header.column.id);

                let thClass = "";
                if (!isActions) {
                  let thClass = "";
                  if (!isActions) {
                    if (idx === 0) thClass = "border-l border-gray-200";
                    else if (idx === hg.headers.length - 1) thClass = "border-r border-gray-200";
                  }
                }
                if (isSortable) {
                  thClass += "group hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer";
                }

                return (
                  <TableHead key={header.id} className={thClass}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            /* Filas de datos */
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className={`${row.getIsSelected() ? "bg-primary/5" : ""} hover:bg-slate-50`}
              >
                {row.getVisibleCells().map((cell) => {
                  const isClickable = cell.column.id !== "actions" && cell.column.id !== "select";
                  return (
                    <TableCell
                      key={cell.id}
                      className={isClickable ? "cursor-pointer" : ""}
                      onClick={() => {
                        if (isClickable) {
                          router.push(`/quotes/${row.original.id}`);
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
                  <div className="text-lg font-semibold text-red-500">Error al cargar cotizaciones</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Verifica tu conexión a internet e intenta de nuevo
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            /* Empty state */
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-64 bg-white text-center align-middle">
                {showNoDataMessage ? (
                  <div className="flex h-full flex-col items-center justify-center py-8">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      className="mb-4 text-gray-400"
                    >
                      <rect
                        x="14"
                        y="10"
                        width="20"
                        height="28"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="19"
                        y="18"
                        width="10"
                        height="2"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="19"
                        y="24"
                        width="6"
                        height="2"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="19"
                        y="30"
                        width="10"
                        height="2"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="text-center text-xl font-medium text-[#003B73]">
                      Aún no tienes cotizaciones!
                    </div>
                    <div className="mt-2 mb-6 text-center text-sm text-gray-500 max-w-md">
                      Crea tu primera cotización y empieza a tomar el control de tus ingresos.
                    </div>
                    <button
                      type="button"
                      className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-[#003B73] hover:bg-gray-50 transition-colors shadow-sm"
                      onClick={() => router.push("/quotes/new")}
                    >
                      Crear primera cotización
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      className="mb-4 text-gray-300"
                    >
                      <rect x="8" y="10" width="32" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="18" width="20" height="2" rx="1" fill="currentColor" />
                      <rect x="14" y="24" width="12" height="2" rx="1" fill="currentColor" />
                    </svg>
                    <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
                    <div className="text-sm text-gray-500 mt-1">
                      La bÃºsqueda no arrojÃ³ quotes electrÃ³nicas
                    </div>
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

