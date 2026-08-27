"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import {
  SelectAllCheckbox,
  SelectRowCheckbox,
} from "@/components/ui/selection-checkbox";
import { ContactMobileCard } from "@/components/contact/table/ContactMobileCard";

interface ContactTableBodyProps {
  table: TanTable<any>;
  columns: ColumnDef<any>[];
  loading?: boolean;
  rowSelection?: Record<string, boolean>;
  onToggleSelection?: (id: number) => void;
  allSelected?: boolean;
  someSelected?: boolean;
  onToggleSelectAll?: (value: boolean) => void;
  activeTab?: "all" | "customer" | "provider";
  searchTerm?: string;
  onAddContact?: () => void;
  onDelete?: (id: number) => void;
  onToggleActive?: (id: number, currentlyActive: boolean) => void;
}

export function ContactTableBody({
  table,
  columns,
  loading,
  rowSelection = {},
  onToggleSelection = () => {},
  allSelected = false,
  someSelected = false,
  onToggleSelectAll = () => {},
  activeTab = "all",
  searchTerm = "",
  onAddContact,
  onDelete = () => {},
  onToggleActive = () => {},
}: ContactTableBodyProps) {
  const router = useRouter();
  const hasSearch = Boolean(searchTerm.trim());
  const showEmptyByTab = !hasSearch;
  const rows = table.getRowModel().rows;
  const hasRows = rows.length > 0;

  const emptyMessageByTab: Record<"all" | "customer" | "provider", string> = {
    all: "¡Aún no tienes contactos!",
    customer: "¡Aún no tienes clientes!",
    provider: "¡Aún no tienes proveedores!",
  };

  const handleRowClick = (event: React.MouseEvent, row: any) => {
    const target = event.target as HTMLElement;
    const interactiveElement = target.closest(
      'button, a, input, select, textarea, [role="checkbox"], [data-no-row-select="true"]',
    );

    if (interactiveElement) return;
    router.push(`/contacts/${row.original.id}`);
  };

  const stateContent = (
    <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
      {showEmptyByTab ? (
        <>
          <div className="max-w-[520px] text-center text-2xl sm:text-[40px] font-semibold leading-tight text-primary">
            {emptyMessageByTab[activeTab]}
          </div>
          <button
            type="button"
            onClick={onAddContact}
            className="mt-6 cursor-pointer inline-flex h-9 items-center gap-1 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            {activeTab === 'customer' ? 'Nuevo cliente' : activeTab === 'provider' ? 'Nuevo proveedor' : 'Nuevo contacto'}
          </button>
        </>
      ) : (
        <>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 text-muted-foreground/40">
            <rect x="8" y="10" width="32" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="18" width="20" height="2" rx="1" fill="currentColor" />
            <rect x="14" y="24" width="12" height="2" rx="1" fill="currentColor" />
          </svg>
          <div className="text-lg font-semibold text-foreground">
            Sin resultados
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            La búsqueda no arrojó contactos
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
              <ContactMobileCard
                key={row.id}
                contact={row.original}
                selected={Boolean(rowSelection[String(row.original.id)])}
                onToggleSelection={() => onToggleSelection(row.original.id)}
                activeTab={activeTab}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))
          : stateContent}
      </div>

      {/* Tabla — sm y superior */}
      <div className="hidden sm:block overflow-x-auto relative">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow
              key={hg.id}
              className="bg-slate-50/50 border-b border-border"
            >
              {hg.headers.map((header) => {
                const isSelect = header.column.id === "select";
                const isActions = header.column.id === "actions";

                return (
                  <TableHead
                    key={header.id}
                    className={`
                      h-9 px-2 text-xs font-medium text-muted-foreground
                      ${isSelect ? "w-10" : ""}
                      ${isActions ? "w-20 text-right" : ""}
                    `}
                  >
                    {isSelect ? (
                      <SelectAllCheckbox
                        allSelected={allSelected}
                        someSelected={someSelected}
                        onToggle={onToggleSelectAll}
                      />
                    ) : header.isPlaceholder ? null : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
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
              const isSelected = Boolean(
                rowSelection[String(row.original.id)],
              );

              return (
                <TableRow
                  key={row.id}
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
                    const isType = cell.column.id === "type";

                    return (
                      <TableCell
                        key={cell.id}
                        className={`
                          h-10 px-2 py-2 text-xs
                          ${isSelect ? "w-10" : ""}
                          ${isActions ? "w-20 text-right" : ""}
                          ${isType ? "" : "text-foreground"}
                        `}
                      >
                        {isSelect ? (
                          <SelectRowCheckbox
                            checked={isSelected}
                            onToggle={() => onToggleSelection(row.original.id)}
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
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
                className="bg-card text-center align-middle p-0"
              >
                {stateContent}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
        </div>
      )}
    </div>
  );
}