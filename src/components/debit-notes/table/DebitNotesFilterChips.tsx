"use client";

import * as React from "react";
import {
  ChevronDown,
  Trash2,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { DEBIT_NOTE_FILTER_OPTIONS } from "./filterOptions";

interface DebitNotesFilterChipsProps {
  activeFilters: string[];
  onRemoveFilter: (value: string) => void;
  onAddFilter: (value: string) => void;
  onRemoveAll: () => void;
}

export function DebitNotesFilterChips({
  activeFilters,
  onRemoveFilter,
  onAddFilter,
  onRemoveAll,
}: DebitNotesFilterChipsProps) {
  if (activeFilters.length === 0) return null;

  const available = DEBIT_NOTE_FILTER_OPTIONS.filter(
    (opt) => !activeFilters.includes(opt.value)
  );
  const allFiltersActive = available.length === 0;

  return (
    <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between border-b border-gray-100 gap-2 flex-wrap">
      <div className="flex flex-wrap gap-2 items-center">

        {/* Chips de filtros activos */}
        {activeFilters.map((filterValue) => {
          const opt = DEBIT_NOTE_FILTER_OPTIONS.find((o) => o.value === filterValue);
          if (!opt) return null;
          const Icon = opt.icon;

          return (
            <Popover key={filterValue}>
              <PopoverTrigger asChild>
                <button className="cursor-pointer inline-flex items-center gap-1.5 h-7 px-3 text-xs font-medium border border-gray-200 rounded-full bg-white hover:bg-gray-50 text-slate-700 transition-colors">
                  <Icon className="h-3.5 w-3.5 text-slate-500" />
                  {opt.label}
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                style={{
                  width: "var(--radix-popover-trigger-width)",
                  maxWidth: "var(--radix-popover-trigger-width)",
                }}
                className="!w-auto overflow-hidden p-3"
              >
                {/* Cabecera */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">{opt.label}</span>
                  <button
                    className="cursor-pointer flex items-center justify-center h-6 w-6 rounded-md text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors"
                    onClick={() => onRemoveFilter(filterValue)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Contenido por tipo */}
                {filterValue === "numero" && (
                  <input
                    type="text"
                    className="w-full h-8 px-3 rounded-md border border-gray-200 text-xs outline-none focus:border-primary cursor-text"
                  />
                )}
                {filterValue === "fecha" && (
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <DatePickerSimple />
                  </div>
                )}
                {filterValue === "estado" && (
                  <div className="flex flex-col gap-2.5">
                    {["Emitida", "En proceso", "Por emitir", "No electrónica"].map((label) => (
                      <label key={label} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                        <Checkbox className="cursor-pointer rounded shadow-none border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                        {label}
                      </label>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          );
        })}

        {/* Botón "+" — solo si quedan filtros por agregar */}
        {!allFiltersActive && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer inline-flex items-center justify-center h-7 w-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-500 transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[200px]">
              <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">
                Filtrar Por
              </div>
              {available.map((opt) => {
                const Icon = opt.icon;
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => onAddFilter(opt.value)}
                    className="cursor-pointer data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {opt.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Remover todos */}
      <button
        className="cursor-pointer text-xs font-medium text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors shrink-0"
        onClick={onRemoveAll}
      >
        Remover filtros
      </button>
    </div>
  );
}
