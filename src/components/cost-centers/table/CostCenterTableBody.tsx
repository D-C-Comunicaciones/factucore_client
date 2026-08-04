"use client";

import * as React from "react";
import { Table as TanTable, ColumnDef, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { CostCenter } from "@/components/cost-centers/table/columns";

interface CostCenterTableBodyProps {
  table: TanTable<CostCenter>;
  columns: ColumnDef<CostCenter>[];
  loading?: boolean;
  showNoDataMessage?: boolean;
  isError?: boolean;
  onNew?: () => void;
}

export function CostCenterTableBody({ table, columns, loading, showNoDataMessage = false, isError = false, onNew }: CostCenterTableBodyProps) {
  const sortableIds = ["code", "name", "created_at"];

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
                  if (idx === 0) thClass = "border-l border-gray-200";
                  else if (idx === hg.headers.length - 1) thClass = "border-r border-gray-200";
                }
                if (isSortable) {
                  thClass += " group hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer";
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
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-slate-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
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
                  <div className="text-lg font-semibold text-red-500">Error al cargar centros de costos</div>
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
                    <div className="text-center text-sm text-muted-foreground">
                      ¡Aún no has creado tu primer centro de costos!
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-[#003B73] hover:bg-gray-50 transition-colors shadow-sm"
                        onClick={onNew}
                      >
                        + Nuevo centro de costo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
                    <div className="text-sm text-gray-500 mt-1">
                      La búsqueda no arrojó centros de costos
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
