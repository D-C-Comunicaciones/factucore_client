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
import type { RemissionSummary } from "@/types/remission";
import { RemissionMobileCard } from "@/components/remission/table/RemissionMobileCard";

interface RemissionTableBodyProps {
  table: TanTable<RemissionSummary>;
  columns: ColumnDef<RemissionSummary>[];
  loading?: boolean;
  showNoDataMessage?: boolean;
  isError?: boolean;
}

export function RemissionTableBody({ table, columns, loading, showNoDataMessage = false, isError = false }: RemissionTableBodyProps) {
  const router = useRouter();
  const sortableIds = ["number", "created_at", "payment_due_date"];
  const rows = table.getRowModel().rows;
  const hasRows = rows.length > 0;

  const stateContent = loading ? (
    <div className="h-64 bg-white" />
  ) : isError ? (
    <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
      <div className="text-lg font-semibold text-red-500">Error al cargar remisiones</div>
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
            ¡Aún no tienes remisiones!
          </div>
          <div className="mt-2 mb-6 text-center text-sm text-gray-500 max-w-md">
            Crea tu primera remisión y empieza a tomar el control de tus envíos.
          </div>
          <button
            type="button"
            className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-[#003B73] hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => router.push("/remissions/new")}
          >
            Crear primera remisión
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
            La búsqueda no arrojó remisiones
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Tarjetas — pantallas angostas (below sm) */}
      <div className="sm:hidden">
        {hasRows ? rows.map((row) => <RemissionMobileCard key={row.id} remission={row.original} />) : stateContent}
      </div>

      {/* Tabla — sm y superior */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-gray-50/50">
                {hg.headers.map((header, idx) => {
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
            {hasRows ? (
              rows.map((row) => (
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
                            router.push(`/remissions/${row.original.id}`);
                          }
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
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
