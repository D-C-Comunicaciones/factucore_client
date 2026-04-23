"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { InvoiceFilter, defaultFilterOptions } from "@/components/invoice/InvoiceFilter";
import type { InvoiceSummary } from "@/types/invoice";

interface InvoiceTableToolbarProps {
  table: Table<InvoiceSummary>;
  search: string;
  setSearch: (v: string) => void;
  onAddFilter: (filterValue: string) => void;
  perPage: number;
  setPerPage: (n: number) => void;
}

export function InvoiceTableToolbar({
  table,
  search,
  setSearch,
  onAddFilter,
  perPage,
  setPerPage,
}: InvoiceTableToolbarProps) {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-65">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Buscar por cliente o número de factura"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-2 py-1.5 border border-gray-200 rounded-md text-xs"
          />
        </div>
        <InvoiceFilter
          options={defaultFilterOptions}
          selected=""
          onSelect={onAddFilter}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">Registros por página:</span>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border rounded px-2 py-1 text-xs"
        >
          {[10, 20, 30, 40, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
