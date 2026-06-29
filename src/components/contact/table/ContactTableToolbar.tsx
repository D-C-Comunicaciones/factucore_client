"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search, Funnel } from "lucide-react";
import { InvoiceFilter } from "@/components/invoice/InvoiceFilter";

interface FilterOption {
  label: string;
  value: string;
  icon: React.ElementType;
}

const contactFilterOptions: FilterOption[] = [
  { value: 'status', label: 'Estado', icon: Funnel },
  { value: 'phone', label: 'Teléfono', icon: Funnel },
];

interface ContactTableToolbarProps {
  table: Table<any>;
  search: string;
  setSearch: (v: string) => void;
  onAddFilter?: () => void;
}

export function ContactTableToolbar({
  table,
  search,
  setSearch,
  onAddFilter,
}: ContactTableToolbarProps) {
  return (
    <div className="h-12 px-4 border-b border-gray-200 flex items-center gap-2">
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-65">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Buscar por nombre o identificación"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full pl-9 pr-2 border border-gray-200 rounded-md text-xs"
          />
        </div>
        {onAddFilter && (
          <InvoiceFilter
            options={contactFilterOptions}
            selected=""
            onSelect={onAddFilter}
          />
        )}
      </div>
    </div>
  );
}