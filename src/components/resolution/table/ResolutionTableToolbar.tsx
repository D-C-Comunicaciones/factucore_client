"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

interface ResolutionTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  setSearch: (value: string) => void;
  onToggleFilter?: () => void;
  isFilterActive?: boolean;
}

export function ResolutionTableToolbar<TData>({
  onToggleFilter,
  isFilterActive,
}: ResolutionTableToolbarProps<TData>) {
  if (isFilterActive) return null;

  return (
    <div className="px-4 py-3 flex justify-end items-center bg-white">
      {onToggleFilter && (
        <button
          onClick={onToggleFilter}
          className="text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors"
        >
          Filtrar
        </button>
      )}
    </div>
  );
}
