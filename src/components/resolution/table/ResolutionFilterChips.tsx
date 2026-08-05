"use client";

import { X } from "lucide-react";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface ResolutionFilterChipsProps<TData> {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  table: Table<TData>;
  onAddFilter?: (filterValue: string) => void;
}

export function ResolutionFilterChips<TData>({
  columnFilters,
  setColumnFilters,
  table,
}: ResolutionFilterChipsProps<TData>) {
  if (columnFilters.length === 0) return null;

  // Helpers para obtener/setear valores de un filtro específico
  const getFilterValue = (id: string) => {
    const filter = columnFilters.find((f) => f.id === id);
    return filter ? filter.value : undefined;
  };

  const setFilterValue = (id: string, value: any) => {
    setColumnFilters((prev) => {
      const exists = prev.some((f) => f.id === id);
      if (exists) {
        return prev.map((f) => (f.id === id ? { ...f, value } : f));
      }
      return [...prev, { id, value }];
    });
  };

  const handleClose = () => {
    setColumnFilters([]);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Header del filtro */}
      <div className="flex justify-end items-center px-4 py-2 gap-4">
        <button className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
          Filtrar
        </button>
        <button
          onClick={handleClose}
          className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>

      {/* Inputs de filtro */}
      <div className="px-4 pb-3 flex flex-wrap gap-3 items-center">
        {/* Filtro: Nombre */}
        <div className="w-full sm:w-[160px]">
          <Input
            placeholder="Nombre"
            className="h-8 w-full text-xs border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary shadow-none transition-colors"
            value={(getFilterValue("name") as string) || ""}
            onChange={(e) => setFilterValue("name", e.target.value)}
          />
        </div>

        {/* Filtro: Preferida */}
        <div className="w-full sm:w-[120px]">
          <Select
            value={getFilterValue("is_main") !== undefined && getFilterValue("is_main") !== "" ? String(getFilterValue("is_main")) : undefined}
            onValueChange={(val) => setFilterValue("is_main", val === "true")}
          >
            <SelectTrigger className="h-8 w-full text-xs bg-white border border-gray-200 shadow-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-colors outline-none">
              <SelectValue placeholder="Preferida" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true" className="cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary transition-colors rounded-md">Sí</SelectItem>
              <SelectItem value="false" className="cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary transition-colors rounded-md">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro: Electrónica */}
        <div className="w-full sm:w-[120px]">
          <Select
            value={getFilterValue("is_electronic") !== undefined && getFilterValue("is_electronic") !== "" ? String(getFilterValue("is_electronic")) : undefined}
            onValueChange={(val) => setFilterValue("is_electronic", val === "true")}
          >
            <SelectTrigger className="h-8 w-full text-xs bg-white border border-gray-200 shadow-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-colors outline-none">
              <SelectValue placeholder="Electrónica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true" className="cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary transition-colors rounded-md">Sí</SelectItem>
              <SelectItem value="false" className="cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary transition-colors rounded-md">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro: Estado */}
        <div className="w-full sm:w-[120px]">
          <Select
            value={getFilterValue("is_active") !== undefined && getFilterValue("is_active") !== "" ? String(getFilterValue("is_active")) : undefined}
            onValueChange={(val) => setFilterValue("is_active", val === "true")}
          >
            <SelectTrigger className="h-8 w-full text-xs bg-white border border-gray-200 shadow-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-colors outline-none">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true" className="cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary transition-colors rounded-md">Sí</SelectItem>
              <SelectItem value="false" className="cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary transition-colors rounded-md">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
