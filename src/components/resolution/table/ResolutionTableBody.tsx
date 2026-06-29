"use client";

import * as React from "react";
import Link from "next/link";
import { flexRender, Table } from "@tanstack/react-table";
import { Inbox } from "lucide-react";
import type { Resolution } from "@/lib/resolutions";

interface ResolutionTableBodyProps {
  table: Table<Resolution>;
  columns: any[];
  loading?: boolean;
  searchTerm?: string;
  emptyMessage?: string;
  isFilterActive?: boolean;
}

export function ResolutionTableBody({
  table,
  columns,
  loading,
  searchTerm,
  emptyMessage,
  isFilterActive,
}: ResolutionTableBodyProps) {
  const rows = table.getRowModel().rows;

  if (loading) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] border-b border-gray-200">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 text-[#64748b] font-medium text-[13px]">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="bg-white">
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="w-full overflow-x-auto min-h-[300px] flex flex-col">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc] border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-[#64748b] font-medium text-[13px] whitespace-nowrap"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>
        {isFilterActive ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Sin resultados</h3>
            <p className="text-sm text-gray-500">La búsqueda no arrojó numeraciones coincidentes</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
            <h2 className="text-3xl font-bold text-[#2563eb] mb-6">
              ¡Aún no tienes numeraciones!
            </h2>
            <Link 
              href="/resolutions/new"
              className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm cursor-pointer"
            >
              + Crear primera numeración
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#f8fafc] border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-[#64748b] font-medium text-[13px] whitespace-nowrap select-none"
                  style={{ width: header.getSize() }}
                >
                  <div
                    className={`flex items-center gap-1.5 ${
                      header.column.getCanSort() ? "cursor-pointer hover:text-gray-900" : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr
              key={row.id}
              className="bg-white hover:bg-gray-50 transition-colors group"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
