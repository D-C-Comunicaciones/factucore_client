"use client";

import * as React from "react";
import { Table as TanTable, ColumnDef, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Payment } from "@/types/payments";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

interface PaymentTableBodyProps {
  table: TanTable<Payment>;
  columns: ColumnDef<Payment>[];
  loading?: boolean;
  rowSelection?: Record<string, boolean>;
  onToggleSelection?: (uniqueId: string) => void;
  searchTerm?: string;
}

export function PaymentTableBody({
  table,
  columns,
  loading,
  rowSelection = {},
  onToggleSelection,
  searchTerm = "",
}: PaymentTableBodyProps) {
  const router = useRouter();
  const hasSearchOrFilters = Boolean(searchTerm.trim()) || table.getState().columnFilters.length > 0;

  const handleRowClick = (event: React.MouseEvent, row: any) => {
    const target = event.target as HTMLElement;
    const interactiveElement = target.closest(
      'button, a, input, select, textarea, [role="checkbox"], [data-no-row-select="true"]'
    );
    if (interactiveElement) return;
    router.push(`/payments/${row.original.id}`);
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-slate-50/50 border-b border-border">
              {hg.headers.map((header) => {
                const isSelect = header.column.id === "select";
                const isActions = header.column.id === "actions";
                const isAmount = header.column.id === "amount";

                return (
                  <TableHead
                    key={header.id}
                    className={`
                      h-9 px-2 text-xs font-medium text-muted-foreground
                      ${isSelect ? "w-10" : ""}
                      ${isActions ? "w-12 px-0" : ""}
                      ${isAmount ? "text-right after:content-none" : ""}
                    `}
                  >
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
            table.getRowModel().rows.map((row) => {
              const isSelected = Boolean(rowSelection[row.id]);

              return (
                <TableRow
                  key={`${row.id}-${row.index}`}
                  data-state={isSelected ? "selected" : undefined}
                  onClick={(event) => handleRowClick(event, row)}
                  className={`
                    border-b border-border
                    ${isSelected
                      ? "bg-primary/10 hover:bg-primary/15"
                      : "hover:bg-muted/50 cursor-pointer"
                    }
                  `}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isSelect = cell.column.id === "select";
                    const isActions = cell.column.id === "actions";
                    const isAmount = cell.column.id === "amount";

                    return (
                      <TableCell
                        key={`${cell.id}-${row.index}`}
                        className={`
                          h-10 px-2 py-2 text-xs
                          ${isSelect ? "w-10" : ""}
                          ${isActions ? "w-12 px-0" : ""}
                          ${isAmount ? "text-right" : "text-foreground"}
                        `}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-64 bg-white text-center align-middle"
              >
                {loading ? null : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      className="mb-4 text-slate-400"
                    >
                      <rect x="14" y="8" width="20" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M19 16h5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M19 22h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M19 28h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>

                    <div className="text-xl font-medium text-[#003B73]">Sin resultados</div>
                    <div className="text-[15px] text-slate-500 mt-1">
                      La búsqueda no arrojó pagos
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
