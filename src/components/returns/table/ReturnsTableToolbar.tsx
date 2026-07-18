"use client";

import * as React from "react";
import { Search, Funnel } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RETURN_FILTER_OPTIONS } from "./filterOptions";

interface ReturnsTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilters: string[];
  onAddFilter: (value: string) => void;
}

export function ReturnsTableToolbar({
  search,
  onSearchChange,
  activeFilters,
  onAddFilter,
}: ReturnsTableToolbarProps) {
  const available = RETURN_FILTER_OPTIONS.filter(
    (opt) => !activeFilters.includes(opt.value)
  );

  const allFiltersActive = available.length === 0;

  return (
    <div className="h-12 px-4 border-b border-gray-200 flex items-center gap-2">
      {/* Search */}
      <div className="relative w-full md:w-65">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-full rounded-md border border-gray-200 bg-transparent pl-8 pr-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Botón Filtrar — se oculta cuando todos los filtros están activos */}
      {!allFiltersActive && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer bg-white flex items-center gap-1.5 h-8 px-3 text-xs border-0 shadow-none text-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
            >
              <Funnel className="w-3.5 h-3.5" />
              Filtrar
            </Button>
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
  );
}
