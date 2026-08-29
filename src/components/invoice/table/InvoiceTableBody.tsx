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
import type { InvoiceSummary } from "@/types/invoice";
import {
  SelectAllCheckbox,
  SelectRowCheckbox,
} from "@/components/ui/selection-checkbox";
import { InvoiceMobileCard } from "@/components/invoice/table/InvoiceMobileCard";

interface InvoiceTableBodyProps {
  table: TanTable<InvoiceSummary>;
  columns: ColumnDef<InvoiceSummary>[];
  loading?: boolean;
  showNoDataMessage?: boolean;
  isError?: boolean;
  rowSelection?: Record<string, boolean>;
  onToggleSelection?: (id: string) => void;
  allSelected?: boolean;
  someSelected?: boolean;
  onToggleSelectAll?: (value: boolean) => void;
}

export function InvoiceTableBody({
  table,
  columns,
  loading,
  showNoDataMessage = false,
  isError = false,
  rowSelection = {},
  onToggleSelection = () => {},
  allSelected = false,
  someSelected = false,
  onToggleSelectAll = () => {},
}: InvoiceTableBodyProps) {
  const router = useRouter();
  const sortableIds = ["number", "created_at", "payment_due_date"];
  const rows = table.getRowModel().rows;
  const hasRows = rows.length > 0;

  // Estados compartidos (carga / error / vacío) entre la tabla (sm+) y las
  // tarjetas de móvil, para no duplicar el markup en las dos vistas.
  const stateContent = loading ? (
    <div className="h-64 bg-white" />
  ) : isError ? (
    <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
      <div className="text-lg font-semibold text-red-500">Error al cargar facturas</div>
      <div className="text-sm text-gray-500 mt-1">
        Verifica tu conexión a internet e intenta de nuevo
      </div>
    </div>
  ) : (
    <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
      {showNoDataMessage ? (
        <>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 text-gray-400">
            <rect x="14" y="10" width="20" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="19" y="18" width="10" height="2" rx="1" fill="currentColor" />
            <rect x="19" y="24" width="6" height="2" rx="1" fill="currentColor" />
            <rect x="19" y="30" width="10" height="2" rx="1" fill="currentColor" />
          </svg>
          <div className="text-center text-xl font-medium text-[#003B73]">
            ¡Aún no tienes facturas!
          </div>
          <div className="mt-2 mb-6 text-center text-sm text-gray-500 max-w-md">
            Crea tu primera factura y empieza a tomar el control de tus ingresos.
          </div>
          <button
            type="button"
            className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-[#003B73] hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => router.push("/sales/invoices/new")}
          >
            Crear primera factura
          </button>
        </>
      ) : (
        <>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 text-gray-300">
            <rect x="8" y="10" width="32" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="18" width="20" height="2" rx="1" fill="currentColor" />
            <rect x="14" y="24" width="12" height="2" rx="1" fill="currentColor" />
          </svg>
          <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
          <div className="text-sm text-gray-500 mt-1">
            La búsqueda no arrojó facturas electrónicas
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Tarjetas — pantallas angostas (below sm) */}
      <div className="sm:hidden">
        {hasRows
          ? rows.map((row) => (
              <InvoiceMobileCard
                key={row.id}
                invoice={row.original}
                selected={Boolean(rowSelection[row.id])}
                onToggleSelection={() => onToggleSelection(row.id)}
              />
            ))
          : stateContent}
      </div>

      {/* Tabla — sm y superior */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-gray-50/50">
                {hg.headers.map((header, idx) => {
                  const isSelect = header.column.id === "select";
                  const isActions = header.column.id === "actions";
                  const isSortable = sortableIds.includes(header.column.id);

                  let thClass = "";
                  if (!isActions) {
                    if (idx === 0) thClass = "border-l border-gray-200";
                    else if (idx === hg.headers.length - 1) thClass = "border-r border-gray-200";
                  }
                  if (isSortable) {
                    thClass += "group hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer";
                  }

                  return (
                    <TableHead key={header.id} className={thClass}>
                      {isSelect ? (
                        <SelectAllCheckbox
                          allSelected={allSelected}
                          someSelected={someSelected}
                          onToggle={onToggleSelectAll}
                        />
                      ) : header.isPlaceholder ? null : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {hasRows ? (
              rows.map((row) => {
                const isSelected = Boolean(rowSelection[row.id]);

                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? "selected" : undefined}
                    className={`${isSelected ? "bg-primary/5" : ""} hover:bg-slate-50`}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isSelect = cell.column.id === "select";
                      const isClickable = cell.column.id !== "actions" && !isSelect;
                      return (
                        <TableCell
                          key={cell.id}
                          className={isClickable ? "cursor-pointer" : ""}
                          onClick={() => {
                            if (isClickable) {
                              router.push(`/sales/invoices/${row.original.id}`);
                            }
                          }}
                        >
                          {isSelect ? (
                            <SelectRowCheckbox
                              checked={isSelected}
                              onToggle={() => onToggleSelection(row.id)}
                            />
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="bg-white text-center align-middle p-0">
                  {stateContent}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
        </div>
      )}
    </div>
  );
}
