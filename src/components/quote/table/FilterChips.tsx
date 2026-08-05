"use client";

import * as React from "react";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { Funnel, Search, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateFilterPopoverInline } from "@/components/ui/DateFilterPopoverInline";
import { defaultFilterOptions } from "@/components/quote/QuoteFilter";
import type { QuoteSummary } from "@/types/quote";

/* -----------------------------------------------------------------------
   Constantes de etiquetas e Ã­conos por columna
   ----------------------------------------------------------------------- */
const filterLabels: Record<string, string> = {
  contact: "Cliente",
  number: "Número",
  created_at: "Fecha de creación",
  payment_due_date: "Fecha de vencimiento",
  status: "Estado",
  status_dian: "Estado DIAN",
  total: "Total",
  pending_amount: "Por cobrar",
  overdue: "Quotes vencidas",
};

const filterIcons: Record<string, React.ReactNode> = {
  contact: <Search className="w-4 h-4 mr-1 text-gray-400" />,
  number: (
    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
      <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="10" y="14" textAnchor="middle" fontSize="8" fill="currentColor">#</text>
    </svg>
  ),
  created_at: (
    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
      <rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="11" r="2" fill="currentColor" />
    </svg>
  ),
  payment_due_date: (
    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
      <rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="11" r="2" fill="currentColor" />
    </svg>
  ),
  status: (
    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
      <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  status_dian: (
    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  overdue: (
    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* -----------------------------------------------------------------------
   Mapeo de opciÃ³n de filtro â†’ id de columna
   ----------------------------------------------------------------------- */
export const filterValueToColumnId: Record<string, string> = {
  created_at: "created_at",
  payment_due_date: "payment_due_date",
  status_dian: "status_dian",
  overdue: "overdue",
  status: "status",
  number: "number",
};

/* -----------------------------------------------------------------------
   Props
   ----------------------------------------------------------------------- */
interface FilterChipsProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  table: Table<QuoteSummary>;
  onAddFilter: (filterValue: string) => void;
}

/* -----------------------------------------------------------------------
   Componente
   ----------------------------------------------------------------------- */
export function FilterChips({
  columnFilters,
  setColumnFilters,
  table,
  onAddFilter,
}: FilterChipsProps) {
  const [showPlusFilter, setShowPlusFilter] = React.useState(false);

  if (columnFilters.length === 0) return null;

  function removeFilter(id: string) {
    setColumnFilters(columnFilters.filter((f) => f.id !== id));
  }

  function removeAllFilters() {
    setColumnFilters([]);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-b border-gray-200 bg-white relative">
      {columnFilters.map((filter) => {
        const isDate = filter.id === "created_at" || filter.id === "payment_due_date";

        return (
          <DropdownMenu key={filter.id}>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center px-3 py-1 rounded-full border ${isDate ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-background text-foreground"
                  } text-xs font-medium shadow-sm 
                    hover:bg-primary/10 hover:text-primary hover:border-primary/40
                    focus:bg-primary/10 focus:text-primary
                    transition-colors`}
              >
                {filterIcons[filter.id] ?? <Funnel className="w-4 h-4 mr-1 text-gray-400" />}
                <span className="mr-1">{filterLabels[filter.id] ?? filter.id}</span>
                <span className="font-normal text-gray-500">
                  {isDate && typeof filter.value === "string" && filter.value
                    ? (() => {
                      const d = new Date(filter.value);
                      return !isNaN(d.getTime()) ? d.toLocaleDateString() : "";
                    })()
                    : typeof filter.value === "string" && filter.value
                      ? filter.value
                      : ""}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" sideOffset={4} className="min-w-[220px]">
              {/* Encabezado del dropdown con botÃ³n eliminar */}
              <div className="flex items-center justify-between px-3 pt-2 pb-1 text-xs font-semibold text-gray-600">
                {filterLabels[filter.id] ?? filter.id}
                <button
                  className="ml-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition p-0 w-6 h-6 border border-gray-300"
                  style={{ borderRadius: 6 }}
                  onClick={() => removeFilter(filter.id)}
                  title="Quitar filtro"
                >
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Filtro de fecha */}
              {isDate && (
                <DateFilterPopoverInline
                  filter={filter}
                  setFilterValue={(val) => setColumnFilters(columnFilters.map(f => f.id === filter.id ? { ...f, value: val } : f))}
                />
              )}

              {/* Filtro de estado */}
              {filter.id === "status" && (
                <div className="flex flex-col gap-1 px-3 py-2">
                  {["Por cobrar", "Cobrada", "Anulada", "Borrador", "Enviada", "Guardada"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-xs cursor-pointer">
                      <Checkbox
                        checked={
                          Array.isArray(filter.value)
                            ? filter.value.includes(opt)
                            : filter.value === opt
                        }
                        onCheckedChange={(checked) => {
                          let newValue: string[] = Array.isArray(filter.value)
                            ? [...filter.value]
                            : filter.value
                              ? [filter.value as string]
                              : [];
                          if (checked) {
                            if (!newValue.includes(opt)) newValue.push(opt);
                          } else {
                            newValue = newValue.filter((v) => v !== opt);
                          }
                          setColumnFilters(columnFilters.map(f => f.id === filter.id ? { ...f, value: newValue } : f));
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* Filtro de estado DIAN */}
              {filter.id === "status_dian" && (
                <div className="flex flex-col gap-1 px-3 py-2">
                  {["Aprobada", "No aprobada", "En proceso"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-xs cursor-pointer">
                      <Checkbox
                        checked={
                          Array.isArray(filter.value)
                            ? filter.value.includes(opt)
                            : filter.value === opt
                        }
                        onCheckedChange={(checked) => {
                          let newValue: string[] = Array.isArray(filter.value)
                            ? [...filter.value]
                            : filter.value
                              ? [filter.value as string]
                              : [];
                          if (checked) {
                            if (!newValue.includes(opt)) newValue.push(opt);
                          } else {
                            newValue = newValue.filter((v) => v !== opt);
                          }
                          setColumnFilters(columnFilters.map(f => f.id === filter.id ? { ...f, value: newValue } : f));
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* Filtro de nÃºmero de quote */}
              {filter.id === "number" && (
                <div className="px-3 py-2">
                  <input
                    className="w-full border rounded px-2 py-1 text-xs"
                    placeholder="Número de quote"
                    value={filter.value as string}
                    onChange={(e) => setColumnFilters(columnFilters.map(f => f.id === filter.id ? { ...f, value: e.target.value } : f))}
                  />
                </div>
              )}

              {/* Quotes vencidas */}
              {filter.id === "overdue" && (
                <div className="px-3 py-2 text-xs">Quotes vencidas</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      {/* BotÃ³n + para agregar mÃ¡s filtros */}
      {columnFilters.length < defaultFilterOptions.length && (
        <DropdownMenu open={showPlusFilter} onOpenChange={setShowPlusFilter}>
          <DropdownMenuTrigger asChild>
            <button
              className="
inline-flex items-center justify-center
w-7 h-7 rounded-full
border border-border
bg-background
text-muted-foreground

hover:bg-primary/10
hover:text-primary
hover:border-primary/40

focus:bg-primary/10
focus:text-primary

transition-colors
ml-1
"              title="Agregar filtro"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="none" />
                <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4} className="min-w-[180px]">
            <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">Filtrar Por</div>
            {defaultFilterOptions.map((opt) => {
              const columnId = filterValueToColumnId[opt.value];
              if (columnFilters.some((f) => f.id === columnId)) return null;
              const Icon = opt.icon;
              return (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => {
                    onAddFilter(opt.value);
                    setShowPlusFilter(false);
                  }}
                  className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {opt.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Remover todos los filtros */}
      <button
        className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none hover:bg-gray-100 cursor-pointer transition-colors"
        style={{ textDecoration: "none" }}
        onClick={removeAllFilters}
      >
        Remover filtros
      </button>
    </div>
  );
}

