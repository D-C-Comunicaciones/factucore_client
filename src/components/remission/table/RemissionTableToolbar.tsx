"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { RemissionFilter, defaultFilterOptions } from "@/components/remission/RemissionFilter";
import { DebouncedInput } from "@/components/ui/debounced-input";
import type { RemissionSummary } from "@/types/remission";

interface RemissionTableToolbarProps {
  table: Table<RemissionSummary>;
  search: string;
  setSearch: (v: string) => void;
  onAddFilter: (filterValue: string) => void;
  perPage: number;
  setPerPage: (n: number) => void;
}

export function RemissionTableToolbar({
  table,
  search,
  setSearch,
  onAddFilter,
  perPage,
  setPerPage,
}: RemissionTableToolbarProps) {
  return (
    <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between gap-3">
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-65">
          <DebouncedInput
            placeholder="Buscar por cliente o no. de remission"
            value={search}
            onChange={setSearch}
          />
        </div>
        <RemissionFilter
          options={defaultFilterOptions}
          selected=""
          onSelect={onAddFilter}
        />
      </div>
    </div>
  );
}

