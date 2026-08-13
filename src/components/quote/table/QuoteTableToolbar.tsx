"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { QuoteFilter, defaultFilterOptions } from "@/components/quote/QuoteFilter";
import { DebouncedInput } from "@/components/ui/debounced-input";
import type { QuoteSummary } from "@/types/quote";

interface QuoteTableToolbarProps {
  table: Table<QuoteSummary>;
  search: string;
  setSearch: (v: string) => void;
  onAddFilter: (filterValue: string) => void;
  perPage: number;
  setPerPage: (n: number) => void;
}

export function QuoteTableToolbar({
  table,
  search,
  setSearch,
  onAddFilter,
  perPage,
  setPerPage,
}: QuoteTableToolbarProps) {
  return (
    <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between gap-3">
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-65">
          <DebouncedInput
            placeholder="Buscar por cliente o no. de cotización"
            value={search}
            onChange={setSearch}
          />
        </div>
        <QuoteFilter
          options={defaultFilterOptions}
          selected=""
          onSelect={onAddFilter}
        />
      </div>
    </div>
  );
}

