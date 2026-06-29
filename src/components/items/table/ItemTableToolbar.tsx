"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search, Filter } from "lucide-react";
import { InvoiceFilter } from "@/components/invoice/InvoiceFilter";

interface FilterOption {
  label: string;
  value: string;
  icon: React.ElementType;
}

const itemFilterOptions: FilterOption[] = [
  { value: "type", label: "Tipo", icon: Filter },
  { value: "active", label: "Estado", icon: Filter },
  { value: "reference", label: "Referencia", icon: Filter },
  { value: "description", label: "Descripción", icon: Filter },
  { value: "price", label: "Precio", icon: Filter },
  { value: "warehouse", label: "Bodega", icon: Filter },
  { value: "category", label: "Categoría", icon: Filter },
  { value: "inventariable", label: "Inventariable", icon: Filter },
];

interface ItemTableToolbarProps {
  table: Table<any>;
  search: string;
  setSearch: (v: string) => void;
  onAddFilter?: (filterValue: string) => void;
}

export function ItemTableToolbar({
  table,
  search,
  setSearch,
  onAddFilter,
}: ItemTableToolbarProps) {
  return (
    <div className="h-12 px-4 border-b border-gray-200 flex items-center gap-2">
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-65">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Buscar por nombre o referencia"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full pl-9 pr-2 border border-gray-200 rounded-md text-xs bg-white"
          />
        </div>
        {onAddFilter && (
          <InvoiceFilter
            options={itemFilterOptions}
            selected=""
            onSelect={onAddFilter}
          />
        )}
      </div>
    </div>
  );
}
