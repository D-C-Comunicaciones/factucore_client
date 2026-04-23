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
import type { InvoiceSummary } from "@/types/invoice";

interface InvoiceTableBodyProps {
  table: TanTable<InvoiceSummary>;
  columns: ColumnDef<InvoiceSummary>[];
  loading?: boolean;
}

export function InvoiceTableBody({ table, columns, loading }: InvoiceTableBodyProps) {
  const sortableIds = ["number", "created_at", "payment_due_date"];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-gray-50">
              {hg.headers.map((header, idx) => {
                const isActions = header.column.id === "actions";
                const isSortable = sortableIds.includes(header.column.id);

                let thClass = "";
                if (!isActions) {
                  if (idx === 0) thClass = "rounded-l-xl border-l border-gray-200";
                  else if (idx === hg.headers.length - 1) thClass = "rounded-r-xl border-r border-gray-200";
                }
                if (isSortable) {
                  thClass += " group hover:bg-[#e5e7eb] transition-colors duration-100 cursor-pointer";
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
          {loading ? (
            /* Skeleton rows */
            Array.from({ length: 6 }).map((_, idx) => (
              <TableRow key={"skeleton-" + idx}>
                {columns.map((_, colIdx) => (
                  <TableCell key={colIdx}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            /* Filas de datos */
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            /* Empty state */
            <TableRow>
              <TableCell colSpan={columns.length} className="h-64 text-center align-middle">
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
                    La búsqueda no arrojó facturas electrónicas
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
