"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { InvoiceFilter, defaultFilterOptions } from "@/components/invoice/InvoiceFilter";
import { DebouncedInput } from "@/components/ui/debounced-input";
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
    <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between gap-3">
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-65">
          <DebouncedInput
            placeholder="Buscar por cliente o no. de factura"
            value={search}
            onChange={setSearch}
          />
        </div>
        <InvoiceFilter
          options={defaultFilterOptions}
          selected=""
          onSelect={onAddFilter}
        />
      </div>
    </div>
  );
}
