"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Table as TanTable, ColumnDef, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemListResponse } from "@/types/items";
import {
  SelectAllCheckbox,
  SelectRowCheckbox,
} from "@/components/ui/selection-checkbox";

interface ItemTableBodyProps {
  table: TanTable<ItemListResponse>;
  columns: ColumnDef<ItemListResponse>[];
  loading?: boolean;
  rowSelection?: Record<string, boolean>;
  onToggleSelection?: (uniqueId: string) => void;
  allSelected?: boolean;
  someSelected?: boolean;
  onToggleSelectAll?: (value: boolean) => void;
  searchTerm?: string;
  onNewItem?: () => void;
  emptyMessage?: string;
}

export function ItemTableBody({
  table,
  columns,
  loading,
  rowSelection = {},
  onToggleSelection = () => {},
  allSelected = false,
  someSelected = false,
  onToggleSelectAll = () => {},
  searchTerm = "",
  onNewItem,
  emptyMessage,
}: ItemTableBodyProps) {
  const hasSearch = Boolean(searchTerm.trim());

  const handleRowClick = (event: React.MouseEvent, row: any) => {
    const target = event.target as HTMLElement;
    const interactiveElement = target.closest(
      'button, a, input, select, textarea, [role="checkbox"], [data-no-row-select="true"]'
    );
    if (interactiveElement) return;
    onToggleSelection?.(row.id);
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
                const isPrice = header.column.id === "price";

                return (
                  <TableHead
                    key={header.id}
                    className={`
                      h-9 px-2 text-xs font-medium text-muted-foreground
                      ${isSelect ? "w-10" : ""}
                      ${isActions ? "w-24" : ""}
                      ${isPrice ? "text-right" : ""}
                    `}
                  >
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
                    const isPrice = cell.column.id === "price";

                    return (
                      <TableCell
                        key={`${cell.id}-${row.index}`}
                        className={`
                          h-10 px-2 py-2 text-xs
                          ${isSelect ? "w-10" : ""}
                          ${isActions ? "w-24" : ""}
                          ${isPrice ? "text-right" : "text-foreground"}
                        `}
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
              <TableCell
                colSpan={columns.length}
                className="h-64 bg-card text-center align-middle"
              >
                {loading ? null : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      className="mb-4 text-muted-foreground/40"
                    >
                      <rect x="8" y="10" width="32" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="18" width="20" height="2" rx="1" fill="currentColor" />
                      <rect x="14" y="24" width="12" height="2" rx="1" fill="currentColor" />
                    </svg>
                    <div className="text-lg font-semibold text-foreground">Sin resultados</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {emptyMessage || "La búsqueda no arrojó ítems"}
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
        </div>
      )}
    </div>
  );
}
