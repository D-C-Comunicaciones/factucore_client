"use client";

import * as React from "react";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { Funnel, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const filterLabels: Record<string, string> = {
  status: "Estado",
  phone: "Teléfono",
};

const LightBulbOn = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.5 2 5.5 4.5 5.5 8c0 2.5 1.5 4.5 3 5.5v2.5c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-2.5c1.5-1 3-3 3-5.5 0-3.5-3-6-6-6zm-1 16h2v2h-2v-2z"/>
  </svg>
);

const LightBulbOff = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.5 2 5.5 4.5 5.5 8c0 2.5 1.5 4.5 3 5.5v2.5c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-2.5M3 3l18 18M9 16h6"/>
  </svg>
);

export const contactFilterOptions = [
  { value: 'status', label: 'Estado', icon: Funnel },
  { value: 'phone', label: 'Teléfono', icon: Funnel },
];

interface FilterChipsProps {
  columnFilters: any[];
  setColumnFilters: React.Dispatch<React.SetStateAction<any[]>>;
  table: Table<any>;
  onAddFilter: () => void;
}

export function ContactFilterChips({
  columnFilters,
  setColumnFilters,
  table,
  onAddFilter,
}: FilterChipsProps) {
  const [showPlusFilter, setShowPlusFilter] = React.useState(false);

  if (columnFilters.length === 0) return null;

  const removeFilter = (id: string) => {
    if (table.getColumn(id)) {
      const col = table.getColumn(id);
      if (col) {
        col.setFilterValue(undefined);
      }
    }
    setColumnFilters(columnFilters.filter((f) => f.id !== id));
  }

  function removeAllFilters() {
    columnFilters.forEach((f) => {
      if (table.getColumn(f.id)) {
        const col = table.getColumn(f.id);
        if (col) {
          col.setFilterValue("");
        }
      }
    });
    setColumnFilters([]);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-b border-gray-200 bg-white relative">
      {columnFilters.map((filter) => {
        const isStatus = filter.id === "status";
        const hasValue = filter.value && filter.value !== "";

        return (
          <div
            key={filter.id}
            className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium shadow-sm transition ${
              isStatus && hasValue
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-gray-300 bg-white text-gray-700"
            }`}
          >
            {isStatus ? (
              hasValue ? (
                <>
                  <span className="mr-1">{String(filter.value)}</span>
                  <button
                    className="ml-1 p-0.5 hover:bg-primary/10 rounded"
                    onClick={() => removeFilter(filter.id)}
                    title="Quitar filtro"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center hover:text-primary focus:outline-none"
                      type="button"
                    >
                      <Funnel className="w-4 h-4 mr-1 text-gray-400" />
                      Estado
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" sideOffset={4} className="min-w-[180px]">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-600">Estado</div>
                    <div className="flex gap-2 px-3 py-2">
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                        onClick={() => {
                          table.getColumn(filter.id)?.setFilterValue("Activo");
                          setColumnFilters(prev => prev.map((f: any) => f.id === filter.id ? { ...f, value: "Activo" } : f));
                        }}
                      >
                        <LightBulbOn className="w-4 h-4 text-amber-500" />
                        Activo
                      </button>
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                        onClick={() => {
                          table.getColumn(filter.id)?.setFilterValue("Inactivo");
                          setColumnFilters(prev => prev.map((f: any) => f.id === filter.id ? { ...f, value: "Inactivo" } : f));
                        }}
                      >
                        <LightBulbOff className="w-4 h-4 text-gray-400" />
                        Inactivo
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ) : (
              <>
                <Funnel className="w-4 h-4 mr-1 text-gray-400" />
                <span className="mr-1">{filterLabels[filter.id] ?? filter.id}</span>
                <span className="font-normal text-gray-500">
                  {typeof filter.value === "string" && filter.value
                    ? filter.value
                    : ""}
                </span>
              </>
            )}
          </div>
        );
      })}

      {columnFilters.length < contactFilterOptions.length && (
        <DropdownMenu open={showPlusFilter} onOpenChange={setShowPlusFilter}>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 bg-secondary/60 text-muted-foreground hover:bg-secondary focus:outline-none ml-1"
              title="Agregar filtro"
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
            {contactFilterOptions.map((opt) => {
              if (columnFilters.some((f) => f.id === opt.value)) return null;
              return (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => {
                    onAddFilter();
                    setShowPlusFilter(false);
                  }}
                >
                  <opt.icon className="w-4 h-4 mr-2" />
                  {opt.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <button
        className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none hover:no-underline"
        style={{ textDecoration: "none" }}
        onClick={removeAllFilters}
      >
        Remover filtros
      </button>
    </div>
  );
}