"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { CostCenterFilter, defaultCostCenterFilterOptions } from "@/components/cost-centers/table/CostCenterFilter";
import { DebouncedInput } from "@/components/ui/debounced-input";
import type { CostCenter } from "@/components/cost-centers/table/columns";

interface CostCenterTableToolbarProps {
  table: Table<CostCenter>;
  search: string;
  setSearch: (v: string) => void;
  onAddFilter: (filterValue: string) => void;
}

export function CostCenterTableToolbar({
  table,
  search,
  setSearch,
  onAddFilter,
}: CostCenterTableToolbarProps) {
  return (
    <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between gap-3">
      <div className="flex w-full md:w-auto items-center gap-2">
        <div className="relative w-full md:w-65">
          <DebouncedInput
            placeholder="Buscar por nombre o código"
            value={search}
            onChange={setSearch}
          />
        </div>
        <CostCenterFilter
          options={defaultCostCenterFilterOptions}
          selected=""
          onSelect={onAddFilter}
        />
      </div>
    </div>
  );
}
