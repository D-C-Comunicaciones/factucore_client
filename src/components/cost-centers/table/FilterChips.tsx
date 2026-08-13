"use client";

import * as React from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Funnel, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultCostCenterFilterOptions } from "@/components/cost-centers/table/CostCenterFilter";

/* -----------------------------------------------------------------------
   Constantes
   ----------------------------------------------------------------------- */
const filterLabels: Record<string, string> = {
  code: "Código",
};

const filterIcons: Record<string, React.ReactNode> = {
  code: <Pencil className="w-4 h-4 mr-1 text-gray-400" />,
};

export const filterValueToColumnId: Record<string, string> = {
  code: "code",
};

/* -----------------------------------------------------------------------
   Props
   ----------------------------------------------------------------------- */
interface FilterChipsProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  onAddFilter: (filterValue: string) => void;
}

/* -----------------------------------------------------------------------
   Componente
   ----------------------------------------------------------------------- */
export function FilterChips({
  columnFilters,
  setColumnFilters,
  onAddFilter,
}: FilterChipsProps) {
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
        return (
          <DropdownMenu key={filter.id}>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center px-3 py-1 rounded-full border border-border bg-background text-foreground text-xs font-medium shadow-sm 
                    hover:bg-primary/10 hover:text-primary hover:border-primary/40
                    focus:bg-primary/10 focus:text-primary
                    transition-colors cursor-pointer`}
              >
                {filterIcons[filter.id] ?? <Funnel className="w-4 h-4 mr-1 text-gray-400" />}
                <span className="mr-1">{filterLabels[filter.id] ?? filter.id}</span>
                <span className="font-normal text-gray-500">
                  {typeof filter.value === "string" && filter.value ? filter.value : ""}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" sideOffset={4} className="min-w-[220px]">
              {/* Header with delete button */}
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

              {/* Code filter - text input that accepts letters and numbers */}
              {filter.id === "code" && (
                <div className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Filtrar por código..."
                    value={typeof filter.value === "string" ? filter.value : ""}
                    onChange={(e) =>
                      setColumnFilters(
                        columnFilters.map((f) =>
                          f.id === filter.id ? { ...f, value: e.target.value } : f
                        )
                      )
                    }
                    className="w-full h-8 px-2 rounded-md border border-gray-200 text-xs outline-none focus:border-primary transition-colors"
                    autoFocus
                  />
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      {/* Clear all */}
      {columnFilters.length > 0 && (
        <button
          onClick={removeAllFilters}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs text-gray-400 hover:text-destructive transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Limpiar
        </button>
      )}
    </div>
  );
}
